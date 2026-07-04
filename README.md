# Ayra B. Store

A modern, full-stack e-commerce web application tailored for premium ladies' suits and formal wear. The platform features dynamic product management, a responsive cart, seamless WhatsApp checkout integration, real-time reviews, and a secure, integrated admin dashboard.

## 🌟 Key Features

- **Dynamic Catalog & Collections:** Browse products dynamically fetched from the database, grouped by collections.
- **WhatsApp Checkout:** A frictionless checkout experience that compiles cart items, calculates totals (including delivery and promo codes), and formats a complete order message directly in WhatsApp.
- **Integrated Admin Dashboard:** A secure panel (`/manage-hq-7x4p`) to manage products, categories, hero slider images, delivery charges, and community photos.
- **Promo Codes & Order Notes:** Customers can apply promo codes for discounts and add special instructions to their orders.
- **Review System:** Customers can leave ratings and reviews on products, which are displayed dynamically.
- **Community Showcase:** A dynamic "Join the Community" photo grid managed directly from the admin panel.
- **Fully Responsive Design:** Beautiful, premium UI that works flawlessly on desktop and mobile devices.

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Frontend:** HTML5, Vanilla JavaScript, CSS3 (No heavy frameworks for blazing fast performance)
- **Deployment:** Ready for deployment on Railway (or similar platforms)

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/ayra-b-store.git
cd "ayra-b-store"
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
ADMIN_DEFAULT_PASSWORD=ayra123
ADMIN_SLUG=manage-hq-7x4p
```

### 4. Run the Server
Start the development server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.


*Crafted for elegance and seamless shopping experiences.*
