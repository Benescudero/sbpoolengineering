# SB Pool Engineering Website

A beautiful and modern website for SB Pool Engineering featuring a professional pool engineering device product page with integrated PayPal payments and shipping calculator.

## Features

- **Modern Design**: Clean, professional layout with responsive design
- **Product Gallery**: Interactive image gallery with 5 product images
- **PayPal Integration**: Secure payment processing with automatic fee calculation
- **Shipping Calculator**: Real-time shipping cost calculation from Orlando, FL
- **Mobile Responsive**: Optimized for all device sizes
- **Smooth Animations**: Professional animations and transitions

## Product Details

- **Product Price**: $199.00
- **PayPal Fee**: 3.49% (automatically calculated)
- **Shipping**: Calculated based on customer's ZIP code
- **Product Size**: Approximately football-sized
- **Weight**: ~2 pounds
- **Origin**: Orlando, Florida

## Setup Instructions

1. **Replace Placeholder Images**: 
   - Update the `productImages` array in `script.js` with your actual product image URLs
   - Replace the placeholder images in the `src` properties

2. **Configure PayPal**:
   - Sign up for a PayPal Developer account at https://developer.paypal.com/
   - Create a new application and get your Client ID
   - Replace `YOUR_PAYPAL_CLIENT_ID` in the HTML file with your actual Client ID

3. **Customize Content**:
   - Update company information in the HTML file
   - Modify contact details in the contact section
   - Adjust product description and specifications as needed

4. **Deploy**:
   - Upload all files to your web server
   - Ensure HTTPS is enabled for PayPal integration
   - Test the payment flow in PayPal's sandbox environment first

## File Structure

```
sbpoolengineering/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Key Features Implemented

### Product Modal
- Click on the product card to open detailed view
- Image gallery with thumbnails
- Product specifications
- Pricing breakdown with PayPal fees
- Shipping cost calculator

### PayPal Integration
- Automatic fee calculation (3.49%)
- Secure payment processing
- Order confirmation handling
- Error handling for failed payments

### Shipping Calculator
- ZIP code input validation
- Distance-based shipping calculation
- Real-time price updates
- Mock API implementation (replace with actual shipping service)

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Optimized layouts for all screen sizes
- Touch-friendly interface

## Customization

### Adding Your Product Images
1. Upload your 5 product images to your server
2. Update the `productImages` array in `script.js`:

```javascript
const productImages = [
    {
        src: 'path/to/your/image1.jpg',
        alt: 'Product Image 1 Description'
    },
    // ... add your other images
];
```

### Updating Company Information
- Modify the company name, contact details, and description in `index.html`
- Update the footer information
- Customize the hero section content

### Styling Customization
- Colors can be changed in the CSS variables
- Fonts can be updated by changing the Google Fonts import
- Layout adjustments can be made in the CSS grid and flexbox properties

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- Always use HTTPS in production
- Validate all user inputs
- Implement proper server-side order processing
- Use PayPal's webhook system for order verification

## Support

For technical support or customization requests, please contact the development team.

---

**Note**: This is a template website. Make sure to replace all placeholder content with your actual business information and product details before going live.
