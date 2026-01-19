const WHATSAPP_NUMBER = "8801709856893";
const DEFAULT_MSG = "Hi! I want to order skincare products.";

const fb = "https://www.facebook.com/Mahmudulsecondid";
const ig = "https://www.instagram.com/mahmudul__75/";

document.getElementById("whatsBtn").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MSG)}`;

document.getElementById("socialFb").href = fb;
document.getElementById("socialIg").href = ig;

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const category = document.getElementById("category");

let PRODUCTS = [];

fetch("products.json")
  .then(r=>r.json())
  .then(data=>{
    PRODUCTS = data;
    loadCategories();
    render(PRODUCTS);
  });

function loadCategories(){
  [...new Set(PRODUCTS.map(p=>p.category))].forEach(c=>{
    const o=document.createElement("option");
    o.value=c;o.textContent=c;
    category.appendChild(o);
  });
}

function render(list){
  grid.innerHTML="";
  list.forEach(p=>{
    const d=document.createElement("div");
    d.className="card";
    d.innerHTML=`
      <img src="${p.image || ''}">
      <h3>${p.name}</h3>
      <p>${p.size} • ${p.short}</p>
      <div class="price">৳${p.price_bdt}</div>
      <a class="btn" target="_blank"
        href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I want '+p.name)}">
        Order
      </a>
    `;
    grid.appendChild(d);
  });
}

function filter(){
  let f=PRODUCTS.filter(p=>
    (category.value==="all"||p.category===category.value)&&
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
  render(f);
}

search.oninput=filter;
category.onchange=filter;
