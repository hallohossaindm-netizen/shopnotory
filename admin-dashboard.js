// admin-dashboard.js
// ShopnoTory E-commerce - Firestore Product CRUD Operations & Dashboard Management

import {
  db,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "./firebase-config.js";
import { protectAdminPage } from "./admin-auth.js";

// স্টেট ভেরিয়েবল
let allProducts = [];
let currentEditingId = null;
let currentDeleteId = null;

// প্রোডাক্ট কালেকশন রেফারেন্স
const productsCollection = collection(db, "products");

// কারেন্সি ও নাম্বার ফরম্যাট হেল্পার (বাংলা টাকায় রূপান্তর)
function formatBengaliPrice(num) {
  const n = Number(num) || 0;
  return "৳ " + n.toLocaleString('en-US');
}

// ১. ড্যাশবোর্ড স্ট্যাটস আপডেট
function updateDashboardStats(products) {
  const totalEl = document.getElementById("stat-total");
  const activeEl = document.getElementById("stat-active");
  const lowStockEl = document.getElementById("stat-low-stock");
  const categoriesEl = document.getElementById("stat-categories");

  if (totalEl) totalEl.textContent = products.length.toString();
  
  const activeCount = products.filter(p => p.active !== false).length;
  if (activeEl) activeEl.textContent = activeCount.toString();

  const lowStockCount = products.filter(p => (Number(p.stock) || 0) <= 5).length;
  if (lowStockEl) lowStockEl.textContent = lowStockCount.toString();

  const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
  if (categoriesEl) categoriesEl.textContent = uniqueCategories.size.toString();
}

// ২. Firestore থেকে প্রোডাক্ট তালিকা লোড করা (Read / Load)
export async function loadProducts() {
  const tableBody = document.getElementById("products-table-body");
  const loadingIndicator = document.getElementById("table-loading");
  const emptyState = document.getElementById("table-empty");

  if (loadingIndicator) loadingIndicator.classList.remove("hidden");
  if (emptyState) emptyState.classList.add("hidden");
  if (tableBody) tableBody.innerHTML = "";

  try {
    let q;
    try {
      q = query(productsCollection, orderBy("createdAt", "desc"));
    } catch {
      q = productsCollection;
    }

    const querySnapshot = await getDocs(q);
    allProducts = [];

    querySnapshot.forEach((docSnap) => {
      allProducts.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    if (loadingIndicator) loadingIndicator.classList.add("hidden");

    if (allProducts.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
    } else {
      renderProductsTable(allProducts);
    }

    updateDashboardStats(allProducts);
    showToast("প্রোডাক্ট তালিকা সফলভাবে লোড হয়েছে।", "success");
  } catch (error) {
    console.error("Firestore Load Error:", error);
    if (loadingIndicator) loadingIndicator.classList.add("hidden");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-8 text-center text-rose-600 bg-rose-50/50">
            <p class="font-bold">ডাটা লোড করতে সমস্যা হয়েছে!</p>
            <p class="text-xs text-rose-500 mt-1">${error.message || 'Firebase Rules বা নেটওয়ার্ক চেক করুন'}</p>
          </td>
        </tr>
      `;
    }
    showToast("প্রোডাক্ট লোড ব্যর্থ: " + (error.message || "ত্রুটি হয়েছে"), "error");
  }
}

// ৩. টেবিল রেন্ডারিং
export function renderProductsTable(products) {
  const tableBody = document.getElementById("products-table-body");
  const emptyState = document.getElementById("table-empty");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (products.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-[#e5e1d4] hover:bg-[#fbf9f4]/80 transition duration-150";

    const isAvailable = p.active !== false;
    const stockQty = Number(p.stock) || 0;
    const isLowStock = stockQty <= 5;
    const imageUrl = p.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200";

    tr.innerHTML = `
      <td class="px-4 py-3.5 whitespace-nowrap">
        <div class="flex items-center gap-3">
          <img 
            src="${imageUrl}" 
            alt="${p.name || 'Product'}" 
            class="w-12 h-12 object-cover rounded-xl border border-stone-200 shadow-sm"
            onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200'"
          />
          <div>
            <div class="font-bold text-stone-900 line-clamp-1 max-w-[200px] text-sm">${p.name || "নামহীন পণ্য"}</div>
            <div class="text-[11px] text-stone-600 flex items-center gap-1.5 mt-0.5">
              <span>ID: ${p.id.slice(0, 8)}...</span>
              ${p.badge ? `<span class="bg-[#eef4ea] text-[#1b4332] px-1.5 py-0.2 rounded font-semibold text-[10px]">${p.badge}</span>` : ""}
            </div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3.5 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
          ${p.category || "সাধারণ"}
        </span>
      </td>
      <td class="px-4 py-3.5 whitespace-nowrap">
        <div class="text-sm font-bold text-[#143d2b]">${formatBengaliPrice(p.price)}</div>
        ${p.oldPrice ? `<div class="text-[11px] text-stone-600 line-through">${formatBengaliPrice(p.oldPrice)}</div>` : ""}
      </td>
      <td class="px-4 py-3.5 whitespace-nowrap">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          stockQty === 0
            ? "bg-rose-100 text-rose-700"
            : isLowStock
            ? "bg-amber-100 text-amber-800"
            : "bg-emerald-100 text-emerald-800"
        }">
          <span class="w-1.5 h-1.5 rounded-full ${stockQty === 0 ? "bg-rose-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"}"></span>
          ${stockQty} টি
        </span>
      </td>
      <td class="px-4 py-3.5 whitespace-nowrap">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          isAvailable ? "bg-[#eef4ea] text-[#1b4332]" : "bg-stone-200 text-stone-600"
        }">
          ${isAvailable ? "সক্রিয় (Active)" : "নিষ্ক্রিয়"}
        </span>
      </td>
      <td class="px-4 py-3.5 whitespace-nowrap text-right">
        <div class="flex items-center justify-end gap-2">
          <button 
            type="button" 
            data-action="edit" 
            data-id="${p.id}"
            class="px-2.5 py-1.5 text-xs font-semibold text-[#143d2b] bg-[#eef4ea] hover:bg-[#143d2b] hover:text-white rounded-lg transition duration-150 inline-flex items-center gap-1"
          >
            ✏️ এডিট
          </button>
          <button 
            type="button" 
            data-action="delete" 
            data-id="${p.id}"
            class="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg transition duration-150 inline-flex items-center gap-1"
          >
            🗑️ ডিলিট
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// ৪. প্রোডাক্ট যুক্ত বা আপডেট করা (Create & Update)
export async function saveProduct(formData) {
  const saveBtn = document.getElementById("save-product-btn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "সংরক্ষণ করা হচ্ছে...";
  }

  try {
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price) || 0,
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock) || 0,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600",
      description: formData.description.trim() || "",
      badge: formData.badge.trim() || "",
      active: Boolean(formData.active),
      featured: Boolean(formData.featured),
      updatedAt: serverTimestamp()
    };

    if (currentEditingId) {
      // Update Operation
      const productRef = doc(db, "products", currentEditingId);
      await updateDoc(productRef, payload);
      showToast("প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!", "success");
    } else {
      // Create Operation
      payload.createdAt = serverTimestamp();
      await addDoc(productsCollection, payload);
      showToast("নতুন প্রোডাক্ট সফলভাবে যুক্ত করা হয়েছে!", "success");
    }

    closeProductModal();
    await loadProducts();
    return { success: true };
  } catch (error) {
    console.error("Save Product Error:", error);
    showToast("সংরক্ষণ ব্যর্থ হয়েছে: " + error.message, "error");
    return { success: false, error };
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "সংরক্ষণ করুন";
    }
  }
}

// ৫. প্রোডাক্ট ডিলিট করা (Delete Operation)
export async function confirmDeleteProduct(id) {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    showToast("প্রোডাক্ট মুছে ফেলা হয়েছে।", "info");
    closeDeleteModal();
    await loadProducts();
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    showToast("মুছে ফেলতে সমস্যা হয়েছে: " + error.message, "error");
    return { success: false, error };
  }
}

// মোডাল হ্যান্ডলার্স
export function openAddModal() {
  currentEditingId = null;
  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");
  const form = document.getElementById("product-form");

  if (form) form.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-active").checked = true;
  document.getElementById("product-featured").checked = false;

  if (modalTitle) modalTitle.textContent = "নতুন প্রোডাক্ট যোগ করুন";
  if (modal) modal.classList.remove("hidden");
}

export function openEditModal(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  currentEditingId = productId;
  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");

  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name || "";
  document.getElementById("product-category").value = product.category || "নারী পোশাক";
  document.getElementById("product-price").value = product.price || "";
  document.getElementById("product-old-price").value = product.oldPrice || "";
  document.getElementById("product-stock").value = product.stock ?? 10;
  document.getElementById("product-image").value = product.image || "";
  document.getElementById("product-badge").value = product.badge || "";
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("product-active").checked = product.active !== false;
  document.getElementById("product-featured").checked = Boolean(product.featured);

  if (modalTitle) modalTitle.textContent = "প্রোডাক্ট তথ্য এডিট করুন";
  if (modal) modal.classList.remove("hidden");
}

export function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.add("hidden");
  currentEditingId = null;
}

export function openDeleteModal(productId) {
  currentDeleteId = productId;
  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.remove("hidden");
}

export function closeDeleteModal() {
  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.add("hidden");
  currentDeleteId = null;
}

// টোস্ট নোটিফিকেশন হেল্পার
export function showToast(message, type = "info") {
  const toast = document.getElementById("toast-message");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 transform translate-y-0 text-white ${
    type === "success"
      ? "bg-[#143d2b] border border-[#b8d56d]/30"
      : type === "error"
      ? "bg-rose-700"
      : "bg-stone-800"
  }`;

  toast.classList.remove("hidden", "opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3500);
}

// ৬. ফিল্টার ও সার্চ হ্যান্ডলার
function filterProducts() {
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  const queryTerm = (searchInput?.value || "").toLowerCase().trim();
  const selectedCat = categoryFilter?.value || "all";

  const filtered = allProducts.filter((p) => {
    const matchesName = (p.name || "").toLowerCase().includes(queryTerm);
    const matchesCategory = selectedCat === "all" || p.category === selectedCat;
    return matchesName && matchesCategory;
  });

  renderProductsTable(filtered);
}

// ৭. পেজ ইনিশিয়ালাইজেশন
document.addEventListener("DOMContentLoaded", async () => {
  // রাউট গার্ড: লগইন ভেরিফিকেশন
  await protectAdminPage();

  // পণ্য ডাটা লোড
  await loadProducts();

  // বাটন ইভেন্ট লিসেনার
  const addBtn = document.getElementById("add-product-btn");
  if (addBtn) addBtn.addEventListener("click", openAddModal);

  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeProductModal);

  const cancelModalBtn = document.getElementById("cancel-modal-btn");
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeProductModal);

  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) refreshBtn.addEventListener("click", () => loadProducts());

  // সার্চ ও ক্যাটাগরি ফিল্টার
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.addEventListener("input", filterProducts);

  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

  // প্রোডাক্ট ফর্ম সাবমিট
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById("product-name")?.value || "",
        category: document.getElementById("product-category")?.value || "নারী পোশাক",
        price: document.getElementById("product-price")?.value || 0,
        oldPrice: document.getElementById("product-old-price")?.value || "",
        stock: document.getElementById("product-stock")?.value || 0,
        image: document.getElementById("product-image")?.value || "",
        badge: document.getElementById("product-badge")?.value || "",
        description: document.getElementById("product-description")?.value || "",
        active: document.getElementById("product-active")?.checked,
        featured: document.getElementById("product-featured")?.checked,
      };

      if (!formData.name) {
        showToast("প্রোডাক্টের নাম লিখুন", "error");
        return;
      }
      if (!formData.price || formData.price <= 0) {
        showToast("সঠিক মূল্য উল্লেখ করুন", "error");
        return;
      }

      await saveProduct(formData);
    });
  }

  // ডিলিট মোডাল বাটন
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (currentDeleteId) {
        await confirmDeleteProduct(currentDeleteId);
      }
    });
  }

  // টেবিল অ্যাকশন ডেলিগেশন (Edit & Delete buttons)
  const tableBody = document.getElementById("products-table-body");
  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      const action = target.getAttribute("data-action");
      const id = target.getAttribute("data-id");

      if (action === "edit" && id) {
        openEditModal(id);
      } else if (action === "delete" && id) {
        openDeleteModal(id);
      }
    });
  }
});
