# FixNear India 🇮🇳 — Verified Hyperlocal Services Platform

**FixNear** is a full-stack on-demand home and trade services marketplace built specifically for the Indian market. It connects customers with government-verified trade technicians (electricians, plumbers, AC engineers, appliance technicians, and cleaning specialists) with standardized transparent pricing in ₹ (INR), instant OTP verification, simulated digital payments, and superuser dispute mediation.

---

## 🎓 Teacher & Evaluator Quick Guide

To test and grade all aspects of the platform on the live Vercel deployment:

### 1. Test Credentials
| Portal | Email | Password | Role Description |
| :--- | :--- | :--- | :--- |
| **Admin Console** | `harsh@fixnear.in` | `password123` | **Harsh (Platform Superuser)**: License audits, dispute mediation, status override |
| **Customer Portal** | `priya@fixnear.in` | `password123` | **Priya Sharma**: Active booking pipeline, rating submissions, complaints |
| **Technician Portal** | `alex@apexpower.in` | `password123` | **Alex Vance (Apex Power Electricals)**: Job requests, license uploads |

*(Note: On the `/login` page, you can also click the handy **"Click to fill"** evaluation badges to auto-populate credentials).*

### 2. Live Registration & OTP Verification Testing
- Click **Create Account** on `/login`.
- Enter any valid email and 10-digit mobile number (`0` to `9`).
- Click **Send OTP** $\rightarrow$ Click the **"Click to fill"** demo OTP badge or enter code `123456` $\rightarrow$ Click **Verify OTP** (turns green ✓).
- For Technicians: Upload any trade license `.pdf` or `.png`.

---

## 🚀 Key Features

### 👤 1. Customer Experience
- **Service Discovery & Filtering**: Search by trade, location (Mumbai, Bengaluru, Delhi NCR), minimum rating, and verified badge.
- **Upfront Transparent Pricing**: Instant itemized cost breakdown (Inspection Visit Charge + Estimated Labor Rate + Platform Guarantee Fee).
- **Service Booking**: Interactive calendar slot selection, date picker, and address entry.
- **Live 4-Stage Booking Pipeline**: `Requested` 🕒 $\rightarrow$ `Accepted` ✅ $\rightarrow$ `In Progress` 🛠️ $\rightarrow$ `Completed & Paid` 🎉.
- **Razorpay Sandbox Simulator**: Pay online via simulated UPI (GPay / PhonePe / Paytm / BHIM QR), Credit/Debit Card, or NetBanking.
- **Ratings & Reviews**: 1–5 star ratings and verified feedback upon service fulfillment.
- **Dispute Mediation**: Raise support dispute tickets directly routed to Admin Harsh.

### 🛠️ 2. Technician / Service Provider Portal
- **Job Request Management**: Review incoming job appointments with service addresses and customer instructions.
- **Status State Machine**: Advance orders from `Accepted` to `In Progress` to `Completed`.
- **Government Document Licensing**: Upload government electrical licenses, ITI diplomas, or trade IDs for Admin verification.
- **Provider Analytics**: Track job revenue, active jobs count, and verified rating.

### 🛡️ 3. Admin Command Center (Harsh)
- **Superuser Booking Override**: Directly accept, advance, or fulfill orders on behalf of providers.
- **Licensing Audit Queue**: Inspect submitted technician trade documents and approve or reject applications.
- **Dispute Mediation Hub**: Investigate customer complaints, apply mediation rulings, and post official resolution notes.
- **Fleet Metrics**: Live tracking of paid revenue, active bookings pipeline, and fleet metrics.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4 (Full Modern Light Mode), Lucide Icons, React Router DOM v7, TanStack Query, Zustand.
- **Backend**: Modular Express.js REST API with repository pattern (`src/modules/*`), JWT auth, bcryptjs.
- **Database**: SQLite (`better-sqlite3`) with automatic schema initialization and pre-seeded sample data on cold start.
- **Deployment**: Vercel Multi-Service architecture with public rewrites and service bindings.

---

## 🏃 Running Locally

Run both frontend (port 3000) and backend (port 5000) simultaneously with one command:

```bash
npm run dev
```

- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
