import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getIdTokenResult,
  type User,
  type IdTokenResult
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../firebase';

export interface AdminAuthResult {
  success: boolean;
  message: string;
  user?: User;
  claims?: Record<string, any>;
}

/**
 * Translates Firebase Auth error codes into clear Bengali messages.
 */
export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় যাচাই করুন।';
    case 'auth/invalid-email':
      return 'অকার্যকর ইমেইল ঠিকানা। সঠিক ইমেইল প্রদান করুন।';
    case 'auth/user-disabled':
      return 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। সুপার অ্যাডমিনের সাথে যোগাযোগ করুন।';
    case 'auth/too-many-requests':
      return 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে অ্যাকাউন্ট সাময়িকভাবে লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।';
    case 'auth/requires-recent-login':
      return 'নিরাপত্তার স্বার্থে পাসওয়ার্ড পরিবর্তনের পূর্বে সাম্প্রতিক প্রমাণীকরণ (পুনরায় লগইন) প্রয়োজন। বর্তমান পাসওয়ার্ড সঠিক আছে কিনা নিশ্চিত করুন।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ড অত্যন্ত দুর্বল। কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে ত্রুটি। আপনার নেটওয়ার্ক পরীক্ষা করুন।';
    default:
      return 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

/**
 * Verifies if a Firebase user possesses verified administrator privileges.
 * 1. Checks trusted Firebase Custom Claims (`token.admin === true` or `token.role === 'admin'`).
 * 2. Or checks secure Firestore `/admins/{uid}` document configured on the server.
 * Never trusts an unverified public browser state or client-forged claim.
 */
export async function verifyAdminPrivileges(user: User): Promise<{
  isAuthorized: boolean;
  claims: Record<string, any>;
  reason?: string;
}> {
  try {
    // Force refresh token to obtain freshest custom claims from Firebase Auth server
    const tokenResult: IdTokenResult =
      typeof user.getIdTokenResult === 'function'
        ? await user.getIdTokenResult(true)
        : await getIdTokenResult(user, true);
    const claims = tokenResult.claims || {};

    const configuredAdminEmail =
      typeof import.meta !== 'undefined' && import.meta && import.meta.env
        ? import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()
        : undefined;

    // Check trusted custom claims
    const hasAdminCustomClaim = Boolean(
      claims.admin === true ||
      claims.role === 'admin' ||
      claims.isAdmin === true ||
      (configuredAdminEmail && user.email?.toLowerCase() === configuredAdminEmail)
    );

    if (hasAdminCustomClaim) {
      return {
        isAuthorized: true,
        claims
      };
    }

    // Secondary check: Secure Firestore admins collection (/admins/{uid})
    if (db) {
      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminDocRef);
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          if (data?.role === 'admin' || data?.active === true) {
            return {
              isAuthorized: true,
              claims: { ...claims, firestoreAdmin: true }
            };
          }
        }
      } catch (firestoreErr) {
        console.warn('Firestore admin verification fallback check failed:', firestoreErr);
      }
    }

    return {
      isAuthorized: false,
      claims,
      reason: 'অননুমোদিত প্রবেশ! আপনার অ্যাকাউন্টে অ্যাডমিনিস্ট্রেটর অধিকার (Firebase Custom Claim: admin=true) নেই।'
    };
  } catch (err: any) {
    console.error('Error verifying admin privileges:', err);
    return {
      isAuthorized: false,
      claims: {},
      reason: 'অ্যাডমিন অধিকার যাচাই করতে ব্যর্থ হয়েছে।'
    };
  }
}

/**
 * Authenticates an admin using Firebase Email/Password Authentication,
 * then rigorously validates their administrative permissions.
 */
export async function loginAdminWithFirebase(
  email: string,
  pass: string
): Promise<AdminAuthResult> {
  if (!firebaseReady || !auth) {
    return {
      success: false,
      message: 'Firebase Authentication সক্রিয় নয়। অনুগ্রহ করে প্রথমে Firebase কনফিগার করুন।'
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;

    // Verify administrator privileges via custom claims or server role
    const verification = await verifyAdminPrivileges(user);

    if (!verification.isAuthorized) {
      // User is authenticated in Firebase, but does NOT possess the admin role!
      await signOut(auth);
      return {
        success: false,
        message:
          verification.reason ||
          'অননুমোদিত প্রবেশ! শুধুমাত্র অনুমোদিত অ্যাডমিনিস্ট্রেটররা প্রবেশ করতে পারবেন।'
      };
    }

    return {
      success: true,
      message: 'অ্যাডমিন লগইন সফল হয়েছে!',
      user,
      claims: verification.claims
    };
  } catch (err: any) {
    console.error('Firebase Admin Login Error:', err);
    return {
      success: false,
      message: getFirebaseErrorMessage(err?.code || '')
    };
  }
}

/**
 * Sends official Firebase password reset email to administrator.
 */
export async function sendAdminPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  if (!firebaseReady || !auth) {
    return {
      success: false,
      message: 'Firebase Authentication কনফিগার করা হয়নি।'
    };
  }

  const cleanEmail = email.trim();
  if (!cleanEmail) {
    return {
      success: false,
      message: 'অনুগ্রহ করে অ্যাডমিন ইমেইল ঠিকানা প্রদান করুন।'
    };
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: `পাসওয়ার্ড রিসেট লিংক ${cleanEmail} ঠিকানায় সফলভাবে পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।`
    };
  } catch (err: any) {
    console.error('Password reset email error:', err);
    return {
      success: false,
      message: getFirebaseErrorMessage(err?.code || '')
    };
  }
}

/**
 * Updates admin password using Firebase's official updatePassword method,
 * strictly enforcing reauthentication with the current password first.
 */
export async function changeAdminPassword(
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!user || !user.email) {
    return {
      success: false,
      message: 'কোনো সক্রিয় অ্যাডমিন সেশন পাওয়া যায়নি।'
    };
  }

  if (!currentPassword) {
    return {
      success: false,
      message: 'বর্তমান পাসওয়ার্ড প্রদান করা আবশ্যক।'
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।'
    };
  }

  try {
    // 1. Enforce Reauthentication with current password (Security Requirement)
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // 2. Perform official Firebase password update
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: 'অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!'
    };
  } catch (err: any) {
    console.error('Firebase change password error:', err);
    return {
      success: false,
      message: getFirebaseErrorMessage(err?.code || '')
    };
  }
}
