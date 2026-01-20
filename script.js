console.log("script loaded ✅");

const money = (n) => `৳ ${Number(n || 0).toLocaleString("en-US")}`;

document.addEventListener("DOMContentLoaded", async () => {
  // year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const grid = document.getElementById("productGrid");
  if (!grid) {
    console.error("❌ #productGrid not found. index.html check করো.");
    return;
  }

  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  // cart elements
  const cartEl = document.getElementById("cart");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const scrollBtn = document.getElementById("scrollToProducts");

  const state = {
    products: [],
    query: "",
    sort: "featured",
    cart: JSON.parse(localStorage.getItem("msc_cart") || "[]"),
  };

  function saveCart() {
    localStorage.setItem("msc_cart", JSON.stringify(state.cart));
  }

  function setCart(open) {
    if (!cartEl) return;
    cartEl.setAttribute("aria-hidden", open ? "false" : "true");
  }

  if (openCartBtn) openCartBtn.addEventListener("click", () => setCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => setCart(false));
  if (cartOverlay) cartOverlay.addEventListener("click", () => setCart(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setCart(false));

  function addToCart(id) {
    const found = state.cart.find((x) => x.id === id);
    if (found) found.qty += 1;
    else state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = state.cart.find((x) => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter((x) => x.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    if (!cartCount || !cartItems || !cartTotal) return;

    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = count;

    if (state.cart.length === 0) {
      cartItems.innerHTML = `<p class="muted">Your cart is empty.</p>`;
      cartTotal.textContent = money(0);
      return;
    }

    let total = 0;

    cartItems.innerHTML = state.cart.map((item) => {
      const p = state.products.find((x) => x.id === item.id);
      if (!p) return "";
      total += p.price * item.qty;

      return `
        <div class="cartItem">
          <img src="${p.img}" alt="${p.name}" onerror="this.src='https://picsum.photos/200?random=${p.id}'" />
          <div>
            <p class="cartItem__name">${p.name}</p>
            <p class="cartItem__price">${money(p.price)} • Qty: ${item.qty}</p>
          </div>
          <div class="qty">
            <button data-id="${p.id}" data-d="-1">−</button>
            <button data-id="${p.id}" data-d="1">+</button>
          </div>
        </div>
      `;
    }).join("");

    cartTotal.textContent = money(total);

    cartItems.querySelectorAll("button[data-id]").forEach((b) => {
      b.addEventListener("click", () => {
        changeQty(Number(b.dataset.id), Number(b.dataset.d));
      });
    });
  }

  // reveal
  function observeReveals() {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach((el) => obs.observe(el));
  }

  function filteredProducts() {
    let list = [...state.products];
    const q = state.query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.tag || "").toLowerCase().includes(q)
      );
    }

    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  function renderProducts() {
    const list = filteredProducts();

    grid.innerHTML = list.map((p) => `
      <article class="card reveal">
        <div class="thumb">
          <img src="${p.img}" alt="${p.name}" loading="lazy"
               onerror="this.src='https://picsum.photos/600/420?random=${p.id}'" />
        </div>
        <div class="body">
          <h3 class="title">${p.name}</h3>
          <p class="meta">
            <span class="tag">${p.tag}</span>
            <span>Mahmudul Skin Care</span>
          </p>
          <div class="priceRow">
            <div class="price">${money(p.price)}</div>
            <button class="btn" data-add="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("button[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
    });

    observeReveals();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.query = e.target.value;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProducts();
    });
  }

  checkoutBtn.addEventListener("click", () => {
  const phone = "8801709856893";

  const message = encodeURIComponent(
    "Hello! I want to place an order from Mahmudul Skin Care.\n\n" +
    "🛒 My Order:\n" +
    state.cart.map(item => {
      const p = state.products.find(x => x.id === item.id);
      return `• ${p.name} (Qty: ${item.qty})`;
    }).join("\n") +
    "\n\nPlease confirm availability & price."
  );

  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
});

    });
  }

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  async function loadProducts() {
    // products.json must be valid JSON array
    const res = await fetch("products.json", { cache: "no-store" });
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("products.json must be an array []");

    return data.map((p, i) => ({
      id: Number(p.id ?? (i + 1)),
      name: String(p.name ?? `Product ${i + 1}`),
      tag: String(p.tag ?? "Skincare"),
      price: Number(p.price ?? 999),
      img: String(p.img ?? `assets/p${i + 1}.jpg`),
    }));
  }

  try {
    state.products = await loadProducts();
    console.log("✅ products loaded:", state.products.length);
  } catch (err) {
    console.error("❌ products.json error:", err);
    grid.innerHTML = `<p class="muted">products.json এ সমস্যা আছে। Error: ${err.message}</p>`;
    return;
  }

  renderProducts();
  renderCart();
  observeReveals();
});
