const products = [
  // 30 original-ish names (similar category vibe, not copied)
  { id: 1,  name: "Radiance C Cream 2.1",        tag: "Brightening",     price: 2499, img: "assets/p1.jpg" },
  { id: 2,  name: "Turmeric Glow Face Scrub",    tag: "Exfoliating",     price: 1599, img: "assets/p2.jpg" },
  { id: 3,  name: "Vitamin C Booster Serum 20%", tag: "Anti-Aging",      price: 2299, img: "assets/p3.jpg" },
  { id: 4,  name: "Shield+Glow Sunscreen SPF50", tag: "SPF",            price: 1899, img: "assets/p4.jpg" },
  { id: 5,  name: "Maxi Bright Serum (Mild)",    tag: "Brightening",     price: 2199, img: "assets/p5.jpg" },
  { id: 6,  name: "ClearCalm Acne Mask",         tag: "Acne Care",       price: 1499, img: "assets/p6.jpg" },
  { id: 7,  name: "EvenTone Dark Spot Serum",    tag: "Dark Spots",      price: 2399, img: "assets/p7.jpg" },
  { id: 8,  name: "GlowMist Vitamin Spray",      tag: "Hydration",       price: 1299, img: "assets/p8.jpg" },
  { id: 9,  name: "Gentle Bright Face Wash",     tag: "Cleanser",        price: 999,  img: "assets/p9.jpg" },
  { id: 10, name: "5-in-1 Smooth Soap Bar",      tag: "Multi-Use",       price: 799,  img: "assets/p10.jpg" },

  { id: 11, name: "Barrier Repair Night Cream",  tag: "Moisturizer",     price: 1999, img: "assets/p11.jpg" },
  { id: 12, name: "Niacinamide Balance Serum",   tag: "Oil Control",     price: 1799, img: "assets/p12.jpg" },
  { id: 13, name: "AHA/BHA Glow Toner",          tag: "Exfoliating",     price: 1699, img: "assets/p13.jpg" },
  { id: 14, name: "HydraLock Hyaluronic Serum",  tag: "Hydration",       price: 1899, img: "assets/p14.jpg" },
  { id: 15, name: "CalmCare Cica Gel",           tag: "Soothing",        price: 1499, img: "assets/p15.jpg" },
  { id: 16, name: "Under-Eye Bright Cream",      tag: "Eye Care",        price: 1399, img: "assets/p16.jpg" },
  { id: 17, name: "Lip Bright Butter",           tag: "Lip Care",        price: 699,  img: "assets/p17.jpg" },
  { id: 18, name: "Guava Sugar Lip Scrub",       tag: "Lip Care",        price: 599,  img: "assets/p18.jpg" },
  { id: 19, name: "Daily Glow Moist Gel",        tag: "Moisturizer",     price: 1499, img: "assets/p19.jpg" },
  { id: 20, name: "Clay Detox Pore Mask",        tag: "Pore Care",       price: 1599, img: "assets/p20.jpg" },

  { id: 21, name: "Brighten Body Wash (Foam)",   tag: "Body",            price: 1499, img: "assets/p21.jpg" },
  { id: 22, name: "Silky Body Lotion (Glow)",    tag: "Body",            price: 1699, img: "assets/p22.jpg" },
  { id: 23, name: "Glow Body Oil 8oz",           tag: "Body",            price: 1899, img: "assets/p23.jpg" },
  { id: 24, name: "Kojic-Inspired Soap Bar",     tag: "Body",            price: 899,  img: "assets/p24.jpg" },
  { id: 25, name: "Exfoliating Body Cloth",      tag: "Tools",           price: 499,  img: "assets/p25.jpg" },

  { id: 26, name: "Retinol-Lite Night Serum",    tag: "Anti-Aging",      price: 2499, img: "assets/p26.jpg" },
  { id: 27, name: "Peptide Firming Cream",       tag: "Anti-Aging",      price: 2599, img: "assets/p27.jpg" },
  { id: 28, name: "Bright Peel Pads (Gentle)",   tag: "Brightening",     price: 2299, img: "assets/p28.jpg" },
  { id: 29, name: "SpotFix Acne Gel",            tag: "Acne Care",       price: 999,  img: "assets/p29.jpg" },
  { id: 30, name: "Soothe & Glow Face Set",      tag: "Bundle",          price: 2999, img: "assets/p30.jpg" },
];

const state = {
  cart: JSON.parse(localStorage.getItem("msc_cart") || "[]"),
  query: "",
  sort: "featured",
};

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const cartEl = document.getElementById("cart");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("scrollToProducts").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

function money(n){
  return `৳ ${n.toLocaleString("en-US")}`;
}

function saveCart(){
  localStorage.setItem("msc_cart", JSON.stringify(state.cart));
}

function setCart(open){
  cartEl.setAttribute("aria-hidden", open ? "false" : "true");
}

openCartBtn.addEventListener("click", () => setCart(true));
closeCartBtn.addEventListener("click", () => setCart(false));
cartOverlay.addEventListener("click", () => setCart(false));

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") setCart(false);
});

function addToCart(id){
  const found = state.cart.find(x => x.id === id);
  if(found) found.qty += 1;
  else state.cart.push({ id, qty: 1 });
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
  const count = state.cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = count;

  if(state.cart.length === 0){
    cartItems.innerHTML = `<p class="muted">Your cart is empty.</p>`;
    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = state.cart.map(item => {
    const p = products.find(x => x.id === item.id);
    const line = p.price * item.qty;
    total += line;
    return `
      <div class="cartItem">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://picsum.photos/200?random=${p.id}'" />
        <div>
          <p class="cartItem__name">${p.name}</p>
          <p class="cartItem__price">${money(p.price)} • Qty: ${item.qty}</p>
        </div>
        <div class="qty">
          <button onclick="changeQty(${p.id}, -1)">−</button>
          <button onclick="changeQty(${p.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = money(total);
}

window.changeQty = changeQty; // expose for inline onclick

function filteredProducts(){
  let list = [...products];

  const q = state.query.trim().toLowerCase();
  if(q){
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
    );
  }

  if(state.sort === "low") list.sort((a,b)=>a.price-b.price);
  if(state.sort === "high") list.sort((a,b)=>b.price-a.price);
  if(state.sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));

  return list;
}

function renderProducts(){
  const list = filteredProducts();

  productGrid.innerHTML = list.map(p => `
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
          <button class="btn" onclick="addToCart(${p.id})">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");

  observeReveals(); // re-attach reveal observer for new cards
}

searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  alert("Demo checkout ✅\nNext step: connect WhatsApp/real checkout gateway.");
});

let revealObserver;
function observeReveals(){
  if(revealObserver) revealObserver.disconnect();

  const els = document.querySelectorAll(".reveal");
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => revealObserver.observe(el));
}

// init
renderProducts();
renderCart();
observeReveals();
