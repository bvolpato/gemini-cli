#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Setting up pnpm ==="
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Setup pnpm global bin if not already set up
if [ -z "$PNPM_HOME" ]; then
    export PNPM_HOME="$HOME/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
fi

# Ensure pnpm setup is complete
if [ ! -d "$PNPM_HOME" ]; then
    pnpm setup
fi

echo "=== Installing dependencies ==="
pnpm install --ignore-scripts

echo "=== Building packages ==="
pnpm run build

echo "=== Bundling ==="
pnpm run bundle

echo "=== Linking as global 'gemini' command ==="
pnpm link --global

echo ""
echo "=== Done! Run 'gemini --version' to verify ==="
