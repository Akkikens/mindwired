# Connect Claude Desktop to the Goldi Database (Mac)

This gives Claude Desktop **read-only** access to the Goldi production database, so you can ask questions like "How many users do we have?" or "Show me signups this week" in plain English.

⏱️ Takes about 5 minutes. No coding required.

---

## Step 1 — Find your `npx` path

Open **Terminal** (press `Cmd+Space`, type "Terminal", hit Enter) and run:

```bash
which npx
```

- ✅ If it prints a path like `/opt/homebrew/bin/npx` or `/usr/local/bin/npx` — copy that path and jump to **Step 2**.
- ❌ If it says `npx not found`, you need Node.js. Run these three commands **one at a time**, waiting for each to finish:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && eval "$(/opt/homebrew/bin/brew shellenv)"
```
```bash
brew install node
```

Then run `which npx` again and copy the path it prints.

> The Homebrew installer will ask for your Mac login password — that's normal. Typing it won't show any characters; just type it and hit Enter.

---

## Step 2 — Open the Claude Desktop config file

In Terminal, run:

```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

This opens the file in TextEdit.

> ⚠️ **Important:** In TextEdit, go to **Format → Make Plain Text** (if the option says "Make Rich Text", you're already fine). Rich text formatting silently breaks the config.

If the command says the file doesn't exist, open Claude Desktop → **Settings → Developer → Edit Config** instead — that creates and opens it for you.

---

## Step 3 — Paste the config

Replace **everything** in the file with the block below, then swap `YOUR_NPX_PATH_HERE` for the path from Step 1 (e.g. `/opt/homebrew/bin/npx`):

```json
{
  "mcpServers": {
    "goldi-db": {
      "command": "YOUR_NPX_PATH_HERE",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://goldi_team_readonly:gJoimcoB0DnTRUvx3DLIrrIrLvb7@ep-sweet-night-a44ju79g-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
      ]
    }
  }
}
```

Save with **Cmd+S**.

> 💡 If you already have other entries under `mcpServers`, don't replace the whole file — just add the `"goldi-db": { ... }` block alongside them, separated by a comma.

---

## Step 4 — Restart Claude Desktop

**Fully quit** the app — `Cmd+Q`, or right-click the Dock icon → Quit. (Just closing the window is not enough.) Then reopen it.

---

## Step 5 — Verify it works

1. Go to **Settings → Developer** — you should see **goldi-db** listed with a green/running status.
2. In a new chat, ask: *"How many users do we have?"*

If Claude runs a query and answers with a number, you're done 🎉

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **"Failed to call tool" toast, but you still get an answer** | Known quirk — just retry the question. The connection is fine. |
| **goldi-db not listed in Settings → Developer** | The JSON is probably malformed (missing comma, curly quotes from rich text). Paste your config into [jsonlint.com](https://jsonlint.com) to find the error. Also re-check Format → Make Plain Text. |
| **goldi-db listed but "failed to start"** | Your `npx` path is wrong. Re-run `which npx` and make sure the path in the config matches exactly. |
| **Claude says it can't query / connection refused** | Check you're not on a VPN or network that blocks outbound Postgres (port 5432). Try a different network. |
| **Changes not taking effect** | You didn't fully quit — `Cmd+Q` and reopen. |

---

## What access does this give?

- The credential is a **read-only** database role (`goldi_team_readonly`) — Claude can `SELECT` but cannot modify or delete anything.
- Still, treat this doc as **internal-only**: it contains a live database credential. Don't post it publicly, commit it to a public repo, or share it outside the team. If it ever leaks, ask Akshay to rotate the password.
