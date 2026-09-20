# Product Requirements Document (PRD)
## FeastHub — Premium Restaurant & Food Delivery Application

---

## 1. Executive Summary
**FeastHub** is an enterprise-grade, high-aesthetic food delivery and table reservation web application designed for Dhaka's metropolitan areas (Gulshan, Banani, Dhanmondi, Uttara, Mirpur). The application provides end-to-end user workflows for discovering top-tier culinary kitchens, exploring menus, customizing dishes, cart & checkout, simulated payment, real-time live animated delivery tracking with moving couriers on a vector map, online table reservations, ratings/reviews, and complete operational dashboards for both Restaurant Admins and Delivery Couriers.

---

## 2. Core Personas
1. **Diners / Customers**:
   - Urban professionals, food enthusiasts, and families seeking premium meals from celebrated kitchens.
   - Requires transparent delivery times, interactive GPS tracking, easy customization, and zero waiting time table reservations.
2. **Kitchen / Restaurant Admins**:
   - Managers managing kitchen operations, real-time order acceptance, menu item availability, and reservation approvals.
3. **Delivery Riders / Couriers**:
   - Drivers picking up orders from kitchens and navigating to customer addresses with step-by-step milestone triggers.

---

## 3. Product Features & Scope

### 3.1 Customer Experience
- **Home & Discovery**:
  - Dynamic user greeting based on time of day.
  - Multi-neighborhood location selector (Gulshan, Banani, Dhanmondi, Uttara, Mirpur).
  - Horizontal food categories carousel with quick filters (Burgers, Pizza, Biryani, Chicken, Pasta, Desserts, Beverages, Healthy).
  - Promotional carousel with discount voucher codes (`FIRST20`, `FEAST100`).
  - Popular partner kitchens grid with badges, ratings, and delivery fees.
  - Popular dishes grid with 1-click add-to-cart and customization triggers.
- **Discovery & Advanced Exploration**:
  - Live debounce search query engine across dishes, restaurants and cuisines.
  - Multi-attribute filter panel: Minimum rating (4.0+, 4.5+), delivery time (<30 mins), price bracket slider, vegetarian only, and promotional offers.
  - Sorting: Recommended, Top Rated, Price Low-to-High, Price High-to-Low, Fastest Delivery.
- **Restaurant Details & Menu**:
  - High-resolution cover photo and verified brand badges.
  - Tabs: Menu, Customer Reviews, and Kitchen Info.
  - Categorized sticky pills for instant navigation across starters, mains, and beverages.
  - Direct "Reserve a Table" CTA.
- **Dish Details & Customization**:
  - Modal quick-view and dedicated URL routes (`/food/[id]`).
  - Single-choice and multiple-choice addon options (extra patties, cheeses, sauces, sides).
  - Preparation times, calorie indicators, and dietary badges (Halal, Vegetarian).
  - Special kitchen cooking notes input.
- **Cart & Simulated Checkout**:
  - Cart counter badge with live total calculation.
  - Voucher redemption engine validating minimum orders and calculating discount subtotals.
  - Address book management (Home, Work, Custom addresses).
  - Simulated payment methods: Cash on Delivery, Credit/Debit Card, Mobile Payment (bKash / Nagad).
  - Unique order ID generation (e.g. `#FD-10245`).
- **Simulated Real-Time Order Tracking**:
  - Custom vector map with street grid, waterways, and animated polyline delivery route.
  - Moving courier marker positioned dynamically based on order progress.
  - 5-stage milestone tracker (Confirmed -> Preparing -> Picked Up -> On The Way -> Delivered).
  - Interactive "Simulate Next Status" button for testing and demonstration.
  - Assigned rider card with vehicle details, rating, and direct interactive courier chat simulation.
- **Table Reservation Engine**:
  - Date picker, time slot selector, guest counter, and special requests note.
  - Instant booking ID generation (`#RES-2048`) and persistence in "My Reservations".
- **Ratings & Reviews**:
  - 5-star rating system with quick praise tags and verified customer reviews.
  - Post-delivery review modal that immediately recalculates restaurant ratings.
- **Customer Account & Profiles**:
  - Saved addresses manager, favorites list (Restaurants & Foods), notification center with unread badges.

---

### 3.2 Admin Operations Portal (`/admin/*`)
- **Executive Dashboard**:
  - KPI metric cards: Total Orders, Gross Revenue (৳), Active Orders, Reservations, Kitchens.
  - Peak-hour order volume visualization.
  - Real-time incoming customer order stream.
- **Order Dispatch Workflow**:
  - Full status lifecycle control: Pending -> Confirmed -> Preparing -> Ready -> Picked Up -> On The Way -> Delivered.
- **Restaurant Management**:
  - Kitchen operational status toggle (Open for Orders vs. Temporarily Closed).
  - Delivery fee parameters and rating reviews.
- **Menu Catalog**:
  - Searchable catalog of 90+ dishes with inline price editor and in-stock/sold-out toggles.
- **Reservation Management**:
  - Table seating approvals and cancellations.
- **Review Moderation**:
  - Live diner comment review feed.

---

### 3.3 Courier Rider Portal (`/rider/*`)
- **Rider Dashboard**:
  - Online/Offline availability toggle.
  - Daily payout calculation (৳95 per drop + bonuses).
  - Assigned pickup and delivery destinations with turn-by-turn simulation notes.
  - Status progression triggers that sync directly with the customer's live tracking map.

---

## 4. Technical Architecture
- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS with custom gourmet color palettes, glassmorphism, and responsive breakpoints.
- **Icons**: Lucide React
- **State & Persistence**: Centralized `AppContext` utilizing `localStorage` with SSR hydration guards.
- **Currency**: Bangladeshi Taka (`৳`) with authentic localization.
