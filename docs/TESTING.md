# Testing & Quality Assurance Plan
## FeastHub — Premium Restaurant & Food Delivery Platform

---

## 1. Automated Verification & Build Check
Execute the Next.js production compiler to verify zero TypeScript errors, clean JSX typing, and correct module exports:
```bash
npm run build
```

---

## 2. Manual End-to-End User Journey Tests

### Test Scenario A: Discovery to Order Placement
1. **Home Discovery**:
   - Open `/`. Verify greeting displays "Good evening, Tanvir 👋" (or current time greeting).
   - Check promotional banner carousel auto-advances or can be navigated via arrows and dot indicators.
   - Click a category (e.g. "Burgers"), verify navigation to `/explore?category=burgers`.
2. **Search & Multi-Filtering**:
   - Go to `/explore`. Type "smash" in the search input. Verify *The Lab Monster Double Smashed Beef* displays immediately.
   - Adjust Price slider to ৳400. Verify higher priced items disappear.
   - Click "Vegetarian Dishes Only" filter. Verify only vegetarian dishes remain.
   - Click "Reset all filters" to restore full list.
3. **Restaurant & Menu Details**:
   - Navigate to `/restaurants/rest-1` (*The Burger Lab*).
   - Switch between **Menu**, **Reviews**, and **Restaurant Info** tabs.
   - Click "Reserve a Table" button on hero cover. Ensure modal opens with date/time/guest pickers.
4. **Dish Customization & Cart Addition**:
   - Click on *The Lab Monster Double Smashed Beef*.
   - In the modal, select "Extra Cheddar Slice (+৳50)", set quantity to 2, add special cooking note "Extra napkins please".
   - Click "Add to Cart". Verify toast appears and cart counter in navbar updates.
5. **Cart & Voucher Redemption**:
   - Go to `/cart`. Verify items, quantities, and addon options display correctly.
   - Enter promo code `FIRST20` and click "Apply". Verify discount of 20% is subtracted from subtotal.
   - Click "Proceed to Checkout".
6. **Checkout & Simulated Payment**:
   - Select saved address (Home: Road 11, Gulshan 2).
   - Choose payment method: **bKash / Nagad Mobile Payment**.
   - Click "Place Order". Verify loading state and redirection to `/order-success?orderId=FD-xxxxx`.

---

### Test Scenario B: Live Order Tracking & Simulation
1. **Order Confirmation & Tracking**:
   - On the `/order-success` screen, click "Track Order Live".
   - Confirm order status displays "Confirmed".
   - Inspect the vector SVG map: verify Kitchen pin, Customer pin, route polyline, and initial Courier marker position.
2. **Milestone Stepping Simulation**:
   - Click the "Simulate Next Status" button.
   - Verify status progresses: Confirmed -> Kitchen Preparing -> Rider Picked Up -> On The Way -> Delivered.
   - Observe courier marker dynamically animating along Kemal Ataturk Ave and Gulshan Ave as percentage progresses.
   - On "Delivered", verify "Delivery Complete" celebration banner appears.
3. **Courier Contact & Live Chat**:
   - Click "Chat" on the courier card. Type a message "Please ring the bell at 4B".
   - Send and verify message appears in the chat thread, followed by courier automated reply.

---

### Test Scenario C: Table Reservation & Post-Delivery Review
1. **Table Reservation**:
   - Go to `/reservations`. Click "Book a New Table".
   - Select date, time slot "07:30 PM", party size 4 guests, and special requests note.
   - Click "Confirm Reservation". Verify confirmation screen with booking ID `#RES-xxxx`.
   - Verify booking appears under "My Bookings" with "Confirmed" badge.
2. **Reviewing Delivered Orders**:
   - Go to `/orders`. On a delivered order, click "Write Review".
   - Select 5 stars, select tag "Super Delicious", enter comment "Exceptional crust and fast delivery!".
   - Click "Submit Review". Verify review is added and reflects on the restaurant's review list.

---

### Test Scenario D: Admin Operations & Courier Portal
1. **Admin Portal**:
   - Navigate to `/admin`. Verify 5 KPI cards, velocity charts, and live order streams are populated.
   - Go to `/admin/orders`. Click a status button on an order to transition it to "Ready for Pickup".
   - Go to `/admin/restaurants`. Toggle a restaurant closed and verify status updates.
   - Go to `/admin/menu`. Edit the price of a dish and toggle availability.
2. **Rider Portal**:
   - Navigate to `/rider`. Toggle online/offline status.
   - View assigned orders and advance order milestone.
   - Switch back to Customer Tracking `/tracking/[id]` to verify synchronization!

---

## 3. Viewport & Responsiveness Testing
Verify with browser DevTools at the following target dimensions:
- Mobile Small: **320px**
- Mobile Standard: **375px**, **390px**, **430px** (iPhone 14/15/16 Pro Max)
- Tablet Portrait: **768px** (iPad)
- Desktop: **1024px**, **1280px**, **1440px**

*Checklist*:
- Zero horizontal overflow or scrollbar.
- Sticky mobile bottom navigation visible on mobile; desktop header with search and links visible on desktop.
- Touch targets at least 44px on mobile devices.
