#!/bin/sh
set -eu

cd "$(dirname "$0")"

SKILL_FILE="$HOME/.codex/skills/automotive-marketing-materials/SKILL.md"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found."
  echo "Install Node.js from https://nodejs.org, then run this file again."
  read -r -p "Press Enter to exit..." _
  exit 1
fi

if [ ! -f "$SKILL_FILE" ]; then
  echo "Missing skill: automotive-marketing-materials"
  echo "Expected: $SKILL_FILE"
  echo "Please install the skill before using this UI."
  read -r -p "Press Enter to exit..." _
  exit 1
fi

if [ ! -x "node_modules/.bin/codex" ]; then
  if command -v npm >/dev/null 2>&1; then
    echo "Installing dependencies..."
    npm install
  else
    echo "Missing dependencies and npm was not found."
    echo "Install Node.js from https://nodejs.org, then run this file again."
    read -r -p "Press Enter to exit..." _
    exit 1
  fi
fi

echo "Starting Automotive Skill UI..."
node bridge.js
