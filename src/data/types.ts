export type DietaryType = 'veg' | 'non-veg' | 'halal' | 'vegan';

export interface FoodCustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodCustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: FoodCustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  dietary?: DietaryType[];
  prepTimeMinutes?: number;
  calories?: number;
  ingredients?: string[];
  customizations?: FoodCustomizationGroup[];
  isAvailable?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g. "25-35 min"
  deliveryFee: number; // e.g. 60 (BDT)
  minOrder: number; // e.g. 200 (BDT)
  coverImage: string;
  logoImage: string;
  address: string;
  area: string; // e.g. "Gulshan 2", "Banani", "Dhanmondi"
  openingHours: string; // e.g. "11:00 AM - 11:00 PM"
  isFeatured?: boolean;
  isOfferAvailable?: boolean;
  offerText?: string; // e.g. "20% OFF up to ৳150"
  isOpen?: boolean;
  featuredDishes?: string[]; // IDs
  menuCategories: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  image: string;
  color: string;
}

export interface SelectedAddon {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item uuid including customizations
  foodItem: FoodItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Picked Up'
  | 'On The Way'
  | 'Delivered'
  | 'Cancelled';

export interface DeliveryTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  time?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  deliveriesCount: number;
  vehicleType: string;
  vehiclePlate: string;
  currentLat?: number;
  currentLng?: number;
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  instructions?: string;
  isDefault?: boolean;
}

export type PaymentMethodType = 'cash_on_delivery' | 'card' | 'bkash' | 'nagad';

export interface Order {
  id: string; // e.g. "FD-10245"
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string }[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  estimatedDeliveryTime: string; // e.g. "25-35 mins"
  rider?: Rider;
  customerNotes?: string;
  reviewed?: boolean;
  riderLocationProgress?: number; // 0 to 100%
}

export interface Reservation {
  id: string; // e.g. "RES-2048"
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // "2026-09-25"
  time: string; // "07:30 PM"
  guests: number;
  specialRequests?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  foodId?: string;
  foodName?: string;
  tags?: string[];
  helpfulCount?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'reservation' | 'system';
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: DeliveryAddress[];
  defaultPaymentMethod: PaymentMethodType;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}
