#!/usr/bin/env bash
# Refuse a version that is not strictly greater than what is already released.
# VERSION must be greater than:
#   - the highest existing tag v<X.Y.Z>
#   - the VERSION file of the base branch, when BASE_REF is set (pull requests: BASE_REF=main)
# The developer increments VERSION by hand; this script only checks it.
#
# Usage: scripts/check-version.sh
# Env:   BASE_REF  base branch to compare with (default: none)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

version="$(tr -d '[:space:]' < VERSION)"
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "::error file=VERSION::VERSION must look like 1.2.3, got: $version" >&2
    exit 1
fi

greater() {   # greater A B: A is strictly greater than B
    [[ "$1" != "$2" && "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -n 1)" == "$1" ]]
}

fail=0

latest="$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*' | sed 's/^v//' | sort -V | tail -n 1)"
if [[ -n "$latest" ]] && ! greater "$version" "$latest"; then
    echo "::error file=VERSION::VERSION $version must be greater than the latest release v$latest. Increment it." >&2
    fail=1
fi

if [[ -n "${BASE_REF:-}" ]]; then
    base="$(git show "origin/${BASE_REF}:VERSION" 2>/dev/null | tr -d '[:space:]' || true)"
    if [[ -n "$base" ]] && ! greater "$version" "$base"; then
        echo "::error file=VERSION::VERSION $version must be greater than the version on ${BASE_REF} ($base). Increment it." >&2
        fail=1
    fi
fi

if [[ $fail -ne 0 ]]; then
    exit 1
fi

echo "Version $version is greater than the latest release (${latest:-none})."
