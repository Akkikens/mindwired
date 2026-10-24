#!/usr/bin/env python3
"""Revamp Phase 2 #2 — slice-aware fetch, era/identity verify, clip gates,
blocklist. Offline: ffmpeg-generated fixtures served from a localhost HTTP
server, and footage._vision_call replaced by a pixel-colour mock (no Gemini).

    python3 scripts/tests/test_footage_phase2.py      (needs httpx numpy pillow)
"""
from __future__ import annotations

import contextlib
import functools
import http.server
import io
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS / "lib"))
sys.path.insert(0, str(SCRIPTS))
import footage  # noqa: E402
import fetch_doc_footage  # noqa: E402
import fetch_footage  # noqa: E402

W, H = 640, 360
ORANGE = "0xFF7F20"   # the "launch" colour the mock vision model recognises


def ff(out: Path, *filters: str) -> Path:
    """Concatenate lavfi segments into one H.264 mp4."""
    args = ["ffmpeg", "-y", "-v", "error"]
    for f in filters:
        args += ["-f", "lavfi", "-i", f]
    n = len(filters)
    graph = "".join(f"[{i}:v]" for i in range(n)) + f"concat=n={n}:v=1:a=0[v]"
    subprocess.run(args + ["-filter_complex", graph, "-map", "[v]", "-c:v", "libx264",
                           "-pix_fmt", "yuv420p", str(out)], check=True)
    return out


def seg_black(d): return f"color=c=black:s={W}x{H}:d={d}:r=30"
def seg_test(d): return f"testsrc2=s={W}x{H}:d={d}:r=30"
def seg_launch(d): return f"color=c={ORANGE}:s={W}x{H}:d={d}:r=30,noise=alls=30:allf=t+u"
def seg_still(d): return f"color=c=0x3060A0:s={W}x{H}:d={d}:r=30"


def is_launch(frame: Path) -> bool:
    from PIL import Image, ImageStat
    r, g, b = ImageStat.Stat(Image.open(frame).convert("RGB")).mean
    return r > 170 and 80 < g < 170 and b < 110


class MockVision:
    """Stands in for Gemini: a frame 'shows the launch' when it is orange."""

    def __init__(self, era: str = "PLAUSIBLE", matches_query: str = "NA"):
        self.era, self.matches_query = era, matches_query
        self.prompts: list[str] = []

    def __call__(self, prompt: str, frames: list[Path]) -> str:
        self.prompts.append(prompt)
        flags = [is_launch(f) for f in frames]
        if '{"match"' in prompt:
            return json.dumps({"match": [i + 1 for i, ok in enumerate(flags) if ok]})
        return json.dumps({
            "subject": "MATCH" if all(flags) else "MISMATCH",
            "era": self.era if "ERA: no era" not in prompt else "NA",
            "identity": {"person": self.matches_query != "NA", "who": "Kamala Harris",
                         "matches_query": self.matches_query},
            "reason": "mock verdict"})


class Server:
    def __init__(self, root: Path):
        h = functools.partial(_QuietHandler, directory=str(root))
        self.httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def url(self, name: str) -> str:
        return f"http://127.0.0.1:{self.httpd.server_address[1]}/{name}"

    def close(self):
        self.httpd.shutdown()


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Phase2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.td = Path(tempfile.mkdtemp(prefix="footage_p2_"))
        cls.src = cls.td / "src"
        cls.src.mkdir()
        # 60s source: 0-20 black, 20-30 colour bars (real but off-subject),
        # 30-60 the "launch"
        ff(cls.src / "reel60.mp4", seg_black(20), seg_test(10), seg_launch(30))
        ff(cls.src / "launch10.mp4", seg_launch(10))
        ff(cls.src / "freeze12.mp4", seg_launch(4), seg_still(6), seg_launch(2))
        cls.server = Server(cls.src)
        cls._saved = (footage._vision_call, footage._load_gemini_key, footage.VERIFY)
        footage._load_gemini_key = lambda: "test-key"
        footage.VERIFY = True

    @classmethod
    def tearDownClass(cls):
        footage._vision_call, footage._load_gemini_key, footage.VERIFY = cls._saved
        cls.server.close()

    def asset(self, name: str, title: str) -> footage.Asset:
        return footage.Asset(source="fixture", media="video", title=title,
                             url=self.server.url(name), page=self.server.url(name),
                             author="test", license="Public domain", lic_key="pd")

    def fetch(self, name, title, out, ctx=None, mock=None, max_seconds=20, need=None):
        footage._vision_call = mock or MockVision()
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            saved = footage.download_assets([self.asset(name, title)], out, "launch", 1,
                                            max_seconds=max_seconds,
                                            query="space shuttle launch",
                                            verify_ctx=ctx, need_seconds=need)
        return saved, buf.getvalue()

    # ---------------------------------------------------------------- (a) slice
    def test_scan_times_cover_strip_and_grid(self):
        ts = footage.scan_times(60.0)
        for t in (0.0, 8.0, 15.0, 6.0, 30.0, 54.0):
            self.assertIn(t, ts)

    def test_slice_lands_on_launch_not_black_opening(self):
        root = self.td / "ep_slice"
        out = root / "video"
        saved, log = self.fetch("reel60.mp4", "STS launch reel", out)
        self.assertEqual(len(saved), 1, log)
        clip = saved[0][0]
        self.assertAlmostEqual(footage.ffprobe_duration(clip), 20.0, delta=0.5)
        rows = [json.loads(l) for l in (root / "PROVENANCE.jsonl").read_text().splitlines()]
        self.assertEqual(rows[-1]["source_offset"], 30.0)
        self.assertEqual(rows[-1]["slice"]["source_duration"], 60.0)
        self.assertEqual(rows[-1]["slice"]["method"], "vision-scan")
        self.assertEqual(rows[-1]["verify"]["status"], "verified")
        self.assertIn("suggested videoFrom=", log)
        self.assertIn("source_offset=30s", log)
        # every frame of the kept slice is the launch
        for t in (0.0, 8.0, 15.0):
            f = footage.extract_frame(clip, t)
            self.assertTrue(is_launch(f), f"frame @{t}s of the slice is not the launch")
            f.unlink()

    def test_slate_scan_without_vision_skips_black(self):
        footage._load_gemini_key = lambda: None
        try:
            sl = footage.pick_slice(self.src / "reel60.mp4", 20, "space shuttle launch")
        finally:
            footage._load_gemini_key = lambda: "test-key"
        self.assertEqual(sl["method"], "slate-scan")
        self.assertGreaterEqual(sl["start"], 20.0)   # past the 20s of black

    def test_no_matching_frame_is_mismatch(self):
        footage._vision_call = lambda p, f: json.dumps({"match": []})
        self.assertIsNone(footage.pick_slice(self.src / "reel60.mp4", 20, "q"))

    # ------------------------------------------------------------ (b) era/identity
    def test_era_prompt_includes_doc_era(self):
        p = footage.build_verify_prompt("columbia launch", "t",
                                        fetch_footage.verify_ctx({"from": "1981", "to": "2003"}),
                                        [0.0, 8.0, 15.0])
        self.assertIn("1981-2003", p)
        self.assertIn("ANACHRONISTIC", p)
        self.assertNotIn("AFTERMATH", p)
        self.assertIn("IDENTITY", p)
        self.assertIn("3 frames", p)

    def test_era_prompt_aftermath_exemption(self):
        for ctx in (fetch_footage.verify_ctx(["1981", "2003"], aftermath=True),
                    fetch_footage.verify_ctx("1981-2003", niche="briefing")):
            p = footage.build_verify_prompt("NASA press briefing", "", ctx)
            self.assertIn("AFTERMATH", p)
            self.assertIn("recorded after 2003", p)
            self.assertIn("NOT anachronistic", p)

    def test_no_era_prompt(self):
        p = footage.build_verify_prompt("q", "", fetch_footage.verify_ctx(None))
        self.assertIn("ERA: no era", p)

    def test_norm_era_rejects_typos(self):
        with self.assertRaises(ValueError):
            footage.norm_era({"from": "2003", "to": "1981"})
        with self.assertRaises(ValueError):
            footage.norm_era("81-03")

    def test_judge_verdict(self):
        strict = fetch_footage.verify_ctx({"from": "1981", "to": "2003"})
        after = fetch_footage.verify_ctx({"from": "1981", "to": "2003"}, aftermath=True)
        brief = fetch_footage.verify_ctx({"from": "1981", "to": "2003"}, niche="briefing")
        anach = {"subject": "MATCH", "era": "ANACHRONISTIC",
                 "identity": {"matches_query": "NA"}, "reason": "Starlink 2024"}
        self.assertEqual(footage.judge_verdict(anach, strict)[:2], (False, "era"))
        self.assertTrue(footage.judge_verdict(anach, after)[0])
        self.assertTrue(footage.judge_verdict(anach, brief)[0])
        wrong = {"subject": "MATCH", "era": "PLAUSIBLE",
                 "identity": {"matches_query": "NO", "who": "Chris Kraft"}, "reason": "r"}
        ok, cat, why = footage.judge_verdict(wrong, strict)
        self.assertEqual((ok, cat), (False, "identity"))
        self.assertIn("WRONG-PERSON", why)

    def test_download_rejects_anachronistic_and_keeps_aftermath(self):
        era = {"from": "1981", "to": "2003"}
        out = self.td / "ep_era" / "video"
        saved, log = self.fetch("launch10.mp4", "Starlink launch 2024", out,
                                ctx=fetch_footage.verify_ctx(era),
                                mock=MockVision(era="ANACHRONISTIC"))
        self.assertEqual(saved, [])
        self.assertIn("!! MISMATCH (era)", log)
        self.assertFalse(list(out.glob("launch_*.mp4")))
        saved, log = self.fetch("launch10.mp4", "NASA briefing 2003", out,
                                ctx=fetch_footage.verify_ctx(era, aftermath=True),
                                mock=MockVision(era="ANACHRONISTIC"))
        self.assertEqual(len(saved), 1, log)
        row = json.loads((out.parent / "PROVENANCE.jsonl").read_text().splitlines()[-1])
        self.assertTrue(row["verify"]["era_exempt"])
        self.assertEqual(row["verify"]["era"], "ANACHRONISTIC")

    def test_download_rejects_wrong_person(self):
        out = self.td / "ep_id" / "video"
        saved, log = self.fetch("launch10.mp4", "Rodney Rocha interview", out,
                                mock=MockVision(matches_query="NO"))
        self.assertEqual(saved, [])
        self.assertIn("!! MISMATCH (identity)", log)
        self.assertIn("WRONG-PERSON", log)

    # ------------------------------------------------------------ (c) clip gates
    def test_clip_short_warn(self):
        w = footage.clip_warnings(self.src / "launch10.mp4", need_s=20.0, freeze=False)
        self.assertTrue(any("clip-short" in x and "short by 10.0s" in x for x in w), w)
        doc = {"scenes": [{"id": "x1", "text": "a b c", "video": "launch10.mp4",
                           "videoFrom": 2}]}
        warns = fetch_doc_footage.clip_gates(doc, {"x1": 20.0}, self.src, freeze=False)
        self.assertTrue(any(w.startswith("x1: WARN clip-short") for w in warns), warns)
        # and the fetch path prints it for a source shorter than the scene
        _, log = self.fetch("launch10.mp4", "short launch", self.td / "ep_short" / "video",
                            need=25.0)
        self.assertIn("WARN clip-short", log)

    def test_freeze_warn(self):
        spans = footage.detect_freezes(self.src / "freeze12.mp4")
        self.assertTrue(spans and abs(spans[0][0] - 4.0) < 0.5, spans)
        doc = {"scenes": [{"id": "f1", "text": "a", "video": "freeze12.mp4"}]}
        warns = fetch_doc_footage.clip_gates(doc, {"f1": 9.0}, self.src)
        self.assertTrue(any("WARN freeze" in w for w in warns), warns)
        self.assertFalse(footage.detect_freezes(self.src / "launch10.mp4"))

    # ------------------------------------------------------- (d) blocklist/niche
    def test_blocklist(self):
        a = footage.Asset(source="eso", media="video", title="Pan of the Crab Nebula",
                          url="https://cdn.eso.org/x.mp4", page="https://www.eso.org/v/1")
        self.assertEqual(footage.blocked_by(a, ["eso.org"]), "eso.org")
        self.assertEqual(footage.blocked_by(a, ["crab nebula"]), "crab nebula")
        self.assertIsNone(footage.blocked_by(a, ["starlink", "nasa.gov"]))

    def test_nasa_institutional_niche(self):
        r = fetch_footage.NICHE_RANK["nasa_institutional"]["video"]
        self.assertEqual(r[0], "dvids")
        self.assertLess(r.index("dvids"), r.index("nasa"))
        self.assertNotIn("eso", r)
        self.assertNotIn("nasa_svs", r)


if __name__ == "__main__":
    unittest.main(verbosity=2)
