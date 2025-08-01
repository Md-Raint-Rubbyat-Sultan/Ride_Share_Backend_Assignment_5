# 🚗 Ride-Sharing Backend API

A backend Node.js API for managing a ride-sharing platform, supporting features like user management, ride requests, driver assignment, and cost calculation.

🚀 Live Demo
🔗 **Live Link:** [https://ride-booking-backend-assignment-5.vercel.app/](https://ride-booking-backend-assignment-5.vercel.app/)

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **TypeScript**
- **Zod (Validation)**
- **Passport.js (Authentication)**
- **JWT (Token Handling)**
- **Nodemailer (Emailing)**
- **EJS (Email Templates)**

---

## ⚙️ Installation

````bash
git clone <your-repo-url>
cd <project-folder>
npm install

## 🔐 Environment Variables

Create a `.env` file in the root with the following structure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BCRYPT_SALT=10

EMAIL_SENDER.SMTP_HOST=smtp.gmail.com
EMAIL_SENDER.SMTP_PORT=465
EMAIL_SENDER.SMTP_USER=your_email@gmail.com
EMAIL_SENDER.SMTP_PASS=your_app_password```

##🚀 API Endpoints
##🧍 User Routes
- POST /api/v1/user/register – Register a new user

- POST /api/v1/user/login – Login user

- GET /api/v1/user/me – Get user profile

- PATCH /api/v1/user/update – Update profile

##🚘 Ride Routes
- POST /api/v1/ride/request – Create a ride request

- PATCH /api/v1/ride/accept/:id – Driver accepts the ride

- GET /api/v1/ride/active – Get active rides

- PATCH /api/v1/ride/complete/:id – Complete a ride

##🔐 Auth Routes
- POST /api/v1/auth/google/callback – Google OAuth login Callback

- POST /api/v1/auth/google – Google OAuth login

- POST /api/v1/auth/login – Google OAuth login

- POST /api/v1/auth/logout – Refresh JWT token

- POST /api/v1/auth/refresh – Refresh JWT token

- POST /api/v1/auth/set-password – Refresh JWT token

- POST /api/v1/auth/change-password – Refresh JWT token

````
