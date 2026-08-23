#!/bin/sh
set -eu

cd "$(dirname "$0")"

SKILL_NAME="automotive-marketing-materials"
SKILL_SRC="$(pwd)/skills/$SKILL_NAME"
SKILL_DEST="$HOME/.codex/skills/$SKILL_NAME"

echo "Installing Automotive Skill UI..."

if [ ! -f "$SKILL_SRC/SKILL.md" ]; then
  echo "Missing packaged skill: $SKILL_SRC"
  echo "Please use the full installer package."
  read -r -p "Press Enter to exit..." _
  exit 1
fi

if [ -f "$SKILL_DEST/SKILL.md" ]; then
  echo "Skill already installed: $SKILL_DEST"
else
  echo "Installing skill to: $SKILL_DEST"
  mkdir -p "$HOME/.codex/skills"
  cp -R "$SKILL_SRC" "$SKILL_DEST"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found."
  echo "Install Node.js LTS from https://nodejs.org, then run install.command again."
  read -r -p "Press Enter to exit..." _
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found."
  echo "Install Node.js LTS from https://nodejs.org, then run install.command again."
  read -r -p "Press Enter to exit..." _
  exit 1
fi

if [ ! -x "node_modules/.bin/codex" ]; then
  echo "Installing UI dependencies..."
  npm install
else
  echo "UI dependencies already installed."
fi

echo
echo "Install complete."
echo "Run start.command, then open http://localhost:8787/"
read -r -p "Press Enter to exit..." _
