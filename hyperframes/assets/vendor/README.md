# Vendored runtime scripts

Renders must not depend on the network, so `scripts/build.mjs` points every emitted page at these
local copies and refuses to build if any `<script src>` / `<link href>` is still remote.

| file | package | source | sha256 |
|---|---|---|---|
| `gsap-3.14.2.min.js` | gsap@3.14.2 `dist/gsap.min.js` (npm; byte-identical to the jsDelivr copy the templates loaded before) | GreenSock standard no-charge license, https://gsap.com/standard-license | `c174bfce53a729418d57a8ad8625e7247c793a22fef8e2851e3cfa3de9cd8280` |

To bump: `npm pack gsap@<v>`, copy `package/dist/gsap.min.js` here as `gsap-<v>.min.js`, update the
`GSAP_FILE` constant in `scripts/build.mjs` and this table.
