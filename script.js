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
        src: 'poolproduct2.jpg',
        alt: 'Salt Water Pool Cell Shield - Main View'
    },
    {
        src: 'poolproduct3.jpg',
        alt: 'Salt Water Pool Cell Shield - Side View'
    },
    {
        src: 'poolproduct4.jpg',
        alt: 'Salt Water Pool Cell Shield - Detail View'
    },
    {
        src: 'poolproduct5.jpg',
        alt: 'Salt Water Pool Cell Shield - Installation View'
    },
    {
        src: 'poolproduct1.jpg',
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

// Open Performance Report Function
function openPerformanceReport() {
    // URL for the performance report PDF
    const reportUrl = 'Cell_Shield_Performance_Report.pdf';
    
    // Open the PDF in a new tab
    const newWindow = window.open(reportUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (newWindow) {
        // Show success message
        showSuccess('Performance report opened in new tab!');
    } else {
        // Fallback if popup is blocked
        alert('Please allow popups for this site to view the performance report, or try again.');
    }
}

// Open Installation Guide Function
function downloadInstallationGuide() {
    // URLs for both installation guide images
    const guide1Url = 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/main/installationguide1.jpeg';
    const guide2Url = 'https://raw.githubusercontent.com/Benescudero/sbpoolengineering/main/installationguide2.jpeg';
    
    // Create HTML content with both images
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cell Shield Installation Guide</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background: #f8fafc;
                    font-family: 'Inter', sans-serif;
                }
                .guide-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 25px rgba(30, 58, 138, 0.1);
                    overflow: hidden;
                }
                .guide-header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                    color: white;
                    padding: 2rem;
                    text-align: center;
                }
                .guide-header h1 {
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 700;
                }
                .guide-header p {
                    margin: 0.5rem 0 0 0;
                    opacity: 0.9;
                }
                .guide-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    border-bottom: 2px solid #e5e7eb;
                }
                .guide-image:last-child {
                    border-bottom: none;
                }
                .image-caption {
                    padding: 1rem 2rem;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: center;
                    color: #1e3a8a;
                    font-weight: 600;
                }
                .image-caption:last-child {
                    border-bottom: none;
                }
                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                    .guide-header {
                        padding: 1.5rem;
                    }
                    .guide-header h1 {
                        font-size: 1.5rem;
                    }
                    .image-caption {
                        padding: 0.75rem 1rem;
                        font-size: 0.9rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="guide-container">
                <div class="guide-header">
                    <h1>Cell Shield Installation Guide</h1>
                    <p>Complete step-by-step visual instructions</p>
                </div>
                <div class="image-caption">Part 1: Parts List & Initial Setup</div>
                <img src="${guide1Url}" alt="Cell Shield Installation Guide Part 1" class="guide-image">
                <div class="image-caption">Part 2: Final Steps & Safety Information</div>
                <img src="${guide2Url}" alt="Cell Shield Installation Guide Part 2" class="guide-image">
            </div>
        </body>
        </html>
    `;
    
    // Create a new window with the HTML content
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Show success message
        showSuccess('Installation guide opened in new tab!');
    } else {
        // Fallback if popup is blocked
        alert('Please allow popups for this site to view the installation guide, or try again.');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SB Pool Engineering website loaded successfully');
    
    // Add touch support
    addTouchSupport();
    
    // Add any additional initialization code here
    // For example, analytics, additional event listeners, etc.
});

// Instagram Feed Integration (Static Posts)
class InstagramFeed {
    constructor() {
        // Static Instagram-style posts using your product images
        this.posts = [
            {
                id: '1',
                media_url: 'poolproduct2.jpg',
                caption: 'Our professional-grade Salt Water Pool Cell Shield in action! 🏊‍♂️✨ Protecting your salt cell from scale buildup and extending its lifespan by up to 3x. Lightweight design and easy installation make this a must-have for pool owners. #PoolMaintenance #SaltWaterPool #PoolEngineering #CellShield',
                permalink: 'https://instagram.com/sbpoolengineering',
                timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
            },
            {
                id: '2',
                media_url: 'poolproduct3.jpg',
                caption: 'Easy installation process for our Cell Shield! 🛠️ Just a few simple steps to protect your investment. Professional-grade materials designed to withstand the elements. Contact us for professional installation services or DIY guidance. #EasyInstallation #PoolProtection #ProfessionalService #DIY',
                permalink: 'https://instagram.com/sbpoolengineering',
                timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
            },
            {
                id: '3',
                media_url: 'poolproduct4.jpg',
                caption: 'Quality materials and precision engineering make the difference! 💪 Our Cell Shield is built to last and designed specifically for salt water pool professionals and homeowners. Prevent scale buildup and save money on salt cell replacements. #QualityMaterials #PoolEngineering #BuiltToLast #SaveMoney',
                permalink: 'https://instagram.com/sbpoolengineering',
                timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
            }
        ];
    }

    loadPosts() {
        const postsContainer = document.getElementById('instagramPosts');
        if (!postsContainer) return;

        // Add a small delay for better user experience
        setTimeout(() => {
            this.renderPosts(this.posts);
        }, 800);
    }

    renderPosts(posts) {
        const postsContainer = document.getElementById('instagramPosts');
        if (!postsContainer) return;

        postsContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
        
        // Add animation to posts
        setTimeout(() => {
            document.querySelectorAll('.instagram-post').forEach((post, index) => {
                post.style.opacity = '0';
                post.style.transform = 'translateY(30px)';
                post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 100);
    }

    createPostHTML(post) {
        const date = new Date(post.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="instagram-post">
                <img src="${post.media_url}" alt="Instagram Post" class="post-image" loading="lazy">
                <div class="post-content">
                    <p class="post-caption">${this.truncateCaption(post.caption, 120)}</p>
                    <div class="post-meta">
                        <span class="post-date">${formattedDate}</span>
                        <a href="${post.permalink}" target="_blank" rel="noopener noreferrer" class="post-link">
                            View on Instagram
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    truncateCaption(caption, maxLength) {
        if (!caption) return '';
        if (caption.length <= maxLength) return caption;
        return caption.substring(0, maxLength) + '...';
    }

    // Method to update posts manually (for when you want to change the content)
    updatePosts(newPosts) {
        this.posts = newPosts;
        this.loadPosts();
    }
}

// Initialize Instagram feed
const instagramFeed = new InstagramFeed();

// Load Instagram posts when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load Instagram posts after a short delay to ensure everything is rendered
    setTimeout(() => {
        instagramFeed.loadPosts();
    }, 1000);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateShippingCost,
        updatePricing,
        validateZipCode,
        InstagramFeed
    };
}
