# FeastHub 🍽️
### Premium Restaurant & Food Delivery Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**FeastHub** is a high-aesthetic, production-ready, responsive **Restaurant & Food Delivery Application** engineered for Dhaka's metropolitan dining scene. It delivers an end-to-end user experience comparable to modern commercial food ordering platforms—including restaurant discovery, menu exploration, food customizations, cart & checkout, simulated mobile payments, **live animated delivery tracking on a vector map**, table reservations, customer reviews, and dedicated portals for **Restaurant Admins** and **Delivery Couriers**.

---

## 🌟 Key Features

### 1. Customer Dining & Delivery Portal
- **Culinary Discovery & Home Hub**:
  - Dynamic user greeting based on time of day (e.g. *"Good evening, Tanvir 👋"*).
  - Neighborhood delivery area selector (Gulshan 2, Gulshan 1, Banani, Dhanmondi, Uttara, Mirpur).
  - Horizontal food categories carousel (Burgers, Pizza, Biryani, Chicken, Pasta, Desserts, Beverages, Healthy).
  - Multi-slide promotional carousel with one-click voucher codes (`FIRST20`, `FEAST100`).
  - Top-rated restaurants grid with ratings, reviews, delivery times, and fees.
  - Popular food dishes grid with quick 1-click cart addition.
- **Explore & Advanced Multi-Filtering**:
  - Live search with instant debounce across restaurants, dishes, and cuisines.
  - Granular filter controls: Minimum rating (4.0+, 4.5+), price bracket slider, delivery time (<30 mins), vegetarian dishes only, and special promotions.
  - Sorting: Recommended, Top Rated, Price Low-to-High, Price High-to-Low, Fastest Delivery.
- **Restaurant Details & Menu Navigation**:
  - Hero cover photography, brand logos, and hygiene trust badges.
  - Tabs for **Menu**, **Verified Customer Reviews**, and **Restaurant Information**.
  - Categorized sticky menu pills (Starters, Burgers, Pizzas, Mains, Desserts, Beverages).
  - Direct "Reserve a Table" action.
- **Dish Customization & Details**:
  - Modal and standalone URL routes (`/food/[id]`).
  - Single-choice and multiple-choice addon options (extra patties, cheeses, sauces).
  - Calorie counters, preparation times, dietary badges, and special kitchen instructions.
- **Cart & Simulated Checkout**:
  - Interactive cart drawer/page with live quantity adjustments, addon breakdowns, and item deletion.
  - Voucher redemption engine calculating real-time discount subtotals.
  - Saved delivery address book with "Add New Address" modal.
  - Simulated payment options: **Cash on Delivery**, **Credit/Debit Card**, and **Mobile Payment (bKash / Nagad)**.
- **Simulated Real-Time Order Tracking**:
  - Vector SVG delivery map with styled Dhaka avenues (Kemal Ataturk Ave, Gulshan Ave, Madani Ave, Gulshan Lake).
  - Dynamic animated courier marker traversing the route in sync with order completion percentage.
  - 5-stage milestone tracker (Confirmed -> Kitchen Preparing -> Rider Picked Up -> On The Way -> Delivered).
  - Interactive **"Simulate Next Status"** button to step through the order lifecycle.
  - Assigned rider card with vehicle details, rating, call action, and direct interactive courier chat simulation.
- **Table Reservation System**:
  - Date picker, time slot selector, guest counter (1–6+ guests), and special requests note.
  - Instant booking ID generation (e.g. `#RES-2048`) and persistence in "My Bookings".
- **Customer Ratings & Reviews**:
  - 5-star ratings, quick praise tags, and verified reviews feed.
  - Post-delivery review modal that recalculates restaurant average ratings instantly.
- **Customer Account, Favorites & Notifications**:
  - Saved favorites tab (Restaurants & Dishes) with persistent storage.
  - Notification center with unread badges, timestamps, and deep links to active tracking.

### 2. Admin Operations Portal (`/admin/*`)
- **Executive Analytics Dashboard**:
  - 5 KPI metric cards: Total Orders, Gross Revenue (৳), Active Orders, Reservations, Kitchens.
  - Peak-hour order velocity visualization bar chart.
  - Live incoming customer order stream with instant dispatch shortcuts.
- **Order Dispatch Workflow**:
  - Status management: Pending -> Confirmed -> Preparing -> Ready -> Picked Up -> On The Way -> Delivered.
- **Kitchen Management**:
  - Operational status toggle (Open for Orders vs. Temporarily Closed).
- **Menu Catalog**:
  - Searchable catalog of 90+ dishes with inline price editor and in-stock/sold-out toggles.
- **Reservation Management**:
  - Approve or cancel customer table bookings.
- **Review Moderation**:
  - Diner feedback monitor and ratings analysis.

### 3. Delivery Rider Portal (`/rider/*`)
- **Courier Dashboard**:
  - Online/Offline availability toggle.
  - Daily payout calculation (৳95 per drop + bonuses).
  - Assigned pickup (Kitchen) and drop-off (Customer) locations with turn-by-turn simulation notes.
  - One-click milestone status updates that synchronize with the customer's live tracking screen!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Centralized React Context (`AppContext`) with automatic `localStorage` persistence
- **Currency**: Bangladeshi Taka (`৳`)

---

## 📂 Project Structure

```
c:\Restaurant App\
├── README.md
├── package.json
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── next.config.mjs
├── docs/
│   ├── PRD.md
│   ├── ANTIGRAVITY-PROMPTS.md
│   ├── DEVELOPMENT-LOG.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx (Home Screen)
    │   ├── globals.css
    │   ├── explore/page.tsx (Explore & Multi-Filters)
    │   ├── restaurants/[id]/page.tsx (Restaurant & Menu)
    │   ├── food/[id]/page.tsx (Food Details)
    │   ├── cart/page.tsx (Cart & Vouchers)
    │   ├── checkout/page.tsx (Checkout & Payments)
    │   ├── order-success/page.tsx (Order Confirmation)
    │   ├── tracking/[id]/page.tsx (Live GPS Order Tracking)
    │   ├── orders/page.tsx (Active & Past Orders)
    │   ├── reservations/page.tsx (Table Booking Hub)
    │   ├── favorites/page.tsx (Saved Favorites)
    │   ├── notifications/page.tsx (Notification Center)
    │   ├── profile/page.tsx (Customer Profile)
    │   ├── settings/page.tsx (Settings)
    │   ├── admin/
    │   │   ├── layout.tsx (Admin Layout & Sidebar)
    │   │   ├── page.tsx (Admin Dashboard)
    │   │   ├── orders/page.tsx (Order Management)
    │   │   ├── restaurants/page.tsx (Kitchen Partners)
    │   │   ├── menu/page.tsx (Menu Catalog)
    │   │   ├── reservations/page.tsx (Reservations Management)
    │   │   └── reviews/page.tsx (Reviews Moderation)
    │   └── rider/
    │       ├── layout.tsx (Rider Layout)
    │       ├── page.tsx (Rider Dashboard & Milestones)
    ├── components/
    │   ├── ui/ (Button, Badge, Modal, Toast)
    │   ├── layout/ (Navbar, BottomNav, Footer, AdminSidebar)
    │   ├── home/ (PromoCarousel, CategoryScroller, RestaurantCard, FoodCard)
    │   ├── tracking/ (TrackingMap, TrackingTimeline, RiderContactCard)
    │   ├── restaurant/ (ReservationModal)
    │   ├── food/ (FoodModal)
    │   └── orders/ (ReviewModal)
    ├── context/
    │   └── AppContext.tsx (Unified State & LocalStorage Sync)
    ├── data/
    │   ├── types.ts (Strict TypeScript Types)
    │   └── mockData.ts (10 Restaurants, 90+ Dishes, 25+ Reviews, Orders, Vouchers)
    └── utils/
        └── formatters.ts (Currency ৳, Timestamps, Status Badges)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17.0+ or Node.js 20+ LTS
- npm or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/feasthub-restaurant-app.git
   cd feasthub-restaurant-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🎯 Demo Walkthrough Guide

Use the quick role switcher at the very top of the navigation bar to easily jump between **Customer**, **Admin**, and **Rider** perspectives:

1. **Ordering Flow**:
   - On the **Home** page, browse food categories or search for "Burger".
   - Open *The Burger Lab* (`/restaurants/rest-1`) and pick *The Lab Monster Double Smashed Beef*.
   - Add extra cheddar cheese and add to cart.
   - Go to `/cart`, enter promo code `FIRST20`, and proceed to checkout.
   - Select bKash payment and place the order.
2. **Live Tracking & Simulation**:
   - On `/order-success`, click **Track Order Live** to view `/tracking/FD-xxxxx`.
   - Observe the vector map with the animated courier marker.
   - Click **"Simulate Next Status"** to advance the order step-by-step to **Delivered**.
   - Test the simulated direct courier chat.
3. **Table Reservation**:
   - Visit `/reservations`, click **Book a New Table**, select date and party size, and confirm.
4. **Admin Management**:
   - Switch to `/admin` to view live revenue, incoming orders, kitchen operational toggles, and menu price editors.
5. **Rider Execution**:
   - Switch to `/rider` to toggle online courier status, view customer notes, and advance delivery milestones.
