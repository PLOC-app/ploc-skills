#!/usr/bin/env bash
# Build one zip per skill in dist/, for tools that import skills as zip files (Claude chat, GitHub releases).
# Each zip contains the skill folder at its root, with SKILL.md inside.
#
# Usage: scripts/package.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/skills"
mkdir -p "$ROOT/dist"

for dir in */; do
    name="${dir%/}"
    [[ -f "$name/SKILL.md" ]] || continue
    rm -f "$ROOT/dist/$name.zip"
    stage="$(mktemp -d)"
    cp -R "$name" "$stage/$name"
    [[ -f "$ROOT/LICENSE" ]] && cp "$ROOT/LICENSE" "$stage/$name/LICENSE"
    (cd "$stage" && zip -rq "$ROOT/dist/$name.zip" "$name" -x "*.DS_Store")
    rm -rf "$stage"
    echo "dist/$name.zip"
done
