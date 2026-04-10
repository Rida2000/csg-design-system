#!/bin/bash
set -e

# CSG Design System — Multi-Tool Installer
# Installs DESIGN.md + tool-specific agent/rule configs

REPO_RAW="https://raw.githubusercontent.com/Rida2000/csg-design-system/main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)"
# If run via curl (no local repo), SCRIPT_DIR may not be useful
HAS_LOCAL_REPO=false
if [ -f "$SCRIPT_DIR/../DESIGN.md" ] 2>/dev/null; then
  HAS_LOCAL_REPO=true
  REPO_ROOT="$SCRIPT_DIR/.."
fi

echo ""
echo "CSG Design System — Installer"
echo "=============================="
echo ""

# ── Step 1: Install DESIGN.md ─────────────────────────────────────────────────

install_design_md() {
  if [ -f "DESIGN.md" ]; then
    echo "  Updating DESIGN.md..."
  else
    echo "  Installing DESIGN.md..."
  fi

  if [ "$HAS_LOCAL_REPO" = true ]; then
    cp "$REPO_ROOT/DESIGN.md" ./DESIGN.md
  else
    curl -fsSL -o DESIGN.md "$REPO_RAW/DESIGN.md"
  fi
  echo "  Done: DESIGN.md"
}

# ── Step 2: Tool-specific setup ───────────────────────────────────────────────

install_claude() {
  echo ""
  echo "Installing Claude Code agents..."
  AGENTS_DIR="$HOME/.claude/agents"
  mkdir -p "$AGENTS_DIR"

  local agents=("csg-maintenance.md" "csg-component-builder.md" "csg-design-reviewer.md")
  for name in "${agents[@]}"; do
    if [ "$HAS_LOCAL_REPO" = true ]; then
      cp "$REPO_ROOT/agents/$name" "$AGENTS_DIR/$name"
    else
      curl -fsSL -o "$AGENTS_DIR/$name" "$REPO_RAW/agents/$name"
    fi
    echo "  Installed: $name → $AGENTS_DIR/"
  done
  echo ""
  echo "  Restart Claude Code, then type /agents to see them."
}

install_cursor() {
  echo ""
  echo "Installing Cursor rules..."

  # Install .cursorrules to project root
  if [ "$HAS_LOCAL_REPO" = true ]; then
    cp "$REPO_ROOT/.cursorrules" ./.cursorrules
  else
    curl -fsSL -o .cursorrules "$REPO_RAW/.cursorrules"
  fi
  echo "  Installed: .cursorrules"

  # Install modular rules to .cursor/rules/
  mkdir -p .cursor/rules
  local rules=("csg-component-builder.mdc" "csg-design-reviewer.mdc" "csg-maintenance.mdc" "csg-figma-sync.mdc")
  for name in "${rules[@]}"; do
    if [ "$HAS_LOCAL_REPO" = true ]; then
      cp "$REPO_ROOT/cursor/$name" ".cursor/rules/$name"
    else
      curl -fsSL -o ".cursor/rules/$name" "$REPO_RAW/cursor/$name"
    fi
    echo "  Installed: .cursor/rules/$name"
  done
  echo ""
  echo "  Restart Cursor to activate. Rules appear in Settings > Rules."
}

install_codex() {
  echo ""
  echo "Installing Codex agents file..."

  if [ "$HAS_LOCAL_REPO" = true ]; then
    cp "$REPO_ROOT/AGENTS.md" ./AGENTS.md
  else
    curl -fsSL -o AGENTS.md "$REPO_RAW/AGENTS.md"
  fi
  echo "  Installed: AGENTS.md"
  echo ""
  echo "  Codex reads AGENTS.md automatically from project root."
}

# ── Interactive menu ──────────────────────────────────────────────────────────

echo "Which tool(s) do you use?"
echo ""
echo "  1) Claude Code"
echo "  2) Cursor"
echo "  3) Codex (OpenAI)"
echo "  4) All of the above"
echo ""
printf "Enter choice [1-4]: "
read -r choice

install_design_md

case "$choice" in
  1) install_claude ;;
  2) install_cursor ;;
  3) install_codex ;;
  4)
    install_claude
    install_cursor
    install_codex
    ;;
  *)
    echo "Invalid choice. Installing DESIGN.md only."
    ;;
esac

echo ""
echo "Done! DESIGN.md is your single source of truth."
echo "View the visual spec: https://rida2000.github.io/csg-design-system/"
echo ""
