# 🎯 BidBazaar - Online Auction Platform

![BidBazaar](https://img.shields.io/badge/BidBazaar-Auction%20Platform-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, full-stack online auction platform built with React and Node.js. BidBazaar enables users to create auctions, place bids in real-time, and manage their auction activities with a secure payment system integrated.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

---

## ✨ Features

### 🎨 Auction Management
- **Create Auctions** - Auctioneers can list items with images, descriptions, starting bids, and time limits
- **Real-time Bidding** - Live bid updates with automatic highest bidder tracking
- **Auction Categories** - Organize auctions by categories (Electronics, Furniture, Art, etc.)
- **Auction Status** - Track ongoing, ended, and won auctions
- **Republish Items** - Relist unsold items without additional cost
- **Auction Analytics** - View bid history, bidder statistics, and auction performance

### 💰 Bidding System
- **Place Bids** - Competitive bidding with automatic validation
- **Update Bids** - Modify your bid before auction ends
- **Bid Tracking** - Monitor all your active bids in one dashboard
- **Win Notifications** - Email notifications when you win an auction
- **Payment Integration** - Secure payment processing via Stripe
- **Bid History** - Complete transaction history with timestamps

### 🔐 Authentication & Security
- **Dual Role System** - Separate experiences for Bidders and Auctioneers
- **JWT Authentication** - Secure token-based authentication
- **Email Verification** - Account verification via SMTP
- **Password Reset** - Secure password recovery system
- **Session Management** - Automatic session handling with cookies
- **Role-based Access** - Protected routes based on user roles

### 👤 User Profiles
- **Custom Profiles** - Personalized user profiles with avatars
- **Profile Images** - Upload and manage profile pictures via Cloudinary
- **Activity Dashboard** - Track auctions, bids, and transactions
- **Payment Methods** - Store multiple payment options (Bank, Easypaisa, PayPal)
- **Statistics** - View money spent, auctions won, and success rates
- **Account Settings** - Manage personal information and preferences

### 📊 Advanced Features
- **Commission System** - 5% platform commission on successful sales
- **Payment Proof** - Upload and verify payment screenshots
- **Leaderboard** - Competitive ranking system for top bidders
- **Search & Filter** - Find auctions by category, status, or price
- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Mode** - Theme switching support (coming soon)
- **Email Notifications** - Automated emails for important events
- **Transaction History** - Complete audit trail of all activities

### 📧 Communication
- **Winner Notifications** - Automatic emails to auction winners with payment details
- **Commission Reminders** - Alerts for unpaid commissions
- **Contact Form** - EmailJS integration for user support
- **Status Updates** - Real-time notifications for bid updates and auction status changes

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first styling
- **React Toastify** - Toast notifications
- **Lucide React** - Beautiful icon library
- **React DatePicker** - Date and time selection
- **EmailJS** - Client-side email service
- **Stripe React** - Payment processing UI

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Express Fileupload** - File upload handling
- **Cookie Parser** - Cookie parsing middleware
- **CORS** - Cross-origin resource sharing

### Cloud Services
- **Cloudinary** - Image storage and optimization
- **MongoDB Atlas** - Cloud database hosting (optional)
- **Stripe** - Payment processing
- **Gmail SMTP** - Email delivery service

### DevOps & Tooling
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **Nodemon** - Auto-restart development server
- **Git** - Version control

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 7.0.0
- npm or yarn
- Git
- Gmail account (for SMTP)
- Stripe account
- Cloudinary account

### Step 1: Clone the Repository
```bash
git clone https://github.com/Enayat-Ur-Rehman/BidBazaar.git
cd BidBazaar
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create `config/config.env` file:

```bash
mkdir config
touch config/config.env
```

Add the following environment variables:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/bidbazaar

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_EXPIRE=1d
COOKIE_EXPIRE=5

# Cloudinary Configuration (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Stripe Configuration (Payment Processing)
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

#### Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Compass/Atlas
```

#### Start Backend Server
```bash
npm run dev
# Or
npm start
```

Server will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create `.env` file in frontend root:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

#### Start Frontend Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔑 Getting API Keys

### 1. Cloudinary (Image Storage)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `config/config.env`

### 2. Gmail SMTP (Email Service)
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account > Security > App Passwords
3. Generate app-specific password
4. Use this password in `SMTP_PASSWORD`

### 3. Stripe (Payment Processing)
1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers > API Keys
3. Copy Publishable Key (pk_test_...) and Secret Key (sk_test_...)
4. Add both keys to respective config files

### 4. MongoDB (Database)
**Option A: Local MongoDB**
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Windows
# Download from mongodb.com
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Replace `MONGO_URI` in config

---

## 🚀 Usage

### For Users

#### As a Bidder
1. **Sign Up**
   - Navigate to `/sign-up`
   - Select "Bidder" role
   - Fill in details (name, email, password, phone, address)
   - Upload profile image
   - Verify email

2. **Browse Auctions**
   - Visit `/auctions` to see all active auctions
   - Filter by category or search
   - Click on auction to view details

3. **Place Bids**
   - Click "Place Bid" on auction page
   - Enter bid amount (must be higher than current bid)
   - Confirm bid
   - Track your bids in `/bidder/myBids`

4. **Win Auction**
   - Receive email notification with payment details
   - Pay via Bank Transfer, Easypaisa, or PayPal
   - Coordinate with Auctioneer for delivery

5. **Track Activity**
   - View all bids: `/bidder/myBids`
   - Check won items: `/bidder/won-items`
   - View profile stats: `/me`

#### As an Auctioneer
1. **Sign Up**
   - Navigate to `/sign-up`
   - Select "Auctioneer" role
   - Add payment methods (Bank, Easypaisa, PayPal)
   - Verify email

2. **Create Auction**
   - Go to `/create-auction`
   - Upload item image
   - Add title, description, category
   - Set starting bid and auction duration
   - Submit to blockchain (metaphorically - saves to DB)

3. **Manage Auctions**
   - View all auctions: `/view-my-auctions`
   - Monitor bids in real-time
   - Delete or republish auctions
   - Track commission status

4. **Handle Sales**
   - Receive payment from winner
   - Pay 5% commission to platform
   - Upload payment proof at `/submit-commission`
   - Wait for admin approval

5. **Commission Management**
   - Track unpaid commission in dashboard
   - Cannot create new auctions with unpaid commission
   - Upload payment screenshot
   - Get verified by admin

### For Administrators
1. **Monitor Platform**
   - Access admin dashboard
   - View all users and auctions
   - Approve/reject commission payments
   - Monitor leaderboard and statistics

2. **Commission Verification**
   - Review payment proofs
   - Approve legitimate payments
   - Update auctioneer commission status
   - Send legal notices if needed

---

## 📁 Project Structure

```
BidBazaar/
├── frontend/
│   ├── public/
│   │   └── assets/           # Static images
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── layout/       # Layout components (Header, Footer, Sidebar)
│   │   │   └── custom/       # Custom components (Card, Spinner, etc.)
│   │   ├── contexts/         # React Context providers
│   │   ├── custom-components/ # Custom UI components
│   │   ├── layout/           # Layout files
│   │   ├── pages/            # Page components
│   │   │   ├── Bidder/       # Bidder-specific pages
│   │   │   ├── Dashboard/    # Dashboard pages
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── SignUp.jsx    # Registration page
│   │   │   ├── Auctions.jsx  # Auction listing
│   │   │   ├── AuctionItem.jsx # Auction details
│   │   │   ├── CreateAuction.jsx # Create auction
│   │   │   ├── ViewMyAuctions.jsx # Auctioneer auctions
│   │   │   ├── Leaderboard.jsx # Top bidders
│   │   │   ├── Contact.jsx   # Contact form
│   │   │   ├── About.jsx     # About page
│   │   │   └── HowItWorks.jsx # How it works
│   │   ├── store/            # Redux store
│   │   │   ├── slices/       # Redux slices
│   │   │   └── store.js      # Store configuration
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── config/
│   │   ├── config.env        # Environment variables
│   │   └── database.js       # MongoDB connection
│   ├── controllers/          # Request handlers
│   │   ├── userController.js
│   │   ├── auctionController.js
│   │   ├── bidController.js
│   │   ├── commissionController.js
│   │   └── superAdminController.js
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.js           # Authentication
│   │   ├── error.js          # Error handling
│   │   ├── catchAsyncErrors.js
│   │   └── trackCommissionStatus.js
│   ├── models/               # Mongoose schemas
│   │   ├── userSchema.js
│   │   ├── auctionSchema.js
│   │   ├── bidSchema.js
│   │   └── commissionSchema.js
│   ├── routes/               # API routes
│   │   ├── userRoutes.js
│   │   ├── auctionRoutes.js
│   │   ├── bidRoutes.js
│   │   ├── commissionRoutes.js
│   │   └── superAdminRoutes.js
│   ├── utils/                # Utility functions
│   │   ├── jwtToken.js
│   │   └── sendEmail.js
│   ├── app.js                # Express app
│   └── server.js             # Server entry point
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /user/register
Content-Type: multipart/form-data

Body:
{
  "userName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St",
  "role": "Bidder" | "Auctioneer",
  "profileImage": <file>,
  
  // For Auctioneers only:
  "bankAccountName": "John Doe",
  "bankAccountNumber": "IBAN123456",
  "bankName": "Bank Name",
  "easypaisaAccountNumber": "03001234567",
  "paypalEmail": "john@paypal.com"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "user": { ... }
}
```

#### Login
```http
POST /user/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /user/me
Authorization: Bearer <token>

Response: {
  "success": true,
  "user": { ... }
}
```

#### Logout
```http
GET /user/logout

Response: {
  "success": true,
  "message": "Logged out successfully"
}
```

### Auction Endpoints

#### Get All Auctions
```http
GET /auctionitem/allitems

Response: {
  "success": true,
  "items": [
    {
      "_id": "...",
      "title": "Item Name",
      "description": "...",
      "startingBid": 1000,
      "currentBid": 1500,
      "image": { ... },
      "category": "Electronics",
      "condition": "New",
      "startTime": "2024-01-01T00:00:00Z",
      "endTime": "2024-01-10T00:00:00Z",
      "bids": [...],
      "createdBy": "..."
    }
  ]
}
```

#### Get Auction Details
```http
GET /auctionitem/auction/:id
Authorization: Bearer <token>

Response: {
  "success": true,
  "auctionItem": { ... },
  "bidders": [
    {
      "userName": "...",
      "amount": 1500,
      "profileImage": "..."
    }
  ]
}
```

#### Create Auction
```http
POST /auctionitem/create
Authorization: Bearer <token> (Auctioneer only)
Content-Type: multipart/form-data

Body:
{
  "title": "Item Name",
  "description": "Item description",
  "category": "Electronics",
  "condition": "New",
  "startingBid": 1000,
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-01-10T00:00:00Z",
  "image": <file>
}

Response: {
  "success": true,
  "message": "Auction created successfully",
  "auctionItem": { ... }
}
```

#### Get My Auctions
```http
GET /auctionitem/myitems
Authorization: Bearer <token> (Auctioneer only)

Response: {
  "success": true,
  "items": [ ... ]
}
```

#### Delete Auction
```http
DELETE /auctionitem/delete/:id
Authorization: Bearer <token> (Auctioneer only)

Response: {
  "success": true,
  "message": "Auction deleted successfully"
}
```

#### Republish Auction
```http
PUT /auctionitem/item/republish/:id
Authorization: Bearer <token> (Auctioneer only)
Content-Type: application/json

Body:
{
  "startTime": "2024-02-01T00:00:00Z",
  "endTime": "2024-02-10T00:00:00Z"
}

Response: {
  "success": true,
  "message": "Auction republished successfully",
  "auctionItem": { ... }
}
```

### Bid Endpoints

#### Place Bid
```http
POST /bid/place/:id
Authorization: Bearer <token> (Bidder only)
Content-Type: application/json

Body:
{
  "amount": 1500
}

Response: {
  "success": true,
  "message": "Bid placed successfully",
  "currentBid": 1500
}
```

#### Get My Bids
```http
GET /bid/myBids
Authorization: Bearer <token> (Bidder only)

Response: {
  "success": true,
  "bids": [
    {
      "_id": "...",
      "amount": 1500,
      "auctionItem": { ... },
      "bidder": { ... }
    }
  ]
}
```

### Commission Endpoints

#### Submit Commission Proof
```http
POST /commission/proof
Authorization: Bearer <token> (Auctioneer only)
Content-Type: multipart/form-data

Body:
{
  "amount": 50,
  "proof": <file>,
  "comment": "Payment screenshot"
}

Response: {
  "success": true,
  "message": "Payment proof submitted successfully"
}
```

#### Get Unpaid Commission
```http
GET /commission/unpaid
Authorization: Bearer <token> (Auctioneer only)

Response: {
  "success": true,
  "unpaidCommission": 250,
  "status": "pending" | "settled"
}
```

### Leaderboard Endpoint

#### Get Leaderboard
```http
GET /user/leaderboard

Response: {
  "success": true,
  "leaderboard": [
    {
      "userName": "...",
      "profileImage": { ... },
      "auctionsWon": 10,
      "moneySpent": 50000
    }
  ]
}
```

---

## 🔒 Security Features

### Authentication
- JWT tokens with httpOnly cookies
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (RBAC)
- Protected routes with middleware
- Session expiration (1 day default)

### Data Protection
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection
- CORS configuration
- File upload validation
- Rate limiting (recommended to add)

### Payment Security
- Stripe PCI compliance
- Secure payment proof handling
- Commission tracking and verification
- Transaction audit trails

---

## 🧪 Testing

### Manual Testing Checklist

#### User Authentication
- [ ] Register as Bidder
- [ ] Register as Auctioneer
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Access protected routes without auth
- [ ] Password reset flow

#### Auction Operations
- [ ] Create auction with all fields
- [ ] Create auction without image
- [ ] View auction details
- [ ] Delete own auction
- [ ] Republish ended auction
- [ ] Filter auctions by category
- [ ] Search auctions

#### Bidding
- [ ] Place valid bid
- [ ] Place bid lower than current
- [ ] Place bid on own auction (should fail)
- [ ] Update existing bid
- [ ] View bid history
- [ ] Receive win notification

#### Commission System
- [ ] Submit payment proof
- [ ] Create auction with unpaid commission
- [ ] View commission status
- [ ] Admin approve payment

#### Profile Management
- [ ] Update profile information
- [ ] Upload profile image
- [ ] View own statistics
- [ ] Update payment methods

---

## 🐛 Common Issues & Solutions

### Backend Issues

#### MongoDB Connection Error
```bash
# Error: MongoNetworkError
Solution: Check if MongoDB is running
mongod --version
sudo service mongodb start
```

#### Port Already in Use
```bash
# Error: Port 5000 is already in use
Solution: Change PORT in config.env or kill the process
lsof -ti:5000 | xargs kill -9
```

#### SMTP Authentication Failed
```bash
# Error: Invalid login
Solution: 
1. Enable 2FA on Gmail
2. Generate App-Specific Password
3. Use that password in SMTP_PASSWORD
```

### Frontend Issues

#### Proxy Errors
```bash
# Error: Cannot proxy request
Solution: Ensure backend is running on port 5000
Check vite.config.js proxy settings
```

#### Environment Variables Not Loading
```bash
# Error: undefined for process.env variables
Solution: In Vite, use VITE_ prefix
VITE_STRIPE_PUBLIC_KEY instead of STRIPE_PUBLIC_KEY
```

#### Build Errors
```bash
# Error: Module not found
Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

#### Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Deploy

#### Environment Variables for Production
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...  # Use MongoDB Atlas
FRONTEND_URL=https://your-frontend-domain.com
# ... other variables
```

### Frontend Deployment (Vercel/Netlify)

#### Vercel
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Update API base URL to production backend
5. Deploy

#### Netlify
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Add environment variables
4. Configure redirects for SPA

---

## 📝 Environment Variables Reference

### Backend (`config/config.env`)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | Yes | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/bidbazaar` |
| `JWT_SECRET_KEY` | Secret key for JWT | Yes | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | Yes | `1d` |
| `COOKIE_EXPIRE` | Cookie expiration (days) | Yes | `5` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | `your_api_secret` |
| `SMTP_HOST` | SMTP server host | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes | `587` |
| `SMTP_SERVICE` | Email service | Yes | `gmail` |
| `SMTP_MAIL` | Sender email | Yes | `your_email@gmail.com` |
| `SMTP_PASSWORD` | Email app password | Yes | `your_app_password` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | `sk_test_...` |

### Frontend (`.env`)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes | `pk_test_...` |

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

### Pull Request Guidelines
- Link related issues
- Include screenshots for UI changes
- Test thoroughly before submitting
- Update README if needed
- Keep PRs focused and atomic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 👥 Authors

### Development Team
- **Enayat Ur Rehman** - *Lead Developer* - [GitHub](https://github.com/Enayat-Ur-Rehman)
- **Saad** - *Co-Founder & Backend Developer*
- **Ammar** - *Co-Founder & Frontend Developer*

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - The UI library
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Lucide React](https://lucide.dev/) - Icon library

---

## 📧 Support

For support and queries:

- **Email**: support@bidbazaar.com
- **GitHub Issues**: [Create an issue](https://github.com/Enayat-Ur-Rehman/BidBazaar/issues)
- **Documentation**: [Wiki](https://github.com/Enayat-Ur-Rehman/BidBazaar/wiki)

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Real-time bid notifications with WebSockets
- [ ] Advanced search with Elasticsearch
- [ ] Mobile apps (React Native)
- [ ] Multiple currency support
- [ ] Auction watchlist
- [ ] Bid history charts
- [ ] Email digest for auction activity

### Version 1.2 (Future)
- [ ] AI-powered price recommendations
- [ ] Video product demos
- [ ] Live auction streaming
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

### Version 2.0 (Long-term)
- [ ] Blockchain integration for transparency
- [ ] NFT auctions
- [ ] Escrow service
- [ ] Reputation system
- [ ] Auction insurance
- [ ] API for third-party integrations

---

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/Enayat-Ur-Rehman/BidBazaar)
![GitHub issues](https://img.shields.io/github/issues/Enayat-Ur-Rehman/BidBazaar)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Enayat-Ur-Rehman/BidBazaar)
![GitHub](https://img.shields.io/github/license/Enayat-Ur-Rehman/BidBazaar)

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: January 2025

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Enayat-Ur-Rehman/BidBazaar&type=Date)](https://star-history.com/#Enayat-Ur-Rehman/BidBazaar&Date)

---

**Built with ❤️ by the BidBazaar Team**

[⬆ Back to Top](#-bidbazaar---online-auction-platform)
