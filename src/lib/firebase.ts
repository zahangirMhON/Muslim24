import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  setLogLevel,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

// Silence informational warnings like "Could not reach Cloud Firestore backend"
try {
  setLogLevel('error');
} catch (e) {}

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Handle transient browser IndexedDB closing or visibility changes gracefully
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || String(reason || '');
    if (
      msg.includes('Database is closing') ||
      msg.includes('closing/hidden') ||
      msg.includes('failed-precondition') ||
      msg.includes('Could not reach Cloud Firestore') ||
      reason?.code === 'failed-precondition' ||
      reason?.code === 'unavailable'
    ) {
      event.preventDefault();
    }
  });
}

// Initialize Auth with multi-layered persistence (IndexedDB -> LocalStorage -> Memory)
export const auth = (() => {
  if (typeof window === 'undefined') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence]
    });
  } catch {
    return getAuth(app);
  }
})();

// Initialize Firestore with force long polling for reliable iframe/proxy connectivity
export const db: Firestore = (() => {
  const dbId = config.firestoreDatabaseId || undefined;
  if (typeof window !== 'undefined') {
    try {
      return initializeFirestore(app, {
        experimentalForceLongPolling: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      }, dbId);
    } catch (e) {
      try {
        return initializeFirestore(app, {
          experimentalForceLongPolling: true,
          localCache: memoryLocalCache()
        }, dbId);
      } catch {
        return dbId ? getFirestore(app, dbId) : getFirestore(app);
      }
    }
  }
  return dbId ? getFirestore(app, dbId) : getFirestore(app);
})();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper Authentication functions
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if admin email
    const isAdminUser = (user.email?.toLowerCase() === 'zahangir.mhn@gmail.com');

    // Create/update user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email || '',
      displayName: user.displayName || 'সম্মানিত ইউজার',
      photoURL: user.photoURL || '',
      isAdmin: isAdminUser,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    const errMsg = error?.message || '';
    // Fallback to anonymous guest sign in if popup is blocked in iframe or database is closing/hidden
    if (
      error?.code === 'auth/popup-blocked' || 
      error?.code === 'auth/popup-closed-by-user' ||
      errMsg.includes('Database is closing') ||
      errMsg.includes('closing/hidden')
    ) {
      console.warn('Popup blocked, closed, or IndexedDB closing, falling back to guest login...');
      return await loginAnonymously('অতিথি ইউজার');
    }
    throw error;
  }
}

export async function loginAnonymously(guestName = 'অতিথি মুমিন') {
  try {
    let result;
    try {
      result = await signInAnonymously(auth);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Database is closing') || msg.includes('closing/hidden')) {
        console.warn('Database is closing/hidden during auth, retrying with brief delay...');
        await new Promise((res) => setTimeout(res, 500));
        result = await signInAnonymously(auth);
      } else {
        throw err;
      }
    }
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: 'guest@islamiclife.local',
      displayName: guestName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isAdmin: false,
      isAnonymous: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error('Anonymous Auth Error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
  }
}

// User Progress & Activity Tracking
export interface UserActivityData {
  userId: string;
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  dailyListeningMinutes: number;
  notes: string;
  streakDays: number;
}

export async function saveUserActivityProgress(data: UserActivityData) {
  if (!data.userId) return;
  // Local storage cache fallback
  try {
    localStorage.setItem(`user_activity_${data.userId}_${data.date}`, JSON.stringify(data));
  } catch (e) {
    // ignore local storage errors
  }

  if (!auth.currentUser || auth.currentUser.uid !== data.userId) return;

  try {
    const docId = `${data.userId}_${data.date}`;
    const activityRef = doc(db, 'userActivities', docId);
    await setDoc(activityRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Update streak in user doc
    const userRef = doc(db, 'users', data.userId);
    await setDoc(userRef, {
      streakDays: data.streakDays || 1,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore offline/save warning for activity progress:', error);
  }
}

export async function getUserActivityProgress(userId: string, date: string): Promise<UserActivityData | null> {
  if (!userId) return null;

  let localFallback: UserActivityData | null = null;
  try {
    const cached = localStorage.getItem(`user_activity_${userId}_${date}`);
    if (cached) {
      localFallback = JSON.parse(cached);
    }
  } catch (e) {
    // ignore
  }

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return localFallback;
  }

  try {
    const docId = `${userId}_${date}`;
    const activityRef = doc(db, 'userActivities', docId);
    const snap = await getDoc(activityRef);
    if (snap.exists()) {
      const data = snap.data() as UserActivityData;
      try {
        localStorage.setItem(`user_activity_${userId}_${date}`, JSON.stringify(data));
      } catch (e) {}
      return data;
    }
  } catch (error: any) {
    console.warn('Firestore offline or network warning fetching activity progress:', error?.message || error);
  }

  return localFallback;
}

// User Customized Schedule & Playlist Preferences
export async function saveUserPreferences(userId: string, customCategories: string[]) {
  if (!userId) return;

  try {
    localStorage.setItem(`user_pref_${userId}`, JSON.stringify(customCategories));
  } catch (e) {}

  if (!auth.currentUser || auth.currentUser.uid !== userId) return;

  try {
    const docId = `${userId}_preferences`;
    const prefRef = doc(db, 'userSchedules', docId);
    await setDoc(prefRef, {
      userId,
      scheduleName: 'কাস্টম ইউজার প্লেলিস্ট ক্যাটাগরি',
      preferredCategories: customCategories,
      customItemsJson: JSON.stringify(customCategories),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore save user preferences warning:', error);
  }
}

export async function getUserPreferences(userId: string): Promise<string[] | null> {
  if (!userId) return null;

  let localFallback: string[] | null = null;
  try {
    const cached = localStorage.getItem(`user_pref_${userId}`);
    if (cached) {
      localFallback = JSON.parse(cached);
    }
  } catch (e) {}

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return localFallback;
  }

  try {
    const docId = `${userId}_preferences`;
    const prefRef = doc(db, 'userSchedules', docId);
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      const data = snap.data();
      const categories = data.preferredCategories || (data.customItemsJson ? JSON.parse(data.customItemsJson) : null);
      if (categories) {
        try {
          localStorage.setItem(`user_pref_${userId}`, JSON.stringify(categories));
        } catch (e) {}
        return categories;
      }
    }
  } catch (error: any) {
    console.warn('Firestore offline warning getting user preferences:', error?.message || error);
  }

  return localFallback;
}

export async function saveUserCustomSchedule(userId: string, scheduleName: string, customItems: any[]) {
  if (!userId) return;

  const scheduleObj = { scheduleName, customItems };
  try {
    localStorage.setItem(`user_schedule_${userId}`, JSON.stringify(scheduleObj));
  } catch (e) {}

  if (!auth.currentUser || auth.currentUser.uid !== userId) return;

  try {
    const docId = `${userId}_schedule`;
    const schedRef = doc(db, 'userSchedules', docId);
    await setDoc(schedRef, {
      userId,
      scheduleName,
      customItemsJson: JSON.stringify(customItems),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore save custom schedule warning:', error);
  }
}

export async function getUserCustomSchedule(userId: string) {
  if (!userId) return null;

  let localFallback: { scheduleName: string; customItems: any[] } | null = null;
  try {
    const cached = localStorage.getItem(`user_schedule_${userId}`);
    if (cached) {
      localFallback = JSON.parse(cached);
    }
  } catch (e) {}

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return localFallback;
  }

  try {
    const docId = `${userId}_schedule`;
    const schedRef = doc(db, 'userSchedules', docId);
    const snap = await getDoc(schedRef);
    if (snap.exists()) {
      const data = snap.data();
      const result = {
        scheduleName: data.scheduleName,
        customItems: data.customItemsJson ? JSON.parse(data.customItemsJson) : []
      };
      try {
        localStorage.setItem(`user_schedule_${userId}`, JSON.stringify(result));
      } catch (e) {}
      return result;
    }
  } catch (error: any) {
    console.warn('Firestore offline warning getting custom schedule:', error?.message || error);
  }

  return localFallback;
}

// -------------------------------------------------------------
// Website Promotion & Ads Management (হোমস্ক্রিন ওয়েবসাইট প্রমোশন)
// -------------------------------------------------------------
export interface SitePromotion {
  id?: string;
  websiteName: string;
  websiteUrl: string;
  tag: string;
  title: string;
  description: string;
  ctaText?: string;
  bannerTheme?: 'gold' | 'emerald' | 'royal' | 'sunset';
  isActive: boolean;
  clickCount?: number;
  impressionCount?: number;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_SITE_PROMOTION: SitePromotion = {
  id: 'main_header_promo',
  websiteName: 'মাকতাবাতুল ইসলাম ডিজিটাল লাইব্রেরি',
  websiteUrl: 'https://quran.com',
  tag: 'স্পন্সরড পার্টনার',
  title: 'সহজ কুরআন ও সহীহ হাদিস পাঠের সমৃদ্ধ অনলাইন প্ল্যাটফর্ম',
  description: 'বিশুদ্ধ তাফসীর, বাংলা অনুবাদ ও সকল ভাষার অডিও তিলাওয়াত পড়ার জন্য আমাদের অফিসিয়াল পার্টনার ওয়েবসাইট ভিজিট করুন।',
  ctaText: 'ওয়েবসাইটে যান →',
  bannerTheme: 'gold',
  isActive: true,
  clickCount: 142,
  impressionCount: 1250,
  updatedAt: new Date().toISOString()
};

const PROMO_STORAGE_KEY = 'islamic_site_promotion_config';

export async function getActiveSitePromotion(): Promise<SitePromotion> {
  // Check local cache first
  let cachedPromo: SitePromotion = DEFAULT_SITE_PROMOTION;
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    if (raw) {
      cachedPromo = JSON.parse(raw);
    }
  } catch (e) {}

  try {
    const promoDocRef = doc(db, 'sitePromotions', 'main_header_promo');
    const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
    const fetchPromise = getDoc(promoDocRef);
    const snap = await Promise.race([fetchPromise, timeoutPromise]) as any;
    if (snap && snap.exists && snap.exists()) {
      const liveData = snap.data() as SitePromotion;
      try {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(liveData));
      } catch (e) {}
      return liveData;
    }
  } catch (e) {
    // Gracefully use cached/default promotion without delay
  }

  return cachedPromo;
}

export async function saveSitePromotion(promo: SitePromotion): Promise<void> {
  const updatedPromo: SitePromotion = {
    ...promo,
    id: 'main_header_promo',
    updatedAt: new Date().toISOString()
  };

  // 1. LocalStorage update for instant reflection
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(updatedPromo));
  } catch (e) {}

  // 2. Dispatch custom event for instant multi-component reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('site-promotion-updated', { detail: updatedPromo }));
  }

  // 3. Firestore persistence
  try {
    const promoDocRef = doc(db, 'sitePromotions', 'main_header_promo');
    await setDoc(promoDocRef, updatedPromo, { merge: true });
  } catch (err) {
    console.warn('Firestore notice saving promotion (local saved successfully):', err);
  }
}

export async function recordPromotionClick(): Promise<void> {
  try {
    const promo = await getActiveSitePromotion();
    const updated = {
      ...promo,
      clickCount: (promo.clickCount || 0) + 1
    };
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    const promoDocRef = doc(db, 'sitePromotions', 'main_header_promo');
    await setDoc(promoDocRef, { clickCount: updated.clickCount }, { merge: true });
  } catch (e) {}
}

export async function recordPromotionImpression(): Promise<void> {
  try {
    const promo = await getActiveSitePromotion();
    const updated = {
      ...promo,
      impressionCount: (promo.impressionCount || 0) + 1
    };
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    const promoDocRef = doc(db, 'sitePromotions', 'main_header_promo');
    await setDoc(promoDocRef, { impressionCount: updated.impressionCount }, { merge: true });
  } catch (e) {}
}

// -------------------------------------------------------------
// Admin User Data Retrieval (এডমিন ড্যাশবোর্ডে ইউজার তথ্য)
// -------------------------------------------------------------
export interface AdminUserInfo {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin?: boolean;
  streakDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllUsersForAdmin(): Promise<AdminUserInfo[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    if (!snap.empty) {
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as AdminUserInfo[];
    }
  } catch (err) {
    console.warn('Firestore users retrieval notice, returning fallback analytics list:', err);
  }

  // Fallback demo users if Firestore is initializing or empty
  return [
    {
      id: 'admin_zahangir',
      email: 'zahangir.mhn@gmail.com',
      displayName: 'মুহাম্মদ জাহাঙ্গীর (অ্যাডমিন)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isAdmin: true,
      streakDays: 45,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_abdullah',
      email: 'abdullah.dhaka@gmail.com',
      displayName: 'আব্দুল্লাহ বিন হাসান',
      photoURL: '',
      isAdmin: false,
      streakDays: 12,
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'user_fatima',
      email: 'fatima.sultana@gmail.com',
      displayName: 'ফাতেমা সুলতানা',
      photoURL: '',
      isAdmin: false,
      streakDays: 28,
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'user_tariq',
      email: 'tariq.rahman@yahoo.com',
      displayName: 'তারেক রহমান',
      photoURL: '',
      isAdmin: false,
      streakDays: 7,
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
}
