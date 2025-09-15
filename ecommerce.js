const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");


// Open menu
menuOpenButton.addEventListener("click", () => {
  document.body.classList.add("show-mobile-menu");
});

// Close menu
menuCloseButton.addEventListener("click", () => {
  document.body.classList.remove("show-mobile-menu");
});

// ==== Search ====
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const productBoxes = document.querySelectorAll(".product-box");
  
  if (!searchInput || productBoxes.length === 0) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    productBoxes.forEach(box => {
      const title = box.querySelector(".product-title").textContent.toLowerCase();
      box.style.display = title.includes(query) ? "block" : "none";
    });
  });
});


// ==== Mobile Menu Toggle ====
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav ul li a");
  const currentPage = window.location.pathname.split("/").pop(); // যেমন "mac.html"

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    // সব লিঙ্ক থেকে active রিমুভ
    link.classList.remove("active");

    // যদি লিংকের href বর্তমান পেজের সাথে মিলে যায়
    if (linkPage === currentPage || (currentPage === "" && linkPage === "ecommerce.html")) {
      link.classList.add("active");
    }

    // ক্লিক ইভেন্ট
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});


// === Cart Drawer Open/Close ===
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartButtons = document.querySelectorAll(".button-group");

// কার্ট ওপেন
cartIcon.addEventListener("click", () => cart.classList.add("active"));

// কার্ট ক্লোজ ফাংশন
function closeCart() {
  cart.classList.remove("active");
}

// #cart-close এর জন্য
cartClose.addEventListener("click", closeCart);

// সব button-group এর জন্যও
cartButtons.forEach(btn => btn.addEventListener("click", closeCart));


// === Wishlist Drawer Open/Close ===
const wishlistIcon = document.querySelector("#wishlist");
const wishlistDrawer = document.querySelector(".Wishlist");
const wishlistClose = document.querySelector("#wishlist-close");
const wishlistButtons = document.querySelectorAll(".btn-cart"); // সব btn-cart এলিমেন্ট

// উইশলিস্ট ওপেন
wishlistIcon.addEventListener("click", () => wishlistDrawer.classList.add("active"));

// উইশলিস্ট ক্লোজ ফাংশন
function closeWishlist() {
  wishlistDrawer.classList.remove("active");
}

// #wishlist-close এর জন্য
wishlistClose.addEventListener("click", closeWishlist);

// সব btn-cart এর জন্যও
wishlistButtons.forEach(btn => btn.addEventListener("click", closeWishlist));


// === Cart Content and Wishlist Content containers ===
const cartContent = document.querySelector(".cart-content");
const wishlistContent = document.querySelector(".Wishlist-content");

// === Counters Badges ===
const cartItemCountBadge = document.querySelector(".cart-item-count");
const wishlistItemCountBadge = document.querySelector(".wishlist-item-count");

// === State Arrays for Cart and Wishlist ===
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];

// === Utility: Update Cart UI from cartItems array ===
function renderCart() {
  cartContent.innerHTML = "";
  cartItems.forEach(item => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div class="cart-detail">
        <h2 class="cart-product-title">${item.title}</h2>
        <span class="cart-price">৳${item.price}</span>
        <div class="cart-quantity">
          <button class="decrement">-</button>
          <span class="number">${item.quantity}</span>
          <button class="increment">+</button>
        </div>
      </div>
      <i class="ri-delete-bin-line cart-remove"></i>
    `;

    // Remove item
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      cartItems = cartItems.filter(ci => ci.title !== item.title);
      saveAndRender();
    });

    // Quantity buttons
    const decrementBtn = cartBox.querySelector(".decrement");
    const incrementBtn = cartBox.querySelector(".increment");
    const quantitySpan = cartBox.querySelector(".number");

    decrementBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantitySpan.textContent = item.quantity;
        saveAndRender(false);
      }
    });

    incrementBtn.addEventListener("click", () => {
      item.quantity++;
      quantitySpan.textContent = item.quantity;
      saveAndRender(false);
    });

    cartContent.appendChild(cartBox);
  });

  updateCartCount();
  updateTotalPrice();
}

// === Utility: Update Wishlist UI from wishlistItems array ===
function renderWishlist() {
  wishlistContent.innerHTML = "";
  wishlistItems.forEach(item => {
    const wishlistBox = document.createElement("div");
    wishlistBox.classList.add("Wishlist-box");
    wishlistBox.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div class="cart-detail">
        <h2 class="cart-product-title">${item.title}</h2>
        <span class="Wishlist-price">৳${item.price}</span>
      </div>
      <i class="ri-delete-bin-line Wishlist-remove"></i>
    `;

    wishlistBox.querySelector(".Wishlist-remove").addEventListener("click", () => {
      wishlistItems = wishlistItems.filter(wi => wi.title !== item.title);
      saveAndRender();

      // Update corresponding heart icon in product list
      const icon = document.querySelector(`.wishlist-icon[data-title="${item.title}"]`);
      if(icon){
        icon.classList.remove("ri-heart-fill");
        icon.classList.add("ri-heart-line");
        icon.style.color = "";
      }
    });

    wishlistContent.appendChild(wishlistBox);
  });
  updateWishlistCount();
}

// === Save both cart and wishlist to localStorage and re-render UI ===
function saveAndRender(renderWishlistFlag = true){
  localStorage.setItem("cart", JSON.stringify(cartItems));
  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  renderCart();
  if(renderWishlistFlag) renderWishlist();
  syncWishlistIcons();  // Sync icons after save and render
}

// === Update cart item count badge ===
function updateCartCount(){
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  if(count > 0){
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = count;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
}

// === Update wishlist item count badge ===
function updateWishlistCount(){
  const count = wishlistItems.length;
  if(count > 0){
    wishlistItemCountBadge.style.visibility = "visible";
    wishlistItemCountBadge.textContent = count;
  } else {
    wishlistItemCountBadge.style.visibility = "hidden";
    wishlistItemCountBadge.textContent = "";
  }
}

// === Calculate and update total price ===
function updateTotalPrice(){
  const totalPriceElement = document.querySelector(".total-price");
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });
  totalPriceElement.textContent = `৳${total}`;
}

// === Add product to Cart function ===
function addToCart(productBox) {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  let productPriceText = productBox.querySelector(".price").textContent;
  const productPrice = parseFloat(productPriceText.replace(/[^\d\.]/g, '')) || 0;

  // === Get color ===
  const productData = JSON.parse(productBox.getAttribute("data-product"));
  const selectedColor = productData.colors ? productData.colors[0].name : "Default Color";

  // Check if product exists in cart
  const existingItem = cartItems.find(item => item.title === productTitle && item.color === selectedColor);
  if(existingItem){
    existingItem.quantity++;
    saveAndRender();
    return;
  }

  // Add new product
  cartItems.push({
    title: productTitle,
    price: productPrice,
    image: productImgSrc,
    color: selectedColor,
    quantity: 1
  });

  saveAndRender();
}

// === Sync wishlist heart icons based on wishlistItems on page load or update ===
function syncWishlistIcons(){
  const wishlistIcons = document.querySelectorAll(".wishlist-icon");
  wishlistIcons.forEach(icon => {
    const productBox = icon.closest(".product-box");
    if(!productBox) return;

    const productTitle = productBox.querySelector(".product-title").textContent;

    // Get selected color from data-product
    const productData = JSON.parse(productBox.getAttribute("data-product"));
    const selectedColor = productData.colors ? productData.colors[0].name : "Default Color";

    icon.setAttribute("data-title", productTitle);

    const inWishlist = wishlistItems.some(item => item.title === productTitle && item.color === selectedColor);

    if(inWishlist){
      icon.classList.remove("ri-heart-line");
      icon.classList.add("ri-heart-fill");
      icon.style.color = "black";
    } else {
      icon.classList.remove("ri-heart-fill");
      icon.classList.add("ri-heart-line");
      icon.style.color = "";
    }
  });
}


// === Wishlist icon click handler with loader ===
const wishlistIcons = document.querySelectorAll(".wishlist-icon");
wishlistIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const productBox = icon.closest(".product-box");
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    let productPriceText = productBox.querySelector(".price").textContent;
    const productPrice = parseFloat(productPriceText.replace(/[^\d\.]/g, '')) || 0;

    // Get color from data-product
    const productData = JSON.parse(productBox.getAttribute("data-product"));
    const selectedColor = productData.colors ? productData.colors[0].name : "Default Color";

    // Find the loader icon within the same img-box as the wishlist icon
    const loadingIcon = icon.closest('.img-box').querySelector('.loading-icon');

    // Show loader, hide heart icon
    icon.style.display = 'none';
    loadingIcon.style.display = 'inline-block';

    setTimeout(() => {
      icon.style.display = 'inline-block';
      loadingIcon.style.display = 'none';

      icon.setAttribute("data-title", productTitle);

      const existsIndex = wishlistItems.findIndex(item => item.title === productTitle && item.color === selectedColor);

      if (existsIndex === -1) {
        // Add to wishlist
        icon.classList.remove("ri-heart-line");
        icon.classList.add("ri-heart-fill");
        icon.style.color = "black";

        wishlistItems.push({
          title: productTitle,
          price: productPrice,
          image: productImgSrc,
          color: selectedColor
        });
      } else {
        // Remove from wishlist
        icon.classList.remove("ri-heart-fill");
        icon.classList.add("ri-heart-line");
        icon.style.color = "";

        wishlistItems.splice(existsIndex, 1);
      }

      saveAndRender();
    }, 500);
  });
});


// === Add to Cart buttons on product boxes ===
const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
  button.addEventListener("click", event => {
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

// === Wishlist Drawer "Add to Cart" button ===
const wishlistAddToCartBtn = document.querySelector(".Wishlist .btn-cart");
if (wishlistAddToCartBtn) {
  wishlistAddToCartBtn.addEventListener("click", e => {
    e.preventDefault();

    wishlistItems.forEach(wItem => {
      const existingIndex = cartItems.findIndex(cItem => cItem.title === wItem.title);

      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += 1;
      } else {
        cartItems.push({
          title: wItem.title,
          price: wItem.price,
          image: wItem.image,
          quantity: 1,
          color: wItem.color || "Default Color"  // Color add করা হলো
        });
      }
    });

    // Clear wishlist after moving to cart (optional)
    wishlistItems = [];
    saveAndRender();

    // Redirect to cart page
    window.location.href = "cart.html";
  });
}

// === Cart Drawer "View Cart" button ===
const cartViewBtn = document.querySelector(".cart .btn-cart");
if(cartViewBtn){
  cartViewBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "cart.html";
  });
}

// === Buy Now Button ===
const buyNowButton = document.querySelector(".btn-buy");
if(buyNowButton){
  buyNowButton.addEventListener("click", () => {
    if(cartItems.length === 0){
      alert("Your cart is empty. Please add items to your cart before buying.");
      return;
    }

    cartItems = [];
    saveAndRender();
    alert("Thank you for your purchase!");
  });
}

// === On page load, render both lists and sync wishlist icons ===
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderWishlist();
  syncWishlistIcons();
});

// Prevent default navigation on wishlist and cart icons
document.querySelectorAll('.wishlist-icon, .add-cart').forEach(icon => {
  icon.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
});

// Product boxes navigation
const productBoxes = document.querySelectorAll("#productlist .product-box");

productBoxes.forEach(box => {
  box.addEventListener("click", () => {
    const productData = JSON.parse(box.getAttribute("data-product"));
    localStorage.setItem("selectedProduct", JSON.stringify(productData));
    window.location.href = "product-detail.html";
  });
});

// Loader for add to cart buttons
const addCartIcons = document.querySelectorAll('.add-cart');

addCartIcons.forEach(addCartIcon => {
  addCartIcon.addEventListener('click', () => {
    const loadingIcon = addCartIcon.parentElement.querySelector('.loading-icon');

    addCartIcon.style.display = 'none';
    loadingIcon.style.display = 'inline';

    setTimeout(() => {
      loadingIcon.style.display = 'none';
      addCartIcon.style.display = 'inline';
      // Optionally call addToCart here if you want after loader
    }, 500);
  });
});
