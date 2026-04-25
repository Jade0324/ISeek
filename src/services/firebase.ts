import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; // <-- This imports the database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD33GmXAo2yweU2SMVkrro5_yHb1rPNyM",
  authDomain: "health-patient-navigator.firebaseapp.com",
  projectId: "health-patient-navigator",
  storageBucket: "health-patient-navigator.firebasestorage.app",
  messagingSenderId: "216969730568",
  appId: "1:216969730568:web:0f51fcfd295e9dce250fbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it so the rest of the app can use it
export const db = getFirestore(app); // <-- This activates the real-time magic

const SESSION_KEY = "health_session_id";

function getSessionsMap(): Record<string, string> {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    // If it's an old string ID or invalid JSON, clear it to prevent crashes
    localStorage.removeItem(SESSION_KEY);
    return {};
  }
}

export async function trackLoginAttempt(phoneNumber: string) {
  let sessions = getSessionsMap();
  let sessionId = sessions[phoneNumber];

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2);
    sessions[phoneNumber] = sessionId;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  }

  const userDocRef = doc(db, "users", sessionId);
  await setDoc(userDocRef, {
    phoneNumber: phoneNumber,
    lastLoginAttempt: serverTimestamp(),
    isVerified: false // Default to false for new tracking
  }, { merge: true });
  
  return sessionId;
}

export async function verifyUserSession(method: string, phoneNumber: string, profileData?: any) {
  const sessions = getSessionsMap();
  let sessionId = sessions[phoneNumber];
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessions[phoneNumber] = sessionId;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  }

  const userDocRef = doc(db, "users", sessionId);
  await setDoc(userDocRef, {
    isVerified: true,
    verificationMethod: method,
    phoneNumber: phoneNumber,
    // Use provided profileData or existing values
    name: profileData?.name || "Verified Citizen",
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    birthdate: profileData?.birthdate || "",
    gender: profileData?.gender || "",
    citizenship: profileData?.citizenship || "FILIPINO",
    category: "Indigent",
    age: profileData?.age || 28,
    bloodType: "O+",
    location: "Quezon City",
    timestamp: serverTimestamp()
  }, { merge: true });
}

export async function getUserProfile(phoneNumber: string) {
  const sessions = getSessionsMap();
  const sessionId = sessions[phoneNumber];
  if (!sessionId) return null;

  const userDocRef = doc(db, "users", sessionId);
  const userDoc = await getDoc(userDocRef);
  
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
}

export async function updateUserProfile(phoneNumber: string, data: any) {
  const sessions = getSessionsMap();
  const sessionId = sessions[phoneNumber];
  if (!sessionId) return;

  const userDocRef = doc(db, "users", sessionId);
  await setDoc(userDocRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function checkUserSession(phoneNumber: string): Promise<boolean> {
  const sessions = getSessionsMap();
  const sessionId = sessions[phoneNumber];
  
  if (!sessionId) return false;

  try {
    const userDocRef = doc(db, "users", sessionId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data().isVerified === true && userDoc.data().phoneNumber === phoneNumber;
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
  
  return false;
}

export function clearAllLocalSessions() {
  localStorage.removeItem(SESSION_KEY);
}

export async function saveUserActivity(phoneNumber: string, type: 'extraction' | 'benefit', data: any) {
  const sessions = getSessionsMap();
  const sessionId = sessions[phoneNumber];
  if (!sessionId) return;

  const activityId = Math.random().toString(36).substring(2);
  const activityDocRef = doc(db, "users", sessionId, "activities", activityId);
  
  await setDoc(activityDocRef, {
    type,
    data,
    timestamp: serverTimestamp()
  });
}

export async function loadUserActivities(phoneNumber: string) {
  const sessions = getSessionsMap();
  const sessionId = sessions[phoneNumber];
  if (!sessionId) return [];

  const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
  const activitiesRef = collection(db, "users", sessionId, "activities");
  const q = query(activitiesRef, orderBy("timestamp", "desc"));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
