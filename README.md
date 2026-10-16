# ShopnoTory (স্বপ্নতরি) — Premium Bangladeshi E-Commerce Website

ShopnoTory is a complete, full-featured Bangladeshi e-commerce web application built with React, TypeScript, Tailwind CSS, Vite, and Firebase. It faithfully implements the visual reference design, featuring rich Bengali typography, brand aesthetics, separate independent routes, and an administrative control suite.

---

## 🎨 Visual Reference & Brand Identity

- **Brand Name**: ShopnoTory (স্বপ্নতরি)
- **Tagline**: *"Dreams in Every Purchase"*
- **Primary Color Palette**: Deep Forest Green (`#143d2b`, `#1b4332`), Emerald Green (`#2d6a4f`, `#387c53`), Accent Sage/Lime (`#b8d56d`), and Warm Cream Ivory (`#fbfaf7`, `#f4f1ea`).
- **Bengali Typography**: Native support for **Hind Siliguri** and **DM Sans**.

---

## 🧭 Page Routes & Navigation Structure

Each navigation item is an independent route:

| Route | Page | Description |
|---|---|---|
| `/` | **হোম (Home)** | Editorial hero banner, service benefits, popular categories, featured products, discount promos, customer reviews, newsletter, and manageable bottom promo bar. |
| `/shop` | **শপ কালেকশন (Shop Collection)** | Full product catalog, category filters, price slider (৳০ - ৳৫,০০০), brand filter checkboxes, sorting, and responsive product grid. |
| `/our-story` | **আমাদের গল্প (Our Story)** | Brand narrative, origin story, mission & vision, 4 core value pillars, and lifestyle photography. |
| `/why-shoptory` | **কেন ShopnoTory (Why ShopnoTory)** | 6 premium benefit cards (প্রিমিয়াম কোয়ালিটি, সাশ্রয়ী দাম, নিরাপদ পেমেন্ট, দ্রুত ডেলিভারি, সহজ রিটার্ন, ২৪/৭ সাপোর্ট). |
| `/contact` | **যোগাযোগ (Contact)** | Office address, support hours, hotlines, and validated message form with instant feedback. |
| `/product/:id` | **পণ্যের বিস্তারিত (Product Details)** | Image gallery with thumbnail previews, price calculation, stock status, specs table, and direct "এখনই অর্ডার করুন" (Buy Now) flow. |
| `/cart` | **শপিং ব্যাগ (Shopping Cart)** | Line items, quantity modifiers, promo coupons (`SHOPNO10`, `WELCOME50`), and free delivery milestone bar. |
| `/checkout` | **চেকআউট (Checkout)** | Delivery details, BD phone format validation, Cash on Delivery, bKash & Nagad payments, and instant printed slip. |
| `/account` | **কাস্টমার অ্যাকাউন্ট (Customer Account)** | Customer profile, registration, and quick links to order tracking. |
| `/orders` | **অর্ডার ট্র্যাকিং (Order History)** | Visual 4-step progress tracker (অর্ডার গ্রহণ → প্রসেসিং → কুরিয়ারে হস্তান্তর → সফল ডেলিভারি). |
| `/admin/login` | **এডমিন লগইন (Admin Login)** | Dedicated standalone login screen matching the reference image layout. |
| `/admin` | **এডমিন ড্যাশবোর্ড (Admin Control Center)** | Protected admin dashboard: Sales KPIs, Product CRUD, Order Status workflow, Coupon codes, Bottom Ad banner editor, and Store settings. |
| `/privacy-policy` | **গোপনীয়তা নীতি (Privacy Policy)** | Customer privacy terms. |
| `/terms` | **শর্তাবলী (Terms & Conditions)** | Store policies and return terms. |

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Production Build & Lint
```bash
npm run build
npm run lint
```

### 4. Run Business Logic Unit Tests
```bash
npx tsx src/tests/cart_order.test.ts
```

---

## 🔑 Admin Access (Dual Mode)

The website works seamlessly in **two modes**:
1. **Local / Demo Mode (Out of the Box)**:
   - Email: `admin@shopnotory.com`
   - Password: `admin123`
   - Or click the green button: **"১-ক্লিকে ডেমো এডমিন মোডে প্রবেশ"**
2. **Firebase Mode**: When Firebase environment variables are provided in `.env`, it automatically uses live Firebase Authentication and Cloud Firestore!

---

## 🔒 Firebase Architecture & Security Rules

### Deploying Firestore Rules
Upload `firestore.rules` to your Firebase project:
```bash
firebase deploy --only firestore:rules
```
- **Rule Design**:
  - `allow read: if true;` for public products and store settings.
  - `allow create: if ...;` for orders with valid customer info and positive totals.
  - `allow write: if isAdmin();` denies unauthorized price tampering, admin escalation, or inventory manipulation.

### Deploying Storage Rules
Upload `storage.rules`:
```bash
firebase deploy --only storage
```
Restricts image uploads to authenticated admins with file size <= 5MB and image MIME types.

---

## 💳 Bangladeshi Payment Gateway Integration (SSLCommerz / bKash)

The application supports:
1. **Cash on Delivery (ক্যাশ অন ডেলিভারি)**: Most trusted payment method in Bangladesh.
2. **bKash & Nagad Mobile Financial Services**: With Transaction ID (TrxID) input.
3. **SSLCommerz Server Verification Workflow**:
   - Order totals are always recalculated server-side.
   - The client never dictates the final transaction amount.
   - Webhook IPN (Instant Payment Notification) validates transaction authenticity with the merchant API before marking status as `paid`.

---

## 📱 Mobile & PWA Optimization

- Dedicated **Mobile Bottom Navigation Bar** (Home, Shop, Wishlist, Cart with live badge, Account/Admin).
- Installable as a Progressive Web App (PWA) with offline capabilities.
- iOS Safari Add-to-Home-Screen interactive guide.
- Touch-friendly 2-column mobile card layout.
