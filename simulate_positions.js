/**
 * Lightweight WebSocket simulator for live van positions and visited sync.
 *
 * Usage:
 *   npm init -y
 *   npm install ws
 *   node simulate_positions.js markers.json
 *
 * Sends:
 *  - Initial array of van objects (vanId, lat, lng, speed, heading, recordedAt)
 *  - Regular updates every 1s with small random movement
 *  - Rebroadcasts visited sync when a client sends a visited message
 */

const fs = require('fs');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const input = process.argv[2] || 'markers.json';

let raw;
try { raw = fs.readFileSync(input, 'utf8'); } catch (e) { console.error('Cannot read', input); process.exit(1); }
const markers = JSON.parse(raw).filter(m => m.latitude && m.longitude);
if (!markers.length) { console.error('No markers with lat/lng'); process.exit(1); }

const vans = markers.slice(0, Math.min(6, markers.length)).map((m, i) => ({
  vanId: 'van-' + (i+1),
  lat: m.latitude + (Math.random()-0.5)*0.002,
  lng: m.longitude + (Math.random()-0.5)*0.002,
  speed: Math.floor(10 + Math.random()*40),
  heading: Math.floor(Math.random()*360),
  recordedAt: new Date().toISOString()
}));

const wss = new WebSocket.Server({ port: PORT }, () => console.log('Simulator WS listening on ws://0.0.0.0:' + PORT));

wss.on('connection', ws => {
  ws.send(JSON.stringify(vans));
  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data && data.type === 'visited' && data.id) {
        wss.clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(JSON.stringify(data)); });
      }
    } catch (err) {}
  });
});

function step(){
  vans.forEach(v => {
    v.lat += (Math.random()-0.5)*0.0008;
    v.lng += (Math.random()-0.5)*0.0008;
    v.speed = Math.max(0, v.speed + (Math.random()-0.5)*3);
    v.heading = (v.heading + (Math.random()-0.5)*10 + 360) % 360;
    v.recordedAt = new Date().toISOString();
  });
  const payload = JSON.stringify(vans);
  wss.clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(payload); });
}
setInterval(step, 1000);