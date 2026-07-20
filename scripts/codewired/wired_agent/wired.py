#!/usr/bin/env python3
"""
wired — the coding agent we build in codewired #4.

A complete, working coding agent in under 60 lines of our own code. The
Claude Agent SDK provides the production harness (the loop, the tools, the
permission gate, context management); we define who the agent is, what it's
allowed to touch, and hand it a job. Run from repo root:

    .venv-agent/bin/python scripts/codewired/wired_agent/wired.py "<task>"
"""
import asyncio
import sys

from claude_agent_sdk import AssistantMessage, ClaudeAgentOptions, TextBlock, ToolUseBlock, query

SYSTEM = """You are wired, a small, careful coding agent.
Work step by step: read before you edit, verify after you change.
When the task is done, summarize what you changed in one sentence."""

OPTIONS = ClaudeAgentOptions(
    system_prompt=SYSTEM,
    allowed_tools=["Read", "Edit", "Bash", "Glob"],  # the agent's only hands
    permission_mode="acceptEdits",                    # edits auto-approved, everything else gated
    cwd="scripts/codewired/wired_agent/demo",         # its whole world is this folder
    max_turns=12,
)


async def main(task: str) -> None:
    print(f"⚡ wired starting: {task}\n")
    async for message in query(prompt=task, options=OPTIONS):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    detail = block.input.get("command") or block.input.get("file_path") or ""
                    print(f"  → {block.name}  {detail}")
                elif isinstance(block, TextBlock) and block.text.strip():
                    print(f"\n{block.text.strip()}\n")


if __name__ == "__main__":
    asyncio.run(main(" ".join(sys.argv[1:]) or "run temps.py, find the bug, fix it, verify"))
