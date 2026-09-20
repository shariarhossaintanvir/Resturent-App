import { CartItem } from '../../data/types';
import { mockFoodItems, mockRestaurants, mockPromoCodes } from '../../data/mockData';

export interface AuthoritativePriceResult {
  isValid: boolean;
  error?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  verifiedItems: CartItem[];
  appliedPromo?: string;
}

/**
 * Calculates authoritative financial totals for an order on the server.
 * Never trusts prices, discounts, delivery fees, or totals supplied by the client.
 */
export function calculateAuthoritativeOrderTotals(
  rawItems: CartItem[],
  promoCode?: string
): AuthoritativePriceResult {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      isValid: false,
      error: 'Order must contain at least one food item.',
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      verifiedItems: [],
    };
  }

  if (rawItems.length > 50) {
    return {
      isValid: false,
      error: 'Order exceeds maximum allowed item count (50 items).',
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      verifiedItems: [],
    };
  }

  // Ensure all items are from the same verified restaurant
  const firstItemFood = mockFoodItems.find((f) => f.id === rawItems[0].foodItem?.id);
  if (!firstItemFood) {
    return {
      isValid: false,
      error: `Food item '${rawItems[0].foodItem?.id}' was not found in restaurant menu catalog.`,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      verifiedItems: [],
    };
  }

  const restaurantId = firstItemFood.restaurantId;
  const verifiedRestaurant = mockRestaurants.find((r) => r.id === restaurantId);
  if (!verifiedRestaurant) {
    return {
      isValid: false,
      error: `Restaurant '${restaurantId}' does not exist or is inactive.`,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      verifiedItems: [],
    };
  }

  let subtotal = 0;
  const verifiedItems: CartItem[] = [];

  for (const rawItem of rawItems) {
    const verifiedFood = mockFoodItems.find((f) => f.id === rawItem.foodItem?.id);
    if (!verifiedFood) {
      return {
        isValid: false,
        error: `Item '${rawItem.foodItem?.name || rawItem.foodItem?.id}' is invalid or no longer available.`,
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        verifiedItems: [],
      };
    }

    if (verifiedFood.restaurantId !== restaurantId) {
      return {
        isValid: false,
        error: 'Multi-restaurant orders are not supported in a single delivery batch.',
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        verifiedItems: [],
      };
    }

    const qty = Math.floor(Number(rawItem.quantity));
    if (isNaN(qty) || qty < 1 || qty > 20) {
      return {
        isValid: false,
        error: `Invalid quantity '${rawItem.quantity}' for item '${verifiedFood.name}'. Max 20 per item.`,
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        verifiedItems: [],
      };
    }

    // Verify customizations and addons against master catalog
    let addonSum = 0;
    const verifiedAddons = [];

    if (Array.isArray(rawItem.selectedAddons)) {
      for (const rawAddon of rawItem.selectedAddons) {
        let matchedOptionPrice = 0;
        let found = false;

        if (verifiedFood.customizations) {
          for (const group of verifiedFood.customizations) {
            const opt = group.options.find((o) => o.id === rawAddon.optionId);
            if (opt) {
              matchedOptionPrice = opt.price;
              found = true;
              verifiedAddons.push({
                groupId: group.id,
                groupName: group.name,
                optionId: opt.id,
                optionName: opt.name,
                price: matchedOptionPrice,
              });
              break;
            }
          }
        }

        // If custom addon wasn't found in group, treat price as 0 or reject
        if (found) {
          addonSum += matchedOptionPrice;
        }
      }
    }

    const authoritativeUnitPrice = verifiedFood.price + addonSum;
    const authoritativeItemTotal = authoritativeUnitPrice * qty;
    subtotal += authoritativeItemTotal;

    verifiedItems.push({
      id: rawItem.id || `${verifiedFood.id}_${Date.now()}`,
      foodItem: verifiedFood,
      restaurantId: verifiedRestaurant.id,
      restaurantName: verifiedRestaurant.name,
      quantity: qty,
      selectedAddons: verifiedAddons,
      specialInstructions: rawItem.specialInstructions ? String(rawItem.specialInstructions).slice(0, 150) : undefined,
      itemTotal: authoritativeItemTotal,
    });
  }

  // Authoritative delivery fee from restaurant catalog
  const deliveryFee = verifiedRestaurant.deliveryFee || 60;

  // Authoritative Promo calculation
  let discount = 0;
  let appliedPromo: string | undefined = undefined;

  if (promoCode && typeof promoCode === 'string') {
    const cleanPromo = promoCode.trim().toUpperCase();
    const promo = mockPromoCodes.find((p) => p.code === cleanPromo);

    if (promo && subtotal >= promo.minOrder) {
      appliedPromo = cleanPromo;
      if (promo.discountAmount) {
        discount = promo.discountAmount;
      } else if (promo.discountPercent) {
        const calculated = (subtotal * promo.discountPercent) / 100;
        discount = promo.maxDiscount ? Math.min(calculated, promo.maxDiscount) : calculated;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return {
    isValid: true,
    subtotal,
    deliveryFee,
    discount,
    total: grandTotal,
    verifiedItems,
    appliedPromo,
  };
}
