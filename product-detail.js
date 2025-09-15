document.addEventListener("DOMContentLoaded", () => {
    const productDataStr = localStorage.getItem("selectedProduct");
    if (!productDataStr) {
        alert("No product data found!");
        return;
    }
    
    const productData = JSON.parse(productDataStr);
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
    const qtyMinus = document.querySelector(".qty-minus");
    const qtyPlus = document.querySelector(".qty-plus");
    const qtyValueEl = document.querySelector(".qty-value");
    const addToCartBtn = document.querySelector(".add-to-cart");

    // Color map
    const colorMap = { "Desert Titanium": "#BFA48F", "Natural Titanium": "#C2BCB2", "Black Titanium": "#3C3C3D", "White Titanium": "#F2F1ED", "Blue": "#0000FF", "Red": "#FF0000", "Black": "#000000", "Green": "#008000", "White": "#fff", "Silver shadow": "#888", "Navy": "#000080", "Jetblack": "#343434", "Yellow": "#F9ce69", "Pink": "#FFB6C1", "Light Blue": "#9bbbfc", "Midnight": "#222930", "Purple": "#D8BFD8", "Starlight": "#FAF6F2", "Iceblue": "#d9eff7", "Mint": "#A9EAC8", "Light Green": "#CAD4C5", "Deep Blue": "#32374A", "Cosmic Orange": "#F77E2D", "Silver": "#F5F5F5", "Lavender": "#E6E6FA", "Sage": "#BCB88A", "Gold": "#F0EAE0" };

    // Set Product Details
    productTitleEl.textContent = productData.title || "No title found";
    productPriceEl.innerHTML = `<span class="price">${productData.price || "Price not available"}</span>`;
    descEl.textContent = productData.description || "Description not available.";
    mainImage.src = productData.image || (productData.colors ? productData.colors[0].image : "");

    // Price and Discount
    oldPriceEl.style.display = productData.oldPrice ? "inline" : "none";
    if (productData.oldPrice) oldPriceEl.textContent = productData.oldPrice;
    discountEl.style.display = productData.discount ? "inline" : "none";
    if (productData.discount) discountEl.textContent = productData.discount;

    // Thumbnails & Colors
    if (productData.colors && productData.colors.length > 0) {
        thumbnailsContainer.innerHTML = "";
        colorContainer.innerHTML = "";
        productData.colors.forEach((color, index) => {
            const thumbImg = document.createElement("img");
            thumbImg.src = color.image;
            thumbImg.classList.add("thumbnail");
            if (index === 0) thumbImg.classList.add("active");
            thumbImg.addEventListener("click", () => {
                mainImage.src = color.image;
                document.querySelectorAll(".thumbnails img").forEach(img => img.classList.remove("active"));
                thumbImg.classList.add("active");
                document.querySelectorAll(".color").forEach(c => c.classList.remove("active"));
                document.querySelector(`.color[data-name="${color.name}"]`).classList.add("active");
                selectedName.textContent = color.name;
            });
            thumbnailsContainer.appendChild(thumbImg);

            const colorDiv = document.createElement("div");
            colorDiv.classList.add("color");
            colorDiv.style.background = color.colorCode || colorMap[color.name] || "#ccc";
            colorDiv.setAttribute("data-name", color.name);
            if (index === 0) colorDiv.classList.add("active");
            colorDiv.addEventListener("click", () => {
                selectedName.textContent = color.name;
                mainImage.src = color.image;
                document.querySelectorAll(".color").forEach(c => c.classList.remove("active"));
                colorDiv.classList.add("active");
                document.querySelectorAll(".thumbnails img").forEach(img => img.classList.remove("active"));
                document.querySelector(`.thumbnail[src="${color.image}"]`).classList.add("active");
            });
            colorContainer.appendChild(colorDiv);
        });
        const defaultColor = document.querySelector(".color.active");
        if (defaultColor) selectedName.textContent = defaultColor.dataset.name;
    }

    // Specifications
    if (productData.specifications && specificationDiv) {
        specificationDiv.innerHTML = "<h2>Specifications</h2>";
        productData.specifications.forEach(specSection => {
            const table = document.createElement("table");
            table.innerHTML = `<thead><tr><th colspan="2" style="text-align:left;">${specSection.title}</th></tr></thead>`;
            const tbody = document.createElement("tbody");
            specSection.rows.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.label}</td><td>${row.value}</td>`;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            specificationDiv.appendChild(table);
            specificationDiv.appendChild(document.createElement("br"));
        });
    } else if (specificationDiv) {
        specificationDiv.style.display = "none";
    }

    // Quantity controls
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

    // Add to Cart
    addToCartBtn.addEventListener("click", () => {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const title = productTitleEl.textContent.trim();
        const price = parseFloat(productPriceEl.textContent.replace(/[^0-9.]/g, ""));
        const image = mainImage.src;
        const color = selectedName.textContent.trim() || "N/A";
        const currentQuantity = parseInt(qtyValueEl.textContent);
        const existingItem = cartItems.find(item => item.title === title && item.color === color);
        if (existingItem) {
            existingItem.quantity += currentQuantity;
        } else {
            cartItems.push({ title, price, image, color, quantity: currentQuantity });
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.location.href = "cart.html";
    });
});
