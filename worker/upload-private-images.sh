#!/usr/bin/env bash
# Lädt alle Bilder aus ../private/img in den Cloudflare-KV-Speicher (Schlüssel "img:<dateiname>").
# Die Website lädt sie dann über https://<worker>/img/<dateiname> – im GitHub-Repo landen sie nie.
#
#   cd worker && ./upload-private-images.sh
set -euo pipefail
cd "$(dirname "$0")"
for f in ../private/img/*; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  echo "↑ $name"
  npx wrangler kv key put --binding CONTEXTO_CACHE --remote "img:$name" --path "$f" >/dev/null
done
echo "Fertig."
