import fs from 'fs';

let mapFile = fs.readFileSync('src/pages/Campus/Map.jsx', 'utf8');
const facilities = fs.readFileSync('generated_facilities.js', 'utf8');

// Replace everything between the start of FACILITIES up to the closing bracket of its assignment.
// Wait, regex might fail with nested brackets, but FACILITIES is flat.
mapFile = mapFile.replace(/\/\/ ─+[\s\S]+?const FACILITIES = \[[^\]]+\];/, '// ─────────────────────────────────────────────────────────────────────────────\n// Extended Campus Facilities including Residential Halls\n// ─────────────────────────────────────────────────────────────────────────────\n' + facilities);

mapFile = mapFile.replace(/const CATEGORIES = \[[\s\S]+?\];/, 'const CATEGORIES = [\n  { id: \'all\', label: \'All\', icon: \'🌐\' },\n  { id: \'academic\', label: \'Academic\', icon: \'📚\' },\n  { id: \'residential\', label: \'Residential\', icon: \'🏠\' },\n  { id: \'food\', label: \'Food\', icon: \'🍔\' },\n  { id: \'health\', label: \'Health\', icon: \'🏥\' },\n  { id: \'sports\', label: \'Sports\', icon: \'⚽\' },\n  { id: \'amenity\', label: \'Amenities\', icon: \'🏦\' },\n];');

fs.writeFileSync('src/pages/Campus/Map.jsx', mapFile);
console.log("SUCCESS");
