# Lifting Social - Pre-Order Website

A high-conversion pre-order website for Lifting Social's limited-edition T-shirt drop.

## 🚀 Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (Custom dark theme)
- **Firebase Firestore** (Order storage)
- **PayHere** (Sri Lanka payment gateway)
- **Vercel** (Deployment)

## 📦 Features

- ✅ Premium dark theme with athletic brand feel
- ✅ Mobile-first responsive design
- ✅ Pre-order form with size selection
- ✅ PayHere payment integration with IPN
- ✅ Order management admin dashboard
- ✅ CSV export functionality
- ✅ Success/Cancel payment pages
- ✅ Real-time order tracking

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Create a Firestore database
3. Copy your Firebase config

### 3. Configure PayHere

1. Sign up at [PayHere.lk](https://www.payhere.lk)
2. Get your Merchant ID and Merchant Secret
3. Use sandbox mode for testing

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# PayHere Configuration
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
NEXT_PUBLIC_PAYHERE_MODE=sandbox

# Admin
ADMIN_PASSWORD=your_secure_password

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCT_PRICE=2500
NEXT_PUBLIC_PREORDER_CLOSES=2026-01-31
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/
│   │   ├── orders/         # Order CRUD endpoints
│   │   └── payment/        # PayHere integration
│   ├── success/            # Payment success page
│   ├── cancel/             # Payment cancel page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section
│   ├── Product.tsx         # Product showcase
│   ├── Details.tsx         # Product details & size chart
│   ├── OrderForm.tsx       # Pre-order form
│   └── Footer.tsx          # Footer
├── lib/
│   └── firebase.ts         # Firebase config
├── types/
│   └── order.ts            # TypeScript types
└── public/
    └── images/             # Product images
```

## 🎨 Design Guidelines

### Colors
- Background: `#0a0a0a` (brand-black)
- Secondary: `#1a1a1a` (brand-charcoal)
- Text: `#ffffff` (white)
- Accents: Grayscale palette

### Typography
- Headings: Bold, uppercase, tracking-wide
- Body: Clean, readable
- Monospace: Used for labels and data

### Components
- Minimal borders
- Subtle hover effects
- Mobile-first responsive
- High contrast for readability

## 🔒 Admin Access

Access the admin dashboard at `/admin`

Default password can be set in `.env.local` as `ADMIN_PASSWORD`.

**Features:**
- View all orders
- Filter by payment status
- Export to CSV
- Real-time statistics

## 💳 Payment Flow

1. User fills pre-order form
2. Order created with `PENDING_PAYMENT` status
3. User redirected to PayHere payment gateway
4. PayHere sends IPN notification to `/api/payment/payhere/notify`
5. Order status updated to `PAID` or `CANCELLED`
6. User redirected to success or cancel page

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
```

### Important: PayHere IPN Setup

After deployment, configure PayHere IPN URL:
```
https://your-domain.com/api/payment/payhere/notify
```

## 📝 Adding Product Images

Replace placeholder images in components:

1. Add images to `/public/images/`
2. Update image references in [Product.tsx](components/Product.tsx)

Example:
```tsx
<Image 
  src="/images/tshirt-front.jpg" 
  alt="T-shirt front view"
  width={500}
  height={500}
/>
```

## 🔧 Customization

### Change Product Price

Update in `.env.local`:
```env
NEXT_PUBLIC_PRODUCT_PRICE=2500
```

### Change Pre-Order Deadline

Update in `.env.local`:
```env
NEXT_PUBLIC_PREORDER_CLOSES=2026-01-31
```

### Modify Sizes

Edit sizes array in [OrderForm.tsx](components/OrderForm.tsx):
```tsx
const sizes: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
```

## 📊 Firebase Firestore Structure

### Collection: `orders`

```json
{
  "name": "John Doe",
  "phone": "+94771234567",
  "size": "L",
  "quantity": 2,
  "amount": 5000,
  "paymentMethod": "PAYHERE",
  "paymentStatus": "PAID",
  "paymentId": "320012345",
  "createdAt": "2026-01-04T10:30:00Z",
  "updatedAt": "2026-01-04T10:35:00Z"
}
```

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase config in `.env.local`
- Check Firestore security rules
- Ensure billing is enabled

### PayHere Integration Issues
- Use sandbox mode for testing
- Verify merchant credentials
- Check IPN URL configuration
- Review PayHere logs

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## 📄 License

This is a proprietary project for Lifting Social.

## 🤝 Support

For questions or issues, contact: support@liftingsocial.com
# Product-pre-order
