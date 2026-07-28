#!/bin/bash
set -e

echo "=== Installing Dependencies ==="
npx pnpm install --no-frozen-lockfile --ignore-scripts

echo "=== Building Frontend for Cloudflare Pages ==="
npx pnpm build

echo ""
echo "=========================================================="
echo " Build Success!"
echo " The build artifacts are located in: src/frontend/dist"
echo "=========================================================="
echo ""
echo "To deploy to Cloudflare Pages via command line, run:"
echo "  npx wrangler pages deploy src/frontend/dist"
echo ""
echo "Or connect your Git repository to the Cloudflare dashboard:"
echo "  - Build Command: npx pnpm build"
echo "  - Build Output Directory: src/frontend/dist"
echo "=========================================================="
