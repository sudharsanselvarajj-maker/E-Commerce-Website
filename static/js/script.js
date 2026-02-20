// Product Data
const products = [
    {
        id: 1,
        name: "Pro Football 2024",
        category: "Football",
        price: 45.00,
        image: "https://placehold.co/600x600/1e1e1e/ff4757?text=Pro+Football",
        rating: 5,
        description: "Professional grade football designed for maximum control and durability across all weather conditions."
    },
    {
        id: 2,
        name: "Cricket Bat Willow",
        category: "Cricket",
        price: 120.00,
        image: "https://placehold.co/600x600/1e1e1e/2ed573?text=Cricket+Bat",
        rating: 4.5,
        description: "Premium English Willow bat for power hitters. Lightweight pickup and massive edges."
    },
    {
        id: 3,
        name: "Speed Runner Shoes",
        category: "Running",
        price: 85.00,
        image: "https://placehold.co/600x600/1e1e1e/00a8ff?text=Running+Shoes",
        rating: 4.5,
        description: "Lightweight running shoes with superior cushioning and energy return for long distance running."
    },
    {
        id: 4,
        name: "Dumbbell Set 20kg",
        category: "Gym",
        price: 60.00,
        image: "https://placehold.co/600x600/1e1e1e/ffa502?text=Dumbbells",
        rating: 5,
        description: "Adjustable dumbbell set perfect for home workouts. Includes 2 bars and weight plates."
    },
    {
        id: 5,
        name: "Basketball Pro",
        category: "Basketball",
        price: 35.00,
        image: "https://placehold.co/600x600/1e1e1e/e15f41?text=Basketball",
        rating: 4,
        description: "Official size and weight basketball with excellent grip for indoor and outdoor courts."
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        category: "Gym",
        price: 25.00,
        image: "https://placehold.co/600x600/1e1e1e/a29bfe?text=Yoga+Mat",
        rating: 4.5,
        description: "Non-slip yoga mat with extra cushioning for joint support during practice."
    },
    {
        id: 7,
        name: "Football Jersey",
        category: "Clothing",
        price: 40.00,
        image: "https://placehold.co/600x600/1e1e1e/fab1a0?text=Jersey",
        rating: 5,
        description: "Breathable fabric jersey to keep you cool during intense matches."
    },
    {
        id: 8,
        name: "Tennis Racket Elite",
        category: "Tennis",
        price: 150.00,
        image: "https://placehold.co/600x600/1e1e1e/fdcb6e?text=Tennis+Racket",
        rating: 5,
        description: "Professional tennis racket for precision and power. Used by top athletes."
    }
];

// Cart State Management
let cart = JSON.parse(localStorage.getItem('fitgear_cart')) || [];

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('fitgear_cart', JSON.stringify(cart));
    updateCartCount();
}

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    alert(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart(); // Re-render cart if on cart page
}

// Update Quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Update Cart Badge Count
function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) badge.innerText = count;
}

// Render Products (Grid)
function renderProducts(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let displayProducts = products;
    if (limit) displayProducts = products.slice(0, limit);

    container.innerHTML = displayProducts.map(product => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="stars">
                    ${getStarRating(product.rating)}
                </div>
                <h3>${product.name}</h3>
                <div class="price-row">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <a href="javascript:void(0)" onclick="event.stopPropagation(); addToCart(${product.id})" class="add-btn">
                        <i class="fas fa-shopping-cart"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Helper: Generate Star Rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i < rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Render Cart Table
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>';
        if (totalEl) totalEl.innerText = '$0.00';
        if (subtotalEl) subtotalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <tr>
                <td>
                    <div class="cart-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <p>${item.name}</p>
                            <small>Price: $${item.price}</small>
                            <br>
                            <a href="javascript:void(0)" onclick="removeFromCart(${item.id})">Remove</a>
                        </div>
                    </div>
                </td>
                <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value - ${item.quantity})"></td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = '$' + total.toFixed(2);
    if (subtotalEl) subtotalEl.innerText = '$' + total.toFixed(2);
}

// Render Single Product Details
function renderProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);

    if (product) {
        document.getElementById('main-img').src = product.image;
        document.getElementById('p-name').innerText = product.name;
        document.getElementById('p-category').innerText = "Home / " + product.category;
        document.getElementById('p-price').innerText = "$" + product.price.toFixed(2);
        document.getElementById('p-desc').innerText = product.description;

        // Setup Add to Cart Button
        const btn = document.getElementById('add-to-cart-btn');
        btn.onclick = () => {
            addToCart(product.id);
        };
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Initial Load Checks
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
