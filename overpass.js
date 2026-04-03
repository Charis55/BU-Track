import https from 'https';
import fs from 'fs';

const query = `[out:json];
(
  node(6.8865,3.7130,6.8975,3.7315)["name"];
  way(6.8865,3.7130,6.8975,3.7315)["name"];
);
out center;`;

const options = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
        const parsed = JSON.parse(data);
        const results = parsed.elements.filter(e => e.tags && e.tags.name).map(e => {
            const lat = e.lat || e.center?.lat;
            const lon = e.lon || e.center?.lon;
            return { name: e.tags.name, lat, lng: lon, type: e.tags.amenity || e.tags.building || 'unknown' };
        });
        fs.writeFileSync('overpass_results.json', JSON.stringify(results, null, 2));
    } catch(e) {
        console.error("Error parsing");
    }
  });
});
req.write(query);
req.end();
