// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}));

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Product Images Array - Cell Shield for Salt Water Pools
const productImages = [
    {
        src: 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/refs/heads/main/poolproduct2.jpg',
        alt: 'Salt Water Pool Cell Shield - Main View'
    },
    {
        src: 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/refs/heads/main/poolproduct3.jpg',
        alt: 'Salt Water Pool Cell Shield - Side View'
    },
    {
        src: 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/refs/heads/main/poolproduct4.jpg',
        alt: 'Salt Water Pool Cell Shield - Detail View'
    },
    {
        src: 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/refs/heads/main/poolproduct5.jpg',
        alt: 'Salt Water Pool Cell Shield - Installation View'
    },
    {
        src: 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/refs/heads/main/poolproduct1.jpg',
        alt: 'Salt Water Pool Cell Shield - Complete Assembly'
    }
];

// Product Modal Functions
function openProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Initialize the product gallery
    initializeProductGallery();
    
    // Initialize PayPal button
    initializePayPalButton();
    
    // Calculate initial pricing
    updatePricing();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}

// Initialize Product Gallery
function initializeProductGallery() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailGallery = document.querySelector('.thumbnail-gallery');
    
    // Set main image
    mainImage.src = productImages[0].src;
    mainImage.alt = productImages[0].alt;
    
    // Create thumbnails
    thumbnailGallery.innerHTML = '';
    productImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        
        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            // Update main image
            mainImage.src = image.src;
            mainImage.alt = image.alt;
        });
        
        thumbnailGallery.appendChild(thumbnail);
    });
}

// Pricing and Shipping Calculator
const basePrice = 199.00;
const paypalFeeRate = 0.0349; // 3.49%

function updatePricing() {
    const paypalFee = basePrice * paypalFeeRate;
    const shippingCost = parseFloat(document.getElementById('shippingCost').textContent.replace('$', '')) || 0;
    const total = basePrice + paypalFee + shippingCost;
    
    document.getElementById('paypalFee').textContent = `$${paypalFee.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

// Shipping Calculator
async function calculateShipping() {
    const zipCode = document.getElementById('zipCode').value.trim();
    
    if (!zipCode || zipCode.length !== 5) {
        alert('Please enter a valid 5-digit ZIP code');
        return;
    }
    
    const shippingElement = document.getElementById('shippingCost');
    shippingElement.innerHTML = '<span class="loading"></span>';
    
    try {
        // Simulate API call to shipping calculator
        // In a real implementation, you would call a shipping API like USPS, UPS, or FedEx
        const shippingCost = await calculateShippingCost(zipCode);
        
        shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
        updatePricing();
    } catch (error) {
        console.error('Error calculating shipping:', error);
        shippingElement.textContent = 'Error calculating shipping';
    }
}

// Simulate shipping cost calculation
async function calculateShippingCost(zipCode) {
    // This is a mock function - replace with actual shipping API
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock shipping calculation based on distance from Orlando, FL
            const orlandoZip = '32801';
            const distance = Math.abs(parseInt(zipCode) - parseInt(orlandoZip));
            
            // Base shipping cost with distance factor
            let shippingCost = 8.99; // Base cost for small package
            
            if (distance > 1000) {
                shippingCost += 5.00; // Additional cost for far distances
            } else if (distance > 500) {
                shippingCost += 3.00;
            } else if (distance > 100) {
                shippingCost += 1.50;
            }
            
            // Add weight factor (less than 1 pound)
            shippingCost += 0.50;
            
            resolve(shippingCost);
        }, 1000);
    });
}

// PayPal Integration
function initializePayPalButton() {
    // Clear any existing PayPal buttons
    document.getElementById('paypal-button-container').innerHTML = '';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            const paypalFee = basePrice * paypalFeeRate;
            const shippingCost = parseFloat(document.getElementById('shippingCost').textContent.replace('$', '')) || 0;
            const total = basePrice + paypalFee + shippingCost;
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2),
                        currency_code: 'USD',
                        breakdown: {
                            item_total: {
                                value: basePrice.toFixed(2),
                                currency_code: 'USD'
                            },
                            shipping: {
                                value: shippingCost.toFixed(2),
                                currency_code: 'USD'
                            },
                            handling: {
                                value: paypalFee.toFixed(2),
                                currency_code: 'USD'
                            }
                        }
                    },
                    items: [{
                        name: 'Salt Water Pool Cell Shield',
                        description: 'Professional-grade cell shield for salt water pool systems',
                        unit_amount: {
                            value: basePrice.toFixed(2),
                            currency_code: 'USD'
                        },
                        quantity: '1',
                        category: 'PHYSICAL_GOODS'
                    }],
                    shipping: {
                        name: {
                            full_name: 'Customer'
                        },
                        address: {
                            country_code: 'US'
                        }
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Show success message
                alert('Payment successful! Order ID: ' + details.id);
                console.log('Payment completed:', details);
                
                // Here you would typically send the order details to your server
                // sendOrderToServer(details);
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
        },
        onCancel: function(data) {
            console.log('Payment cancelled:', data);
        }
    }).render('#paypal-button-container');
}

// Form validation
function validateZipCode(zipCode) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode);
}

// Add event listener for ZIP code input
document.addEventListener('DOMContentLoaded', function() {
    const zipInput = document.getElementById('zipCode');
    if (zipInput) {
        zipInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateShipping();
            }
        });
        
        zipInput.addEventListener('input', function(e) {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(30, 58, 138, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(30, 58, 138, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading states
function showLoading(element) {
    element.innerHTML = '<span class="loading"></span>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Error handling
function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Success notification
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Touch-friendly interactions for mobile
function addTouchSupport() {
    // Add touch support for product card
    const productCard = document.querySelector('.product-card');
    if (productCard) {
        productCard.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
        });
        
        productCard.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add touch support for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add touch support for thumbnails
    document.addEventListener('click', function(e) {
        if (e.target.closest('.thumbnail')) {
            e.target.closest('.thumbnail').style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.closest('.thumbnail').style.transform = 'scale(1)';
            }, 150);
        }
    });
}

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SB Pool Engineering website loaded successfully');
    
    // Add touch support
    addTouchSupport();
    
    // Add any additional initialization code here
    // For example, analytics, additional event listeners, etc.
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateShippingCost,
        updatePricing,
        validateZipCode
    };
}
