// ====== CONFIG ======
const WHATSAPP_NUMBER = "8801709856893"; // no +, no spaces
const DEFAULT_MESSAGE = "Hi! I want to order skincare products from Mahmudul Skincare.";

// Social links (Facebook + Instagram added)
const SOCIAL_LINKS = {
  fb: "https://www.facebook.com/Mahmudulsecondid",
  ig: "https://www.instagram.com/mahmudul__75/",
  in: "#",
  yt: "#",
  pin: "#"
};

// ====== Helpers ======
const money = (bdt) => `৳${bdt}`;
const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const category = document.getElementById("category");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("close");

// ====== Footer year + socials ======
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const setHref = (id, url) => {
  const el = document.getElementById(id);
  if (!el) return;

  if (url && url !== "#") {
    el.href = url;
    el.style.display = "inline-flex";
  } else {
    el.style.display = "none"; // hide icons that have no link yet
  }
};

setHref("socialFb", SOCIAL_LINKS.fb);
setHref("socialIg", SOCIAL_LINKS.ig);
setHref("socialIn", SOCIAL_LINKS.in);
setHref("socialYt", SOCIAL_LINKS.yt);
setHref("socialPin", SOCIAL_LINKS.pin);

// ====== Header WhatsApp button ======
const headerBtn = document.getElementById("whatsBtn");
if (headerBtn) headerBtn.href = waLink(DEFAULT_MESSAGE);

// ====== Data ======
let ALL = [];

// ====== Modal ======
function openModal(p) {
  if (!modal || !modalBody) return;
  modal.setAttribute("aria-hidden", "false");

  const msg = `Hi! I want to order: ${p.name} (${money(p.price_bdt)}).`;

  modalBody.innerHTML = `
    <div class="row" style="align-items:center">
      <div>
        <h2 style="margin:0">${p.name}</h2>
        <p class="meta" style="margin:6px 0 0">${p.category} • ${p.size || ""}</p>
      </div>
      <div class="price" style="font-size:20px">${money(p.price_bdt)}</div>
    </div>

    <img class="pimg" style="height:260px;margin-top:12px"
      src="${p.image || ""}" alt="${p.name}"
      onerror="this.src='https://via.placeholder.com/900x500?text=Add+product+image';" />

    <p style="margin:12px 0 0;color:rgba(255,255,255,.8)">${p.short || ""}</p>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">How to use</h3>
      <p style="margin:0;color:rgba(255,255,255,.8)">${p.how_to_use || "Use as directed."}</p>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">Ingredients</h3>
      <p style="margin:0;color:rgba(255,255,255,.8)">${p.ingredients || "—"}</p>
    </div>

    <a class="btn" style="margin-top:12px" href="${waLink(msg)}" target="_blank" rel="noopener">
      Order this on WhatsApp
    </a>

    <p class="small">Note: Patch test recommended. For sensitive skin, consult a professional.</p>
  `;
}

function closeModal() {
  if (!modal || !modalBody) return;
  modal.setAttribute("aria-hidden", "true");
  modalBody.innerHTML = "";
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (modal) modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ====== Render ======
function render(list) {
  if (!grid) return;
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `
      <div class="card">
        <h3 style="margin:0">No products found</h3>
        <p class="meta">Try another keyword or category.</p>
      </div>`;
    return;
  }

  for (const p of list) {
    const el = document.createElement("div");
    el.className = "card";

    const orderMsg = `Hi! I want to order: ${p.name} (${money(p.price_bdt)}).`;

    el.innerHTML = `
      <img class="pimg" src="${p.image || ""}" alt="${p.name}"
        onerror="this.src='https://via.placeholder.com/900x500?text=Add+product+image';" />

      <div class="row">
        <div>
          <h3 class="name">${p.name}</h3>
          <p class="meta">${p.category}${p.size ? " • " + p.size : ""}</p>
        </div>
        <div class="price">${money(p.price_bdt)}</div>
      </div>

      <p class="small">${p.short || ""}</p>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
        <a class="btn btnGhost" href="#" data-view="1">View details</a>
        <a class="btn" href="${waLink(orderMsg)}" target="_blank" rel="noopener">Order</a>
      </div>
    `;

    const viewBtn = el.querySelector('[data-view="1"]');
    if (viewBtn) {
      viewBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        openModal(p);
      });
    }

    grid.appendChild(el);
  }
}

// ====== Categories ======
function updateCategories() {
  if (!category) return;
  const cats = Array.from(new Set(ALL.map(p => p.category))).sort();
  category.innerHTML =
    `<option value="all">All categories</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ====== Filters ======
function applyFilters() {
  const q = (search?.value || "").trim().toLowerCase();
  const cat = category?.value || "all";

  const filtered = ALL.filter(p => {
    const matchesQ =
      !q ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.short || "").toLowerCase().includes(q);

    const matchesCat = (cat === "all") ? true : p.category === cat;
    return matchesQ && matchesCat;
  });

  render(filtered);

  const pick = filtered[0] || ALL[0];
  const tp = document.getElementById("todayPick");
  if (tp && pick) tp.textContent = `${pick.name} — ${money(pick.price_bdt)}`;
}

if (search) search.addEventListener("input", applyFilters);
if (category) category.addEventListener("change", applyFilters);

// ====== Load products ======
fetch("products.json")
  .then(r => r.json())
  .then(data => {
    ALL = Array.isArray(data) ? data : [];
    updateCategories();
    applyFilters();
  })
  .catch(() => {
    if (!grid) return;
    grid.innerHTML = `
      <div class="card">
        <h3 style="margin:0">Couldn’t load products.json</h3>
        <p class="meta">Create a file named <b>products.json</b> in the same folder and add product data.</p>
      </div>`;
  });
