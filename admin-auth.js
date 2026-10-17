// admin-auth.js
// ShopnoTory E-commerce - Admin Authentication & Route Protection

import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "./firebase-config.js";

// এরর কোড বাংলায় রূপান্তর
export function getBengaliErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'ভুল ইমেইল বা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে আবার চেষ্টা করুন।';
    case 'auth/user-not-found':
      return 'এই ইমেইলের কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি।';
    case 'auth/invalid-email':
      return 'সঠিক ইমেইল ঠিকানা দিন (যেমন: admin@shopnotory.com)।';
    case 'auth/too-many-requests':
      return 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে অ্যাকাউন্ট সাময়িকভাবে লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে সমস্যা হয়েছে। সংযোগ চেক করে আবার চেষ্টা করুন।';
    case 'auth/user-disabled':
      return 'এই অ্যাডমিন অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।';
    default:
      return 'লগইন করতে সমস্যা হয়েছে। দয়া করে তথ্য পুনরায় পরীক্ষা করুন।';
  }
}

// ১. অ্যাডমিন লগইন ফাংশন
export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    
    // লোকাল স্টোরেজে সেশন তথ্য সংরক্ষণ
    localStorage.setItem('shopnotory_admin_session', JSON.stringify({
      uid: user.uid,
      email: user.email,
      loginAt: new Date().toISOString()
    }));
    
    return { success: true, user };
  } catch (error) {
    console.error("Admin Login Error:", error);
    return {
      success: false,
      code: error.code,
      message: getBengaliErrorMessage(error.code)
    };
  }
}

// ২. অ্যাডমিন লগআউট ফাংশন
export async function logoutAdmin() {
  try {
    await signOut(auth);
    localStorage.removeItem('shopnotory_admin_session');
    window.location.href = "admin-login.html";
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, message: "লগআউট হতে সমস্যা হয়েছে।" };
  }
}

// ৩. পাসওয়ার্ড রিসেট (Forgot Password) ফাংশন
export async function resetAdminPassword(email) {
  if (!email || !email.includes('@')) {
    return { success: false, message: "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।" };
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: `পাসওয়ার্ড রিসেট লিংক ${email} ঠিকানায় পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`
    };
  } catch (error) {
    console.error("Password Reset Error:", error);
    return {
      success: false,
      code: error.code,
      message: getBengaliErrorMessage(error.code)
    };
  }
}

// ৪. ড্যাশবোর্ড রাউট প্রটেকশন (Dashboard Route Protection)
export function protectAdminPage() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // লগইন করা না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট
        window.location.href = "admin-login.html?redirect=admin-dashboard.html";
      } else {
        // ড্যাশবোর্ডে অ্যাডমিন ইমেইল দেখানো
        const userEmailElement = document.getElementById("admin-user-email");
        if (userEmailElement) {
          userEmailElement.textContent = user.email;
        }
        resolve(user);
      }
    });
  });
}

// ৫. লগইন পেজের রিডাইরেক্ট হ্যান্ডলার (Redirect If Already Logged In)
export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "admin-dashboard.html";
    }
  });
}

// ৬. DOM ইভেন্ট লিসেনার সেটআপ (লগইন ও লগআউট বাটন অটো-বাইন্ডিং)
document.addEventListener("DOMContentLoaded", () => {
  // যদি লগইন ফর্ম উপস্থিত থাকে
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    redirectIfLoggedIn();

    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const loginBtn = document.getElementById("login-btn");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const forgotPasswordLink = document.getElementById("forgot-password-link");

    // এরর মেসেজ প্রদর্শনের হেল্পার
    const showError = (msg) => {
      if (errorMessage) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove("hidden");
      }
      if (successMessage) successMessage.classList.add("hidden");
    };

    const showSuccess = (msg) => {
      if (successMessage) {
        successMessage.textContent = msg;
        successMessage.classList.remove("hidden");
      }
      if (errorMessage) errorMessage.classList.add("hidden");
    };

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput?.value || "";
      const password = passwordInput?.value || "";

      if (!email || !password) {
        showError("ইমেইল এবং পাসওয়ার্ড উভয় ঘর পূরণ করুন।");
        return;
      }

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          যাচাই করা হচ্ছে...
        `;
      }

      const result = await loginAdmin(email, password);

      if (result.success) {
        showSuccess("লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...");
        setTimeout(() => {
          window.location.href = "admin-dashboard.html";
        }, 800);
      } else {
        showError(result.message);
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = "লগইন করুন";
        }
      }
    });

    // ফরগট পাসওয়ার্ড হ্যান্ডলার
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = emailInput?.value;
        if (!email) {
          showError("পাসওয়ার্ড রিসেটের জন্য প্রথমে উপরে আপনার ইমেইল ঠিকানাটি লিখুন।");
          emailInput?.focus();
          return;
        }

        const confirmReset = confirm(`আমরা কি ${email} ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠাব?`);
        if (!confirmReset) return;

        showSuccess("পাসওয়ার্ড রিসেট লিংক পাঠানো হচ্ছে...");
        const result = await resetAdminPassword(email);
        if (result.success) {
          showSuccess(result.message);
        } else {
          showError(result.message);
        }
      });
    }
  }

  // যদি লগআউট বাটন উপস্থিত থাকে
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("আপনি কি নিশ্চিতভাবে ShopnoTory অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
        await logoutAdmin();
      }
    });
  }
});
