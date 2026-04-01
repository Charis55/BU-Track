import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

const DAILY_LOG_COLLECTION = "daily_logs";
const USER_COLLECTION = "users";

/**
 * Get the current date string in YYYY-MM-DD format.
 */
const getTodayStr = () => new Date().toISOString().split('T')[0];

/**
 * Initialize or fetch the daily log for a user.
 */
export const getDailyLog = async (uid) => {
  const today = getTodayStr();
  const logId = `${uid}_${today}`;
  const logRef = doc(db, DAILY_LOG_COLLECTION, logId);
  const logSnap = await getDoc(logRef);

  if (logSnap.exists()) {
    return logSnap.data();
  } else {
    // Initial data for a new day
    const initialData = {
      uid,
      date: today,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      steps: 0,
      water: 0,
      weight: 0, 
      lastUpdated: serverTimestamp()
    };
    await setDoc(logRef, initialData);
    return initialData;
  }
};

/**
 * Update a specific metric for today.
 */
export const updateTodayMetric = async (uid, metrics) => {
  const today = getTodayStr();
  const logId = `${uid}_${today}`;
  const logRef = doc(db, DAILY_LOG_COLLECTION, logId);
  
  await updateDoc(logRef, {
    ...metrics,
    lastUpdated: serverTimestamp()
  });
};

/**
 * Log a meal and update the daily calorie count.
 */
export const logUserMeal = async (uid, meal) => {
  const mealRef = collection(db, "users", uid, "meals");
  await addDoc(mealRef, {
    ...meal,
    timestamp: serverTimestamp()
  });

  // Update daily consumed calories
  const currentLog = await getDailyLog(uid);
  const newTotal = (currentLog.caloriesConsumed || 0) + (meal.calories || 0);
  await updateTodayMetric(uid, { caloriesConsumed: newTotal });
};

/**
 * Log a workout and update the daily burned calories.
 */
export const logUserWorkout = async (uid, workout) => {
  const workoutRef = collection(db, "users", uid, "workouts");
  await addDoc(workoutRef, {
    ...workout,
    timestamp: serverTimestamp()
  });

  // Update daily burned calories
  const currentLog = await getDailyLog(uid);
  const newTotal = (currentLog.caloriesBurned || 0) + (workout.calories || 0);
  await updateTodayMetric(uid, { caloriesBurned: newTotal });
};

/**
 * Fetch all users for the leaderboard.
 */
export const getLeaderboardData = async () => {
  // Query for top students based on steps or points.
  // Using daily_logs as an example of active tracking.
  const today = getTodayStr();
  const q = query(
    collection(db, DAILY_LOG_COLLECTION),
    where("date", "==", today),
    orderBy("caloriesConsumed", "desc"), // Simplified for demo; would usually be points
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.data());
  });
  return results;
};
