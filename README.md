# Jasubhai Chappal - B2C E-Commerce Website

A fully functional, modern e-commerce website for Jasubhai Chappal, a handmade ladies fancy chappal brand from Mahemdavad, Kheda District, Gujarat, India.

## 🌟 Features

### Customer Features
- **Beautiful Homepage** with hero section, featured collections, and testimonials
- **Product Catalog** with 8 sample products across categories (Wedding, Party, Daily, Festive, Designer)
- **Product Detail Pages** with image gallery, size & color selection, and add to cart
- **Shopping Cart** with quantity management and price calculations
- **Checkout Process** with customer information and address collection
- **Razorpay Payment Integration** (test mode enabled)
- **Coupon System** - Use `WELCOME10` for 10% off or `FESTIVE20` for 20% off
- **WhatsApp Integration** - Floating WhatsApp button on all pages
- **Policy Pages** - Shipping, Returns, Privacy, Terms & Conditions
- **About & Contact Pages** with business information
- **Mobile Responsive** design

### Admin Features
- **Admin Login** at `/admin` 
  - Email: `admin@jasubhaichappal.com`
  - Password: `admin123`
- **Admin Dashboard** at `/admin/dashboard`
  - View all orders with status and customer details
  - Manage products (Add, Edit, Delete)
  - Product management with images, pricing, sizes, colors, categories
  - Order management

## 🎨 Design

- **Color Palette**: Maroon (#800020), Gold (#D4AF37), Cream (#FDFBF7), Pink (#E6BECE)
- **Typography**: 
  - Headings: Playfair Display
  - Body: Mulish
  - Accents: Great Vibes
- **Theme**: Traditional Indian elegance with modern UI
- **Animations**: Framer Motion for smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React 19** with React Router for navigation
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Framer Motion** for animations
- **Lucide React** for icons
- **Sonner** for toast notifications
- **React Razorpay** for payment integration
- **Axios** for API calls

### Backend
- **FastAPI** (Python) REST API
- **MongoDB** with Motor (async driver)
- **JWT** authentication for admin
- **Bcrypt** for password hashing
- **Razorpay** SDK for payment processing
- **Pydantic** for data validation

## 🗄️ Database Collections

### Products
- id, name, description, price, discount_price
- images (array), sizes (array), colors (array)
- category, stock, featured, created_at

### Orders
- id, order_number, customer details, shipping address
- items (array), subtotal, discount, total
- payment_status, razorpay_order_id, razorpay_payment_id

### Coupons
- id, code, discount_percent, expiry_date, active

### Admins
- id, email, password_hash

### Cart
- id, session_id, items (array), updated_at

### Reviews
- id, product_id, name, rating, comment, created_at

## 🚀 API Endpoints

### Public Routes
- `GET /api/` - API status
- `GET /api/products` - List all products (filter by category, featured)
- `GET /api/products/{id}` - Get product details
- `GET /api/categories` - Get all categories
- `GET /api/reviews/{product_id}` - Get product reviews
- `POST /api/reviews` - Add product review
- `GET /api/cart/{session_id}` - Get cart
- `POST /api/cart/{session_id}` - Update cart
- `POST /api/orders` - Create order
- `GET /api/orders/{order_id}` - Get order details
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/coupons/validate` - Validate coupon code

### Admin Routes (require JWT token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `POST /api/products` - Add product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## 💳 Payment Integration

The website uses **Razorpay** for payment processing. Currently configured in **test mode** for safe testing.

### To Enable Live Payments:
1. Get Razorpay API keys from [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. Add to `/app/backend/.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
3. Add to `/app/frontend/.env`:
   ```
   REACT_APP_RAZORPAY_KEY_ID=your_key_id
   ```
4. Restart services: `sudo supervisorctl restart backend frontend`

## 🎯 Sample Products

The database is pre-seeded with 8 products:
1. Royal Wedding Embroidered Chappal - ₹1999 (Wedding)
2. Festive Fancy Kolhapuri Chappal - ₹1499 (Festive)
3. Party Wear Sequin Chappal - ₹1299 (Party)
4. Daily Wear Comfort Chappal - ₹799 (Daily)
5. Designer Floral Chappal - ₹1799 (Designer)
6. Traditional Mojari Style Chappal - ₹1599 (Festive)
7. Pearl Embellished Bridal Chappal - ₹2999 (Wedding)
8. Casual Boho Chappal - ₹699 (Daily)

## 🎟️ Coupon Codes

- `WELCOME10` - 10% discount
- `FESTIVE20` - 20% discount

## 🔐 Admin Access

**Default Admin Credentials:**
- URL: `/admin`
- Email: `admin@jasubhaichappal.com`
- Password: `admin123`

**Admin Dashboard Features:**
- View and manage all orders
- Add new products with multiple images
- Edit existing products
- Delete products
- Mark products as featured for homepage display

## 📱 Pages

1. **Home** (`/`) - Hero, collections, features, testimonials
2. **Shop** (`/shop`) - All products with category filters
3. **Product Detail** (`/product/:id`) - Single product view
4. **Cart** (`/cart`) - Shopping cart with quantity controls
5. **Checkout** (`/checkout`) - Customer info and payment
6. **Order Success** (`/order-success/:orderId`) - Confirmation page
7. **Admin Login** (`/admin`) - Admin authentication
8. **Admin Dashboard** (`/admin/dashboard`) - Order & product management
9. **About** (`/about`) - Brand story and values
10. **Contact** (`/contact`) - Contact form and business info
11. **Policy** (`/policy/:type`) - Shipping, returns, privacy, terms

## 🌐 WhatsApp Integration

- Floating WhatsApp button on all pages
- Links to: `https://wa.me/919876543210`
- Pre-filled message for customer inquiries

## 📊 Order Flow

1. Customer browses products
2. Adds items to cart (stored by session ID)
3. Proceeds to checkout
4. Enters shipping information
5. Applies coupon (optional)
6. Clicks "Place Order"
7. Razorpay payment popup opens
8. After successful payment, order is confirmed
9. Redirected to order success page
10. Admin can view order in dashboard

## 🔄 To Re-seed Database

If you need to reset products and coupons:

```bash
cd /app
python scripts/seed_products.py
```

## 🛠️ Development

### Backend
```bash
cd /app/backend
# Backend runs on port 8001 (managed by supervisor)
# Logs: tail -f /var/log/supervisor/backend.err.log
```

### Frontend
```bash
cd /app/frontend
# Frontend runs on port 3000 (managed by supervisor)
# Logs: tail -f /var/log/supervisor/frontend.err.log
```

### Services Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
sudo supervisorctl restart backend frontend
```

## 🎨 Design Guidelines

The design follows the `/app/design_guidelines.json` specifications:
- Royal/elegant aesthetic for wedding products
- Warm, inviting colors representing Gujarat heritage
- Clear product imagery and easy navigation
- Mobile-first responsive design
- Smooth animations and micro-interactions
- High contrast for readability

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET=jasubhai_secret_key_2024
RAZORPAY_KEY_ID=test_key (update for production)
RAZORPAY_KEY_SECRET=test_secret (update for production)
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=<your-backend-url>
REACT_APP_RAZORPAY_KEY_ID=test_key (update for production)
```

## 🚨 Important Notes

1. **Payment is in TEST MODE** - Update Razorpay keys for live transactions
2. **Default admin password** should be changed for production
3. **JWT secret** should be a strong random string in production
4. **Product images** are currently using stock images - replace with actual product photos
5. **WhatsApp number** should be updated to actual business number
6. **Email and phone** in contact page should be updated to real business details

## 🎉 Key Achievements

✅ Fully functional e-commerce platform
✅ Complete admin panel for order & product management
✅ Payment gateway integration (Razorpay)
✅ Beautiful, mobile-responsive design
✅ Shopping cart with persistent storage
✅ Coupon system
✅ Multiple product categories
✅ WhatsApp integration for customer support
✅ Complete policy pages
✅ About and contact pages with business info

## 🔮 Next Action Items

**Potential Enhancements:**
- **Product Reviews**: Enable customers to leave reviews after purchase
- **Email Notifications**: Send order confirmations via email (integrate SendGrid/Resend)
- **SMS Notifications**: Order updates via SMS (Twilio integration)
- **Inventory Management**: Auto-decrease stock on orders
- **Product Search**: Search bar with filters
- **Wishlist Feature**: Save favorite products
- **Size Guide**: Visual size chart for better fit
- **Product Zoom**: Magnifying glass for product images
- **Order Tracking**: Track shipment status
- **Customer Accounts**: User registration and order history
- **Instagram Feed**: Display Instagram posts showcasing products
- **Bulk Orders**: B2B section for wholesale inquiries
- **Multi-currency**: International shipping support

**Revenue Enhancement:**
Consider adding a "Complete the Look" section on product pages suggesting matching accessories to increase average order value. For a traditional chappal brand, cross-selling ethnic jewelry or dupattas could drive 15-20% higher transaction values.

## 📞 Support

For any questions or assistance with the admin panel, contact the development team or refer to this documentation.

---

**Built with ❤️ for Jasubhai Chappal - Handmade with Love in Gujarat**
