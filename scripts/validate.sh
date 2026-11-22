#!/usr/bin/env bash
# Check the repository before a pull request or a release:
#   - VERSION is a semantic version (X.Y.Z)
#   - every skills/<name>/SKILL.md has a frontmatter with name (= folder name) and a description (<= 1024 characters)
#   - every relative link in the Markdown files of a skill points to an existing file
#   - skills/ploc/sdk/catalog.json is valid JSON
#
# Usage: scripts/validate.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python3 -I - <<'PY'
import json
import os
import re
import subprocess
import sys

errors = []

def fail(message):
    errors.append(message)

# VERSION
try:
    version = open("VERSION").read().strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        fail(f"VERSION must look like 1.2.3, got: {version!r}")
except FileNotFoundError:
    fail("VERSION is missing")

# Skills
skills_dir = "skills"
skills = sorted(d for d in os.listdir(skills_dir) if os.path.isdir(os.path.join(skills_dir, d)))
if not skills:
    fail("no skill found in skills/")

for name in skills:
    path = os.path.join(skills_dir, name, "SKILL.md")
    if not os.path.isfile(path):
        fail(f"{path} is missing")
        continue

    text = open(path, encoding="utf-8").read()
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        fail(f"{path}: frontmatter is missing")
        continue

    # Parse the frontmatter as real YAML (ruby is available on GitHub runners and macOS).
    parsed = subprocess.run(
        ["ruby", "-ryaml", "-rjson", "-e", "puts JSON.generate(YAML.safe_load(STDIN.read))"],
        input=match.group(1), capture_output=True, text=True,
    )
    if parsed.returncode != 0:
        fail(f"{path}: frontmatter is not valid YAML: {parsed.stderr.strip().splitlines()[-1] if parsed.stderr.strip() else 'parse error'}")
        continue
    fields = json.loads(parsed.stdout)
    if fields.get("name") != name:
        fail(f"{path}: name must be {name!r}, got {fields.get('name')!r}")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name) or len(name) > 64:
        fail(f"{path}: invalid skill name {name!r}")
    description = fields.get("description", "")
    if not description:
        fail(f"{path}: description is missing")
    elif len(description) > 1024:
        fail(f"{path}: description is {len(description)} characters (max 1024)")

    # Relative links
    for folder, _, files in os.walk(os.path.join(skills_dir, name)):
        for file in files:
            if not file.endswith(".md"):
                continue
            source = os.path.join(folder, file)
            content = open(source, encoding="utf-8").read()
            links = re.findall(r"\]\(([^)\s]+)\)", content) + re.findall(r'(?:src|href)="([^"]+)"', content)
            for link in links:
                if re.match(r"^(https?:|mailto:|#|data:)", link):
                    continue
                target = os.path.normpath(os.path.join(folder, link.split("#")[0]))
                if not os.path.exists(target):
                    fail(f"{source}: broken link {link}")

# Catalog
catalog = os.path.join(skills_dir, "ploc", "sdk", "catalog.json")
if os.path.isfile(catalog):
    try:
        json.load(open(catalog, encoding="utf-8"))
    except ValueError as error:
        fail(f"{catalog}: invalid JSON ({error})")

if errors:
    print("Validation failed:")
    for error in errors:
        print("  -", error)
    sys.exit(1)

print(f"OK: version {version}, skills: {', '.join(skills)}")
PY
