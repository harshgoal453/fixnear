# FixNear — Full-Stack Local Service Marketplace Platform

**FixNear** connects customers with verified local service professionals such as electricians, plumbers, AC technicians, appliance repair technicians, and cleaning teams.

---

## 🚀 Key Features

### 👤 1. Customer Experience
- **Service Discovery & Filtering**: Search by keyword, category (Electrician, Plumber, AC Repair, Appliance Fix, etc.), city, rating, and verified status.
- **Upfront Transparent Pricing**: Instant cost breakdown (Category inspection rate + Technician hourly rate + Platform trust fee).
- **Service Booking**: Interactive slot selection, date picker, address entry, and job note details.
- **Live Booking Status Pipeline**: Track progress through 4 visual stages:
  1. `Requested` 🕒
  2. `Accepted` ✅
  3. `In Progress` 🛠️
  4. `Completed & Paid` 🎉
- **Ratings & Reviews**: Post star ratings (1–5 stars) and detailed reviews upon job completion.
- **Admin Mediation & Complaint Filing**: Submit dispute tickets directly for any booking.

### 🛠️ 2. Service Provider / Technician Portal
- **Job Request Management**: View incoming booking requests with customer details and issue notes.
- **Status State Machine**:
  - Accept request -> `Accepted`
  - Start work -> `In Progress`
  - Mark completed -> `Completed` + submit completion proof notes & invoice.
- **Live Availability Toggle**: Switch availability state between `Available`, `Busy`, and `Offline`.
- **Verification Document Submission**: Submit trade licenses, background checks, or insurance reference documents for Admin review.
- **Provider Analytics**: Track total job earnings, active pipeline count, and customer satisfaction rating.

### 🛡️ 3. Admin Command Center
- **Provider Verification Queue**: Review technician applications and single-click Approve (`Verified Pro` badge) or Reject document.
- **Complaint & Dispute Hub**: Investigate customer complaints, update investigation status (`Open`, `Under Investigation`, `Resolved`), and log official resolution notes.
- **Service Category Manager**: Create new service categories with custom base prices and icons.
- **Platform Analytics**: Aggregated system metrics (Total Paid Revenue, Active Bookings, Verified Provider Ratio, User Directory).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM v7
- **Backend**: Node.js, Express.js REST API
- **Database**: SQLite (`better-sqlite3`) with pre-seeded sample data
- **Role Switcher**: Live interactive perspective switcher in the navbar header to test Customer, Provider, and Admin views seamlessly.

---

## 🏃 How to Run Locally

### 1. Backend API
```bash
cd backend
npm install
node src/db/seed.js   # Seed database
node src/index.js      # Starts API on http://localhost:5000
```

### 2. Frontend Web App
```bash
cd frontend
npm install
npm run dev           # Starts Vite app on http://localhost:3000
```

---

## 📡 API Endpoints

- `GET /api/health` — Health check endpoint
- `GET /api/categories` — List service categories
- `GET /api/technicians` — Search & filter technicians
- `GET /api/technicians/:id` — Technician profile & reviews
- `PUT /api/technicians/:id` — Update profile/availability & upload verification doc
- `GET /api/bookings` — Filter bookings by customer/technician/status
- `POST /api/bookings` — Create new booking request
- `PATCH /api/bookings/:id/status` — Update booking status pipeline
- `POST /api/reviews` — Submit customer rating & review
- `GET /api/admin/verifications` — Admin verification queue
- `PATCH /api/admin/verifications/:techId` — Approve/Reject provider verification
- `GET /api/admin/complaints` — List support dispute tickets
- `PATCH /api/admin/complaints/:id` — Update dispute resolution notes
- `GET /api/stats` — Platform overview analytics
