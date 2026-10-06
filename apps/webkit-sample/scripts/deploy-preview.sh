#!/usr/bin/env bash
# Builds and deploys the internal preview to the account logged into the Azion CLI.
# State lives in azion-preview/; the source deploy's azion/ and azion.config.js are never written.
set -euo pipefail
cd "$(dirname "$0")/.."

backup="$(mktemp)"
cp azion.config.js "$backup"
trap 'cp "$backup" azion.config.js; rm -f "$backup"' EXIT

cp azion-preview/azion.config.mjs azion.config.js
# deploy rewrites the placeholders and rebuilds, so the swap must hold for both steps
azion build --config-dir azion-preview
azion deploy --local --auto --config-dir azion-preview
