#!/bin/bash
set -e

# CSG Design System — Multi-Tool Installer
# Installs DESIGN.md + tool-specific agent/rule configs
# Works with both public and private repos (uses gh CLI for private)

REPO="Rida2000/csg-design-system"
BRANCH="main"
REPO_RAW="https://raw.githubusercontent.com/$REPO/$BRANCH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)"
HAS_LOCAL_REPO=false
if [ -f "$SCRIPT_DIR/../DESIGN.md" ] 2>/dev/null; then
  HAS_LOCAL_REPO=true
  REPO_ROOT="$SCRIPT_DIR/.."
fi

echo ""
echo "CSG Design System — Installer"
echo "=============================="
echo ""

# ── Download helper (works for private repos via gh CLI) ──────────────────────

download_file() {
  local remote_path="$1"
  local local_path="$2"

  if [ "$HAS_LOCAL_REPO" = true ]; then
    cp "$REPO_ROOT/$remote_path" "$local_path"
    return 0
  fi

  # Try raw URL first (works for public repos)
  if curl -fsSL -o "$local_path" "$REPO_RAW/$remote_path" 2>/dev/null; then
    return 0
  fi

  # Fall back to gh CLI (works for private repos)
  if command -v gh &>/dev/null; then
    gh api "repos/$REPO/contents/$remote_path?ref=$BRANCH" --jq '.content' 2>/dev/null \
      | base64 -d > "$local_path" && return 0
  fi

  echo "  Error: Could not download $remote_path"
  echo "  If the repo is private, install the GitHub CLI: https://cli.github.com"
  echo "  Then run: gh auth login"
  return 1
}

# ── Step 1: Install DESIGN.md ─────────────────────────────────────────────────

install_design_md() {
  if [ -f "DESIGN.md" ]; then
    echo "  Updating DESIGN.md..."
  else
    echo "  Installing DESIGN.md..."
  fi
  download_file "DESIGN.md" "./DESIGN.md"
  echo "  Done: DESIGN.md"
}

# ── Step 2: Tool-specific setup ───────────────────────────────────────────────

install_claude() {
  echo ""
  echo "Installing Claude Code agents..."
  AGENTS_DIR="$HOME/.claude/agents"
  mkdir -p "$AGENTS_DIR"

  local agents=(
    "csg-maintenance.md"
    "csg-component-builder.md"
    "csg-design-reviewer.md"
    "csg-figma-sync.md"
    "design-bridge.md"
    "csg-frontend-developer.md"
    "csg-ui-designer.md"
  )
  for name in "${agents[@]}"; do
    download_file "agents/$name" "$AGENTS_DIR/$name"
    echo "  Installed: $name"
  done
  echo ""
  echo "  Restart Claude Code, then type /agents to see them."
}

install_cursor() {
  echo ""
  echo "Installing Cursor rules..."

  download_file ".cursorrules" "./.cursorrules"
  echo "  Installed: .cursorrules"

  mkdir -p .cursor/rules
  local rules=(
    "csg-component-builder.mdc"
    "csg-design-reviewer.mdc"
    "csg-maintenance.mdc"
    "csg-figma-sync.mdc"
  )
  for name in "${rules[@]}"; do
    download_file "cursor/$name" ".cursor/rules/$name"
    echo "  Installed: .cursor/rules/$name"
  done
  echo ""
  echo "  Restart Cursor to activate. Rules appear in Settings > Rules."
}

install_codex() {
  echo ""
  echo "Installing Codex agents file..."
  download_file "AGENTS.md" "./AGENTS.md"
  echo "  Installed: AGENTS.md"
  echo ""
  echo "  Codex reads AGENTS.md automatically from project root."
}

# ── Interactive menu ──────────────────────────────────────────────────────────

# Allow non-interactive installs via env var: `CHOICE=1 curl ... | bash`
choice="${CHOICE:-}"

if [ -z "$choice" ]; then
  echo "Which tool(s) do you use?"
  echo ""
  echo "  1) Claude Code"
  echo "  2) Cursor"
  echo "  3) Codex (OpenAI)"
  echo "  4) All of the above"
  echo ""
  printf "Enter choice [1-4]: "

  # When piped via `curl ... | bash`, stdin is the script itself — `read`
  # would hit EOF. Read from the controlling terminal instead.
  if [ -t 0 ]; then
    read -r choice
  elif [ -r /dev/tty ]; then
    read -r choice < /dev/tty
  else
    echo ""
    echo "  No terminal available. Set CHOICE=1..4 for non-interactive install."
    choice=""
  fi
fi

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

# ── Add installed files to .gitignore ─────────────────────────────────────────

add_to_gitignore() {
  local entry="$1"
  if [ -f ".gitignore" ]; then
    # Skip if already present
    grep -qxF "$entry" .gitignore 2>/dev/null && return
  fi
  echo "$entry" >> .gitignore
}

if [ -f ".git/HEAD" ] || [ -f ".git" ]; then
  echo "Updating .gitignore..."
  # Always added
  add_to_gitignore "DESIGN.md"

  # Tool-specific
  case "$choice" in
    1) ;; # Claude agents go to ~/.claude, nothing in project to ignore
    2)
      add_to_gitignore ".cursorrules"
      add_to_gitignore ".cursor/rules/csg-*.mdc"
      ;;
    3)
      add_to_gitignore "AGENTS.md"
      ;;
    4)
      add_to_gitignore ".cursorrules"
      add_to_gitignore ".cursor/rules/csg-*.mdc"
      add_to_gitignore "AGENTS.md"
      ;;
  esac
  echo "  Done: .gitignore updated"
fi

echo ""
echo "Done! DESIGN.md is your single source of truth."
echo "View the visual spec: https://rida2000.github.io/csg-design-system/"
echo ""
