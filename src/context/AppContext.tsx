'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CartItem,
  FoodItem,
  Order,
  OrderStatus,
  Reservation,
  Restaurant,
  Review,
  NotificationItem,
  UserProfile,
  SelectedAddon,
  DeliveryAddress,
  PaymentMethodType,
  Rider,
} from '../data/types';
import {
  mockRestaurants as initialRestaurants,
  mockFoodItems as initialFoodItems,
  mockReviews as initialReviews,
  mockUserProfile as initialUserProfile,
  mockPromoCodes,
  defaultMockOrders,
  defaultMockReservations,
  mockRider,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedPromo: string | null;
  total: number;
  addToCart: (foodItem: FoodItem, quantity?: number, addons?: SelectedAddon[], instructions?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Favorites
  favoriteRestaurantIds: string[];
  favoriteFoodIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteFood: (id: string) => void;
  isRestaurantFavorite: (id: string) => boolean;
  isFoodFavorite: (id: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (data: {
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethodType;
    customerNotes?: string;
  }) => string;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  simulateNextStatus: (orderId: string) => OrderStatus | null;
  getOrder: (orderId: string) => Order | undefined;
  reorder: (orderId: string) => void;

  // Reservations
  reservations: Reservation[];
  createReservation: (data: {
    restaurantId: string;
    restaurantName: string;
    date: string;
    time: string;
    guests: number;
    specialRequests?: string;
  }) => string;
  cancelReservation: (id: string) => void;
  updateReservationStatus: (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getRestaurantReviews: (restaurantId: string) => Review[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addDeliveryAddress: (address: Omit<DeliveryAddress, 'id'>) => void;

  // Restaurants & Menu (Admin editable state)
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  toggleRestaurantOpen: (restaurantId: string) => void;
  toggleFoodAvailability: (foodId: string) => void;
  updateFoodPrice: (foodId: string, newPrice: number) => void;

  // Rider
  rider: Rider;
  isRiderOnline: boolean;
  toggleRiderOnline: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'feasthub_cart_v1',
  PROMO: 'feasthub_promo_v1',
  FAV_REST: 'feasthub_fav_restaurants_v1',
  FAV_FOOD: 'feasthub_fav_foods_v1',
  ORDERS: 'feasthub_orders_v1',
  RESERVATIONS: 'feasthub_reservations_v1',
  REVIEWS: 'feasthub_reviews_v1',
  NOTIFICATIONS: 'feasthub_notifications_v1',
  PROFILE: 'feasthub_profile_v1',
  RESTS: 'feasthub_restaurants_v1',
  FOODS: 'feasthub_foods_v1',
  RIDER_ONLINE: 'feasthub_rider_online_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State with initial mock fallbacks
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-1', 'rest-3']);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(['food-101', 'food-301']);
  const [orders, setOrders] = useState<Order[]>(defaultMockOrders);
  const [reservations, setReservations] = useState<Reservation[]>(defaultMockReservations);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [rider, setRider] = useState<Rider>(mockRider);
  const [isRiderOnline, setIsRiderOnline] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Order Dispatched!',
      message: 'Your order #FD-10245 from The Burger Lab is on the way with Rakib Hasan.',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      read: false,
      type: 'order',
      link: '/tracking/FD-10245',
    },
    {
      id: 'notif-2',
      title: 'Weekend Treat 20% OFF',
      message: 'Use code FIRST20 to save 20% on all gourmet burgers today!',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      read: false,
      type: 'promo',
      link: '/explore',
    },
  ]);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedPromo = localStorage.getItem(STORAGE_KEYS.PROMO);
      if (savedPromo) setAppliedPromo(savedPromo);

      const savedFavRest = localStorage.getItem(STORAGE_KEYS.FAV_REST);
      if (savedFavRest) setFavoriteRestaurantIds(JSON.parse(savedFavRest));

      const savedFavFood = localStorage.getItem(STORAGE_KEYS.FAV_FOOD);
      if (savedFavFood) setFavoriteFoodIds(JSON.parse(savedFavFood));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedRes = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (savedRes) setReservations(JSON.parse(savedRes));

      const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedRests = localStorage.getItem(STORAGE_KEYS.RESTS);
      if (savedRests) setRestaurants(JSON.parse(savedRests));

      const savedFoods = localStorage.getItem(STORAGE_KEYS.FOODS);
      if (savedFoods) setFoodItems(JSON.parse(savedFoods));

      const savedRiderOnline = localStorage.getItem(STORAGE_KEYS.RIDER_ONLINE);
      if (savedRiderOnline) setIsRiderOnline(savedRiderOnline === 'true');
    } catch (e) {
      console.error('Failed to parse state from localStorage', e);
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = useCallback((key: string, value: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }
  }, []);

  // Toast dispatch
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    // Base fee from first restaurant
    const rest = restaurants.find((r) => r.id === cart[0].restaurantId);
    return rest ? rest.deliveryFee : 60;
  }, [cart, restaurants]);

  const discount = useMemo(() => {
    if (!appliedPromo || cart.length === 0) return 0;
    const promo = mockPromoCodes.find((p) => p.code === appliedPromo);
    if (!promo || subtotal < promo.minOrder) return 0;

    if (promo.discountAmount) {
      return promo.discountAmount;
    }
    if (promo.discountPercent) {
      const calculated = (subtotal * promo.discountPercent) / 100;
      return promo.maxDiscount ? Math.min(calculated, promo.maxDiscount) : calculated;
    }
    return 0;
  }, [appliedPromo, subtotal, cart.length]);

  const total = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [cart.length, subtotal, deliveryFee, discount]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Cart operations
  const addToCart = useCallback(
    (foodItem: FoodItem, quantity: number = 1, addons: SelectedAddon[] = [], instructions?: string) => {
      // Enforce same restaurant or prompt
      const rest = restaurants.find((r) => r.id === foodItem.restaurantId);
      const restaurantName = rest ? rest.name : 'Restaurant';

      const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = foodItem.price + addonTotal;
      const itemTotal = unitPrice * quantity;

      // Unique hash for item with addons
      const addonKey = addons
        .map((a) => a.optionId)
        .sort()
        .join('-');
      const cartItemId = `${foodItem.id}_${addonKey}`;

      setCart((prev) => {
        // If from another restaurant, reset cart
        if (prev.length > 0 && prev[0].restaurantId !== foodItem.restaurantId) {
          showToast(`Cart reset to items from ${restaurantName}`, 'info');
          const newCart = [
            {
              id: cartItemId,
              foodItem,
              restaurantId: foodItem.restaurantId,
              restaurantName,
              quantity,
              selectedAddons: addons,
              specialInstructions: instructions,
              itemTotal,
            },
          ];
          saveToStorage(STORAGE_KEYS.CART, newCart);
          return newCart;
        }

        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        let updated: CartItem[];

        if (existingIndex > -1) {
          updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            itemTotal: unitPrice * newQty,
            specialInstructions: instructions || updated[existingIndex].specialInstructions,
          };
        } else {
          updated = [
            ...prev,
            {
              id: cartItemId,
              foodItem,
              restaurantId: foodItem.restaurantId,
              restaurantName,
              quantity,
              selectedAddons: addons,
              specialInstructions: instructions,
              itemTotal,
            },
          ];
        }

        saveToStorage(STORAGE_KEYS.CART, updated);
        return updated;
      });

      showToast(`Added ${foodItem.name} to cart!`, 'success');
    },
    [restaurants, saveToStorage, showToast]
  );

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setCart((prev) => {
        const itemIndex = prev.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) return prev;

        const currentItem = prev[itemIndex];
        const newQty = currentItem.quantity + delta;

        if (newQty <= 0) {
          const filtered = prev.filter((i) => i.id !== itemId);
          saveToStorage(STORAGE_KEYS.CART, filtered);
          showToast(`Removed ${currentItem.foodItem.name} from cart`, 'info');
          return filtered;
        }

        const addonTotal = currentItem.selectedAddons.reduce((sum, a) => sum + a.price, 0);
        const unitPrice = currentItem.foodItem.price + addonTotal;

        const updated = [...prev];
        updated[itemIndex] = {
          ...currentItem,
          quantity: newQty,
          itemTotal: unitPrice * newQty,
        };

        saveToStorage(STORAGE_KEYS.CART, updated);
        return updated;
      });
    },
    [saveToStorage, showToast]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart((prev) => {
        const filtered = prev.filter((i) => i.id !== itemId);
        saveToStorage(STORAGE_KEYS.CART, filtered);
        return filtered;
      });
      showToast('Item removed from cart', 'info');
    },
    [saveToStorage, showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    }
  }, []);

  const applyPromoCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      const promo = mockPromoCodes.find((p) => p.code === normalized);
      if (!promo) {
        showToast('Invalid promo voucher code', 'error');
        return { success: false, message: 'Invalid promo voucher code' };
      }
      if (subtotal < promo.minOrder) {
        const msg = `Minimum order of ৳${promo.minOrder} required for ${normalized}`;
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      setAppliedPromo(normalized);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROMO, normalized);
      }
      showToast(`Promo ${normalized} applied successfully!`, 'success');
      return { success: true, message: 'Promo applied!' };
    },
    [subtotal, showToast]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    }
    showToast('Promo code removed', 'info');
  }, [showToast]);

  // Favorites
  const toggleFavoriteRestaurant = useCallback(
    (id: string) => {
      setFavoriteRestaurantIds((prev) => {
        const isFav = prev.includes(id);
        const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
        saveToStorage(STORAGE_KEYS.FAV_REST, updated);
        showToast(isFav ? 'Removed from favorites' : 'Added to favorite restaurants ❤️', 'success');
        return updated;
      });
    },
    [saveToStorage, showToast]
  );

  const toggleFavoriteFood = useCallback(
    (id: string) => {
      setFavoriteFoodIds((prev) => {
        const isFav = prev.includes(id);
        const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
        saveToStorage(STORAGE_KEYS.FAV_FOOD, updated);
        showToast(isFav ? 'Removed from favorites' : 'Saved to favorite dishes ❤️', 'success');
        return updated;
      });
    },
    [saveToStorage, showToast]
  );

  const isRestaurantFavorite = useCallback(
    (id: string) => favoriteRestaurantIds.includes(id),
    [favoriteRestaurantIds]
  );

  const isFoodFavorite = useCallback((id: string) => favoriteFoodIds.includes(id), [favoriteFoodIds]);

  // Orders
  const createOrder = useCallback(
    (data: { deliveryAddress: DeliveryAddress; paymentMethod: PaymentMethodType; customerNotes?: string }) => {
      if (cart.length === 0) throw new Error('Cannot create order with empty cart');

      const restId = cart[0].restaurantId;
      const rest = restaurants.find((r) => r.id === restId);
      const restName = rest ? rest.name : cart[0].restaurantName;
      const restAddress = rest ? rest.address : 'Dhaka';

      const newOrderId = `FD-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: newOrderId,
        customerId: userProfile.id,
        customerName: userProfile.name,
        customerPhone: userProfile.phone,
        restaurantId: restId,
        restaurantName: restName,
        restaurantAddress: restAddress,
        items: [...cart],
        subtotal,
        deliveryFee,
        discount,
        promoCode: appliedPromo || undefined,
        total,
        status: 'Confirmed',
        statusHistory: [{ status: 'Confirmed', timestamp: now }],
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        createdAt: now,
        estimatedDeliveryTime: '25-35 mins',
        rider: mockRider,
        customerNotes: data.customerNotes,
        reviewed: false,
        riderLocationProgress: 15,
      };

      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        saveToStorage(STORAGE_KEYS.ORDERS, updated);
        return updated;
      });

      // Push notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Order Confirmed 🎉',
        message: `Order #${newOrderId} from ${restName} has been received and is being prepared!`,
        timestamp: now,
        read: false,
        type: 'order',
        link: `/tracking/${newOrderId}`,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
        return updated;
      });

      // Clear cart
      clearCart();
      showToast(`Order #${newOrderId} placed successfully!`, 'success');

      return newOrderId;
    },
    [cart, restaurants, userProfile, subtotal, deliveryFee, discount, appliedPromo, total, saveToStorage, clearCart, showToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) => {
        const idx = prev.findIndex((o) => o.id === orderId);
        if (idx === -1) return prev;

        const currentOrder = prev[idx];
        const now = new Date().toISOString();

        // Calculate simulated map progress
        let progress = currentOrder.riderLocationProgress || 10;
        if (newStatus === 'Preparing') progress = 30;
        if (newStatus === 'Ready' || newStatus === 'Picked Up') progress = 50;
        if (newStatus === 'On The Way') progress = 75;
        if (newStatus === 'Delivered') progress = 100;

        const updatedOrder: Order = {
          ...currentOrder,
          status: newStatus,
          riderLocationProgress: progress,
          statusHistory: [...currentOrder.statusHistory, { status: newStatus, timestamp: now }],
          paymentStatus: newStatus === 'Delivered' ? 'paid' : currentOrder.paymentStatus,
        };

        const updatedList = [...prev];
        updatedList[idx] = updatedOrder;
        saveToStorage(STORAGE_KEYS.ORDERS, updatedList);
        return updatedList;
      });

      // Create notification
      const notifMessages: Record<OrderStatus, string> = {
        Pending: `Order #${orderId} is pending.`,
        Confirmed: `Order #${orderId} is confirmed.`,
        Preparing: `Chef is preparing your delicious meal for order #${orderId}!`,
        Ready: `Order #${orderId} is packed and ready for pickup.`,
        'Picked Up': `Rider ${mockRider.name} picked up your order #${orderId}.`,
        'On The Way': `Rider ${mockRider.name} is on the way to your address!`,
        Delivered: `Order #${orderId} has been delivered. Enjoy your meal!`,
        Cancelled: `Order #${orderId} was cancelled.`,
      };

      if (notifMessages[newStatus]) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: `Order ${newStatus}`,
          message: notifMessages[newStatus],
          timestamp: new Date().toISOString(),
          read: false,
          type: 'order',
          link: `/tracking/${orderId}`,
        };
        setNotifications((prev) => {
          const updated = [newNotif, ...prev];
          saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
          return updated;
        });
      }

      showToast(`Order status updated to "${newStatus}"`, 'info');
    },
    [saveToStorage, showToast]
  );

  const simulateNextStatus = useCallback(
    (orderId: string): OrderStatus | null => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;

      const progression: OrderStatus[] = [
        'Confirmed',
        'Preparing',
        'Picked Up',
        'On The Way',
        'Delivered',
      ];

      const currentIndex = progression.indexOf(order.status);
      if (currentIndex === -1 || currentIndex >= progression.length - 1) {
        showToast('Order has already reached final delivery state!', 'info');
        return null;
      }

      const nextStatus = progression[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
      return nextStatus;
    },
    [orders, updateOrderStatus, showToast]
  );

  const getOrder = useCallback(
    (orderId: string) => {
      return orders.find((o) => o.id === orderId);
    },
    [orders]
  );

  const reorder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.items.length === 0) return;

      clearCart();
      order.items.forEach((item) => {
        addToCart(item.foodItem, item.quantity, item.selectedAddons, item.specialInstructions);
      });
      showToast(`Items from #${orderId} added to cart!`, 'success');
    },
    [orders, clearCart, addToCart, showToast]
  );

  // Reservations
  const createReservation = useCallback(
    (data: {
      restaurantId: string;
      restaurantName: string;
      date: string;
      time: string;
      guests: number;
      specialRequests?: string;
    }) => {
      const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReservation: Reservation = {
        id: resId,
        restaurantId: data.restaurantId,
        restaurantName: data.restaurantName,
        customerName: userProfile.name,
        customerEmail: userProfile.email,
        customerPhone: userProfile.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        specialRequests: data.specialRequests,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      setReservations((prev) => {
        const updated = [newReservation, ...prev];
        saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
        return updated;
      });

      // Notification
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Table Reserved! 🎉',
        message: `Your table for ${data.guests} at ${data.restaurantName} is confirmed for ${data.date} at ${data.time}.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'reservation',
        link: '/reservations',
      };
      setNotifications((prev) => {
        const updated = [notif, ...prev];
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
        return updated;
      });

      showToast(`Table confirmed at ${data.restaurantName}! (Booking #${resId})`, 'success');
      return resId;
    },
    [userProfile, saveToStorage, showToast]
  );

  const cancelReservation = useCallback(
    (id: string) => {
      setReservations((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' as const } : r));
        saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
        return updated;
      });
      showToast('Reservation has been cancelled', 'info');
    },
    [saveToStorage, showToast]
  );

  const updateReservationStatus = useCallback(
    (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
      setReservations((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
        saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
        return updated;
      });
      showToast(`Reservation #${id} marked as ${status}`, 'info');
    },
    [saveToStorage, showToast]
  );

  // Reviews
  const addReview = useCallback(
    (newReviewData: Omit<Review, 'id' | 'date'>) => {
      const id = `rev-${Date.now()}`;
      const date = new Date().toISOString().split('T')[0];
      const newReview: Review = {
        ...newReviewData,
        id,
        date,
      };

      setReviews((prev) => {
        const updated = [newReview, ...prev];
        saveToStorage(STORAGE_KEYS.REVIEWS, updated);
        return updated;
      });

      // Update restaurant rating
      setRestaurants((prev) => {
        return prev.map((r) => {
          if (r.id === newReviewData.restaurantId) {
            const allRestReviews = reviews.filter((rev) => rev.restaurantId === r.id);
            const newTotalCount = allRestReviews.length + 1;
            const newRating = Number(
              ((r.rating * r.reviewCount + newReviewData.rating) / (r.reviewCount + 1)).toFixed(1)
            );
            return {
              ...r,
              rating: newRating,
              reviewCount: newTotalCount,
            };
          }
          return r;
        });
      });

      showToast('Thank you! Your review has been submitted.', 'success');
    },
    [reviews, saveToStorage, showToast]
  );

  const getRestaurantReviews = useCallback(
    (restaurantId: string) => {
      return reviews.filter((r) => r.restaurantId === restaurantId);
    },
    [reviews]
  );

  // Notifications
  const markNotificationAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
    showToast('All notifications marked as read', 'info');
  }, [saveToStorage, showToast]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // User Profile
  const updateUserProfile = useCallback(
    (updatedFields: Partial<UserProfile>) => {
      setUserProfile((prev) => {
        const updated = { ...prev, ...updatedFields };
        saveToStorage(STORAGE_KEYS.PROFILE, updated);
        showToast('Profile updated successfully', 'success');
        return updated;
      });
    },
    [saveToStorage, showToast]
  );

  const addDeliveryAddress = useCallback(
    (addr: Omit<DeliveryAddress, 'id'>) => {
      const id = `addr-${Date.now()}`;
      setUserProfile((prev) => {
        const updatedAddrs = [...prev.addresses, { ...addr, id }];
        const updated = { ...prev, addresses: updatedAddrs };
        saveToStorage(STORAGE_KEYS.PROFILE, updated);
        showToast('New address saved', 'success');
        return updated;
      });
    },
    [saveToStorage, showToast]
  );

  // Admin Controls
  const toggleRestaurantOpen = useCallback(
    (restaurantId: string) => {
      setRestaurants((prev) => {
        const updated = prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r));
        saveToStorage(STORAGE_KEYS.RESTS, updated);
        return updated;
      });
      showToast('Restaurant status updated', 'info');
    },
    [saveToStorage, showToast]
  );

  const toggleFoodAvailability = useCallback(
    (foodId: string) => {
      setFoodItems((prev) => {
        const updated = prev.map((f) =>
          f.id === foodId ? { ...f, isAvailable: f.isAvailable === false ? true : false } : f
        );
        saveToStorage(STORAGE_KEYS.FOODS, updated);
        return updated;
      });
      showToast('Menu item availability updated', 'info');
    },
    [saveToStorage, showToast]
  );

  const updateFoodPrice = useCallback(
    (foodId: string, newPrice: number) => {
      setFoodItems((prev) => {
        const updated = prev.map((f) => (f.id === foodId ? { ...f, price: newPrice } : f));
        saveToStorage(STORAGE_KEYS.FOODS, updated);
        return updated;
      });
      showToast('Menu item price updated', 'success');
    },
    [saveToStorage, showToast]
  );

  // Rider Controls
  const toggleRiderOnline = useCallback(() => {
    setIsRiderOnline((prev) => {
      const updated = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.RIDER_ONLINE, String(updated));
      }
      showToast(updated ? 'Rider is now ONLINE' : 'Rider is now OFFLINE', 'info');
      return updated;
    });
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        appliedPromo,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        favoriteRestaurantIds,
        favoriteFoodIds,
        toggleFavoriteRestaurant,
        toggleFavoriteFood,
        isRestaurantFavorite,
        isFoodFavorite,
        orders,
        createOrder,
        updateOrderStatus,
        simulateNextStatus,
        getOrder,
        reorder,
        reservations,
        createReservation,
        cancelReservation,
        updateReservationStatus,
        reviews,
        addReview,
        getRestaurantReviews,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        userProfile,
        updateUserProfile,
        addDeliveryAddress,
        restaurants,
        foodItems,
        toggleRestaurantOpen,
        toggleFoodAvailability,
        updateFoodPrice,
        rider,
        isRiderOnline,
        toggleRiderOnline,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
