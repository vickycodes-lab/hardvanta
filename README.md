# HardVanta

A modern full-stack e-commerce platform built with Next.js, Prisma, Supabase, NextAuth, Razorpay, and Tailwind CSS.

## Overview

HardVanta is a scalable online marketplace solution designed for modern businesses. The platform provides a complete shopping experience, including product management, secure authentication, payment processing, order tracking, and an administrative dashboard.

Built with a production-ready architecture, HardVanta combines a fast frontend experience with a robust backend infrastructure.

---

## Key Features

### Customer Features

* Modern responsive storefront
* Advanced product browsing and category navigation
* Product detail pages with image galleries
* Shopping cart and checkout flow
* Secure user authentication
* Email OTP verification
* Order placement and tracking
* PIN code validation during checkout
* Razorpay payment integration
* Order confirmation emails
* Mobile-friendly user experience

### Admin Features

* Admin dashboard
* Product CRUD operations
* Category management
* Create categories directly from product forms
* Order status management
* Product image upload support
* Local image fallback storage
* Inventory and catalog management

### UI & UX Enhancements

* Premium modern design system
* Robu.in-inspired category navigation
* Mega menu support
* Responsive layouts
* Enhanced product cards
* Improved authentication pages
* Dynamic category tiles
* Error and loading boundaries

---

## Technology Stack

### Frontend

* Next.js 15
* React
* Tailwind CSS
* JavaScript

### Backend

* Next.js API Routes
* Prisma ORM
* Supabase Database
* NextAuth Authentication

### Integrations

* Razorpay Payments
* Resend Email Service
* Supabase Storage

---

## Project Structure

```text
hardvanta/
├── prisma/              # Database schema and migrations
├── public/              # Static assets and uploads
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions
│   ├── services/        # Business logic
│   └── api/             # API routes
├── .env.example         # Environment variables template
├── GUIDE.md             # Project workflow documentation
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/vickycodes-lab/hardvanta.git
cd hardvanta
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in the required credentials:

* Supabase
* NextAuth
* Razorpay
* Resend Email Service
* Database URL

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Authentication

HardVanta supports:

* Email OTP Login
* Secure Session Management
* User Registration
* Protected Routes
* Role-Based Admin Access

---

## Payments

Integrated with Razorpay for secure online payments.

Supported Features:

* Online checkout
* Payment verification
* Order confirmation workflow

---

## Email Services

Powered by Resend:

* OTP verification emails
* Order confirmation emails
* Transaction notifications

---

## Order Management

* Order creation
* Status updates
* Tracking timeline
* Customer order history

---

## Deployment

### Recommended: Vercel

```bash
npm run build
npm start
```

Deploy directly to Vercel for optimal Next.js performance.

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---

## Roadmap

* Wishlist functionality
* Product reviews and ratings
* Multi-vendor support
* Coupon and discount engine
* Analytics dashboard
* Advanced inventory management

---

## License

This project is licensed under the MIT License.

---

## Author

**Vicky Mishra**

GitHub: https://github.com/vickycodes-lab

For feature requests, issues, or contributions, please open a GitHub Issue.
