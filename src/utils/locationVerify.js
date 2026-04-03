// ─────────────────────────────────────────────────────────────────────────────
// Location Verification Utility for BU-Track Workout Logging
// Prevents fake workout logging by checking the user's GPS position against
// known campus venue coordinates before a workout can be saved.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Haversine distance between two GPS points, in metres.
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─────────────────────────────────────────────────────────────────────────────
// Named campus venues (used for user-facing messages)
// ─────────────────────────────────────────────────────────────────────────────
export const VENUE_LOCATIONS = {
  stadium:      { name: 'Babcock Stadium',           lat: 6.8949,  lng: 3.7276  },
  guestHouse:   { name: 'Babcock Guest House',        lat: 6.89051, lng: 3.71992 },
  basketball:   { name: 'Basketball Court',           lat: 6.89396, lng: 3.72848 },
  volleyball:   { name: 'Volleyball Court',           lat: 6.88963, lng: 3.72331 }, // 6°53'22.6"N 3°43'23.9"E
  gym:          { name: 'Babcock Sports Complex',     lat: 6.8945,  lng: 3.7265  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Venue groups per workout type
// radius: maximum allowed distance in metres from any of the listed venues
// ─────────────────────────────────────────────────────────────────────────────
const LOCATION_RULES = {
  // Weightlifting / gym cardio — must be near the gym or stadium
  gym: {
    label: 'Gym',
    radius: 200,
    venues: [VENUE_LOCATIONS.gym, VENUE_LOCATIONS.guestHouse, VENUE_LOCATIONS.stadium],
    hint: 'You must be at the Sports Complex, Guest House or Stadium to log a gym workout.',
  },
  // Swimming — Guest House pool or Stadium
  swimming: {
    label: 'Pool',
    radius: 200,
    venues: [VENUE_LOCATIONS.guestHouse, VENUE_LOCATIONS.stadium],
    hint: 'You must be near the Guest House pool or the Stadium to log swimming.',
  },
  // Football — stadium
  football: {
    label: 'Stadium / Football Pitch',
    radius: 200,
    venues: [VENUE_LOCATIONS.stadium],
    hint: 'Football must be logged at or near the Babcock Stadium.',
  },
  // Basketball — court or stadium
  basketball: {
    label: 'Basketball Court / Stadium',
    radius: 200,
    venues: [VENUE_LOCATIONS.basketball, VENUE_LOCATIONS.stadium],
    hint: 'Basketball must be logged at the Basketball Court or Stadium.',
  },
  // Volleyball — volleyball court or stadium
  volleyball: {
    label: 'Volleyball Court / Stadium',
    radius: 200,
    venues: [VENUE_LOCATIONS.volleyball, VENUE_LOCATIONS.stadium],
    hint: 'Volleyball must be logged at the Volleyball Court or Stadium.',
  },
  // Outdoor jogging — checked dynamically against the route's first waypoint
  outdoor: {
    label: 'Route Start',
    radius: 200,
    venues: [], // populated dynamically per-route
    hint: 'You must select a route and be at its starting point to log this run.',
  },
  // Yoga — no location requirement
  anywhere: null,
};

/**
 * Maps a workout's category ID + subcategory ID + workout ID to a rule key.
 * Returns 'anywhere' if no location check is needed.
 */
export function getRuleKey(categoryId, subId, workoutId) {
  if (categoryId === 'yoga') return 'anywhere';

  if (categoryId === 'weightlifting') return 'gym';

  if (categoryId === 'cardio') {
    if (subId === 'c_equipment') return 'gym';
    if (subId === 'c_pool')      return 'swimming';
    if (subId === 'c_outdoor')   return 'outdoor';
  }

  if (categoryId === 'sports') {
    if (workoutId === 'football')   return 'football';
    if (workoutId === 'basketball') return 'basketball';
    if (workoutId === 'volleyball') return 'volleyball';
    return 'gym'; // other sports (tennis etc.) → near a sports venue
  }

  return 'anywhere'; // default fallback
}

/**
 * Requests the user's current GPS position.
 * Returns { lat, lng } or throws if denied/unavailable.
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_UNAVAILABLE'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === 1) reject(new Error('PERMISSION_DENIED'));
        else                reject(new Error('POSITION_UNAVAILABLE'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Core verification function.
 *
 * @param {string} categoryId  - e.g. 'cardio', 'weightlifting'
 * @param {string} subId       - e.g. 'c_outdoor', 'w_chest'
 * @param {string} workoutId   - e.g. 'football', 'jog_light'
 * @param {object|null} selectedRoute - jogging route object (with waypoints[0])
 *
 * @returns {Promise<{
 *   status: 'verified' | 'out_of_range' | 'permission_denied' | 'unavailable' | 'no_check',
 *   distanceM: number|null,
 *   nearestVenue: string|null,
 *   hint: string|null,
 * }>}
 */
export async function verifyWorkoutLocation(categoryId, subId, workoutId, selectedRoute = null) {
  const ruleKey = getRuleKey(categoryId, subId, workoutId);

  if (ruleKey === 'anywhere') {
    return { status: 'no_check', distanceM: null, nearestVenue: null, hint: null };
  }

  const rule = { ...LOCATION_RULES[ruleKey] };

  // For outdoor routes, replace venues with the route starting waypoint
  if (ruleKey === 'outdoor') {
    if (selectedRoute?.waypoints?.length) {
      const [startLat, startLng] = selectedRoute.waypoints[0];
      rule.venues = [{
        name: `Start of "${selectedRoute.name}"`,
        lat: startLat,
        lng: startLng,
      }];
      rule.hint = `You must be at the start of the ${selectedRoute.name} route to log this run.`;
    } else {
      // Prompt user to select a route so we know what they are running
      return { status: 'out_of_range', distanceM: null, nearestVenue: null, hint: 'Please select a campus route first.' };
    }
  }

  // No venues defined = cannot verify, allow with no_check
  if (!rule.venues || rule.venues.length === 0) {
    return { status: 'no_check', distanceM: null, nearestVenue: null, hint: null };
  }

  // Request GPS
  let userPos;
  try {
    userPos = await getCurrentPosition();
  } catch (err) {
    const status = err.message === 'PERMISSION_DENIED' ? 'permission_denied' : 'unavailable';
    return { status, distanceM: null, nearestVenue: null, hint: rule.hint };
  }

  // Find the nearest valid venue
  let nearestVenue = null;
  let minDistance = Infinity;

  for (const venue of rule.venues) {
    const d = haversineDistance(userPos.lat, userPos.lng, venue.lat, venue.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestVenue = venue.name;
    }
  }

  const status = minDistance <= rule.radius ? 'verified' : 'out_of_range';

  return {
    status,
    distanceM: Math.round(minDistance),
    nearestVenue,
    hint: rule.hint,
    userLat: userPos.lat,
    userLng: userPos.lng,
  };
}
