# 🛍️ Highkeytess — Full Stack E-Commerce Platform

> A production-ready MERN stack e-commerce platform with separate Buyer and Seller dashboards, Google OAuth, Razorpay payment integration, ImageKit image management, product variant management, and Helmet.js security hardening.

**Live Demo →** [snitch-indol.vercel.app](https://snitch-indol.vercel.app)

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [MongoDB Aggregation Pipeline](#-mongodb-aggregation-pipeline--cart-total)

---

## ✨ Features

### 👤 Authentication
- **Google OAuth 2.0** — Continue with Google (one-click signup/login)
- **JWT Authentication** — Secure HTTP-only cookie-based sessions
- **Role-based access** — Separate flows for Buyers and Sellers
- **Protected routes** — Unauthorized users redirected automatically

### 🛒 Buyer Dashboard
- Browse and search products by name, category, or keyword
- View product details with all available variants (size, colour, stock)
- Add to Cart with variant selection
- Real-time cart total calculated via MongoDB Aggregation Pipeline
- Checkout with **Razorpay payment gateway**
- Order history and status tracking

### 🏪 Seller Dashboard
- Add new products with images (uploaded via **ImageKit**)
- **Variant management** — Add multiple variants (size, colour, stock quantity) per product
- Edit existing product details and variants
- Product search within seller's own listings
- View all orders placed for seller's products

### 🔍 Product Search
- Dedicated search controller (`search.controller.js`) for fast, optimised queries
- Real-time product filtering by name and category

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Aggregation Pipeline) |
| **Auth** | JWT (HTTP-only cookies), Google OAuth 2.0 |
| **Payment** | Razorpay |
| **Image Storage** | ImageKit |
| **Security** | Helmet.js |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🔒 Security

Security was a core focus of this project. The backend is hardened using **Helmet.js**, which sets several critical HTTP security headers:

| Protection | Header Set by Helmet.js | What it Prevents |
|---|---|---|
| **XSS Protection** | `X-XSS-Protection` | Cross-Site Scripting attacks |
| **Content Security Policy** | `Content-Security-Policy` | Injection of malicious scripts |
| **Clickjacking** | `X-Frame-Options: DENY` | UI redress / iframe attacks |
| **MIME Sniffing** | `X-Content-Type-Options` | MIME-type confusion attacks |
| **Referrer Policy** | `Referrer-Policy` | Leaking sensitive URL info |
| **HSTS** | `Strict-Transport-Security` | Forces HTTPS connections |

Additional security measures:
- **JWT in HTTP-only cookies** — not accessible via JavaScript (XSS-safe)
- **bcryptjs** — passwords hashed with salt rounds
- **Google OAuth** — no password stored for OAuth users
- **Input validation** — dedicated `validator/` layer before controllers
- **CORS** — configured to allow only trusted origins

---

## 📁 Project Structure

```
highkeytess/
│
├── backend/
│   ├── src/
│   │   ├── config/                  # DB connection, env config
│   │   ├── controller/              # Route handler logic
│   │   │   ├── auth.controller.js
│   │   │   ├── buyer.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.controller.test.js
│   │   │   ├── product.controller.js
│   │   │   └── search.controller.js
│   │   ├── dao/                     # Data Access Object layer (DB queries)
│   │   ├── middleware/              # Auth & role middleware
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── buyer.route.js
│   │   │   ├── cart.route.js
│   │   │   ├── payment.route.js
│   │   │   └── product.route.js
│   │   ├── service/
│   │   │   ├── imagekit.service.js  # ImageKit image upload
│   │   │   └── Payment.service.js   # Razorpay integration
│   │   ├── utils/                   # Helper functions
│   │   ├── validator/               # Request validation schemas
│   │   └── app.js                   # Express app setup + Helmet.js
│   ├── server.js                    # Entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/                         # React components, pages, store
    ├── index.html
    ├── vercel.json
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (test keys)
- Google Cloud Console project (OAuth credentials)
- ImageKit account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/anandrajjee981-max/highkeytess.git
cd highkeytess

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

---

## 🔑 Environment Variables

### Backend `/backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Client
CLIENT_URL=http://localhost:5173
```

### Frontend `/frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📡 API Overview

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Initiate Google OAuth |
| `GET` | `/api/auth/google/callback` | OAuth callback |
| `POST` | `/api/auth/logout` | Logout & clear cookie |
| `GET` | `/api/auth/me` | Get current user |

### Product Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Get all products | Public |
| `GET` | `/api/products/:id` | Get product by ID | Public |
| `POST` | `/api/products` | Create product + variants | Seller |
| `PUT` | `/api/products/:id` | Edit product | Seller (own) |
| `DELETE` | `/api/products/:id` | Delete product | Seller (own) |

### Buyer Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/buyer/orders` | Get buyer's orders | Buyer |
| `GET` | `/api/buyer/profile` | Get buyer profile | Buyer |

### Cart Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart` | Get cart with aggregated total | Buyer |
| `POST` | `/api/cart/add` | Add item with variant | Buyer |
| `PUT` | `/api/cart/update` | Update quantity | Buyer |
| `DELETE` | `/api/cart/remove/:itemId` | Remove item | Buyer |

### Payment Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Create Razorpay order | Buyer |
| `POST` | `/api/payment/verify` | Verify payment signature | Buyer |

### Search Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/search?q=keyword` | Search products | Public |

---

## 🧠 MongoDB Aggregation Pipeline — Cart Total

The cart total is calculated server-side using MongoDB's Aggregation Pipeline:

```js
Cart.aggregate([
  { $match: { userId: new ObjectId(userId) } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" },
  {
    $project: {
      item: "$items",
      product: "$productDetails",
      lineTotal: {
        $multiply: ["$items.quantity", "$productDetails.price"]
      }
    }
  },
  {
    $group: {
      _id: "$_id",
      items: {
        $push: {
          item: "$item",
          product: "$product",
          lineTotal: "$lineTotal"
        }
      },
      cartTotal: { $sum: "$lineTotal" }
    }
  }
])
```

---

## 👨‍💻 Author

**Anand Raj** — Full Stack JavaScript Developer

- GitHub: [github.com/anandrajjee981-max](https://github.com/anandrajjee981-max)
- LinkedIn: [linkedin.com/in/anand-raj-059011387](https://linkedin.com/in/anand-raj-059011387)
- Portfolio: [portfolio2-three-sable.vercel.app](https://portfolio2-three-sable.vercel.app)

---

> ⭐ If you found this project helpful, give it a star on GitHub!