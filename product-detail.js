document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const productTitleEl = document.getElementById("productTitle");
  const productPriceEl = document.getElementById("productPrice");
  const oldPriceEl = document.querySelector(".old-price");
  const discountEl = document.querySelector(".discount");
  const descEl = document.getElementById("productDescription");
  const thumbnailsContainer = document.querySelector(".thumbnails");
  const mainImage = document.getElementById("mainImage");
  const colorContainer = document.getElementById("colorContainer");
  const selectedName = document.getElementById("selectedName");
  const specificationDiv = document.querySelector(".specification");

  // Color map (fallback if colorCode missing)
  const colorMap = {
    "Desert Titanium": "#BFA48F",
    "Natural Titanium": "#C2BCB2",
    "Black Titanium": "#3C3C3D",
    "White Titanium": "#F2F1ED",
    "Blue": "#0000FF",
    "Red": "#FF0000",
    "Black": "#000000",
    "Green": "#008000",
    "White": "#fff",
    "Silver shadow": "#888",
    "Navy": "#000080",
    "Jetblack": "#343434",
    "Yellow": "#F9ce69",
    "Pink": "#FFB6C1",
    "Light Blue": "#9bbbfc",
    "Midnight": "#222930",
    "Purple": "#D8BFD8",
    "Starlight": "#FAF6F2",
    "Iceblue": "#d9eff7",
    "Mint": "#A9EAC8",
    "Light Green": "#CAD4C5",
    "Deep Blue": "#32374A",
    "Cosmic Orange": "#F77E2D",
    "Silver": "#F5F5F5",
    "Lavender": "#E6E6FA",
    "Sage": "#BCB88A",
    "Gold": "#F0EAE0",
  };

  // Load product data from localStorage
  const productDataStr = localStorage.getItem("selectedProduct");
  if (!productDataStr) {
    alert("No product data found!");
    return;
  }

  const productData = JSON.parse(productDataStr);

  // Set Product Title & Price
  productTitleEl.textContent = productData.title || "No title found";
  productPriceEl.innerHTML = `<span class="price">${productData.price || "Price not available"}</span>`;

  // Old Price and Discount
  if (productData.oldPrice) {
    oldPriceEl.textContent = productData.oldPrice;
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }

  if (productData.discount) {
    discountEl.textContent = productData.discount;
    discountEl.style.display = "inline";
  } else {
    discountEl.style.display = "none";
  }

  // Description
  descEl.textContent = productData.description || "Description not available.";

  // Clear thumbnails and colors containers
  if (thumbnailsContainer) thumbnailsContainer.innerHTML = "";
  if (colorContainer) colorContainer.innerHTML = "";

  // Load thumbnails & colors
  if (productData.colors && productData.colors.length > 0) {
    productData.colors.forEach((color, index) => {
      // Thumbnail Images
      const thumbImg = document.createElement("img");
      thumbImg.src = color.image;
      thumbImg.alt = color.name + " thumbnail";
      thumbImg.setAttribute("data-image", color.image);
      thumbImg.style.cursor = "pointer";

      if (index === 0) mainImage.src = color.image;

      thumbImg.addEventListener("click", () => {
        mainImage.src = color.image;
        // Highlight thumbnail
        document.querySelectorAll(".thumbnails img").forEach(img => img.classList.remove("active"));
        thumbImg.classList.add("active");
      });

      thumbnailsContainer.appendChild(thumbImg);

      // Color boxes
      const colorDiv = document.createElement("div");
      colorDiv.classList.add("color");
      if (index === 0) colorDiv.classList.add("active");

      // Use color.colorCode if exists, else fallback to colorMap, else default #ccc
      colorDiv.style.background = color.colorCode || colorMap[color.name] || "#ccc";

      colorDiv.setAttribute("data-name", color.name);
      colorDiv.setAttribute("data-image", color.image);

      colorDiv.addEventListener("click", () => {
        selectedName.textContent = color.name;
        mainImage.src = color.image;

        // Remove active class from all colors & add to this one
        document.querySelectorAll("#colorContainer .color").forEach(c => c.classList.remove("active"));
        colorDiv.classList.add("active");

        // Also update thumbnails active state (optional)
        document.querySelectorAll(".thumbnails img").forEach(img => {
          img.classList.toggle("active", img.src === color.image);
        });
      });

      colorContainer.appendChild(colorDiv);
    });

    // Show selected color name initially
    const defaultColor = document.querySelector("#colorContainer .color.active");
    if (defaultColor) {
      selectedName.textContent = defaultColor.dataset.name;
      selectedName.style.display = "block";
    }
  } else {
    mainImage.src = productData.image || "";
    selectedName.style.display = "none";
  }

  // Specifications
  if (specificationDiv) {
    if (productData.specifications && productData.specifications.length > 0) {
      specificationDiv.innerHTML = "<h2>Specifications</h2>";
      productData.specifications.forEach(specSection => {
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");
        const th = document.createElement("th");
        th.colSpan = 2;
        th.textContent = specSection.title;
        th.style.textAlign = "left";
        trHead.appendChild(th);
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        specSection.rows.forEach(row => {
          const tr = document.createElement("tr");
          const tdLabel = document.createElement("td");
          tdLabel.textContent = row.label;
          const tdValue = document.createElement("td");
          tdValue.innerHTML = row.value;

          tr.appendChild(tdLabel);
          tr.appendChild(tdValue);
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        specificationDiv.appendChild(table);
        specificationDiv.appendChild(document.createElement("br"));
      });
    } else {
      specificationDiv.innerHTML = "";
      specificationDiv.style.display = "none";
    }
  }

  // Quantity controls
  const qtyMinus = document.querySelector(".qty-minus");
  const qtyPlus = document.querySelector(".qty-plus");
  const qtyValueEl = document.querySelector(".qty-value");

  let quantity = 1;
  qtyValueEl.textContent = quantity;

  qtyMinus.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyValueEl.textContent = quantity;
    }
  });

  qtyPlus.addEventListener("click", () => {
    quantity++;
    qtyValueEl.textContent = quantity;
  });

  // Add to Cart Button
  const addToCartBtn = document.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    const title = productTitleEl.textContent.trim();
    const priceText = productPriceEl.textContent.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
    const image = mainImage.src;
    const color = selectedName.textContent.trim() || "N/A";

    if (!title || !price || !image) {
      alert("Product info missing!");
      return;
    }

    // Unique id তৈরি করছি title + color দিয়ে
    const id = title.toLowerCase().replace(/\s+/g, "-") + "_" + color.toLowerCase().replace(/\s+/g, "-");

    const product = { id, title, price, image, quantity, color };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "cart.html";
  });
});
