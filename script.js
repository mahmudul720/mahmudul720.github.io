console.log("script loaded ✅");

const money = (n) => `৳ ${Number(n || 0).toLocaleString("en-US")}`;

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  const cartEl = document.getElementById("cart");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const scrollBtn = document.getElementById("scrollToProducts");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!grid) {
    console.error("❌ #productGrid not found in index.html");
    return;
  }

  const state = {
    products: [],
    query: "",
    sort: "featured",
    cart: JSON.parse(localStorage.getItem("msc_cart") || "[]")
  };

  const fallbackProducts = Array.from({length: 30}, (_, i) => ({
    id: i + 1,
    name: `Skincare Product ${i + 1}`,
    tag: ["Brightening","Hydration","SPF","Serum","Cleanser","Body"][i % 6],
    price: [999,1299,1499,1699,1899,2199,2499,2999][i % 8],
    img: `https://picsum.photos/600/420?random=${i+1}`
  }));

  function saveCart(){ localStorage.setItem("msc_cart", JSON.stringify(state.cart)); }

  function setCart(open){
    cartEl?.setAttribute("aria-hidden", open ? "false" : "true");
  }

  openCartBtn?.addEventListener("click", () => setCart(true));
  closeCartBtn?.addEventListener("click", () => setCart(false));
  cartOverlay?.addEventListener("click", () => setCart(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setCart(false));

  function addToCart(id){
    const found = state.cart.find(x => x.id === id);
    if(found) found.qty += 1;
    else state.cart.push({id, qty: 1});
    saveCart();
    renderCart();
  }

  function changeQty(id, delta){
    const item = state.cart.find(x => x.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0) state.cart = state.cart.filter(x => x.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart(){
    if(!cartCount || !cartItems || !cartTotal) return;

    const count = state.cart.reduce((s,i)=> s + i.qty, 0);
    cartCount.textContent = count;

    if(state.cart.length === 0){
      cartItems.innerHTML = `<p class="muted">Your cart is empty.</p>`;
      cartTotal.textContent = money(0);
      return;
    }

    let total = 0;
    cartItems.innerHTML = state.cart.map(item => {
      const p = state.products.find(x => x.id === item.id);
      if(!p) return "";
      total += p.price * item.qty;

      return `
        <div class="cartItem">
          <img src="${p.img}" alt="${p.name}">
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

    cartItems.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        changeQty(Number(btn.dataset.id), Number(btn.dataset.d));
      });
    });
  }

  function filteredProducts(){
    let list = [...state.products];
    const q = state.query.trim().toLowerCase();
    if(q){
      list = list.filter(p =>
        (p.name||"").toLowerCase().includes(q) ||
        (p.tag||"").toLowerCase().includes(q)
      );
    }
    if(state.sort === "low") list.sort((a,b)=>a.price-b.price);
    if(state.sort === "high") list.sort((a,b)=>b.price-a.price);
    if(state.sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }

  function renderProducts(){
    const list = filteredProducts();
    grid.innerHTML = list.map(p => `
      <article class="card">
        <div class="thumb">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="body">
          <h3 class="title">${p.name}</h3>
          <p class="meta">
            <span class="tag">${p.tag}</span>
            <span>Mahmudul Skin Care</span>
          </p>
          <div class="priceRow">
            <div class="price">${money(p.price)}</div>
            <button class="btn" data-add="${p.id}">Add</button>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("button[data-add]").forEach(btn => {
      btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
    });
  }

  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderProducts();
  });

  sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  scrollBtn?.addEventListener("click", () => {
    document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
  });

  checkoutBtn?.addEventListener("click", () => {
    const phone = "8801709856893";

    if(state.cart.length === 0){
      alert("Cart empty. Add product first.");
      return;
    }

    const message = encodeURIComponent(
      "Hello! I want to place an order from Mahmudul Skin Care.\n\n🛒 My Order:\n" +
      state.cart.map(item => {
        const p = state.products.find(x => x.id === item.id);
        return `• ${p?.name || "Product"} (Qty: ${item.qty})`;
      }).join("\n") +
      "\n\nPlease confirm availability & price."
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  });

  async function loadProducts(){
    try{
      const res = await fetch("products.json", {cache:"no-store"});
      if(!res.ok) throw new Error("products.json not found");
      const data = await res.json();
      if(!Array.isArray(data)) throw new Error("products.json must be an array");
      return data.map((p,i)=>({
        id: Number(p.id ?? (i+1)),
        name: String(p.name ?? `Skincare Product ${i+1}`),
        tag: String(p.tag ?? "Skincare"),
        price: Number(p.price ?? 999),
        img: String(p.img ?? `https://picsum.photos/600/420?random=${i+1}`)
      }));
    }catch(e){
      console.warn("Using fallback products:", e.message);
      return fallbackProducts;
    }
  }

  state.products = await loadProducts();
  renderProducts();
  renderCart();
});

