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
    
    // Initialize PayPal button (hidden initially)
    // initializePayPalButton(); // Will be called after shipping calculation
    
    // Calculate initial pricing
    updatePricing();
    
    // Reset shipping state
    calculatedShipping = false;
    shippingCost = 0;
    
    // Clear zip code input
    const zipCodeInput = document.getElementById('zipCode');
    if (zipCodeInput) {
        zipCodeInput.value = '';
    }
    
    // Hide PayPal section initially
    const paypalSection = document.getElementById('paypalSection');
    if (paypalSection) {
        paypalSection.style.display = 'none';
    }
    
    // Hide shipping result initially
    const shippingResult = document.getElementById('shippingResult');
    if (shippingResult) {
        shippingResult.style.display = 'none';
    }
    
    // Setup event listeners (remove old ones first to avoid duplicates)
    const calculateBtn = document.getElementById('calculateShippingBtn');
    if (calculateBtn) {
        // Clone and replace to remove all event listeners
        const newCalculateBtn = calculateBtn.cloneNode(true);
        calculateBtn.parentNode.replaceChild(newCalculateBtn, calculateBtn);
        
        // Add fresh event listener
        newCalculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button click event triggered');
            calculateShipping();
        });
    }
    
    // Allow Enter key to calculate shipping
    if (zipCodeInput) {
        // Clone and replace to remove all event listeners
        const newZipCodeInput = zipCodeInput.cloneNode(true);
        zipCodeInput.parentNode.replaceChild(newZipCodeInput, zipCodeInput);
        
        newZipCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateShipping();
            }
        });
        
        // Only allow numbers in zip code input
        newZipCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
        });
    }
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

function updatePricing() {
    // Only update if elements exist (modal is open)
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${basePrice.toFixed(2)} + Shipping`;
    }
}

// Shipping Calculator - Calculate shipping from Orlando to customer zip code
let shippingCost = 0;
let calculatedShipping = false;

function calculateShipping() {
    console.log('Calculate Shipping button clicked!');
    
    const zipCodeInput = document.getElementById('zipCode');
    if (!zipCodeInput) {
        console.error('Zip code input element not found!');
        return;
    }
    
    const zipCode = zipCodeInput.value.trim();
    console.log('Zip code entered:', zipCode);
    
    if (!zipCode) {
        console.log('No zip code entered');
        showError('Please enter a zip code');
        return;
    }
    
    if (!validateZipCode(zipCode)) {
        console.log('Invalid zip code format');
        showError('Please enter a valid 5-digit zip code');
        return;
    }
    
    // Show loading state
    const calculateBtn = document.getElementById('calculateShippingBtn');
    if (!calculateBtn) {
        console.error('Calculate button not found!');
        return;
    }
    
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    calculateBtn.disabled = true;
    
    console.log('Starting calculation for zip code:', zipCode);
    
    // Simulate API call delay
        setTimeout(() => {
        // Calculate shipping based on distance from Orlando (32801)
        shippingCost = calculateShippingCost(zipCode);
        console.log('Calculated shipping cost:', shippingCost);
        
        // Update UI
        const shippingCostElement = document.getElementById('shippingCost');
        const totalPriceElement = document.getElementById('totalPrice');
        const shippingResultElement = document.getElementById('shippingResult');
        const paypalSectionElement = document.getElementById('paypalSection');
        
        if (shippingCostElement) {
            shippingCostElement.textContent = `$${shippingCost.toFixed(2)}`;
        } else {
            console.error('shippingCost element not found');
        }
        
        if (totalPriceElement) {
            totalPriceElement.textContent = `$${(basePrice + shippingCost).toFixed(2)}`;
        } else {
            console.error('totalPrice element not found');
        }
        
        // Show success message
        if (shippingResultElement) {
            shippingResultElement.style.display = 'block';
        } else {
            console.error('shippingResult element not found');
        }
        
        showSuccess(`Shipping calculated: $${shippingCost.toFixed(2)} to ${zipCode}`);
        
        // Show PayPal button
        if (paypalSectionElement) {
            paypalSectionElement.style.display = 'block';
        } else {
            console.error('paypalSection element not found');
        }
        
        // Reinitialize PayPal with new total
        calculatedShipping = true;
        initializePayPalButton();
        
        // Reset button
        calculateBtn.innerHTML = originalText;
        calculateBtn.disabled = false;
        
        console.log('Shipping calculation complete!');
        
    }, 1500);
}

function calculateShippingCost(zipCode) {
    // Orlando, FL coordinates (approximate)
    const orlandoLat = 28.5383;
    const orlandoLon = -81.3792;
    
    // Get destination coordinates (simplified - in production, use a geocoding service)
    const destination = getCoordinatesFromZip(zipCode);
    
    if (!destination) {
        // Default shipping cost if we can't determine location
        return 15.99;
    }
    
    // Calculate distance using Haversine formula (simplified)
    const distance = calculateDistance(orlandoLat, orlandoLon, destination.lat, destination.lon);
    
    // Shipping cost based on distance zones
    if (distance <= 100) {
        return 8.99; // Local/Regional
    } else if (distance <= 300) {
        return 12.99; // Regional
    } else if (distance <= 600) {
        return 15.99; // Continental
    } else if (distance <= 1200) {
        return 19.99; // Cross-country
    } else {
        return 24.99; // Extended shipping
    }
}

function getCoordinatesFromZip(zipCode) {
    // Comprehensive Florida zip code to coordinates mapping
    const zipCoordinates = {
        // Central Florida - Orlando Area
        '32701': { lat: 28.6028, lon: -81.2006 }, // Altamonte Springs
        '32702': { lat: 28.6611, lon: -81.3656 }, // Altoona
        '32703': { lat: 28.8500, lon: -81.2900 }, // Apopka
        '32704': { lat: 28.8500, lon: -81.2900 }, // Apopka
        '32707': { lat: 28.7339, lon: -81.3478 }, // Casselberry
        '32708': { lat: 28.6667, lon: -81.3456 }, // Winter Springs
        '32709': { lat: 28.6611, lon: -81.3656 }, // Altoona
        '32710': { lat: 28.7300, lon: -81.3900 }, // Fern Park
        '32712': { lat: 28.8500, lon: -81.2900 }, // Apopka
        '32713': { lat: 28.7800, lon: -81.1700 }, // Debary
        '32714': { lat: 28.8900, lon: -81.3100 }, // Altamonte Springs
        '32715': { lat: 28.6611, lon: -81.3656 }, // Altoona
        '32716': { lat: 28.9000, lon: -81.2500 }, // Debary
        '32718': { lat: 28.6400, lon: -81.1900 }, // Oviedo
        '32719': { lat: 28.7000, lon: -81.4100 }, // Longwood
        '32720': { lat: 28.8700, lon: -81.0200 }, // DeLand
        '32721': { lat: 28.8700, lon: -81.0200 }, // DeLand
        '32722': { lat: 28.8700, lon: -81.0200 }, // DeLand
        '32723': { lat: 28.8700, lon: -81.0200 }, // DeLand
        '32724': { lat: 28.8700, lon: -81.0200 }, // DeLand
        '32725': { lat: 28.8889, lon: -81.0192 }, // Deltona
        '32726': { lat: 28.9006, lon: -81.2139 }, // Eustis
        '32727': { lat: 28.8727, lon: -81.0170 }, // DeLand
        '32728': { lat: 28.8889, lon: -81.0192 }, // Deltona
        '32730': { lat: 28.8889, lon: -81.0192 }, // Deltona
        '32732': { lat: 28.9006, lon: -81.2139 }, // Eustis
        '32733': { lat: 28.9200, lon: -81.3600 }, // Sorrento
        '32735': { lat: 28.9200, lon: -81.4100 }, // Grand Island
        '32736': { lat: 28.9006, lon: -81.2139 }, // Eustis
        '32738': { lat: 28.8889, lon: -81.0192 }, // Deltona
        '32739': { lat: 28.9200, lon: -81.4100 }, // Deltona
        '32744': { lat: 29.0300, lon: -81.1000 }, // Lake Helen
        '32746': { lat: 29.0700, lon: -81.3400 }, // Lake Mary
        '32750': { lat: 28.6333, lon: -81.3667 }, // Longwood
        '32751': { lat: 28.6278, lon: -81.3631 }, // Maitland
        '32752': { lat: 28.7000, lon: -81.4100 }, // Longwood
        '32753': { lat: 28.6333, lon: -81.3667 }, // Longwood
        '32754': { lat: 28.6278, lon: -81.3631 }, // Maitland
        '32756': { lat: 29.0600, lon: -81.4900 }, // Mount Dora
        '32757': { lat: 29.0600, lon: -81.4900 }, // Mount Dora
        '32759': { lat: 28.5767, lon: -81.2067 }, // Oak Hill
        '32762': { lat: 28.6400, lon: -81.1900 }, // Oviedo
        '32763': { lat: 28.7800, lon: -81.1700 }, // Orange City
        '32764': { lat: 28.9200, lon: -81.3600 }, // Osteen
        '32765': { lat: 28.6400, lon: -81.1900 }, // Oviedo
        '32766': { lat: 28.9200, lon: -81.3600 }, // Oviedo
        '32767': { lat: 29.0300, lon: -81.2900 }, // Osteen
        '32768': { lat: 28.9200, lon: -81.2900 }, // Paisley
        '32771': { lat: 28.7500, lon: -81.2400 }, // Sanford
        '32772': { lat: 28.7800, lon: -81.2700 }, // Sanford
        '32773': { lat: 28.8000, lon: -81.2700 }, // Sanford
        '32774': { lat: 29.0400, lon: -81.3300 }, // Sanford
        '32775': { lat: 29.0000, lon: -81.5300 }, // Scottsmoor
        '32776': { lat: 29.1700, lon: -81.0200 }, // Seville
        '32777': { lat: 29.1000, lon: -81.4400 }, // Sorrento
        '32778': { lat: 29.2000, lon: -81.4900 }, // Tavares
        '32779': { lat: 28.7300, lon: -81.3900 }, // Longwood
        '32780': { lat: 28.9300, lon: -80.6100 }, // Titusville
        '32781': { lat: 28.9300, lon: -80.6100 }, // Titusville
        '32783': { lat: 29.2000, lon: -81.4900 }, // Titusville
        '32784': { lat: 29.1000, lon: -81.4400 }, // Umatilla
        '32789': { lat: 28.7000, lon: -81.3400 }, // Winter Park
        '32790': { lat: 28.6000, lon: -81.3400 }, // Winter Park
        '32792': { lat: 28.7000, lon: -81.3400 }, // Winter Park
        '32793': { lat: 28.7000, lon: -81.3400 }, // Winter Park
        '32794': { lat: 28.7000, lon: -81.3400 }, // Winter Park
        '32795': { lat: 28.7000, lon: -81.3400 }, // Winter Park
        '32796': { lat: 28.9800, lon: -80.6200 }, // Titusville
        '32798': { lat: 29.1900, lon: -81.8700 }, // Yalaha
        '32799': { lat: 28.5383, lon: -81.3792 }, // Orlando
        '32801': { lat: 28.5383, lon: -81.3792 }, // Orlando
        '32803': { lat: 28.5480, lon: -81.3460 }, // Orlando
        '32804': { lat: 28.5600, lon: -81.3870 }, // Orlando
        '32805': { lat: 28.5320, lon: -81.4070 }, // Orlando
        '32806': { lat: 28.5120, lon: -81.3500 }, // Orlando
        '32807': { lat: 28.5350, lon: -81.3150 }, // Orlando
        '32808': { lat: 28.5580, lon: -81.3150 }, // Orlando
        '32809': { lat: 28.4680, lon: -81.3700 }, // Orlando
        '32810': { lat: 28.6180, lon: -81.3650 }, // Orlando
        '32811': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32812': { lat: 28.5380, lon: -81.3250 }, // Orlando
        '32814': { lat: 28.5650, lon: -81.3250 }, // Orlando
        '32815': { lat: 28.5150, lon: -81.4150 }, // Orlando
        '32816': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32817': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32818': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32819': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32820': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32821': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32822': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32824': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32825': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32826': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32827': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32828': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32829': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32830': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32831': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32832': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32833': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32834': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32835': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32836': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32837': { lat: 28.5150, lon: -81.4450 }, // Orlando
        '32839': { lat: 28.5150, lon: -81.4450 }, // Orlando
        
        // South Florida - Miami Area
        '33101': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33102': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33109': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33111': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33114': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33116': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33119': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33122': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33124': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33125': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33126': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33127': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33128': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33129': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33130': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33131': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33132': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33133': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33134': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33135': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33136': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33137': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33138': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33139': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33140': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33141': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33142': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33143': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33144': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33145': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33146': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33147': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33149': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33150': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33151': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33152': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33153': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33154': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33155': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33156': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33157': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33158': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33159': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33160': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33161': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33162': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33163': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33164': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33165': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33166': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33167': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33168': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33169': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33170': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33172': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33173': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33174': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33175': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33176': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33177': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33178': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33179': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33180': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33181': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33182': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33183': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33184': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33185': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33186': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33187': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33188': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33189': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33190': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33193': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33194': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33195': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33196': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33197': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33198': { lat: 25.7617, lon: -80.1918 }, // Miami
        '33199': { lat: 25.7617, lon: -80.1918 }, // Miami
        
        // West Central Florida - Tampa Area
        '33601': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33602': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33603': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33604': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33605': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33606': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33607': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33608': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33609': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33610': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33611': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33612': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33613': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33614': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33615': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33616': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33617': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33618': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33619': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33620': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33621': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33622': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33623': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33624': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33625': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33626': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33629': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33630': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33631': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33633': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33634': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33635': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33637': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33646': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33647': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33650': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33655': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33660': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33661': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33662': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33663': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33664': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33672': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33673': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33674': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33675': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33677': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33679': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33680': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33681': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33682': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33684': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33685': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33686': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33687': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33688': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33689': { lat: 27.9506, lon: -82.4572 }, // Tampa
        '33694': { lat: 27.9506, lon: -82.4572 }, // Tampa
        
        // North Florida - Jacksonville Area
        '32201': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32202': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32203': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32204': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32205': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32206': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32207': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32208': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32209': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32210': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32211': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32212': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32216': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32217': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32218': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32219': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32220': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32221': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32222': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32223': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32224': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32225': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32226': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32227': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32228': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32233': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32234': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32244': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32246': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32250': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32254': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32255': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32256': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32257': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32258': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32259': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32260': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32266': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        '32277': { lat: 30.3322, lon: -81.6557 }, // Jacksonville
        
        // Other Major Florida Cities
        '32501': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32502': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32503': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32504': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32505': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32506': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32507': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32508': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32509': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32511': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32512': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32513': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32514': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32516': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32520': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32526': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32534': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32535': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32536': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32537': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32541': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32542': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32544': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32547': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32548': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32559': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32561': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32562': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32563': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32564': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32565': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32566': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32567': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32568': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32569': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32571': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32572': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32577': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32578': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32579': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32580': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32581': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32582': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32583': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32588': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32591': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        '32592': { lat: 30.4213, lon: -87.2169 }, // Pensacola
        
        // Tallahassee
        '32301': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32302': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32303': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32304': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32305': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32306': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32307': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32308': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32309': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32310': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32311': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32312': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32313': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32314': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32315': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32316': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32317': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        '32318': { lat: 30.4518, lon: -84.2807 }, // Tallahassee
        
        // Gainesville
        '32601': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32602': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32603': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32604': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32605': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32606': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32607': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32608': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32609': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32610': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32611': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32612': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32613': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32614': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32615': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32616': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32617': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32618': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32626': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32627': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32628': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32631': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32633': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32634': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32635': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32640': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32641': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32643': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32644': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32648': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32653': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32654': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32655': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32658': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32662': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32663': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32664': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32666': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32667': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32668': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32669': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32671': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32672': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32673': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32675': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32676': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32680': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32681': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32683': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32686': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32692': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32693': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32694': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32696': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        '32697': { lat: 29.6516, lon: -82.3248 }, // Gainesville
        
        // Fort Lauderdale
        '33301': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33302': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33303': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33304': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33305': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33306': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33307': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33308': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33309': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33310': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33311': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33312': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33313': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33314': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33315': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33316': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33317': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33318': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33319': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33320': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33321': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33322': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33323': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33324': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33325': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33326': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33327': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33328': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33329': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33330': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33331': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33332': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33334': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33335': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33336': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33337': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33338': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33339': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33340': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33345': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33346': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33348': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33349': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33351': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33355': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        '33359': { lat: 26.1224, lon: -80.1373 }, // Fort Lauderdale
        
        // West Palm Beach
        '33401': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33402': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33403': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33404': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33405': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33406': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33407': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33408': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33409': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33410': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33411': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33412': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33413': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33414': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33415': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33416': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33417': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33418': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33419': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33420': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33421': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33422': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33423': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33424': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33425': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33426': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33427': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33428': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33429': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33430': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33431': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33432': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33433': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33434': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33435': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33436': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33437': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33438': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33439': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33440': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33441': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33442': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33443': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33444': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33445': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33446': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33447': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33448': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33449': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33454': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33455': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33458': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33459': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33460': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33461': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33462': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33463': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33464': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33465': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33466': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33467': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33468': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33469': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33470': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33471': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33472': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33473': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33474': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33475': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33476': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33477': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33478': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33480': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33481': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33482': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33483': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33484': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33486': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33487': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33488': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33493': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33496': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33497': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33498': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        '33499': { lat: 26.7153, lon: -80.0534 }, // West Palm Beach
        
        // St. Petersburg
        '33701': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33702': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33703': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33704': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33705': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33706': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33707': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33708': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33709': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33710': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33711': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33712': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33713': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33714': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33715': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33716': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33730': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33731': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33732': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33733': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33734': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33736': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33737': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33738': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33740': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33741': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33742': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33743': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33744': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33747': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33755': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33756': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33757': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33758': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33759': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33760': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33761': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33762': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33763': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33764': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33765': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33766': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33767': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33769': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33770': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33771': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33772': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33773': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33774': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33775': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33776': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33777': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33778': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33779': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33780': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33781': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        '33782': { lat: 27.7676, lon: -82.6403 }, // St. Petersburg
        
        // Hialeah
        '33002': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33010': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33011': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33012': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33013': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33014': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33015': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33016': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33017': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33018': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33030': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33031': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33032': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33033': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33034': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33035': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33054': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33055': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33056': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33057': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33058': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33060': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33061': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33062': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33063': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33064': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33065': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33066': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33067': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33068': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33069': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33071': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33072': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33073': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33074': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33075': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33076': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33077': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33081': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33082': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33083': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33084': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33090': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33092': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33093': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33097': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33098': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33125': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33126': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33127': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33128': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33129': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33130': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33131': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33132': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33133': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33134': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33135': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33136': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33137': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33138': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33139': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33140': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33141': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33142': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33143': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33144': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33145': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33146': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33147': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33149': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33150': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33151': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33152': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33153': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33154': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33155': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33156': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33157': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33158': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33159': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33160': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33161': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33162': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33163': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33164': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33165': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33166': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33167': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33168': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33169': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33170': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33172': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33173': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33174': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33175': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33176': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33177': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33178': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33179': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33180': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33181': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33182': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33183': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33184': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33185': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33186': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33187': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33188': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33189': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33190': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33193': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33194': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33195': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33196': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33197': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33198': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        '33199': { lat: 25.8576, lon: -80.2781 }, // Hialeah
        
        // Other Major Cities - Keep existing ones
        '90210': { lat: 34.0901, lon: -118.4065 }, // Beverly Hills, CA
        '94102': { lat: 37.7749, lon: -122.4194 }, // San Francisco, CA
        '90001': { lat: 33.9731, lon: -118.2479 }, // Los Angeles, CA
        '10001': { lat: 40.7505, lon: -73.9934 }, // New York, NY
        '11201': { lat: 40.6943, lon: -73.9249 }, // Brooklyn, NY
        '75201': { lat: 32.7767, lon: -96.7970 }, // Dallas, TX
        '77001': { lat: 29.7604, lon: -95.3698 }, // Houston, TX
        '60601': { lat: 41.8781, lon: -87.6298 }, // Chicago, IL
    };
    
    return zipCoordinates[zipCode] || null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}


// PayPal Integration - Use Native PayPal Buttons Only
function initializePayPalButton() {
    // Update modal price
    const modalPriceElement = document.getElementById('modal-total-price');
    if (modalPriceElement) {
        modalPriceElement.textContent = (basePrice + shippingCost).toFixed(2);
    }

    // Clear container and use ONLY PayPal's native buttons
    const buttonContainer = document.getElementById('paypal-button-container');
    if (buttonContainer) {
        buttonContainer.innerHTML = ''; // Clear any custom buttons
    }

    // Show PayPal modal
    const paypalModal = document.getElementById('paypal-modal');
    if (paypalModal) {
        paypalModal.style.display = 'flex';
    }

    // Initialize PayPal's native buttons
    if (typeof paypal !== 'undefined') {
        // PayPal Button
    paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
                height: 50,
                tagline: false
            },
        createOrder: function(data, actions) {
                const total = basePrice + shippingCost;
            return actions.order.create({
                    intent: 'CAPTURE',
                purchase_units: [{
                        reference_id: 'SALT_CELL_SHIELD_' + Date.now(),
                        description: 'Salt Cell Shield - Professional Salt Cell Protection',
                    amount: {
                        currency_code: 'USD',
                            value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                    currency_code: 'USD',
                                    value: basePrice.toFixed(2)
                            },
                            shipping: {
                                    currency_code: 'USD',
                                    value: shippingCost.toFixed(2)
                            }
                        }
                    },
                    items: [{
                            name: 'Salt Cell Shield',
                            description: 'Professional-grade salt cell shield that protects salt cells from scale buildup and temperature damage.',
                        unit_amount: {
                                currency_code: 'USD',
                                value: basePrice.toFixed(2)
                        },
                        quantity: '1',
                            category: 'PHYSICAL_GOODS',
                            sku: 'SCS-001'
                        }]
                    }],
                    application_context: {
                        brand_name: 'Shield Bearer 3D',
                        shipping_preference: 'GET_FROM_FILE'
                    }
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log('PayPal payment completed:', details);
                    showSuccess('Payment successful! Your order has been processed.');
                    
                    const orderData = {
                        orderID: details.id,
                        payerID: details.payer.payer_id,
                        email: details.payer.email_address,
                        name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                        amount: details.purchase_units[0].payments.captures[0].amount.value,
                        currency: details.purchase_units[0].payments.captures[0].amount.currency_code,
                        timestamp: new Date().toISOString(),
                        status: details.purchase_units[0].payments.captures[0].status
                    };
                    
                    localStorage.setItem('lastOrder', JSON.stringify(orderData));
                    
                    setTimeout(() => {
                        closeProductModal();
                    }, 2000);
                });
            },
            onError: function(err) {
                console.error('PayPal error:', err);
                showError('An error occurred during payment. Please try again.');
            }
        }).render('#paypal-button-container');

        // Venmo Button (if available)
        if (paypal.FUNDING.VENMO) {
            paypal.Buttons({
                fundingSource: paypal.FUNDING.VENMO,
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'venmo',
                    height: 50,
                    tagline: false
                },
                createOrder: function(data, actions) {
                    const total = basePrice + shippingCost;
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            reference_id: 'SALT_CELL_SHIELD_' + Date.now(),
                            description: 'Salt Cell Shield - Professional Salt Cell Protection',
                            amount: {
                                currency_code: 'USD',
                                value: total.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: basePrice.toFixed(2)
                                    },
                                    shipping: {
                                        currency_code: 'USD',
                                        value: shippingCost.toFixed(2)
                                    }
                                }
                            },
                            items: [{
                                name: 'Salt Cell Shield',
                                description: 'Professional-grade salt cell shield that protects salt cells from scale buildup and temperature damage.',
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: basePrice.toFixed(2)
                                },
                                quantity: '1',
                                category: 'PHYSICAL_GOODS',
                                sku: 'SCS-001'
                            }]
                        }],
                        application_context: {
                            brand_name: 'Shield Bearer 3D',
                            shipping_preference: 'GET_FROM_FILE'
                        }
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                        console.log('Venmo payment completed:', details);
                        showSuccess('Payment successful! Your order has been processed.');
                        
                        const orderData = {
                            orderID: details.id,
                            payerID: details.payer.payer_id,
                            email: details.payer.email_address,
                            name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                            amount: details.purchase_units[0].payments.captures[0].amount.value,
                            currency: details.purchase_units[0].payments.captures[0].amount.currency_code,
                            timestamp: new Date().toISOString(),
                            status: details.purchase_units[0].payments.captures[0].status
                        };
                        
                        localStorage.setItem('lastOrder', JSON.stringify(orderData));
                        
                        setTimeout(() => {
                            closeProductModal();
                        }, 2000);
            });
        },
        onError: function(err) {
                    console.error('Venmo error:', err);
                    showError('An error occurred during payment. Please try again.');
                }
            }).render('#paypal-button-container');
        }

        // Card Button (Guest Checkout - the one you want!)
        if (paypal.FUNDING.CARD) {
            paypal.Buttons({
                fundingSource: paypal.FUNDING.CARD,
                style: {
                    layout: 'vertical',
                    color: 'black',
                    shape: 'rect',
                    label: 'pay',
                    height: 50,
                    tagline: false
                },
                createOrder: function(data, actions) {
                    const total = basePrice + shippingCost;
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            reference_id: 'SALT_CELL_SHIELD_' + Date.now(),
                            description: 'Salt Cell Shield - Professional Salt Cell Protection',
                            amount: {
                                currency_code: 'USD',
                                value: total.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: basePrice.toFixed(2)
                                    },
                                    shipping: {
                                        currency_code: 'USD',
                                        value: shippingCost.toFixed(2)
                                    }
                                }
                            },
                            items: [{
                                name: 'Salt Cell Shield',
                                description: 'Professional-grade salt cell shield that protects salt cells from scale buildup and temperature damage.',
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: basePrice.toFixed(2)
                                },
                                quantity: '1',
                                category: 'PHYSICAL_GOODS',
                                sku: 'SCS-001'
                            }]
                        }],
                        application_context: {
                            brand_name: 'Shield Bearer 3D',
                            shipping_preference: 'GET_FROM_FILE'
                        }
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        console.log('Card payment completed:', details);
                        showSuccess('Payment successful! Your order has been processed.');
                        
                        const orderData = {
                            orderID: details.id,
                            payerID: details.payer.payer_id,
                            email: details.payer.email_address,
                            name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                            amount: details.purchase_units[0].payments.captures[0].amount.value,
                            currency: details.purchase_units[0].payments.captures[0].amount.currency_code,
                            timestamp: new Date().toISOString(),
                            status: details.purchase_units[0].payments.captures[0].status
                        };
                        
                        localStorage.setItem('lastOrder', JSON.stringify(orderData));
                        
                        setTimeout(() => {
                            closeProductModal();
                        }, 2000);
                    });
                },
                onError: function(err) {
                    console.error('Card payment error:', err);
                    showError('An error occurred during payment. Please try again.');
        }
    }).render('#paypal-button-container');
        }
    }
}


// Close PayPal Modal
function closePayPalModal() {
    const paypalModal = document.getElementById('paypal-modal');
    if (paypalModal) {
        paypalModal.style.display = 'none';
    }
}

// Add click outside to close modal
document.addEventListener('click', function(e) {
    const paypalModal = document.getElementById('paypal-modal');
    
    if (paypalModal && paypalModal.style.display === 'flex' && e.target === paypalModal) {
        closePayPalModal();
    }
});

// Form validation
function validateZipCode(zipCode) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode);
}

// Add event listener for ZIP code input
document.addEventListener('DOMContentLoaded', function() {
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

// Download Installation Guide Function
function downloadInstallationGuide() {
    const guideUrl = 'Cell_Shield_Installation_Guide.pdf';
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = guideUrl;
    link.download = 'Cell_Shield_Installation_Guide.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Installation guide download started!');
}

// Open Performance Report Function
function openPerformanceReport() {
    // URLs for both performance report PDFs
    const reportUrl1 = 'Salt Cell Shield Performance Analysis.pdf';
    const reportUrl2 = 'Salt_Cell_Shield_Performance_Report.pdf';
    
    // Create HTML content with both PDFs embedded
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cell Shield Performance Reports</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background: #f8fafc;
                    font-family: 'Inter', sans-serif;
                }
                .report-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 25px rgba(30, 58, 138, 0.1);
                    overflow: hidden;
                }
                .report-header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                    color: white;
                    padding: 2rem;
                    text-align: center;
                }
                .report-header h1 {
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 700;
                }
                .report-header p {
                    margin: 0.5rem 0 0 0;
                    opacity: 0.9;
                }
                .pdf-container {
                    width: 100%;
                    height: 80vh;
                    border: none;
                    display: block;
                }
                .pdf-section {
                    margin-bottom: 2rem;
                }
                .pdf-section:last-child {
                    margin-bottom: 0;
                }
                .pdf-title {
                    padding: 1rem 2rem;
                    background: #f8fafc;
                    border-bottom: 2px solid #e5e7eb;
                    color: #1e3a8a;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                    .report-header {
                        padding: 1.5rem;
                    }
                    .report-header h1 {
                        font-size: 1.5rem;
                    }
                    .pdf-title {
                        padding: 0.75rem 1rem;
                        font-size: 1rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="report-header">
                    <h1>Cell Shield Performance Reports</h1>
                    <p>Comprehensive analysis and statistical modeling</p>
                </div>
                <div class="pdf-section">
                    <div class="pdf-title">Salt Cell Shield Performance Analysis</div>
                    <iframe src="${reportUrl1}" class="pdf-container"></iframe>
                </div>
                <div class="pdf-section">
                    <div class="pdf-title">Salt Cell Shield Performance Report</div>
                    <iframe src="${reportUrl2}" class="pdf-container"></iframe>
                </div>
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
        showSuccess('Both performance reports opened in new tab!');
    } else {
        // Fallback if popup is blocked
        alert('Please allow popups for this site to view the performance reports, or try again.');
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
    console.log('Shield Bearer 3D website loaded successfully');
    
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

// Savings Calculator
// Salt cell brand data - typical lifespans and replacement costs
const saltCellData = {
    hayward: { baseLifespan: 4, replacementCost: 900, name: 'Hayward' },
    pentair: { baseLifespan: 4.5, replacementCost: 950, name: 'Pentair' },
    jandy: { baseLifespan: 4, replacementCost: 850, name: 'Jandy' },
    circupool: { baseLifespan: 3.5, replacementCost: 700, name: 'CircuPool' },
    intellichlor: { baseLifespan: 4.5, replacementCost: 1000, name: 'IntelliChlor' },
    other: { baseLifespan: 4, replacementCost: 850, name: 'Other Brand' }
};

// Hard water regions by zip code ranges (simplified - using general US regions)
function getHardWaterLevel(zipCode) {
    const zip = parseInt(zipCode);
    if (isNaN(zip)) return 1; // Default moderate
    
    // Florida, Texas, Arizona, Nevada, California - Very hard water
    if ((zip >= 32000 && zip <= 34999) || // Florida
        (zip >= 75000 && zip <= 79999) || // Texas
        (zip >= 85000 && zip <= 86999) || // Arizona
        (zip >= 89000 && zip <= 89999) || // Nevada
        (zip >= 90000 && zip <= 96999)) { // California
        return 1.4; // Very hard - 40% faster degradation
    }
    
    // Southeast, Southwest - Hard water
    if ((zip >= 30000 && zip <= 31999) || // Georgia
        (zip >= 35000 && zip <= 36999) || // Alabama
        (zip >= 70000 && zip <= 74999) || // Louisiana
        (zip >= 29000 && zip <= 29999)) { // South Carolina
        return 1.25; // Hard - 25% faster degradation
    }
    
    // Midwest - Moderate to hard
    if ((zip >= 40000 && zip <= 49999) || // Kentucky, etc
        (zip >= 50000 && zip <= 59999) || // Iowa, etc
        (zip >= 60000 && zip <= 69999)) { // Illinois, etc
        return 1.15; // Moderate-hard - 15% faster degradation
    }
    
    // Default moderate
    return 1.1; // Moderate - 10% faster degradation
}

// Calculate extended life and savings
function calculateSavings(brand, zipCode, cellAge) {
    const cellInfo = saltCellData[brand];
    if (!cellInfo) return null;
    
    const hardWaterFactor = getHardWaterLevel(zipCode);
    const baseLifespan = cellInfo.baseLifespan;
    const replacementCost = cellInfo.replacementCost;
    
    // Calculate remaining life without Cell Shield
    // Degradation is faster in hard water areas
    const adjustedLifespan = baseLifespan / hardWaterFactor;
    const remainingLife = Math.max(0, adjustedLifespan - cellAge);
    
    // Cell Shield benefits based on field data:
    // - 10°F temperature reduction when pool not running
    // - Reduced scale formation (helps reduce calcium buildup)
    // - UV protection
    // Based on data: "Every 10°F increase reduces lifespan by 15-20%"
    // So 10°F reduction may extend life by approximately 15-20%
    // Combined with scale reduction benefits, estimate 20-30% life extension
    const shieldBenefit = 1.25; // 25% extension factor (conservative based on field data)
    
    // Calculate extended life with Cell Shield
    // Field studies suggest 1-2 years additional life in typical conditions
    // But this varies based on remaining cell life and conditions
    const maxAdditionalLife = 1.5; // Maximum additional years from field data
    const additionalLife = Math.min(remainingLife * 0.25, maxAdditionalLife); // 25% extension, capped at 1.5 years
    const extendedLife = remainingLife + additionalLife;
    
    // Calculate savings on current cell
    // Savings = cost of replacement delayed by the additional life
    // More realistic: savings based on time value of delaying replacement
    let firstCellSavings = 0;
    if (remainingLife < 0.5 && additionalLife > 0) {
        // Cell is at end of life - Shield extends it, delaying replacement
        // Savings = portion of replacement cost based on how long replacement is delayed
        const delayYears = Math.min(additionalLife, 1.5);
        firstCellSavings = replacementCost * (delayYears / adjustedLifespan) * 0.6; // 60% of proportional value
    } else if (remainingLife < 1 && additionalLife > 0) {
        // Cell is near end of life
        const delayYears = Math.min(additionalLife, 1.2);
        firstCellSavings = replacementCost * (delayYears / adjustedLifespan) * 0.5; // 50% of proportional value
    } else if (remainingLife < 2 && additionalLife > 0) {
        // Cell has 1-2 years left
        const delayYears = Math.min(additionalLife, 1.0);
        firstCellSavings = replacementCost * (delayYears / adjustedLifespan) * 0.4; // 40% of proportional value
    } else if (additionalLife > 0) {
        // Cell has more life - smaller savings
        const delayYears = Math.min(additionalLife, 0.8);
        firstCellSavings = replacementCost * (delayYears / adjustedLifespan) * 0.3; // 30% of proportional value
    }
    
    // Calculate savings per future replacement
    // With Cell Shield, each new cell may last 1-1.5 years longer
    // Savings = avoiding one replacement cycle over time
    const futureLifespan = (baseLifespan / hardWaterFactor) + 1.2; // Add ~1.2 years average extension
    const standardLifespan = baseLifespan / hardWaterFactor;
    
    // Savings per replacement = cost of one replacement avoided over the extended lifespan
    // If standard is 3 years and extended is 4.2 years, you save 1 replacement every ~12 years
    // More realistic: savings = portion of replacement cost based on frequency reduction
    const replacementFrequencyReduction = (futureLifespan - standardLifespan) / futureLifespan;
    const savingsPerReplacement = replacementCost * replacementFrequencyReduction * 0.5; // 50% of frequency reduction value
    
    // Calculate total savings over 10 years
    // Assume cells are replaced every standardLifespan years without shield
    const yearsToCalculate = 10;
    const replacementsWithoutShield = Math.ceil(yearsToCalculate / standardLifespan);
    const replacementsWithShield = Math.ceil(yearsToCalculate / futureLifespan);
    const replacementsAvoided = Math.max(0, replacementsWithoutShield - replacementsWithShield);
    const futureSavingsTotal = replacementsAvoided * replacementCost * 0.7; // 70% of avoided replacement cost
    
    const totalSavings = firstCellSavings + futureSavingsTotal;
    const shieldCost = 199;
    const netSavings = totalSavings - shieldCost;
    
    return {
        extendedLife: additionalLife.toFixed(1),
        totalLife: extendedLife.toFixed(1),
        firstCellSavings: firstCellSavings.toFixed(0),
        futureCellSavings: savingsPerReplacement.toFixed(0),
        futureSavingsTotal: futureSavingsTotal.toFixed(0),
        totalSavings: totalSavings.toFixed(0),
        netSavings: netSavings.toFixed(0),
        replacementCost: replacementCost,
        replacementsIn10Years: replacementsWithShield
    };
}

// Initialize calculator form
document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('savingsCalculatorForm');
    const resultsDiv = document.getElementById('calculatorResults');
    const savingsCalculator = document.querySelector('.savings-calculator');
    
    // Prevent calculator clicks from opening product modal
    if (savingsCalculator) {
        savingsCalculator.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Also prevent propagation on all interactive elements inside
        const calculatorElements = savingsCalculator.querySelectorAll('input, select, button, label');
        calculatorElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            element.addEventListener('focus', function(e) {
                e.stopPropagation();
            });
        });
    }
    
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const brand = document.getElementById('cellBrand').value;
            const zipCode = document.getElementById('zipCode').value;
            const cellAge = parseFloat(document.getElementById('cellAge').value);
            
            if (!brand || !zipCode || isNaN(cellAge)) {
                alert('Please fill in all fields correctly.');
                return;
            }
            
            const results = calculateSavings(brand, zipCode, cellAge);
            
            if (results) {
                document.getElementById('firstCellSavings').textContent = `$${results.firstCellSavings}`;
                document.getElementById('futureCellSavings').textContent = `$${results.futureCellSavings} per replacement`;
                document.getElementById('totalSavings').textContent = `$${results.totalSavings}`;
                
                // Update description with context
                const totalDesc = document.getElementById('totalSavingsDescription');
                if (results.replacementsIn10Years > 0) {
                    totalDesc.textContent = `Combined savings from your current cell and ${results.replacementsIn10Years} future replacement${results.replacementsIn10Years > 1 ? 's' : ''} over the next 10 years.`;
                } else {
                    totalDesc.textContent = `Combined savings from your current cell over the next 10 years.`;
                }
                
                resultsDiv.style.display = 'block';
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateShippingCost,
        updatePricing,
        validateZipCode,
        InstagramFeed,
        calculateSavings,
        getHardWaterLevel
    };
}
