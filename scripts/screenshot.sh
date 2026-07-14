#!/bin/bash
# Використання: ./scripts/screenshot.sh <ширина,висота> <шлях_виводу.png> <файл_або_url>
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size="$1" --screenshot="$2" "$3" 2>/dev/null
