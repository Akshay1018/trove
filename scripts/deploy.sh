#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${1:-$PWD}"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Error: Project directory does not exist: $PROJECT_DIR" >&2
  exit 1
fi

PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
cd "$PROJECT_DIR"

if [[ ! -f package.json ]]; then
  echo "Error: package.json not found in $PROJECT_DIR" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Error: Node.js and npm are required." >&2
  exit 1
fi

if ! node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)"; then
  echo "Error: package.json must define a build script." >&2
  exit 1
fi

if [[ ! -f .env && ! -f .env.production ]]; then
  echo "Notice: No local production environment file found."
  echo "Ensure required environment variables are configured in your hosting platform."
fi

echo "Preparing deployment for: $PROJECT_DIR"
bash "$SCRIPT_DIR/build.sh" "$PROJECT_DIR"

echo "Build succeeded. Deployment preparation is complete."
echo "Deploy using your hosting provider's documented workflow."
