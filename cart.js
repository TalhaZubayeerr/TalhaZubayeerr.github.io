document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const summarySection = document.querySelector(".summary");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="font-size: 1.5rem; font-weight: 700; text-align: center; padding: 50px 0;">Your cart is empty</p>`;
            if (summarySection) summarySection.style.display = "none";
            return;
        }

        if (summarySection) summarySection.style.display = "block";
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        cart.forEach((item, index) => {
            const totalPrice = item.price * item.quantity;
            subtotal += totalPrice;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
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
                    <div><i class="ri-delete-bin-line remove-icon" data-title="${item.title}" data-color="${item.color}" style="cursor:pointer;"></i></div>
                    <div class="qty-control">
                        <button class="qty-minus" data-title="${item.title}" data-color="${item.color}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-plus" data-title="${item.title}" data-color="${item.color}">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const discountRate = 0.03;
        const discount = subtotal * discountRate;
        const deliveryFee = 200;
        const total = subtotal - discount + deliveryFee;

        document.querySelector(".summary-row span").textContent = `৳${subtotal.toFixed(2)}`;
        document.querySelector(".summary-row.discount p").textContent = `Discount (-3%)`;
        document.querySelector(".summary-row.discount span").textContent = `-৳${discount.toFixed(2)}`;
        document.querySelector(".summary-total span").textContent = `৳${total.toFixed(2)}`;
    }

    cartItemsContainer.addEventListener("click", (e) => {
        const target = e.target;
        const { title, color } = target.dataset;
        if (target.classList.contains("remove-icon")) {
            cart = cart.filter(item => !(item.title === title && item.color === color));
        } else if (target.classList.contains("qty-minus")) {
            const item = cart.find(i => i.title === title && i.color === color);
            if (item && item.quantity > 1) item.quantity--;
        } else if (target.classList.contains("qty-plus")) {
            const item = cart.find(i => i.title === title && i.color === color);
            if (item) item.quantity++;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
    });

    renderCartItems();
});
