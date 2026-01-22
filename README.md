# Van-Aware Live Map — Multi‑repo Starter

This repository bundle contains a local-first, van-aware live map and campsite directory for the UK. It is designed to run on a laptop, Raspberry Pi, Android box or tablet and to be private by default (runs on your local network / hotspot).

Included components
- Frontend (single-page): index.html, markers.json, manifest.json, sw.js — interactive dashboard, embedded Leaflet map, shortlist, visited flags, charts and PWA support.
- Simulator: simulate_positions.js + package.json — lightweight WebSocket server that broadcasts demo van positions and supports visited sync.
- Tools: scripts/geocode-nominatim.js (geocode), scripts/import-markers.js (import to Postgres).
- Deploy helper: deploy/vanmap.service — systemd unit to auto-start a simple static server on Raspberry Pi.
- LICENSE, .gitignore

Quick start (local)
1. Put `index.html`, `markers.json`, `manifest.json`, `sw.js` in a folder.
2. Serve the folder:
   - Python: `python3 -m http.server 8000`
   - Node (http-server): `npx http-server -p 8000`
3. Open the page:
   - Local: http://localhost:8000
   - From another device on the same WiFi/hotspot: http://<HOST_IP>:8000

Try live van simulator
1. In the same folder place `simulate_positions.js` and `package.json`.
2. Run:
   ```
   npm install
   npm start
   ```
3. In the dashboard put `ws://<SIMULATOR_IP>:8080` into the WebSocket input and click Connect WS.

Geocoding large datasets
- Use `scripts/geocode-nominatim.js` to geocode markers (Nominatim). Respect usage policy and replace the User-Agent email in the script.
- After you have `markers_enriched.json`, you can replace `markers.json` with it.

Import to Postgres/PostGIS
- Use `scripts/import-markers.js`:
  ```
  DATABASE_URL=postgresql://user:pass@host:5432/db node scripts/import-markers.js markers_enriched.json
  ```
- The script creates a `markers` table with `geom` geometry points.

Deploy on Raspberry Pi (always-on)
1. Copy the folder to the Pi (scp/rsync/git).
2. Test:
   ```
   cd ~/vanmap-dashboard
   python3 -m http.server 8000
   ```
3. To auto-start on boot use the provided systemd unit (`deploy/vanmap.service`):
   ```
   sudo cp deploy/vanmap.service /etc/systemd/system/vanmap.service
   sudo systemctl daemon-reload
   sudo systemctl enable vanmap
   sudo systemctl start vanmap
   sudo journalctl -u vanmap -f
   ```

Repository split suggestion
- van-aware-live-map — frontend (index.html, markers.json, PWA files, README)
- van-aware-simulator — simulator (simulate_positions.js + package.json)
- vanstops-data — dataset (markers_input.json / markers_enriched.json)

Git / GitHub tips
- Create repos with `gh repo create` or via GitHub web UI.
- Push each folder into its own repo (see earlier instructions in conversation for exact commands).

Privacy & security
- Local-first by default — no cloud service required.
- If you expose the server to the internet (ngrok/localtunnel), be cautious and add auth.
- Devices connecting to the Pi should be trusted (hotspot or private WiFi).

Support & contribution
- If you'd like, I can:
  - generate ZIPs for each repo,
  - create the GitHub repos for you,
  - create a basic GitHub Pages demo,
  - produce outreach assets (GIF, demo text for Reddit/Facebook/Twitter),
  - run geocoding for a sample of your markers and return `markers_enriched.json`.

Enjoy — run locally and tell me which of the optional tasks above you want me to do next.