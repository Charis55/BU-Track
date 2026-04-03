import fs from 'fs';

const existingFacilities = [
  { id: 1, name: 'Babcock University Stadium', type: 'sports', lat: 6.8949, lng: 3.7276, icon: '🏟️', desc: 'Main athletics and football arena.' },
  { id: 2, name: 'Babcock University Shopping Complex', type: 'food', lat: 6.8912, lng: 3.7205, icon: '🛍️', desc: 'Central shopping and food mall.' },
  { id: 3, name: 'Wema Bank BABCOCK University', type: 'amenity', lat: 6.8909, lng: 3.7208, icon: '🏦', desc: 'Babcock branch financial services.' },
  { id: 4, name: 'Laz Otti Library', type: 'academic', lat: 6.8923, lng: 3.7225, icon: '📚', desc: 'Core academic research and study hub.' },
  { id: 5, name: 'Babcock University Teaching Hospital', type: 'health', lat: 6.8911, lng: 3.7173, icon: '🏥', desc: 'BUTH – Specialised medical care.' },
  { id: 6, name: 'Babcock University Registry', type: 'admin', lat: 6.8893, lng: 3.7218, icon: '🏛️', desc: 'Academic and administrative records.' },
  { id: 7, name: 'School of Computing & Engineering', type: 'academic', lat: 6.8904, lng: 3.7232, icon: '💻', desc: 'Faculty of Computing and Engineering Sciences.' },
  { id: 8, name: 'Babcock University Main Campus Center', type: 'academic', lat: 6.8924, lng: 3.7183, icon: '🌐', desc: 'Geographic and social heart of the campus.' },
  { id: 9, name: 'Babcock Basketball Court', type: 'sports', lat: 6.89396, lng: 3.72848, icon: '🏀', desc: 'Outdoor sports and basketball facility.' },
  { id: 10, name: 'Babcock Amphitheatre', type: 'sports', lat: 6.8909, lng: 3.7226, icon: '🎭', desc: 'Open-air theatre for events and leisure.' },
  { id: 11, name: 'Babcock Food Service', type: 'food', lat: 6.89305, lng: 3.72277, icon: '🍛', desc: 'Primary student catering facility (Cafeteria).' },
  { id: 12, name: 'Babcock University Bakery', type: 'food', lat: 6.8928, lng: 3.7196, icon: '🥖', desc: 'Fresh campus-made bread and pastries.' },
  { id: 13, name: 'Babcock Business School', type: 'academic', lat: 6.8907, lng: 3.7237, icon: '📊', desc: 'Faculty of management sciences.' },
  { id: 14, name: 'Access Bank Babcock', type: 'amenity', lat: 6.89078, lng: 3.72069, icon: '🏦', desc: 'Standalone bank branch south of Shopping Complex.' },
];

const results = JSON.parse(fs.readFileSync('overpass_results.json', 'utf8'));

// manually known halls
const knownHalls = ['Queen Esther', 'Felicia Adebisi Dada', 'Justice Deborah', 'Maranatha', 'Gamaliel', 'Iperu Female Hall', 'Nelson Mandela'];

let START_ID = 15;
const additionalFacilities = results.map(r => {
    let type = 'amenity';
    let icon = '📍';
    let desc = 'Campus Location';
    
    let name = r.name;
    let nameLower = name.toLowerCase();

    // Check known hall lists and add ' Hall' if missing
    if (knownHalls.some(h => nameLower.includes(h.toLowerCase()))) {
        if (!nameLower.includes('hall')) {
            name += ' Hall';
        }
    }

    nameLower = name.toLowerCase();

    if (nameLower.includes('hall') || nameLower.includes('hostel')) {
        type = 'residential';
        icon = '🏠';
        desc = 'Student Residential Hall';
    } else if (nameLower.includes('mall') || nameLower.includes('food') || nameLower.includes('cafe')) {
        type = 'food';
        icon = '🍔';
        desc = 'Food and Shopping';
    } else if (nameLower.includes('church') || nameLower.includes('chapel')) {
        type = 'amenity';
        icon = '⛪';
        desc = 'Place of Worship';
    } else if (nameLower.includes('bank') || nameLower.includes('atm')) {
        type = 'amenity';
        icon = '🏦';
        desc = 'Banking Services';
    } else if (nameLower.includes('school') || nameLower.includes('academic') || nameLower.includes('library') || nameLower.includes('science') || nameLower.includes('eah') || nameLower.includes('bucodel')) {
        type = 'academic';
        icon = '📚';
        desc = 'Academic Building';
    } else if (nameLower.includes('hospital') || nameLower.includes('buth')) {
        type = 'health';
        icon = '🏥';
        desc = 'Medical Facility';
    } else if (nameLower.includes('court') || nameLower.includes('stadium') || nameLower.includes('park')) {
         type = 'sports';
         icon = '⚽';
         desc = 'Sports and Recreation';
    } else if (nameLower.includes('senate') || nameLower.includes('gate') || nameLower.includes('bursary')) {
         type = 'admin';
         icon = '🏛️';
         desc = 'Administrative Building';
    }

    return {
        id: START_ID++,
        name: name,
        type,
        lat: parseFloat((r.lat || r.center?.lat).toFixed(5)),
        lng: parseFloat((r.lng || r.center?.lon).toFixed(5)),
        icon,
        desc
    };
});

// filter out duplicates by NAME strictly, not by coordinate distance
const merged = [...existingFacilities];
const existingNames = new Set(existingFacilities.map(f => f.name.toLowerCase()));

for (const additional of additionalFacilities) {
    let isDupe = false;
    for (const existing of merged) {
        if (existing.name.toLowerCase() === additional.name.toLowerCase()) {
            isDupe = true;
            break;
        }
    }
    if (!isDupe) {
        merged.push(additional);
    }
}

// Check for heavily requested halls that might not be in OSM, and inject them manually with rough offsets
const manualHalls = [
    { name: 'Gamaliel Hall', lat: 6.8932, lng: 3.7221 },
    { name: 'Maranatha Hall', lat: 6.8921, lng: 3.7258 },
    { name: 'Justice Deborah Hall', lat: 6.8945, lng: 3.7265 }
];

for (const manual of manualHalls) {
    if (!merged.some(m => m.name.toLowerCase().includes(manual.name.toLowerCase()))) {
        merged.push({
            id: START_ID++,
            name: manual.name,
            type: 'residential',
            lat: manual.lat,
            lng: manual.lng,
            icon: '🏠',
            desc: 'Student Residential Hall'
        });
    }
}

fs.writeFileSync('generated_facilities.js', "export const FACILITIES = " + JSON.stringify(merged, null, 2) + ";");
