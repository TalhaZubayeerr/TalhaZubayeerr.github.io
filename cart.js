document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const summarySection = document.querySelector(".summary");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <p style="font-size: 1.5rem; font-weight: 700; text-align: center; padding: 50px 0;">
          Your cart is empty
        </p>
      `;
      summarySection.style.display = "none";
      return;
    }

    summarySection.style.display = "block";
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      const totalPrice = item.price * item.quantity;
      subtotal += totalPrice;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      const borderStyle = (index === cart.length - 1) ? "none" : "1px solid #ccc";
      cartItem.style.borderBottom = borderStyle;
      cartItem.style.paddingBottom = "15px";
      cartItem.style.marginBottom = "15px";

      cartItem.innerHTML = `
        <div class="item-left">
          <img src="${item.image}" alt="Product">
          <div class="item-details">
            <div><strong>${item.title}</strong></div>
            <div>Quantity: <span class="qty-number">${item.quantity}</span></div>
            <div>Color: <span class="product-clr">${item.color}</span></div>
            <div class="price">৳${totalPrice.toFixed(2)}</div>
          </div>
        </div>
        <div class="item-right">
          <div>
            <i class="ri-delete-bin-line remove-icon" data-id="${item.id}" style="cursor:pointer;"></i>
          </div>
          <div class="qty-control">
            <button class="qty-minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    // হিসাব
    const discountRate = 0.03; // ৩% ডিসকাউন্ট
    const discount = subtotal * discountRate;

    const deliveryFee = 200; // ডেলিভারি ফি ২০০ টাকা
    const total = subtotal - discount + deliveryFee;

    // Summary আপডেট
    document.querySelector(".summary-row span").textContent = `৳${subtotal.toFixed(2)}`;
    document.querySelector(".summary-row.discount p").textContent = `Discount (-3%)`;
    document.querySelector(".summary-row.discount span").textContent = `-৳${discount.toFixed(2)}`;

    // ডেলিভারি ফি এর অংশ (optional)
    // document.querySelector(".summary-row:nth-child(3) span").textContent = `৳${deliveryFee.toFixed(2)}`;

    document.querySelector(".summary-total span").textContent = `৳${total.toFixed(2)}`;
  }

  renderCart();

  // Quantity ও Remove হ্যান্ডেল
  cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("remove-icon")) {
      const id = target.getAttribute("data-id");
      cart = cart.filter(item => item.id === id ? false : true); // শুধু সেই item remove হবে
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    if (target.classList.contains("qty-minus")) {
      const id = target.getAttribute("data-id");
      const index = cart.findIndex(item => item.id === id);
      if (index > -1 && cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }

    if (target.classList.contains("qty-plus")) {
      const id = target.getAttribute("data-id");
      const index = cart.findIndex(item => item.id === id);
      if (index > -1) {
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }
  });
});
