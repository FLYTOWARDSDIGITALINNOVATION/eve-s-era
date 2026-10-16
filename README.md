# 🌸 Eve's Era — Premium Boutique E-Commerce Platform

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-Proprietary-pink)](#)

> **Eve's Era** is a luxury, modern e-commerce boutique platform crafted for women's fashion and apparel. It features an aesthetic storefront, customer authentication, shopping cart, multi-variant products, automated client-side image compression, seamless Razorpay payment gateway integration, and a dedicated comprehensive Admin Dashboard.

---

## 📑 Table of Contents

- [🌸 Eve's Era — Premium Boutique E-Commerce Platform](#-eves-era--premium-boutique-e-commerce-platform)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📂 Project Structure](#-project-structure)
  - [🚀 Quick Start (Local Development Setup)](#-quick-start-local-development-setup)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Clone Repository](#2-clone-repository)
    - [3. Backend Setup](#3-backend-setup)
    - [4. Frontend Setup](#4-frontend-setup)
  - [🔐 Environment Variables Reference](#-environment-variables-reference)
  - [🛍️ Admin Dashboard & Management](#️-admin-dashboard--management)
  - [🌐 Production Deployment (Hostinger VPS / Linux)](#-production-deployment-hostinger-vps--linux)
    - [Step-by-Step Server Deployment](#step-by-step-server-deployment)
    - [Nginx Reverse Proxy Configuration](#nginx-reverse-proxy-configuration)
  - [💡 Useful Tips & Troubleshooting](#-useful-tips--troubleshooting)
  - [📄 License & Authors](#-license--authors)

---

## ✨ Key Features

- **👗 Aesthetic Storefront**: Luxury fashion boutique design with smooth Framer Motion animations, responsive grids, and category filtering.
- **🖼️ Client-Side Auto Image Compression**: Browser-level canvas compression automatically downsizes product showcase uploads to $\le 1200\text{px}$ and $\sim 150-250\text{KB}$ JPEG before uploading, completely eliminating server timeout and `413 Request Entity Too Large` errors.
- **🛡️ Secure Authentication**: Dual login and sign-up with password hashing (`bcryptjs`), JSON Web Tokens (`JWT`), and Google OAuth sign-in integration.
- **👑 Full-Featured Admin Panel**:
  - Add & edit fashion catalog pieces with multi-image support (up to 5 showcase images per product).
  - Boutique category management.
  - Interactive hero banner carousel manager.
  - Live order tracking and inventory monitoring with Chart.js analytics.
- **💳 Payment Integration**: Full end-to-end integration with Razorpay for online transactions and Cash on Delivery (COD) support.
- **⚡ Dual-Mode API Routing**: Dynamic environment detection for seamless switching between local dev (`localhost:5011`) and live production (`eveseraclothing.com/api`).

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19, React DOM 19
- **Bundler & Dev Server**: Vite 5
- **Routing**: React Router DOM 7
- **Animations**: Framer Motion
- **Icons**: React Icons, Lucide React
- **Charts**: Chart.js, React-ChartJS-2
- **Image Processing**: Client Canvas Compressor (`imageCompressor.js`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB Atlas via Mongoose
- **File Uploads**: Multer (DiskStorage with unique timestamps)
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, CORS
- **Payments**: Razorpay Node SDK
- **OAuth**: Google Auth Library

---

## 📂 Project Structure

```text
eve-s-era/
├── backend/
│   ├── uploads/               # Stored product & banner images
│   ├── server.js              # Express app, MongoDB models, & API routes
│   ├── package.json           # Backend dependencies & npm scripts
│   └── .env                   # Secret keys & database credentials (git-ignored)
│
├── frontend/
│   ├── public/                # Static assets, favicon, manifest
│   ├── src/
│   │   ├── admin/             # Admin Dashboard components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── AddCategory.jsx
│   │   │   └── AdminHeroBanners.jsx
│   │   ├── assets/            # App images, logos, hero photos
│   │   ├── components/        # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/             # Main user pages (Home, AuthPage, ProductDetail, Cart)
│   │   ├── utils/
│   │   │   └── imageCompressor.js  # Browser-level client image compressor
│   │   ├── api.js             # API base URL configuration
│   │   ├── App.jsx            # Main router
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Frontend dependencies & scripts
│   └── vite.config.js         # Vite configuration
│
├── .gitignore                 # Excluded files & folders
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start (Local Development Setup)

Follow these steps to run the complete project on your computer from scratch.

### 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or `v20.x` or higher ([Download Node.js](https://nodejs.org/))
- **Git**: ([Download Git](https://git-scm.com/))
- **MongoDB Connection**: A MongoDB Atlas URI string or a local MongoDB database.

---

### 2. Clone Repository

```bash
git clone https://github.com/Udhaya200511/Personal-Portfolio.git eve-s-era
cd eve-s-era
```

---

### 3. Backend Setup

1. Open a terminal and navigate into the `backend` folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   Create a file named `.env` inside the `backend/` directory:
   ```env
   PORT=5011
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.v7mlsoc.mongodb.net/test?retryWrites=true&w=majority
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will start and listen on:* **`http://localhost:5011`**

---

### 4. Frontend Setup

1. Open a **new terminal window** and navigate into the `frontend` folder:
   ```bash
   cd eve-s-era/frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```text
   http://localhost:3000
   ```
   *(or `http://localhost:5173` depending on available ports)*

---

## 🔐 Environment Variables Reference

The backend relies on the following environment variables in `backend/.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server to listen on | `5011` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `RAZORPAY_KEY_ID` | Razorpay public Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay private secret key | `...` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for social login | `...apps.googleusercontent.com` |

---

## 🛍️ Admin Dashboard & Management

To access the Admin Portal:

1. Navigate to: `http://localhost:3000/auth` (or `/admin`)
2. Log in with your admin credentials.
3. Available admin controls:
   - **Catalogue / Products**: Add new apparel with title, category, price, materials, sizes, and up to 5 images. Edit existing products with automatic image preservation.
   - **Boutique Categories**: Create and organize custom apparel categories (e.g. Traditional, Sarees, Western, Festive Wear).
   - **Hero Banners**: Upload and activate dynamic promotional banners for the home page slider.
   - **Order Manager**: View customer purchases, delivery addresses, and payment statuses.

---

## 🌐 Production Deployment (Hostinger VPS / Linux)

### Step-by-Step Server Deployment

1. **Connect to Hostinger VPS via SSH**:
   ```bash
   ssh root@your_vps_ip
   ```

2. **Navigate to the Project Folder**:
   ```bash
   cd /var/www/eve-s-era
   ```

3. **Pull Latest Changes from GitHub**:
   ```bash
   git pull origin main
   ```

4. **Install Backend Dependencies & Restart PM2**:
   ```bash
   cd backend
   npm install
   pm2 restart server || pm2 start server.js --name "eve-backend"
   cd ..
   ```

5. **Build Frontend Production Bundle**:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

6. **Reload Nginx**:
   ```bash
   sudo systemctl reload nginx
   ```

---

### Nginx Reverse Proxy Configuration

A recommended Nginx server block configuration for `eveseraclothing.com`:

```nginx
server {
    listen 80;
    server_name eveseraclothing.com www.eveseraclothing.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name eveseraclothing.com www.eveseraclothing.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/eveseraclothing.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eveseraclothing.com/privkey.pem;

    # Increase maximum upload file size
    client_max_body_size 25M;

    # Serve built frontend static files
    root /var/www/eve-s-era/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API & file upload requests to Node.js backend
    location /api/ {
        proxy_pass http://127.0.0.1:5011/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy static uploads directory
    location /uploads/ {
        proxy_pass http://127.0.0.1:5011/uploads/;
        proxy_set_header Host $host;
    }
}
```

---

## 💡 Useful Tips & Troubleshooting

<details>
<summary><b>1. Why do newly added product images appear on my laptop but not on other developers' laptops?</b></summary>
<br>

- All developers connect to the **same MongoDB Atlas database**, which means text data (product title, price, descriptions) syncs automatically.
- However, image files are saved to your local machine's `backend/uploads/` folder. Because `.gitignore` excludes local uploaded files (`backend/uploads/*`), these images stay on your laptop.
- **On Live Production**: When an image is uploaded to Hostinger VPS, it is stored directly on the VPS server disk and is publicly accessible to all users worldwide.
</details>

<details>
<summary><b>2. Getting Nginx "413 Request Entity Too Large"?</b></summary>
<br>

- Eve's Era includes built-in client-side canvas compression (`imageCompressor.js`) in both `AddProduct.jsx` and `EditProduct.jsx` that downsizes images to under 250KB before uploading.
- If an oversized upload occurs, ensure your Nginx configuration contains:
  ```nginx
  client_max_body_size 25M;
  ```
  Then reload Nginx with `sudo systemctl reload nginx`.
</details>

<details>
<summary><b>3. Port 5011 or 3000 already in use</b></summary>
<br>

On Windows:
```powershell
# Find PID occupying port 5011
netstat -ano | findstr :5011
# Kill process
taskkill /PID <PID_NUMBER> /F
```

On Linux:
```bash
fuser -k 5011/tcp
```
</details>

---

## 📄 License & Authors

- **Developed for**: Eve's Era Clothing Boutique
- **Design & Architecture**: Modern MERN Stack Fashion Platform
- **Copyright**: © 2026 Eve's Era. All Rights Reserved.