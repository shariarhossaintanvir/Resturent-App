# Antigravity AI Engineering Prompts & Directives
## FeastHub — Premium Restaurant & Food Delivery Platform

This document archives the prompt patterns, architectural instructions, and design guidelines used to build the FeastHub application.

---

## 1. Master System Prompt
```markdown
You are an expert product designer, senior frontend engineer, UX engineer, and AI-assisted application architect.
Build a complete, premium, modern, responsive Restaurant & Food Delivery Application.
This is an APPLICATION, not a simple landing page or static website.
The final result must feel like a real-world food delivery product similar in quality to a modern commercial food-ordering platform.
```

---

## 2. Design System & Aesthetics Directives
- **Palette**: Avoid generic colors. Use warm gourmet amber (`#F97316` / `#EA580C`) paired with deep emerald (`#10B981`) and sleek dark mode surfaces (`#0B0F17`).
- **Typography**: Crisp typographic hierarchy with sans-serif styling, high contrast, and readable pill badges.
- **Glassmorphism**: Subtle `backdrop-blur-md bg-white/80` overlays for floating bars and modals.
- **Micro-interactions**: Hover lifts on cards (`-translate-y-1`), pulsing live GPS radar beacons, and toast animations.

---

## 3. Workflow Prompts & Role Segregation
- **Customer Portal**: Focus on fast discovery, zero-friction customization, live price tallies in Bangladeshi Taka (`৳`), and animated delivery progress.
- **Admin Management**: Focus on high-density information architecture, KPI visibility, order dispatch workflow transitions, and menu availability toggles.
- **Rider Experience**: Mobile-first single-handed controls for accepting drops, viewing delivery notes, contacting customers, and updating milestones.

---

## 4. Key Architectural Patterns
- **Single-Source-of-Truth Store**: Unified `AppContext` synchronizing cart, orders, reservations, reviews, favorites, and rider status into `localStorage`.
- **Zero External Backend Requirement**: Full simulation capabilities allow testing the entire lifecycle (order creation -> tracking -> status progression -> delivery -> customer review) completely client-side.
