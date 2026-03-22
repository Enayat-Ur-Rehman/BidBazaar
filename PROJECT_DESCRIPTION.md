# BidBazaar 2.0 — Comprehensive Project Description

## Executive Summary

**BidBazaar** is a full-stack online auction platform that facilitates competitive bidding for merchandise through a digital marketplace. The application enables users with distinct roles—Auctioneers, Bidders, and Super Administrators—to engage in real-time auction transactions, process secure payments via Stripe integration, and manage comprehensive financial settlements with automated commission tracking. The platform is engineered to handle complex multi-step workflows including auction lifecycle management, cascading bidder payment collection, and administrator-verified commission settlements.

---

## 1. Project Title and Overview

### 1.1 Official Title
**BidBazaar 2.0**: A Full-Stack Online Auction Platform for Competitive Merchandise Trading

### 1.2 Project Vision
BidBazaar provides a transparent, secure, and efficient mechanism for individuals and organizations to conduct auctions, manage bidding competitions, process financial transactions, and track earnings through an integrated digital ecosystem with built-in commission management and administrator oversight.

---

## 2. Problem Statement

### 2.1 Problems Addressed

**Market Inefficiencies in Traditional Auction Systems**:
- Traditional auction platforms lack real-time bidding capabilities and transparent price discovery
- Manual commission tracking and settlement processes are prone to human error and disputes
- Absence of automated payment collection leads to administrative overhead and delayed settlements
- No unified system for managing multiple payment methods or handling bidder fallback scenarios
- Lack of transparent leaderboard systems creates information asymmetry among participants

**Pain Points in Current Market**:

1. **For Auctioneers (Sellers)**:
   - Manual tracking of who won auctions and at what price
   - No automated notification system for successful bids
   - Complex commission calculation and settlement workflows
   - Difficulty managing multiple payment methods
   - No performance metrics or earnings visualization

2. **For Bidders (Buyers)**:
   - Uncertainty about payment deadlines and procedures
   - No clear visibility into their bidding history and active auctions
   - Lack of transparent competitive ranking system
   - Manual tracking of winning bids and payment obligations
   - No centralized payment management interface

3. **For Administrators**:
   - No systematic way to verify commission payments
   - Manual approval of settlement proofs
   - Difficulty generating business intelligence (revenue trends, user growth)
   - No centralized dashboard for platform monitoring and control
   - Risk of fraud due to lack of verification mechanisms

### 2.2 Solution Approach

BidBazaar addresses these pain points through:
- **Automated Auction Lifecycle Management**: Cron jobs automatically process auction endings, payment initiations, and expiry handling
- **Real-Time Bidding System**: Live bid placement with instant highest-bidder tracking
- **Cascading Payment Collection**: Automatic fallback to next highest bidder if winner doesn't pay within 12 hours
- **Integrated Payment Processing**: Stripe integration for secure deposit collection (20% of winning bid)
- **Commission Automation**: 5% platform fee automatically calculated, tracked, and verified
- **Admin Dashboard**: Analytics, proof verification, and platform monitoring tools
- **Transparent Leaderboard**: Public ranking system based on user engagement (money spent)

---

## 3. Target Users

### 3.1 Primary User Groups

#### 3.1.1 Auctioneers (Sellers)
- **Role Description**: Users who create and manage auction listings
- **Primary Activities**:
  - List items for auction with detailed descriptions, images, and pricing
  - Monitor bidding activity and track winning bids in real-time
  - Pay commission fees to the platform upon successful sales
  - Submit payment proofs for commission settlement
  - Republish unsold items with updated timing parameters
- **User Characteristics**: 
  - e-commerce vendors, collectibles dealers, liquidation businesses
  - Require reliable payout mechanisms and transparent fee structures
  - Need engagement metrics and sales history tracking
- **Key Requirements**:
  - Must register with valid bank account, PayPal, or Easypaisa details for payment
  - Cannot create new auctions if unpaid commissions are pending
  - Access to auction management dashboard and commission tracking

#### 3.1.2 Bidders (Buyers)
- **Role Description**: Users who browse and place competitive bids on auction items
- **Primary Activities**:
  - Browse active auction listings and view auction details
  - Place competitive bids and track bid history
  - Receive notifications of winning bids and payment obligations
  - Complete 20% deposit payments via secure Stripe checkout
  - View leaderboard rankings and historical bidding activity
- **User Characteristics**:
  - Individual collectors, wholesale buyers, price-conscious shoppers
  - Require confidence in transparent pricing and fair competition
  - Benefit from performance tracking and competitive rankings
- **Key Requirements**:
  - Must complete payment within 12 hours of winning an auction
  - Payment is mandatory to secure the auction win
  - Access to bid history, payment management, and leaderboard ranking

#### 3.1.3 Super Administrators
- **Role Description**: Platform supervisors responsible for oversight and governance
- **Primary Activities**:
  - Review and verify commission payment proofs submitted by auctioneers
  - Approve or reject settlement claims with detailed feedback
  - Monitor platform analytics (revenue trends, user growth)
  - Remove fraudulent or policy-violating auctions
  - Generate business intelligence reports for stakeholders
- **User Characteristics**:
  - Platform management team, compliance officers, business analysts
  - Require comprehensive visibility into platform operations
  - Responsible for fraud prevention and settlement accuracy
- **Key Requirements**:
  - Full system access with no restrictions on data viewing or actions
  - Dashboard with multiple analytical views and charts
  - Commission proof verification tools with approval/rejection workflows

### 3.2 Secondary Stakeholders
- **Platform Owners**: Monitor revenue, compliance, and growth metrics
- **Payment Processors** (Stripe): Receive and process deposit payments
- **Cloud Service Providers** (Cloudinary, MongoDB): Provide infrastructure
- **Email Service** (Gmail SMTP): Deliver notifications and confirmations

---

## 4. Application Type

### 4.1 Classification
**BidBazaar is a Web Application** — specifically a **Progressive Full-Stack Web Application**

### 4.2 Architecture Type
- **Frontend**: Responsive web application built with React.js and Vite
- **Backend**: RESTful API server built with Express.js and Node.js
- **Database**: NoSQL document-based storage with MongoDB
- **Deployment Model**: Cloud-native (frontend hosted on CDN, backend on server, database on MongoDB Atlas)

### 4.3 Technology Stack Justification

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend Framework** | React 18 with Vite | Fast cold startup, modern component paradigm, strong ecosystem |
| **State Management** | Redux Toolkit | Centralized state for complex auction/payment workflows |
| **Styling** | Tailwind CSS | Utility-first approach for rapid responsive design |
| **Backend Framework** | Express.js | Lightweight, battle-tested, excellent middleware ecosystem |
| **Database** | MongoDB | Flexible schema for varied document structures, scalable |
| **Authentication** | JWT with HttpOnly Cookies | Stateless, secure against XSS attacks, REST-friendly |
| **Payment** | Stripe API | PCI compliance, reliable webhook system, global reach |
| **File Storage** | Cloudinary | CDN delivery, automatic optimization, no server storage overhead |
| **Email** | Nodemailer + Gmail SMTP | Simple setup, sufficient for transactional emails |
| **Task Scheduling** | Node-cron | Lightweight, in-process scheduling for auction management |

### 4.4 Platform Capabilities
- **Device Support**: Desktop (primary), Tablet (responsive design), Mobile (touch-optimized)
- **Client-Side Rendering**: React SPA with client-side routing
- **Offline Capability**: None (real-time bidding requires connectivity)
- **Browser Requirements**: Modern browsers with ES6+, CSS Grid/Flexbox support
- **Accessibility**: WCAG 2.1 Level AA standards attempted through Tailwind components

---

## 5. Project Scope

### 5.1 Included Features and Modules

#### Module 1: User Management & Authentication
- User registration with role selection (Auctioneer, Bidder, Super Admin)
- Secure login/logout with JWT token management
- Profile management with image uploads
- Payment method configuration (Bank, PayPal, Easypaisa)
- Role-based access control and authorization

#### Module 2: Auction Lifecycle Management
- Create new auctions with item details, images, and timing parameters
- Real-time auction status tracking (Active, Waiting_Payment, Completed, Cancelled)
- Time-based state transitions (automatic via cron jobs)
- Auction browsing and filtering
- Auctioneer-specific management tools (edit, delete, republish)

#### Module 3: Real-Time Bidding System
- Place competitive bids with automatic validation
- Live bid history with bidder information (name, avatar)
- Highest bidder tracking and updates
- Bid deduplication (user can update their own bid)
- Auction countdown timers with real-time updates

#### Module 4: Payment Processing
- Stripe integration for secure deposit collection
- 20% deposit calculation from winning bid amount
- 12-hour payment deadline enforcement
- Cascading bidder payment offers (if winner defaults)
- Multiple payment method support for settlement

#### Module 5: Commission Management
- Automatic 5% commission calculation on successful auctions
- Commission balance tracking per auctioneer
- Payment proof submission with image uploads
- Admin approval/rejection workflow
- Settlement tracking and balance reconciliation

#### Module 6: Notification System
- Email notifications for auction winners (payment deadline alerts)
- Payment confirmation emails (receipts)
- Payment expiry notifications (missed deadline alerts)
- Commission settlement confirmation emails
- Automated template-based HTML emails

#### Module 7: Leaderboard & Rankings
- Public leaderboard displaying top bidders
- Ranking criteria: total money spent on winning bids
- Real-time updates as transactions complete
- User engagement metrics and statistics

#### Module 8: Admin Dashboard
- Revenue analytics with monthly trends graph
- User growth tracking (Bidder vs. Auctioneer registration)
- Payment proof management interface
- Auction deletion and moderation tools
- Commission settlement verification panel

### 5.2 Out of Scope

The following features are **not** currently implemented:
- **Live Chat / Messaging**: User-to-user communication system
- **Shipping Integration**: Carrier APIs, tracking, logistics
- **Inventory Management**: Stock tracking or multi-quantity auctions
- **Automated Logistics**: Shipping cost calculation, insurance
- **Refund Management**: Automated refund processing (manual settlement only)
- **Dispute Resolution**: Formal dispute handling workflows
- **Mobile Apps**: Native iOS/Android applications
- **Multi-Currency**: International payment handling (USD only)
- **Advanced Search**: Full-text search, semantic search, filters beyond category
- **Auction Deposits**: Platform protection deposits (only bidder deposits)
- **Promotional Tools**: Coupons, discounts, promotional auctions
- **Rating System**: Buyer/seller feedback and rating system
- **Scheduled Auctions**: Queue-based auction scheduling
- **API Rate Limiting**: Explicit rate limiting on endpoints
- **Webhook System**: Outbound webhooks for third-party integrations

---

## 6. Core Features and Modules — Detailed Description

### 6.1 User Authentication and Authorization System

#### Overview
The authentication system implements a JWT-based stateless authentication model with role-based access control (RBAC), enabling secure user identification and permission management across all platform operations.

#### Technical Implementation

**Registration Process**:
- Accepts role selection (Auctioneer, Bidder, Super Admin)
- Validates form inputs: username (3-40 chars), password (8+ chars), email (unique)
- For Auctioneers: mandates payment method registration (at least one of: bank account, Easypaisa, PayPal)
- Profile image upload via Cloudinary (required for all users)
- Password hashing via bcrypt with automatic salt generation
- Unique email constraint prevents duplicate accounts

**Login Process**:
- Email and password verification against stored hash
- JWT token generation with user ID and role embedded
- HTTP-only cookie storage (prevents JavaScript access, mitigates XSS)
- Token expiration configured via `JWT_EXPIRE` environment variable

**Authorization Middleware**:
- `isAuthenticated`: Verifies JWT token validity, decodes user ID, attaches user object to request
- `isAuthorized(roleName1, roleName2, ...)`: Checks user role against allowed roles, returns 403 Forbidden if unauthorized
- Applied to sensitive endpoints requiring authentication or specific roles

**Session Management**:
- Stateless design (no session storage required)
- Token passed in HTTP-only cookie with every request
- Logout implemented as client-side cookie deletion

#### Security Measures
- Passwords: bcrypt hashing with salting
- Tokens: JWT signed with secret key, expiring automatically
- HTTP-only Cookies: Prevent XSS attacks, prevent JavaScript access to tokens
- CORS-protected endpoints: Credentials included only for trusted origins
- Sensitive data excluded from localStorage
- Authorization checks occur before business logic execution

---

### 6.2 Auction Creation and Lifecycle Management

#### Overview
The auction module manages the complete lifecycle of auction listings from creation through completion, including time-based state transitions, bid tracking, and payment initiation.

#### Auction Creation

**Auctioneer Permissions**:
- Only "Auctioneer" role can create auctions
- Cannot have more than 1 active auction simultaneously
- Cannot create auctions if unpaid commissions exist (enforced by `trackCommissionStatus` middleware)

**Required Information**:
- Item Details: Title (required), description (required), category (required), condition (New/Used)
- Pricing: Starting bid amount (required, must be positive)
- Timing: Start time (required, must be future date), end time (required, must be after start time)
- Image: Item photo upload (required, png/jpeg/webp only, max file size enforced)

**Validation Rules**:
- Title and description must contain meaningful content (no empty strings)
- Starting bid must be positive number
- Auction duration must be at least 1 hour
- Start time cannot be in past
- End time must be at least 1 hour after start time
- Image file type whitelist prevents malicious uploads

**Data Persistence**:
- Auction document created in MongoDB with initial state
- Image uploaded to Cloudinary with automatic CDN delivery
- Auction ID returned to frontend for future reference

#### Auction State Management

**State Machine**:
```
Active → Waiting_Payment → Completed
   ↓                            ↑
Cancelled ←──────────────────────
```

**Active State**:
- Bids can be placed, updated, or viewed
- Auction visible in browsing interface
- Countdown timer active on frontend
- Real-time bid history displayed

**Waiting_Payment State**:
- Triggered when `endTime` passes and bids exist
- No new bids accepted
- Payment initiated for highest bidder
- Frontend shows payment pending message
- Timeout period: 12 hours for payment completion

**Completed State**:
- Payment received from winning bidder OR
- Payment deadline expired with no more bidders OR
- Commission has been calculated and settled
- Historical record available in user profile
- Not available for browsing

**Cancelled State**:
- Auction manually deleted by auctioneer OR
- Auction ended with zero bids (automatic cancellation) OR
- Admin deleted auction for policy violation
- Auctioneer notified of cancellation
- Bids disassociated from auction

#### Automated State Transitions (Cron Jobs)

**Ended Auction Processor** (Runs every 1 minute):
- Queries auctions where `endTime < currentTime` AND `paymentInitiated = false`
- For each: If bids exist → calls `initiateAuctionPayment()`
- For each: If no bids → sets `auctionState = "Cancelled"` and `commissionCalculated = true`
- Ensures timely payment initiation and auction closure

#### Auction Republishing

**Purpose**: Allow auctioneers to relist unsuccessful auctions with new timing parameters

**Prerequisites**:
- Auction must have ended (current time > end time)
- Auctioneer must be auction creator
- No pending payments or unresolved commissions

**Republish Action**:
- Clears bid history and current bidder information
- Resets monetary counters (`currentBid = 0`, removes previous winner stats)
- Resets commission calculated flag
- Sets new start and end times
- Auction transitions back to Active state
- Previous bid records deleted from database

**Business Logic**:
- Reverts user stats: `moneySpent` decremented, `auctionsWon` decremented
- Clears unpaid commission for this auction
- All previous bidders notified of re-auction
- Allows multiple reattempts to sell item

---

### 6.3 Real-Time Bidding System

#### Overview
The bidding module enables competitive auction participation with validation, bid history tracking, and automatic highest-bidder identification.

#### Bid Placement Logic

**Placement Requirements**:
- User must have "Bidder" role
- Auction must be in Active state (not ended)
- Middleware `checkAuctionEndTime` verifies auction still active

**Bid Validation**:
- Amount must be greater than current highest bid
- Amount must be at least equal to starting bid
- Amount must be positive number
- User cannot place bid on own auction (checked implicitly by role)

**Bid Processing**:
- If user is making first bid: Create new Bid document
- If user has previous bid: Update existing bid amount
- Update auction's `currentBid` field to new amount
- Record bidder metadata (username, profile image)
- Timestamp bid creation (MongoDB `createdAt`)

**Database Indexing**:
- Composite index on `{bidder.id, auctionItem}` for efficient historical queries
- Index on `auctionItem` for bid retrieval by auction

#### Bid History and Tracking

**Information Captured**:
- Bidder ID, username, and profile image
- Bid amount (in USD)
- Auction ID reference
- Timestamp (automatically recorded by MongoDB)

**Frontend Display**:
- Bids sorted by amount (highest first)
- Bidder avatars displayed with bids
- Real-time updates via API polling
- Historical view in "My Bids" dashboard

**Highest Bidder Determination**:
- Auction document maintains `highestBidder` field
- Updated atomically with each new bid
- When auction ends, becomes `finalWinner`
- Used for payment initiation

**Bidder Sequence**:
- If highest bidder defaults on payment, system iterates through bidders
- `bidderSequence` field tracks position in fallback queue (0 = first, 1 = second, etc.)
- Payment offers cascade automatically via cron job

---

### 6.4 Payment Processing System

#### Overview
The payment module manages the complex workflow of deposit collection from auction winners, payment deadline management, cascading fallback offers to subsequent bidders, and Stripe integration for secure transactions.

#### Payment Initiation

**Trigger**: When auction ends and bids exist
- Cron job detects ended auction without initiated payment
- Calls `initiateAuctionPayment(auctionId)`
- Processes highest bidder information

**Payment Creation**:
- Creates Payment document in database with:
  - `paymentStatus = "Pending"`
  - `paymentAmount = winningBid * 0.20` (20% deposit)
  - `expiresAt = now + 12 hours` (deadline)
  - `bidderSequence = 0` (first bidder in line)
- Links to auction and bidder (User)
- Sets auction `auctionState = "Waiting_Payment"`
- Adds payment to user's `pendingPayments[]` array

**Email Notification**:
- System sends payment notification email to winner
- Contains:
  - Auction item details and image
  - Winning bid amount
  - Required deposit (20%)
  - Payment deadline (exact time)
  - Direct link to payment gateway
  - Bank transfer instructions (alternative)

#### Stripe Payment Gateway Integration

**Session Creation**:
- Endpoint: POST `/api/v1/payment/stripe/createSession/:paymentId`
- Validates payment exists and deadline not passed
- Calls Stripe API to create checkout session
- Returns redirect URL to frontend
- Session contains:
  - Product: Item name (from auction)
  - Amount: 20% of winning bid (in cents)
  - Currency: USD
  - Metadata: Payment ID for verification
  - Success/cancel redirect URLs

**Payment Verification**:
- Endpoint: POST `/api/v1/payment/stripe/verify`
- Parameters: Stripe session ID, payment ID
- Verifies session payment status with Stripe API
- If confirmed paid: Calls `confirmPaymentSuccess()`

**Payment Success Confirmation**:
- Sets payment `paymentStatus = "Paid"`
- Records `paidAt` timestamp
- Updates user records:
  - Removes from `pendingPayments[]`
  - Adds to `completePayments[]`
  - Increments `auctionsWon` counter
  - Adds to `moneySpent` (for leaderboard)
- Calculates and records commission:
  - Commission amount: `winningBid * 0.05`
  - Adds to user's `unpaidCommission` balance
- Sets auction `auctionState = "Completed"`
- Sends confirmation email to winner

#### Payment Expiry and Cascading Bidders

**Expiry Detection** (Runs every 5 minutes via cron):
- Queries payments where `paymentStatus = "Pending"` AND `expiresAt < now`
- For each expired payment: Calls `handlePaymentExpiry()`

**Expiry Handling**:
1. **Current Bidder**:
   - Sets payment to `paymentStatus = "Expired"`
   - Sends expiry notification email
   - Marks bidder as non-paying

2. **Next Bidder Cascade**:
   - Retrieves next highest bidder from bid history
   - If next bidder exists:
     - Creates new Payment for next bidder
     - Sets `bidderSequence = previous + 1`
     - Updates `currentPaymentBidderId`
     - Sets `expiresAt = now + 12 hours` (new deadline)
     - Sends payment notification to new bidder
   - If no next bidder:
     - Sets `auctionState = "Completed"`
     - Auction ends without payment

3. **Repeat Until Payment**:
   - Cascades continue until a bidder pays OR all bidders exhausted
   - Each offer is time-limited to 12 hours

#### Manual Payment Methods

**Alternative to Stripe**:
- Auctioneers can accept bank transfers, PayPal, or Easypaisa
- Bidder submits payment proof (screenshot) manually
- Auctioneer confirms payment received
- System updated manually by admin or auctioneer
- Less common for platform transactions (Stripe preferred)

---

### 6.5 Commission Calculation and Settlement

#### Overview
The commission system implements a 5% platform fee on successful auctions, with automated calculation, bidder-submitted proof uploads, administrator verification, and cron-driven settlement processing.

#### Commission Calculation

**Automatic Calculation**:
- Triggered when payment confirmed from auction winner
- Formula: `commission = winningBid * 0.05`
- Example: Winning bid $100 → Commission $5
- Applied to all successful auction sales (except cancelled/failed)
- Recorded in `unpaidCommission` field on user account

**Balance Tracking**:
- User `unpaidCommission` field accumulates across multiple auctions
- Updated when:
  - New payment confirmed (+)
  - Proof submitted and approved (-)
  - Proof rejected (no change)
- Auctioneer can view current balance in dashboard

#### Commission Settlement Workflow

**Step 1: Auctioneer Proof Submission**:
- Endpoint: POST `/api/v1/commission/proof`
- Auctioneer submits:
  - Amount being paid (must be ≤ unpaidCommission)
  - Screenshot/image of payment proof
  - Comments (optional explanation)
- Image uploaded to Cloudinary
- Creates PaymentProof document with status `"Pending"`
- Frontend confirms: "Proof submitted, will be verified within 24 hours"

**Step 2: Admin Verification and Approval**:
- Super Admin reviews pending proofs in dashboard
- Admin can:
  - **Approve**: Verifies payment actually received, confirms proof authentic
  - **Reject**: Proof is fake, amount incorrect, or insufficient documentation
- If rejected, proof status set to `"Rejected"`, submission stays with auctioneer

**Step 3: Automatic Settlement** (Runs every 1 minute via cron):
- Queries PaymentProofs where status `= "Approved"`
- For each approved proof:
  - Deducts amount from user's `unpaidCommission`
  - If amount > unpaidCommission: clamp to unpaidCommission (prevent negative)
  - Sets proof status to `"Settled"`
  - Creates Commission record (permanent settlement record)
  - Sends settlement confirmation email
  - Tracks settlement date and amount

**Email Confirmation**:
- Subject: "Commission Payment Settled"
- Contains:
  - Amount settled
  - Remaining unpaid commission
  - Settlement date and proof reference
  - Next payment instructions if balance remains

#### Enforcement Rules

**Checkpoint Before Auction Creation**:
- Middleware `trackCommissionStatus` checks user's `unpaidCommission`
- If unpaidCommission > 0: Rejects new auction creation
- Forces auctioneers to settle before relisting items
- Prevents abuse of unpaid fee accumulation

**Commission Visibility**:
- Auctioneer views unpaid balance in dashboard
- Clear indication of payment required before next auction
- Commission breakdown per auction shown in history

---

### 6.6 Notification System

#### Overview
The notification system delivers time-sensitive information to users automatically via HTML emails triggered by key platform events, managed through Node.js cron jobs and Nodemailer integration.

#### Email Infrastructure

**SMTP Configuration**:
- Provider: Gmail SMTP
- Credentials stored in environment variables
- Nodemailer handles SMTP connection and delivery
- HTML template support with variable substitution
- Plain text fallback for email clients without HTML support

**Email Templates**:

1. **Payment Notification** (`payment-notification.html`)
   - Sent: When auction ends and payment is initiated
   - Recipient: Auction winner (highest bidder)
   - Contents:
     - Auction item name and image
     - Winning bid amount
     - Required deposit (20% of bid)
     - Payment deadline (12 hours from now)
     - Link to Stripe checkout
     - Alternative payment methods (bank, PayPal, Easypaisa)
   - Trigger: `initiateAuctionPayment()` in payment flow service

2. **Payment Confirmed** (`payment-confirmed.html`)
   - Sent: After Stripe payment verification
   - Recipient: Auction bidder who paid
   - Contents:
     - Payment receipt details
     - Amount paid and timestamp
     - Auction item information
     - Next steps (item shipment instructions, contact auctioneer)
     - Transaction ID from Stripe

3. **Payment Expired** (`payment-expired.html`)
   - Sent: When 12-hour deadline passes without payment
   - Recipient: Original auction winner
   - Contents:
     - Payment deadline missed notification
     - Auction offered to next bidder
     - Option to submit late payment with approval required
     - Instructions to contact admin if dispute

4. **Commission Settled** (`commission-settled.html`)
   - Sent: When admin-approved proof is settled
   - Recipient: Auctioneer
   - Contents:
     - Amount settled
     - Remaining unpaid commission balance
     - Settlement date and proof reference
     - Instructions for next payment (if balance remains)

#### Email Delivery Integration

**Cron-Triggered Emails**:
- Commission Settlement Cron sends settlement confirmation
- Payment Expiry Cron sends expiry notifications
- Ended Auction Cron sends payment notifications

**Controller-Triggered Emails**:
- Payment confirmation sent after Stripe verification
- Registration welcome email sent after signup (optional)

**Email Queue Handling**:
- Emails sent synchronously (blocks briefly, acceptable for low-volume platform)
- Failed email attempts logged but don't prevent transaction processing
- Retry mechanism depends on Nodemailer configuration

---

### 6.7 Leaderboard and User Rankings

#### Overview
The leaderboard provides transparent public rankings of users based on engagement metrics, fostering competition and community participation.

#### Ranking Criteria

**Primary Metric**: Total Money Spent on Winning Bids
- Calculated as: Sum of all winning bid amounts for completed auctions
- Updated when payment confirmed from auction winner
- Reflects user engagement and platform activity
- Never decrements (only increments with new wins)

**Leaderboard Composition**:
- Only users with `moneySpent > 0` appear
- Sorted descending (highest spenders first)
- Top bidders typically displayed (top 10, 20, 50 depending on UI)
- Public API endpoint accessible without authentication
- Real-time updates as new payments are confirmed

**User Information Displayed**:
- Username
- Profile image (from Cloudinary)
- Total money spent
- Rank/position (1st, 2nd, 3rd, etc.)
- Optional: Number of auctions won, join date

**Business Value**:
- Incentivizes user participation through social proof
- Identifies high-value users (potential VIP treatment)
- Encourages competitive engagement
- Provides marketing data (show case studies of top bidders)

---

### 6.8 Admin Dashboard and Analytics

#### Overview
The Super Admin dashboard provides comprehensive platform visibility through analytics visualizations, management tools, and oversight functions.

#### Dashboard Components

**1. Revenue Analytics Graph**:
- Visualization: Line or bar chart showing monthly commission revenue
- Data Source: Commission documents aggregated by month
- Time Period: Last 12 months or configurable period
- Metric: Total commission amount per month
- Business Insight: Revenue trends, seasonal patterns, growth analysis

**2. User Registration Graph**:
- Visualization: Stacked bar chart showing user growth by type
- Categories: Bidders vs. Auctioneers
- Time Period: By month, with year selector
- Shows: Registration trends, role adoption patterns
- Business Insight: Platform growth metrics, user composition

**3. Payment Proofs Management**:
- Table displaying all submitted commission payment proofs
- Filters: By status (Pending, Approved, Rejected, Settled)
- Columns: Auctioneer name, amount, submitted date, status, actions
- Actions: View details, approve, reject, request additional info
- Approval workflow: Admin enters approved amount, sets status

**4. Auction Deletion Tool**:
- Search interface to find specific auctions
- Delete functionality for policy-violating or duplicate auctions
- Triggers: Cascade delete of associated bids, delete from bidder's bid history
- Audit trail: Logs which admin deleted what and when

**5. User Statistics**:
- Total users by role (Bidders, Auctioneers, Admins)
- Monthly user acquisition
- Active users (logged in last 30 days)
- Commission settlement rate
- Average commission per auctioneer

#### Admin Permissions

**Super Admin Capabilities**:
- View all payment proofs (private data)
- Approve/reject commission settlements with comments
- Delete auctions with reason logging
- View all users and their financial data
- Download analytics reports
- Monitor platform health metrics

**Super Admin Restrictions**:
- Cannot participate in auctions (cannot bid)
- Cannot create auctions (cannot receive commission)
- Cannot modify completed transactions (only view)
- Cannot directly modify user accounts (only admins can)

---

## 7. Technologies Used

### 7.1 Programming Languages

| Language | Usage | Version |
|----------|-------|---------|
| **JavaScript (ES6+)** | Frontend logic, React components, hooks | ES2022+ |
| **JavaScript (Node.js)** | Backend server, APIs, cron jobs, utilities | Node 20.x |
| **HTML5** | Frontend markup (generated by React) | HTML5 |
| **CSS3** | Styling via Tailwind utility classes | CSS3 |

### 7.2 Frontend Framework and Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| **React** | UI library, component framework | 18.x |
| **React Router** | Client-side routing, navigation | 6.x |
| **Redux Toolkit** | State management, store, slices, async thunks | 1.9+ |
| **Axios** | HTTP client, API requests with interceptors | 1.x |
| **Vite** | Module bundler, build tool, dev server | 4.x+ |
| **Tailwind CSS** | Utility-first CSS framework | 3.x |
| **PostCSS** | CSS processing, Tailwind compilation | Latest |
| **Lucide React** | Icon library (Gavel, Clock, DollarSign icons) | Latest |
| **Swiper** | Carousel component for featured auctions | 10.x+ |
| **React DatePicker** | Date/time input component | Latest |
| **React Toastify** | Toast notifications, user feedback | Latest |
| **Stripe.js** | Client-side Stripe integration | Latest |

### 7.3 Backend Framework and Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| **Express.js** | Web framework, HTTP server | 4.x |
| **Node.js** | JavaScript runtime | 20.x |
| **Mongoose** | MongoDB ODM, schema validation | 7.x+ |
| **bcryptjs** | Password hashing, security | 2.4.3+ |
| **jsonwebtoken** | JWT generation and verification | 9.x |
| **Cloudinary** | Image storage and CDN | Latest |
| **Stripe** | Payment processing (server-side) | Latest |
| **Nodemailer** | Email sending via SMTP | 6.x+ |
| **node-cron** | Task scheduling for automation | 3.x |
| **dotenv** | Environment variable management | Latest |
| **cors** | Cross-origin request handling | Latest |
| **cookie-parser** | Cookie parsing and management | Latest |
| **multer** | File upload handling, FormData parsing | Latest |

### 7.4 Database

| Component | Specification |
|-----------|---------------|
| **Primary Database** | MongoDB 7.x (local or MongoDB Atlas cloud) |
| **ODM/Query Builder** | Mongoose.js (schema validation, middleware hooks) |
| **Database Design** | Document model with 6 core collections |
| **Indexing** | Indices on queryable fields (email, expiry, status) |
| **Transactions** | MongoDB multi-document ACID transactions (if needed) |

### 7.5 External Services and APIs

| Service | Integration | Purpose |
|---------|-------------|---------|
| **Stripe** | REST API, webhooks | Payment processing, checkout sessions |
| **Cloudinary** | SDK, REST API | Image hosting, CDN, optimization |
| **Gmail SMTP** | Nodemailer integration | Transactional email delivery |
| **MongoDB Atlas** | Cloud database (optional) | Hosted MongoDB database service |

### 7.6 Development and Building Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager, dependency management |
| **Vite** | Build tool, development server with HMR |
| **Node.js Runtime** | JavaScript execution environment |
| **Git/GitHub** | Version control, repository hosting |
| **VS Code** | Development IDE |
| **ESLint** | Code linting (optional) |
| **Prettier** | Code formatting (optional) |

### 7.7 Deployment Infrastructure

| Component | Technology |
|-----------|-----------|
| **Frontend Hosting** | Static file host (Vercel, Netlify, GitHub Pages) |
| **Backend Server** | Node.js server (Heroku, Railway, AWS EC2, DigitalOcean) |
| **Database** | MongoDB Atlas or self-hosted MongoDB |
| **File Storage** | Cloudinary CDN |
| **Email** | Gmail SMTP (free tier supports ~500 emails/day) |
| **SSL/TLS** | HTTPS for all endpoints |

---

## 8. System Requirements

### 8.1 Functional Requirements

Functional requirements specify what the system must do to fulfill business needs.

#### FR-1: User Registration and Authentication
- **FR-1.1**: System shall allow users to register with email, password, username, and role selection
- **FR-1.2**: System shall store passwords using bcrypt hashing with salt rounds (≥10)
- **FR-1.3**: System shall enforce unique email constraint across all users
- **FR-1.4**: System shall generate JWT tokens upon successful login, valid for configured duration
- **FR-1.5**: System shall support role-based access control with three roles: Auctioneer, Bidder, Super Admin
- **FR-1.6**: System shall prevent unauthorized role assignments (users cannot self-assign Super Admin role)

#### FR-2: Auction Creation and Management
- **FR-2.1**: System shall allow Auctioneers to create auctions with title, description, category, condition, starting bid, and timing
- **FR-2.2**: System shall validate auction timing (start time must be future, end time > start time)
- **FR-2.3**: System shall enforce one-active-auction limit per auctioneer simultaneously
- **FR-2.4**: System shall require image upload with file type validation (png, jpeg, webp only)
- **FR-2.5**: System shall prevent Auctioneers with unpaid commissions from creating new auctions
- **FR-2.6**: System shall allow Auctioneers to delete their own auctions (before start time)
- **FR-2.7**: System shall allow Auctioneers to republish ended auctions with new timing parameters

#### FR-3: Bid Placement and Tracking
- **FR-3.1**: System shall allow Bidders to place bids on active auctions
- **FR-3.2**: System shall validate that bid amount > current highest bid and >= starting bid
- **FR-3.3**: System shall update highest bidder field atomically with each new bid
- **FR-3.4**: System shall prevent bid placement on ended auctions (validate against endTime)
- **FR-3.5**: System shall allow bidders to update their own bid (increase amount)
- **FR-3.6**: System shall store complete bid history with bidder info (name, image, timestamp)

#### FR-4: Auction Lifecycle and Automation
- **FR-4.1**: System shall automatically detect when auctions end (endTime < currentTime)
- **FR-4.2**: System shall automatically initiate payment for highest bidder when auction ends with bids
- **FR-4.3**: System shall automatically cancel auctions that end with zero bids
- **FR-4.4**: System shall set auction state to "Waiting_Payment" when payment initiated
- **FR-4.5**: System shall set auction state to "Completed" when payment confirmed or final bidder deadline expires
- **FR-4.6**: System shall process all state transitions within 1 minute of trigger event (cron job frequency)

#### FR-5: Payment Processing and Stripe Integration
- **FR-5.1**: System shall calculate payment amount as 20% of winning bid
- **FR-5.2**: System shall create Stripe checkout session with correct amount and metadata
- **FR-5.3**: System shall verify Stripe payment status after checkout completion
- **FR-5.4**: System shall set payment deadline to 12 hours from payment initiation
- **FR-5.5**: System shall detect expired payments (passed deadline)
- **FR-5.6**: System shall cascade payment offers to next highest bidder when current bidder doesn't pay within 12 hours
- **FR-5.7**: System shall update user's `auctionsWon` and `moneySpent` counters upon successful payment

#### FR-6: Commission Calculation and Settlement
- **FR-6.1**: System shall calculate commission as 5% of winning bid amount
- **FR-6.2**: System shall add commission to auctioneer's `unpaidCommission` balance
- **FR-6.3**: System shall allow Auctioneers to submit payment proof with image upload (Cloudinary)
- **FR-6.4**: System shall allow Super Admin to approve or reject payment proofs
- **FR-6.5**: System shall automatically settle approved proofs (deduct from balance, create settlement record)
- **FR-6.6**: System shall prevent negative unpaidCommission balances (clamp to 0)
- **FR-6.7**: System shall track settlement history with dates and amounts

#### FR-7: Notification System
- **FR-7.1**: System shall send HTML email notifications for payment deadlines to auction winners
- **FR-7.2**: System shall send payment confirmation emails upon successful Stripe payment
- **FR-7.3**: System shall send payment expiry notifications when deadline passed
- **FR-7.4**: System shall send commission settlement confirmation emails to Auctioneers
- **FR-7.5**: System shall use HTML templates with variable substitution for personalization
- **FR-7.6**: System shall handle email delivery failures gracefully (log but don't block transactions)

#### FR-8: Leaderboard and Rankings
- **FR-8.1**: System shall calculate user rankings based on total `moneySpent` (sum of all winning bids)
- **FR-8.2**: System shall display leaderboard sorted descending by money spent
- **FR-8.3**: System shall include only users with moneySpent > 0
- **FR-8.4**: System shall provide public access to leaderboard (no authentication required)
- **FR-8.5**: System shall update leaderboard in real-time as new payments confirmed

#### FR-9: Super Admin Functions
- **FR-9.1**: System shall allow Super Admin to view all payment proofs regardless of status
- **FR-9.2**: System shall allow Super Admin to approve proofs with amount confirmation
- **FR-9.3**: System shall allow Super Admin to reject proofs with optional reason/comment
- **FR-9.4**: System shall allow Super Admin to delete auctions with audit logging
- **FR-9.5**: System shall provide Super Admin access to analytics (revenue, user growth)
- **FR-9.6**: System shall allow Super Admin to export/download data reports

#### FR-10: Data Persistence and Consistency
- **FR-10.1**: System shall persist all user data in MongoDB with validation schemas
- **FR-10.2**: System shall maintain referential integrity (auctions reference users, bids reference auctions)
- **FR-10.3**: System shall use MongoDB transactions for multi-step operations (e.g., payment confirmation)
- **FR-10.4**: System shall implement atomic updates to prevent race conditions
- **FR-10.5**: System shall retain audit trail of payment proofs and settlements

### 8.2 Non-Functional Requirements

Non-functional requirements specify performance, security, usability, and reliability expectations.

#### NFR-1: Performance
- **NFR-1.1**: Bid placement response time: < 500ms (p95)
- **NFR-1.2**: Auction detail page load: < 2 seconds (including image from Cloudinary CDN)
- **NFR-1.3**: Leaderboard query: < 1 second for top 100 users
- **NFR-1.4**: Stripe session creation: < 3 seconds (including API call to Stripe)
- **NFR-1.5**: Cron job execution: < 5 seconds per cycle (1-5 minute frequencies)
- **NFR-1.6**: API response payload: < 1MB for any single endpoint
- **NFR-1.7**: Database query optimization: < 100ms for indexed queries
- **NFR-1.8**: Frontend bundle size: < 500KB after minification and gzip

#### NFR-2: Scalability
- **NFR-2.1**: System shall support concurrent bid placement on same auction without conflicts
- **NFR-2.2**: System shall handle at least 1,000 concurrent users (elastic scaling)
- **NFR-2.3**: System shall support up to 10,000+ auctions in database
- **NFR-2.4**: Base should scale horizontally (stateless API servers, database sharding)
- **NFR-2.5**: Search and filtering should use indexed queries to maintain performance

#### NFR-3: Security
- **NFR-3.1**: All passwords shall be hashed with bcrypt (minimum salt rounds: 10)
- **NFR-3.2**: JWT tokens shall be signed with strong secret key (≥32 bytes)
- **NFR-3.3**: All user-specific endpoints shall require authentication
- **NFR-3.4**: Authorization checks shall occur before business logic execution
- **NFR-3.5**: All file uploads shall be validated by file type whitelist (png, jpeg, webp)
- **NFR-3.6**: File uploads shall be stored in Cloudinary (not on server filesystem)
- **NFR-3.7**: All API responses shall exclude sensitive data (passwords, secrets)
- **NFR-3.8**: HTTP-only cookies shall be used for JWT storage (prevent XSS)
- **NFR-3.9**: CORS shall be configured to allow only trusted origins
- **NFR-3.10**: Payment processing shall be PCI-compliant (delegated to Stripe)
- **NFR-3.11**: Environment secrets shall not be committed to version control
- **NFR-3.12**: HTTPS/TLS shall be enforced for all communication

#### NFR-4: Availability and Reliability
- **NFR-4.1**: System shall target 99.5% uptime (except scheduled maintenance)
- **NFR-4.2**: Database backups shall occur at least daily
- **NFR-4.3**: Failed email delivery shall not prevent transaction completion
- **NFR-4.4**: Cron jobs shall implement retry logic for failed operations
- **NFR-4.5**: API endpoints shall implement health check endpoints
- **NFR-4.6**: Database connection pooling shall prevent exhaustion

#### NFR-5: Usability
- **NFR-5.1**: Frontend shall be responsive on mobile, tablet, and desktop devices
- **NFR-5.2**: Forms shall provide real-time validation feedback to users
- **NFR-5.3**: Error messages shall be clear, specific, and actionable
- **NFR-5.4**: All payment processes shall require explicit user confirmation before charging
- **NFR-5.5**: Countdown timers shall update in real-time without page refresh
- **NFR-5.6**: Images shall be optimized and served via CDN for fast loading

#### NFR-6: Data Integrity
- **NFR-6.1**: Commission calculations shall be auditable (tracked in settlement records)
- **NFR-6.2**: Payment amounts shall never change after initiation
- **NFR-6.3**: Bid amounts shall be immutable (can update own bid, but previous records preserved)
- **NFR-6.4**: Completed transactions shall be protected from modification
- **NFR-6.5**: User balance calculations shall be verified through commission records

#### NFR-7: Maintainability
- **NFR-7.1**: Code shall follow consistent naming conventions and structure
- **NFR-7.2**: API endpoints shall follow RESTful conventions
- **NFR-7.3**: Middleware shall be reusable across multiple routes
- **NFR-7.4**: Error handling shall be centralized (ErrorHandler class, error middleware)
- **NFR-7.5**: Configuration shall be externalized (environment variables, config files)

#### NFR-8: Compliance
- **NFR-8.1**: System shall comply with GDPR for user data (if applicable)
- **NFR-8.2**: System shall maintain audit logs for sensitive operations
- **NFR-8.3**: System shall implement dispute resolution mechanisms
- **NFR-8.4**: System shall provide data export capabilities for users

---

## 9. User Roles and Permissions

### 9.1 Role Definitions

#### 9.1.1 Bidder Role

**Overview**: End users who browse, bid on, and purchase auction items

**Permissions**:
- ✓ Register account with profile image
- ✓ Login and logout
- ✓ Browse all active auctions
- ✓ View auction details (description, image, bid history)
- ✓ Place bids on auctions during active period
- ✓ Update own bids (increase amount)
- ✓ View personal bid history
- ✓ View pending payments (amounts due within 12 hours)
- ✓ Create Stripe payment sessions
- ✓ Complete payments and receive confirmation
- ✓ View leaderboard ranking
- ✓ Update profile information
- ✓ Access "My Bids" and "My Payments" dashboard sections

**Restrictions**:
- ✗ Cannot create auctions (no listing privilege)
- ✗ Cannot access Super Admin dashboard
- ✗ Cannot submit commission payment proofs
- ✗ Cannot approve/reject payments
- ✗ Cannot delete auctions
- ✗ Cannot modify other users' data
- ✗ Cannot view commission details or financial reports

**Key Behaviors**:
- Cannot place bids higher than financial capacity (no credit system)
- Cannot bid on own auctions (role prevents listing)
- Payment required within 12 hours of winning bid
- Cascades to next bidder if payment fails
- Appears on leaderboard based on cumulative spending

**Data Access**:
- Own profile, bid history, payment history
- All public auction data
- Public leaderboard data
- Cannot access other users' financial information

---

#### 9.1.2 Auctioneer Role

**Overview**: Sellers who create auction listings, receive payments, and manage commissions

**Permissions**:
- ✓ Register account with required payment method details (bank, PayPal, or Easypaisa)
- ✓ Login and logout
- ✓ Create new auction listings (with item details, image, timing)
- ✓ Set starting bid amounts
- ✓ View own auction listings and bid history per auction
- ✓ Monitor bidding activity in real-time
- ✓ Delete own auctions (only before start time or after republish)
- ✓ Republish ended auctions with new timing parameters
- ✓ View pending commission balance
- ✓ Submit payment proof for commission settlement
- ✓ Upload proof image to Cloudinary
- ✓ Track commission settlement history
- ✓ Update profile information and payment method details
- ✓ Access "My Auctions" and "Submit Commission" dashboard sections
- ✓ View auction earnings and revenue summary

**Restrictions**:
- ✗ Cannot place bids on auctions (no bidding privilege)
- ✗ Cannot access Super Admin dashboard
- ✗ Cannot approve settlement proofs
- ✗ Cannot create auctions if unpaid commission balance > 0
- ✗ Cannot create multiple concurrent active auctions
- ✗ Cannot modify other users' data
- ✗ Cannot view other auctioneers' commission details
- ✗ Cannot refund bidders directly (must go through admin)

**Key Behaviors**:
- Auction automatically published when created (becomes active at startTime)
- Receives email notification when bidding begins
- Receives payment when bidder completes deposit payment
- Commission (5%) added to unpaid balance upon successful payment
- Must submit proof to settle commission before creating next auction
- Cannot create new listings while unpaid commission pending

**Data Access**:
- Own profile, auction listings, and bid history
- Own commission balance and settlement history
- Only own auction and payment data
- Cannot access other users' information

---

#### 9.1.3 Super Admin Role

**Overview**: Platform administrators responsible for governance, oversight, and compliance

**Permissions**:
- ✓ Login and logout
- ✓ View all users (Bidders, Auctioneers, Admins)
- ✓ View all payment proofs (regardless of status)
- ✓ Approve payment proofs with amount confirmation
- ✓ Reject payment proofs with optional reason/comment
- ✓ Access admin dashboard with analytics and reports
- ✓ View monthly revenue graph (aggregated commissions)
- ✓ View user registration trends (Bidders vs. Auctioneers by month)
- ✓ Delete auctions (for policy violations or duplicates)
- ✓ View all auctions, bids, and transactions
- ✓ Monitor platform health and metrics
- ✓ Export data and generate reports
- ✓ Manage other admin accounts (in extended version)
- ✓ View audit logs of deleted items and rejected proofs

**Restrictions**:
- ✗ Cannot participate in auctions (cannot bid or create listings)
- ✗ Cannot directly modify user balances (audit trail important)
- ✗ Cannot delete completed transactions
- ✗ Cannot approve own submissions (if ever needed)
- ✗ Cannot access payment method details (PCI compliance)
- ✗ Cannot manually override automated processes without logging
- ✗ Cannot impersonate users or manipulate user data

**Key Behaviors**:
- Reviews pending commission payment proofs regularly
- Verifies payment proof authenticity and accuracy
- Approves proofs which triggers automatic settlement via cron
- Monitors revenue and can identify trends
- Enforces policy violations through auction deletion
- Tracks admin actions for audit compliance
- Cannot earn commission or spend money on platform

**Data Access**:
- All user data (profiles, financial information, email addresses)
- All auction and transaction data
- All payment proof submissions
- Analytics and aggregated reporting data
- Audit logs of admin actions
- Cannot access password hashes or JWT secrets

**Activation**:
- Super Admin role assigned during user registration (not self-assigned)
- Typically only one or two per platform
- Requires manual setup by platform owner
- Logged with specific permissions

---

### 9.2 Permission Matrix

| Permission | Bidder | Auctioneer | Super Admin |
|-----------|--------|-----------|------------|
| Browse auctions | ✓ | ✓ | ✓ |
| Place bids | ✓ | ✗ | ✗ |
| Create auctions | ✗ | ✓ (conditional) | ✗ |
| Delete own auction | ✗ | ✓ | N/A |
| Delete any auction | ✗ | ✗ | ✓ |
| View own bids | ✓ | ✓ | ✗ |
| View all bids | ✗ | ✓ (own auctions) | ✓ |
| Pay for winning bid | ✓ | ✗ | ✗ |
| Submit commission proof | ✗ | ✓ | ✗ |
| Approve commission proof | ✗ | ✗ | ✓ |
| View payment proofs | ✗ | ✓ (own) | ✓ |
| Access dashboard | ✓ | ✓ | ✓ |
| View analytics | ✗ | Limited | ✓ |
| Modify user data | ✗ | Own only | ✓ |
| View leaderboard | ✓ | ✓ | ✓ |

---

## 10. Database Overview

### 10.1 Database Architecture

**Technology**: MongoDB (NoSQL document database)
- Schema validation: Mongoose.js with TypeScript-like schema definitions
- Document-oriented: Each collection stores JSON-like documents
- Scalability: Horizontal scaling via sharding supported
- Transactions: Multi-document ACID transactions available

**Collections**: Six core collections representing main entities

---

### 10.2 Collection Schemas and Data Models

#### 10.2.1 User Collection

**Purpose**: Stores user accounts, authentication credentials, profile information, and financial tracking

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // MongoDB auto-generated ID
  
  // Authentication & Identity
  userName: String (3-40 chars),          // Username chosen by user
  email: String (unique, required),       // Email, must be unique, lowercase
  password: String (hash, 8+ chars),      // Bcrypt hashed (never stored plaintext)
  role: Enum ["Auctioneer", "Bidder", "Super Admin"],
  
  // Profile Information
  profileImage: {
    public_id: String (Cloudinary ID),    // Cloud storage reference
    url: String (CDN URL)                 // Public image URL
  },
  address: String,                        // Physical address
  phone: String (11 digits),              // Phone number formatted
  
  // Payment Methods (For Auctioneers)
  bankAccountNumber: String,              // Bank account for withdrawals
  bankAccountName: String,                // Account holder name
  bankName: String,                       // Bank name
  easypaisaAccountNumber: String,         // Easypaisa mobile number
  paypalEmail: String,                    // PayPal account email
  
  // Financial Tracking
  unpaidCommission: Decimal (default 0),  // Sum of 5% commissions not yet settled
  auctionsWon: Number (default 0),        // Count of successful bids paid
  moneySpent: Decimal (default 0),        // Sum of all winning bid amounts (leaderboard key)
  
  // Transaction References
  pendingPayments: [ObjectId],            // References to Payment docs, status="Pending"
  completePayments: [ObjectId],           // References to Payment docs, status="Paid"
  
  // Metadata
  createdAt: Date (auto),                 // Account creation timestamp
  updatedAt: Date (auto),                 // Last modified timestamp
  
  // Methods
  comparePassword(plaintext) → Boolean    // Bcrypt comparison
  generateJsonWebToken() → String         // Returns JWT token
}
```

**Indices**:
- `{ email: 1, unique: true }` - For login lookups
- `{ userName: 1 }` - For username searches
- `{ role: 1 }` - For filtering by role
- `{ moneySpent: -1 }` - For leaderboard sorting (descending)

**Data Constraints**:
- Email must be unique across all users
- Username must be 3-40 characters
- Password must be at least 8 characters (enforced at registration)
- Phone must be exactly 11 digits for Pakistani standards
- Profile image required (non-null)
- Role cannot be modified after creation

**Typical Query Patterns**:
- `findOne({ email })` - Login lookup
- `findById(userId)` - Profile view
- `find({ role: "Auctioneer" }).sort({ createdAt: -1 })` - User growth report
- `find({ moneySpent: { $gt: 0 } }).sort({ moneySpent: -1 }).limit(100)` - Leaderboard

---

#### 10.2.2 Auction Collection

**Purpose**: Represents auction listings with item details, bidding state, and multi-step payment tracking

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // Auction ID
  
  // Item Details
  title: String (required),               // Item name/title
  description: String (required),         // Detailed item description
  category: String (required),            // Category enum (Electronics, Furniture, Art, etc.)
  condition: Enum ["New", "Used"],        // Item condition
  image: {
    public_id: String,                    // Cloudinary storage ID
    url: String                           // CDN URL
  },
  
  // Bidding Information
  startingBid: Decimal (required),        // Minimum acceptable bid
  currentBid: Decimal (default 0),        // Highest bid currently placed
  bids: [{                                // Array of all bids (could be optimized)
    _id: ObjectId,
    amount: Decimal,
    bidder: {
      id: ObjectId (ref User),
      userName: String,
      profileImage: {
        public_id: String,
        url: String
      }
    },
    createdAt: Date
  }],
  
  // Bidder Tracking
  highestBidder: ObjectId (ref User),     // Current highest bidder
  finalWinner: ObjectId (ref User),       // Final winning bidder (after payment)
  currentPaymentBidderId: ObjectId (ref User), // Bidder currently being asked to pay
  
  // Timing
  startTime: Date (required),             // Auction start datetime
  endTime: Date (required),               // Auction end datetime
  createdAt: Date (auto),                 // Document creation timestamp
  
  // State Management
  auctionState: Enum [
    "Active",                 // Bids being accepted
    "Waiting_Payment",        // Ended, awaiting deposit payment
    "Completed",              // Payment received or final winner
    "Cancelled"               // No bids or admin cancelled
  ],
  commissionCalculated: Boolean (default false), // Flag for settlement
  paymentInitiated: Boolean (default false),     // Payment workflow started
  
  // Payment History (per-auction tracking)
  paymentHistory: [{
    bidderId: ObjectId,
    status: String,           // "Pending", "Paid", "Expired"
    expiresAt: Date,
    paidAt: Date
  }],
  
  // Creator
  createdBy: ObjectId (ref User),         // Auctioneer who created auction
  
  // Metadata
  updatedAt: Date (auto)
}
```

**Indices**:
- `{ endTime: 1 }` - For "find ended auctions" queries (cron job)
- `{ createdBy: 1 }` - For "my auctions" queries
- `{ auctionState: 1 }` - For filtering by state
- `{ startTime: 1, endTime: 1 }` - For active auctions query
- `{ highestBidder: 1 }` - For "my wins" queries

**Data Constraints**:
- All required fields must be populated before insertion
- startTime must be in future at creation
- endTime must be after startTime
- currentBid cannot be less than startingBid
- auctionState must be valid enum value

**Typical Query Patterns**:
- `find({ auctionState: "Active" })` - Browse auctions
- `find({ endTime: { $lt: Date.now() }, paymentInitiated: false })` - Cron job for ended auctions
- `find({ createdBy: userId })` - Auctioneer's auctions
- `findById(auctionId)` - Auction details view

---

#### 10.2.3 Bid Collection

**Purpose**: Records all bid attempts across all auctions for history and analytics

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // Bid ID
  
  // Bid Details
  amount: Decimal (required),             // Bid amount in USD
  
  // Bidder Information
  bidder: {
    id: ObjectId (ref User, required),   // User making the bid
    userName: String,                     // Snapshot of username at bid time
    profileImage: {
      public_id: String,
      url: String
    }
  },
  
  // Auction Reference
  auctionItem: ObjectId (ref Auction, required), // Which auction this bid is for
  
  // Metadata
  createdAt: Date (auto),                 // Bid timestamp
  updatedAt: Date (auto),                 // Last update (if bid was increased)
  
  // Indices
  index { "bidder.id": 1, auctionItem: 1, unique: false } // Allows multiple bids
}
```

**Indices**:
- `{ "bidder.id": 1, auctionItem: 1 }` - Find if user already bid on auction
- `{ auctionItem: 1, amount: -1 }` - Get sorted bids for auction
- `{ "bidder.id": 1 }` - Get all bids by user
- `{ createdAt: -1 }` - For bid history sorting

**Data Constraints**:
- Bidder ID must reference valid User document
- Auction ID must reference valid Auction document
- Amount must be positive decimal
- Cannot create duplicate bid for same bidder on same auction (update instead)

**Typical Query Patterns**:
- `find({ auctionItem: auctionId }).sort({ amount: -1 })` - Bid history for auction
- `find({ "bidder.id": userId, auctionItem: auctionId })` - Check if user bid on auction
- `find({ "bidder.id": userId }).sort({ createdAt: -1 })` - User's complete bid history
- `findOneAndUpdate({ "bidder.id": userId, auctionItem }, { amount: newAmount })` - Update bid

---

#### 10.2.4 Payment Collection

**Purpose**: Tracks deposit payments required from auction winners, with complex state tracking for deadline enforcement and cascading

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // Payment ID
  
  // References
  auctionItem: ObjectId (ref Auction, required), // Which auction
  bidder: ObjectId (ref User, required),  // Who must pay (winner)
  
  // Payment Amounts
  bidAmount: Decimal (required),          // Original winning bid amount
  paymentAmount: Decimal (required),      // 20% of bidAmount
  
  // Payment Status
  paymentStatus: Enum [
    "Pending",                // Not yet paid
    "Paid",                   // Successfully paid
    "Failed",                 // Payment attempt failed
    "Expired"                 // Deadline passed
  ] (default "Pending"),
  
  paymentMethod: Enum [
    "Stripe",                 // Credit card via Stripe
    "Manual",                 // Bank transfer, PayPal, Easypaisa
    "Pending"                 // Not yet selected
  ] (default "Pending"),
  
  // Stripe Integration
  stripeSessionId: String,                // Stripe checkout session ID (if using Stripe)
  
  // Payment Proof (for manual payments)
  paymentProofImage: {
    public_id: String (Cloudinary),       // Image of payment proof
    url: String
  },
  
  // Timeline
  paidAt: Date,                           // When payment was completed
  expiresAt: Date (required),             // Payment deadline (12 hours from creation)
  createdAt: Date (auto),                 // When payment was initiated
  
  // Cascading Bidders
  bidderSequence: Number (default 0),     // Position in fallback queue (0=first, 1=second, etc.)
  reason: String,                         // Why this bid is being asked to pay
                                          // e.g., "Win confirmation", "Fallback - previous expired"
  
  // Metadata
  updatedAt: Date (auto)
}
```

**Indices**:
- `{ bidder: 1, paymentStatus: 1 }` - User's pending payments
- `{ expiresAt: 1, paymentStatus: 1 }` - Cron job for expiry detection
- `{ auctionItem: 1 }` - All payments for an auction
- `{ stripeSessionId: 1, sparse: true }` - Stripe verification lookup

**Data Constraints**:
- paymentAmount must equal 20% of bidAmount
- expiresAt must be after createdAt
- paymentStatus must be valid enum
- bidderSequence must be non-negative integer
- Cannot have two "Pending" payments for same bidder-auction combo

**Typical Query Patterns**:
- `find({ bidder: userId, paymentStatus: "Pending" }).sort({ expiresAt: 1 })` - User's pending payments
- `find({ expiresAt: { $lt: Date.now() }, paymentStatus: "Pending" })` - Expired payments (cron)
- `findOne({ stripeSessionId })` - Stripe payment verification
- `find({ auctionItem, paymentStatus: "Paid" })` - Payments received for auction

---

#### 10.2.5 Commission Collection

**Purpose**: Permanent settlement records for commissions, created when payment proofs are approved

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // Commission record ID
  
  // Commission Details
  amount: Decimal (required),             // Commission amount (5% of winning bid)
  user: ObjectId (ref User, required),    // Auctioneer who earned commission
  
  // Metadata
  createdAt: Date (auto),                 // When settlement was processed
  
  // Note: No status field - this collection only stores SETTLED commissions
  // Pending/approved commissions are tracked in PaymentProof collection
}
```

**Indices**:
- `{ user: 1, createdAt: -1 }` - User's settlement history
- `{ createdAt: -1 }` - For monthly revenue aggregation (cron job)
- `{ "createdAt": { $gte: dateStart, $lte: dateEnd } }` - Monthly filtering for reports

**Data Constraints**:
- User must be valid auctioneer
- Amount must be positive
- Only created after proof approved and settled
- Immutable (no updates after creation)

**Typical Query Patterns**:
- `find({ user: userId }).sort({ createdAt: -1 })` - Settlement history
- `find({ createdAt: { $gte: monthStart, $lte: monthEnd } })` - Monthly revenue
- `aggregate([{ $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amount" } } }])` - Revenue by month

---

#### 10.2.6 CommissionProof Collection

**Purpose**: Tracks commission payment proof submissions with verification workflow and status tracking

**Document Structure**:
```javascript
{
  _id: ObjectId,                          // Proof record ID
  
  // User & Amount
  userId: ObjectId (ref User, required),  // Auctioneer submitting proof
  amount: Decimal (required),             // Amount claimed to be paid (must be ≤ unpaidCommission)
  
  // Proof Image
  proof: {
    public_id: String (Cloudinary),       // Image of payment proof/receipt
    url: String
  },
  
  // Submission Details
  comment: String,                        // Auctioneer's explanation/notes
  uploadedAt: Date (auto),                // Submission timestamp
  
  // Approval Workflow
  status: Enum [
    "Pending",                // Awaiting admin review
    "Approved",               // Admin verified, awaiting settlement
    "Rejected",               // Admin rejected (fake/incorrect)
    "Settled"                 // Cron job processed (commission deducted)
  ] (default "Pending"),
  
  // Approval Details
  approvedBy: ObjectId (ref User, sparse), // Admin who approved
  approvedAt: Date,                       // When admin approved
  rejectedReason: String,                 // Why proof was rejected (if rejected)
  
  // Metadata
  updatedAt: Date (auto)
}
```

**Workflow States**:
1. User submits proof → status = "Pending"
2. Admin reviews → either "Approved" or "Rejected"
3. Cron job detects "Approved" → status = "Settled"

**Indices**:
- `{ status: 1, uploadedAt: -1 }` - Admin dashboard listing
- `{ userId: 1, status: 1 }` - User's proof history
- `{ status: 1, approvedAt: -1 }` - For cron job (find "Approved" proofs)

**Data Constraints**:
- Amount must be positive and ≤ unpaidCommission
- Proof image required (non-null)
- Status must be valid enum
- One proof per submission (cannot duplicate)

**Typical Query Patterns**:
- `find({ status: "Pending" }).sort({ uploadedAt: 1 })` - Admin dashboard
- `find({ status: "Approved" })` - Cron job for settlement
- `find({ userId, status: { $in: ["Pending", "Approved", "Settled"] } })` - User's submission history

---

### 10.3 Relationships Between Collections

**Entity Relationship Diagram**:
```
User(id)
  ├── 1-to-Many ──> Auction(createdBy)     # Auctioner creates auctions
  ├── 1-to-Many ──> Bid(bidder.id)         # Bidder places bids
  ├── 1-to-Many ──> Payment(bidder)        # Bidder has pending/completed payments
  ├── 1-to-Many ──> Commission(user)       # Auctioneer earns commissions
  └── 1-to-Many ──> CommissionProof(userId) # Auctioneer submits proofs

Auction(id)
  ├── Many-to-1 ──> User(createdBy)        # Created by auctioneer
  ├── 1-to-Many ──> Bid(auctionItem)       # Multiple bids per auction
  ├── 1-to-Many ──> Payment(auctionItem)   # Multiple payment attempts (cascading)
  └── 0-to-1 ──> User(highestBidder)       # Current highest bidder
  └── 0-to-1 ──> User(finalWinner)         # Final paying winner

Bid(id)
  ├── Many-to-1 ──> User(bidder.id)        # Bid placed by user
  └── Many-to-1 ──> Auction(auctionItem)   # Bid is on auction

Payment(id)
  ├── Many-to-1 ──> User(bidder)           # Bidder owes payment
  └── Many-to-1 ──> Auction(auctionItem)   # For this auction

Commission(id) & CommissionProof(id)
  └── Many-to-1 ──> User(user/userId)      # Earned/submitted by auctioneer
```

**Key Relationship Types**:

1. **User → Auction (One-to-Many)**
   - One auctioneer creates multiple auctions
   - Foreign key: `auction.createdBy = user._id`
   - Population: When fetching user's auction list

2. **Auction → Bid (One-to-Many)**
   - One auction receives multiple bids from different users
   - Foreign key: `bid.auctionItem = auction._id`
   - Population: When displaying bid history in auction details

3. **User → Bid (One-to-Many)**
   - One bidder places multiple bids across auctions
   - Foreign key: `bid.bidder.id = user._id`
   - Population: When showing "My Bids" dashboard

4. **Auction → Payment (One-to-Many)**
   - One auction may have multiple payment records (cascading bidders)
   - Foreign key: `payment.auctionItem = auction._id`
   - Multiple payments possible as system offers to next bidders
   - Linked via `bidderSequence` (0 = first payment, 1 = second, etc.)

5. **User → Commission (One-to-Many)**
   - One auctioneer may earn multiple commissions from different auctions
   - Foreign key: `commission.user = user._id`
   - Immutable records (never deleted or updated)

6. **User → CommissionProof (One-to-Many)**
   - One auctioneer submits multiple proofs for different commission batches
   - Foreign key: `commissioProof.userId = user._id`
   - Status transitions: Pending → Approved/Rejected → Settled

### 10.4 Data Types and Constraints

| Field Type | MongoDB Type | Constraints | Example |
|-----------|-------------|-------------|---------|
| ID | ObjectId | Auto-generated, unique | `507f1f77bcf86cd799439011` |
| Decimal | Decimal128 or Number | For financial data, precision to cents | `99.99` |
| Email | String | Unique, lowercase, valid format | `user@example.com` |
| Boolean | Boolean | true/false | `true` |
| Date | Date | ISO 8601 format | `2025-03-22T10:30:00Z` |
| Enum | String | Predefined values only | `"Active"`, `"Completed"` |
| String | String | Max length validated at schema | Title must be 1-255 chars |

### 10.5 Data Validation Rules

**User Collection**:
- Email: must match regex `/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/`
- Username: 3-40 characters, alphanumeric + underscore
- Password: minimum 8 characters (enforced at auth, not stored)
- Phone: exactly 11 digits (Pakistani standard)
- Unpaid commission: must be ≥ 0

**Auction Collection**:
- Title: 1-200 characters, non-empty
- Starting bid: must be positive number
- Dates: startTime < endTime, startTime in future
- Category: must be predefined enum value
- Image: required, not null

**Bid Collection**:
- Amount: must be positive, > currentBid
- Bidder: must reference valid User
- Auction: must reference valid Auction

**Payment Collection**:
- Payment amount: exactly 20% of bid amount
- Deadline: 12 hours from creation
- Status: must be valid enum
- Sequence: non-negative integer

**Commission/CommissionProof**:
- Amount: positive, ≤ user's unpaidCommission
- Status: valid enum value

### 10.6 Database Queries and Aggregations

**Example Query 1: Get auction details with bid history**
```javascript
db.auctions.findOne({ _id: auctionId }).populate('createdBy', 'userName profileImage').populate('highestBidder', 'userName')
// Returns: Full auction document with user information embedded
```

**Example Query 2: Get user's pending payments**
```javascript
db.payments.find({ bidder: userId, paymentStatus: "Pending" }).sort({ expiresAt: 1 })
// Returns: Array of pending payments, sorted by deadline (nearest first)
```

**Example Query 3: Calculate total money spent (for leaderboard)**
```javascript
db.payments.aggregate([
  { $match: { bidder: userId, paymentStatus: "Paid" } },
  { $group: { _id: "$bidder", totalSpent: { $sum: "$bidAmount" } } }
])
// Returns: Total money spent by user across all auctions
```

**Example Query 4: Find expired payments (cron job)**
```javascript
db.payments.find({ expiresAt: { $lt: new Date() }, paymentStatus: "Pending" })
// Returns: All payments that have exceeded deadline
```

**Example Query 5: Monthly revenue aggregation**
```javascript
db.commissions.aggregate([
  { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
  { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
])
// Returns: Total commission earned in month
```

---

## 11. Conclusion

BidBazaar 2.0 represents a comprehensive solution to the challenges of online auction management. By combining real-time bidding capabilities with automated payment processing and commission management, the platform provides a seamless experience for all user types—bidders, auctioneers, and administrators.

The full-stack MERN architecture ensures scalability, maintainability, and performance across high-volume transactions. The integration of Stripe for secure payments, Cloudinary for image delivery, and automated background cron jobs for lifecycle management creates a robust and reliable system.

Through clear role-based access control, transparent commission tracking, and comprehensive admin oversight, BidBazaar establishes trust in the auction ecosystem while automating complex multi-step workflows that would otherwise require significant manual intervention.

---

## Document Information

- **Document Version**: 1.0
- **Last Updated**: March 22, 2026
- **Author**: Generated from comprehensive codebase analysis
- **Project Repository**: https://github.com/Enayat-Ur-Rehman/BidBazaar
- **Technology Stack**: MERN (MongoDB, Express, React, Node.js)

