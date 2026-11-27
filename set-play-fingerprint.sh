#!/bin/bash
# Kemas kini assetlinks.json dengan SHA-256 Play App Signing, kemudian deploy.
# Guna: ./set-play-fingerprint.sh "AA:BB:CC:..."
set -e
FP="$1"
if [ -z "$FP" ]; then echo "Guna: $0 \"AA:BB:..\""; exit 1; fi
if ! [[ "$FP" =~ ^([0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2}$ ]]; then
  echo "RALAT: format SHA-256 tidak sah (32 pasangan hex dipisah titik bertindih)"; exit 1
fi
cd "$(dirname "$0")"
cat > public/.well-known/assetlinks.json <<JSON
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kinderdy.kids",
    "sha256_cert_fingerprints": ["$FP"]
  }
}]
JSON
VITE_BASE=/kinderdy-kids/ npm run build
git add public/.well-known/assetlinks.json
git -c user.email=dev@local -c user.name=Kinderdy commit -qm "assetlinks: Play App Signing SHA-256"
git push -q origin main
git add -f dist
git -c user.email=dev@local -c user.name=Kinderdy commit -qm "deploy: play fingerprint"
git subtree push --prefix dist origin gh-pages | tail -1
echo "Siap. Uji: https://shahadahadilah-blip.github.io/kinderdy-kids/.well-known/assetlinks.json"
