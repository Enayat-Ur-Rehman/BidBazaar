# BidBazaar

An auction platform built with React frontend and Node.js backend.

Clone the repository:
```bash
git clone https://github.com/Enayat-Ur-Rehman/BidBazaar.git
```

## Project Structure

```
BidBazaar/
├── frontend/
├── backend/
└── .gitignore
```

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create config folder and environment file:
```bash
mkdir config
```

4. Create `config/config.env` with the following credentials:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017

CLOUDINARY_CLOUD_NAME=dy0oi24hm 
CLOUDINARY_API_KEY=352694988413628
CLOUDINARY_API_SECRET=xmyt56WF75TSQExKP8S2YbNVC4I

    
FRONTEND_URL=http://localhost:5173

JWT_SECRET_KEY=SuperSecretKey123

JWT_EXPIRE=1d

COOKIE_EXPIRE=5

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=ammarkhanty2@gmail.com
SMTP_PASSWORD=iifbfexsoujw bthz

STRIPE_PUBLIC_KEY=pk_test_51SSIjqAbg57frAPIdxbe0iFj7qFIdU12j8xgjV6bLli4SaSslotRWICjQYwqMpb4CHx1z8GvAo5rJUSUrClFUsxa004gRxYLbO
STRIPE_SECRET_KEY=sk_test_51SSIjqAbg57frAPIBsomtOQVOVoVltNXzriNGiLcUEfagmmEGeGvQqIbZ6U9oSoMnS5wFJJjDmGQ6OTUXBLVih7P00FZZzRAMJ
```

5. Start the server:
```bash
npm run dev "(if this does'nt work)"
npm run start
```

---

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the frontend root:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_51SSIjqAbg57frAPIdxbe0iFj7qFIdU12j8xgjV6bLli4SaSslotRWICjQYwqMpb4CHx1z8GvAo5rJUSUrClFUsxa004gRxYLbO
```

4. Start the development server:
```bash
npm run dev
```

---

## Running the Application

1. Start backend server (runs on port 5000)
2. Start frontend server (runs on port 5173)
3. Access the application at `http://localhost:5173`

---
