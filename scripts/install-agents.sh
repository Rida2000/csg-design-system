#!/bin/bash
set -e

AGENTS_DIR="$HOME/.claude/agents"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_AGENTS="$SCRIPT_DIR/../agents"

echo "CSG Design System — Agent Installer"
echo "===================================="

# Create agents directory if it doesn't exist
mkdir -p "$AGENTS_DIR"

installed=0
updated=0

for f in "$REPO_AGENTS"/*.md; do
  filename=$(basename "$f")

  # Skip the agents README
  if [ "$filename" = "README.md" ]; then
    continue
  fi

  dest="$AGENTS_DIR/$filename"

  if [ -f "$dest" ]; then
    cp "$f" "$dest"
    echo "  Updated:   $filename"
    ((updated++)) || true
  else
    cp "$f" "$dest"
    echo "  Installed: $filename"
    ((installed++)) || true
  fi
done

echo ""
echo "Done. $installed installed, $updated updated."
echo "Agents are in: $AGENTS_DIR"
echo ""
echo "Restart Claude Code to activate the agents."
echo "Then type /agents to see them."
