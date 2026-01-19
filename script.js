// ===== CONFIG =====
const WHATSAPP_NUMBER = "8801709856893"; 
const MESSAGE = "Hi! I want to order skincare products.";

// ===== BUTTON LINK =====
const btn = document.getElementById("whatsBtn");

if (btn) {
  const link =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(MESSAGE);

  btn.href = link;
}

