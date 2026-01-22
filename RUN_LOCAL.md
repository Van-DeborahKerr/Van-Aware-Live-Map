# Run this local live map (novice-friendly)

Files included:
- index.html — single-page web app (Leaflet)
- markers.json — small sample POI file (replace or enrich with your dataset)
- simulate_positions.js — optional Node simulator to stream live van positions via WebSocket

Quick static mode (2 minutes)
1. Put `index.html` and `markers.json` in a folder on your device (Raspberry Pi, laptop, Android box).
2. Open a terminal in that folder and run:
   - If you have Python 3:
     ```
     python3 -m http.server 8000
     ```
   - Or with Node (if you have http-server installed):
     ```
     npx http-server -p 8000
     ```
3. Open a browser on the same device or another device on your network:
   - http://localhost:8000  (on the same device)  
   - http://<DEVICE_IP>:8000  (from other devices on your home WiFi)
4. Click "Load sample POIs" in the sidebar to load `markers.json`.

Live mode (simulate a van stream)
1. Install Node.js on the machine you want to run the simulator (Pi/laptop).
2. In the same folder run:
   ```
   npm init -y
   npm install ws
   node simulate_positions.js markers.json
   ```
   The simulator starts a WebSocket server on port 8080 and will broadcast positions every second.

3. In the web page:
   - Enter `ws://<SIMULATOR_IP>:8080` into the WebSocket URL field (for example `ws://192.168.1.42:8080`)
   - Click "Connect WebSocket". You should see vans appear and move.

Running on an Android box or tablet
- You can run the same local static server on a laptop and access it from the Android device browser via the laptop's IP.
- Or put files on the Android device (e.g. Termux) and run `python3 -m http.server`.
- The site runs in any modern browser (Chrome, Firefox).

Making it available to everyone in the van
- Put the files on a small always-on device (Raspberry Pi) and run the python http.server or Node http-server.
- Connect the Pi to your van WiFi / phone hotspot. Everyone on the same network can open http://<PI_IP>:8000.

Helpful tips
- To make the app start automatically on a Raspberry Pi, create a small systemd service that runs the simple HTTP server. If you'd like, I can provide that systemd unit file and instructions.
- To import your full dataset: you'll need lat/lng for each marker (the JSON you pasted earlier did not contain them). I can provide a geocoding script (Nominatim or Mapbox) to add coordinates to your markers.
- If you already have a backend (the Node server from the starter project), point the WebSocket field to that server (ws://<backend_ip>:<port>) and the page will accept live van updates in JSON form:
  - { "vanId":"van-001", "lat":51.5, "lng":-0.1, "speed":12, "heading":80, "recordedAt":"..." }
  - The page also accepts an array of such objects.

Would you like:
- A one-click systemd service file for Raspberry Pi to auto-start the static server? (yes/no)
- A geocoding script to add lat/lng to your large marker JSON? (yes/no)
- A version that registers the page as a Progressive Web App (installable)? (yes/no)

If you want, paste one marker from your dataset that includes an address or a sample page link that contains coordinates — I can show how to geocode that one as an example.