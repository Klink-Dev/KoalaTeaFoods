document.addEventListener('DOMContentLoaded', function() {


    // Load products from CSV
    fetch('data/products.csv')
        .then(response => response.text())
        .then(data => {
            const products = parseCSV(data);
            loadProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));

    // Navigation function
    window.navigate = function(page) {
        window.location.href = page;
    };

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'show';
    
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000); // Toast will be visible for 3 seconds
    }

    // Add to cart function
    window.addToCart = function(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart.find(item => item.UPC === product.UPC);

        if (item) {
            item.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        showToast(`${product.Title} added to cart`);

    };

    // Load cart items
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
});

function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        let product = {};
        headers.forEach((header, index) => {
            product[header] = values[index];
        });
        return product;
    });
}

function loadProducts(products) {
    const catalogItems = document.getElementById('catalog-items');
    const saleItems = document.getElementById('sale-items');
    const frequentItems = document.getElementById('frequent-items');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        salePrice = product.Price-(product.Price*product.Discount)
        productDiv.innerHTML = `
            <img src="images/${product.Title}.jpg" alt="${product.Title}">
            <h3>${product.Title}</h3>
            <p>${product.Description}</p>
            <p>List Price: $${product.Price}</p>
            <p>Sale Price: $${salePrice.toFixed(2)}</p>
            <button class="add-to-cart" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;

        if (catalogItems) catalogItems.appendChild(productDiv);
        if (saleItems && parseFloat(product.Discount) > 0) saleItems.appendChild(productDiv.cloneNode(true));
        if (frequentItems && Math.random() < 0.3) frequentItems.appendChild(productDiv.cloneNode(true));  // Randomly pick some as frequently purchased for demo
    });
}

function loadCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';  // Clear existing items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        salePrice = item.Price-(item.Price*item.Discount)
        itemDiv.innerHTML = `
            <img src="images/${item.Title}.jpg" alt="${item.Title}.jpg">
            <h3>${item.Title}</h3>
            <p>${item.Description}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>List Price: $${item.Price}</p>
            <p>Sale Price: $${salePrice.toFixed(2)}</p>
            <button class="remove-from-cart" onclick='removeFromCart("${item.UPC}")'>Remove</button>
        `;
        cartItems.appendChild(itemDiv);
        total += parseFloat(salePrice) * item.quantity;
    });

    document.getElementById('total-cost').textContent = total.toFixed(2);
}

window.removeFromCart = function(UPC) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.UPC !== UPC);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
};

