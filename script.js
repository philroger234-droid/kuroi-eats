

// Cart State - Load from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('kuroiEatsCart')) || [];

// CART FUNCTIONS

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('kuroiEatsCart', JSON.stringify(cart));
}

// Add item to cart (called from inline onclick)
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCart();
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update items list
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">REMOVE</button>
                </div>
            `).join('');
        }
    }
    
    // Update total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Show cart modal
function showCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.add('active');
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.remove('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed! Total: $${total.toFixed(2)}\n\nThank you for ordering from Kuroi Eats!`);
    cart = [];
    saveCart();
    updateCart();
    closeCart();
}

// NOTIFICATION

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 6rem;
        right: 2rem;
        background: #666666;
        color: #fff;
        padding: 1rem 2rem;
        font-family: 'Oswald', sans-serif;
        font-size: 0.85rem;
        letter-spacing: 2px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(102, 102, 102, 0.4);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// FAQ TOGGLE

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// CONTACT FORM

function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    if (name && email && subject && message) {
        if (name.value && email.value && subject.value && message.value) {
            showNotification('Message sent successfully!');
            document.querySelector('.contact-form').reset();
        } else {
            showNotification('Please fill in all fields!');
        }
    }
}

// SCROLL ANIMATIONS

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// INITIALIZE ON PAGE LOAD

document.addEventListener('DOMContentLoaded', () => {
    // Update cart display on page load
    updateCart();
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .dish-card, .drink-card, .menu-item-card, .value-card, .team-card, .stat-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Contact form submission
});

// CLOSE CART ON OUTSIDE CLICK

document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.querySelector('.cart-button');
    
    if (cartModal && cartModal.classList.contains('active') && 
        !cartModal.querySelector('.cart-panel').contains(e.target) && 
        cartButton && !cartButton.contains(e.target)) {
        closeCart();
    }
});

// CSS ANIMATIONS

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🍜 Kuroi Eats loaded! Cart items:', cart.length);
