const cart = {};
const cartElement = document.getElementById("cart");
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const finalizeOrderBtn = document.getElementById("finalize-order");
const whatsappNumber = "5577999192015";
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");

function updateCartDisplay() {
  const keys = Object.keys(cart);
  cartItemsElement.innerHTML = "";

  if (keys.length === 0) {
    cartTotalElement.textContent = "Seu carrinho está vazio.";
    finalizeOrderBtn.style.display = "none";
    cartCount.textContent = 0;
    return;
  }

  let total = 0;
  let totalItems = 0;

  keys.forEach((key) => {
    const item = cart[key];
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    totalItems += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cart-item-name";
    nameSpan.textContent = item.name;

    const qtyControls = document.createElement("div");
    qtyControls.className = "cart-item-qty";

    const minusBtn = document.createElement("button");
    minusBtn.className = "cart-qty-btn";
    minusBtn.textContent = "-";
    minusBtn.onclick = () => changeCartQuantity(key, -1);

    const qtySpan = document.createElement("span");
    qtySpan.textContent = item.qty;

    const plusBtn = document.createElement("button");
    plusBtn.className = "cart-qty-btn";
    plusBtn.textContent = "+";
    plusBtn.onclick = () => changeCartQuantity(key, 1);

    qtyControls.appendChild(minusBtn);
    qtyControls.appendChild(qtySpan);
    qtyControls.appendChild(plusBtn);

    const priceSpan = document.createElement("span");
    priceSpan.className = "cart-item-price";
    priceSpan.textContent = `R$ ${itemTotal.toFixed(2).replace(".", ",")}`;

    div.appendChild(nameSpan);
    div.appendChild(qtyControls);
    div.appendChild(priceSpan);

    cartItemsElement.appendChild(div);
  });

  cartTotalElement.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
  finalizeOrderBtn.style.display = "block";
  cartCount.textContent = totalItems;
}

function changeCartQuantity(key, delta) {
  if (!cart[key]) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) {
    delete cart[key];
  }
  updateCartDisplay();
}

function addToCart(name, price, qty, options, observations) {
  if (cart[name]) {
    cart[name].qty += qty;
  } else {
    cart[name] = { name, price, qty, options, observations };
  }
  updateCartDisplay();
}



document.querySelectorAll(".item").forEach((itemEl) => {
  const name = itemEl.dataset.name;
  const price = parseFloat(itemEl.dataset.price);

  const qtyInput = itemEl.querySelector(".qty-input");
  const minusBtn = itemEl.querySelector(".qty-btn.minus");
  const plusBtn = itemEl.querySelector(".qty-btn.plus");
  const addToCartBtn = itemEl.querySelector(".add-to-cart");

  minusBtn.onclick = () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  };

  plusBtn.onclick = () => {
    let val = parseInt(qtyInput.value);
    qtyInput.value = val + 1;
  };

  addToCartBtn.onclick = () => {
  const qty = parseInt(qtyInput.value);

  const options = Array.from(itemEl.querySelectorAll('input[type="checkbox"]:checked'))
    .map(opt => opt.value);

  const observations = itemEl.querySelector('textarea') ? itemEl.querySelector('textarea').value.trim() : "";

  if (qty > 0) {
    addToCart(name, price, qty, options, observations);
    qtyInput.value = 1;

    if (itemEl.querySelector('textarea')) {
      itemEl.querySelector('textarea').value = "";
    }
    itemEl.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
  }
};

});

finalizeOrderBtn.onclick = () => {
  let message = "Olá, gostaria de fazer o pedido:\n";
  let total = 0;

  for (const key in cart) {
    const item = cart[key];
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    message += `\n- ${item.name} (x${item.qty}): R$ ${itemTotal.toFixed(2).replace(".", ",")}`;

    // Adiciona opções se houver
    if (item.options && item.options.length > 0) {
      message += `\n   ➤ Opções: ${item.options.join(", ")}`;
    }

    // Adiciona observações se houver
    if (item.observations) {
      message += `\n   ➤ Observações: ${item.observations}`;
    }

    message += `\n`;
  }

  message += `\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(url, "_blank");
};


// Ação de abrir/fechar o carrinho
cartButton.addEventListener("click", () => {
  cartElement.classList.toggle("active");
});

