'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { PaymentMethodType, DeliveryAddress } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Phone,
  User,
  Plus,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    deliveryFee,
    discount,
    total,
    userProfile,
    addDeliveryAddress,
    createOrder,
    showToast,
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userProfile.addresses[0]?.id || 'addr-1'
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('bkash');
  const [customerNotes, setCustomerNotes] = useState('');
  const [contactName, setContactName] = useState(userProfile.name);
  const [contactPhone, setContactPhone] = useState(userProfile.phone);

  // Simulated Payment fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [mobileWalletNumber, setMobileWalletNumber] = useState('01819-456789');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);

  // Form state for new address modal
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('Gulshan 2');
  const [newInstructions, setNewInstructions] = useState('');

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="py-12 sm:py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Please add delicious dishes to your cart before proceeding to checkout."
          actionText="Browse Restaurants"
          actionHref="/explore"
        />
      </div>
    );
  }

  const selectedAddress =
    userProfile.addresses.find((a) => a.id === selectedAddressId) || userProfile.addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) {
      showToast('Please enter a street address.', 'error');
      return;
    }

    addDeliveryAddress({
      label: newLabel,
      street: newStreet.trim(),
      area: newArea,
      city: 'Dhaka',
      instructions: newInstructions.trim() || undefined,
      isDefault: false,
    });

    showToast('New delivery address saved!', 'success');
    setShowNewAddressModal(false);
    setNewStreet('');
    setNewInstructions('');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address.', 'error');
      return;
    }

    if (!contactPhone.trim() || contactPhone.trim().length < 6) {
      showToast('Please provide a valid contact phone number for the rider.', 'error');
      return;
    }

    if (!contactName.trim()) {
      showToast('Please provide recipient name.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = createOrder({
        deliveryAddress: selectedAddress,
        paymentMethod: selectedPayment,
        customerNotes: customerNotes.trim() || undefined,
      });

      // Simulated network/processing delay
      setTimeout(() => {
        setIsSubmitting(false);
        showToast('Order confirmed! Tracking live rider...', 'success');
        router.push(`/order-success?orderId=${orderId}`);
      }, 750);
    } catch (err) {
      setIsSubmitting(false);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-16">
      {/* Top Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review delivery destination, recipient info, and complete simulated payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Address, Contact, Payment (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Delivery Address */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center font-black text-xs shadow-glow">
                  1
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Where should your rider deliver?</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewAddressModal(true)}
                className="text-xs font-extrabold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1.5 rounded-full hover:bg-primary-100 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>

            {/* Address Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {userProfile.addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary-50/60 dark:bg-primary-950/40 border-primary-500 ring-2 ring-primary-500/20 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span>{addr.label}</span>
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary-500 fill-primary-500 text-white" />
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      {addr.street}, {addr.area}, {addr.city}
                    </p>
                    {addr.instructions && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        &quot;{addr.instructions}&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center font-black text-xs shadow-glow">
                2
              </span>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  Recipient Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">For delivery coordination & arrival SMS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recipient Full Name</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rider Contact Phone</span>
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Delivery Instructions for Courier (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring apartment 4B doorbell, leave with front security guard..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full text-xs px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center font-black text-xs shadow-glow">
                  3
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    Payment Method
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select how you want to pay</p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* bKash / Nagad Mobile Payment */}
              <div
                onClick={() => setSelectedPayment('bkash')}
                className={`p-4 sm:p-5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedPayment === 'bkash'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  {selectedPayment === 'bkash' && (
                    <span className="w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100 dark:ring-rose-950" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">bKash / Nagad</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant Mobile Wallet</p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setSelectedPayment('cash_on_delivery')}
                className={`p-4 sm:p-5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedPayment === 'cash_on_delivery'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Banknote className="w-5 h-5" />
                  </div>
                  {selectedPayment === 'cash_on_delivery' && (
                    <span className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay at Doorstep</p>
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setSelectedPayment('card')}
                className={`p-4 sm:p-5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedPayment === 'card'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  {selectedPayment === 'card' && (
                    <span className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Visa, MC, AMEX</p>
                </div>
              </div>
            </div>

            {/* Dynamic Simulated Payment Form */}
            {selectedPayment === 'bkash' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3.5">
                <span className="text-xs font-black text-rose-700 dark:text-rose-400">
                  Simulated bKash / Nagad Instant Gateway
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Account Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobileWalletNumber}
                      onChange={(e) => setMobileWalletNumber(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      4-Digit Simulated OTP
                    </label>
                    <input
                      type="password"
                      defaultValue="1234"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-3.5">
                <span className="text-xs font-black text-blue-700 dark:text-blue-400">
                  Simulated Card Payment Form
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary & Place Order (1 col) */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 tracking-tight">
              Selected Items ({cart.length})
            </h3>

            {/* Items mini list */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <div className="truncate max-w-[70%]">
                    <span className="font-extrabold text-slate-900 dark:text-white mr-1.5">
                      {item.quantity}x
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.foodItem.name}</span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">
                    {formatPrice(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Express Delivery:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base sm:text-lg font-black text-slate-900 dark:text-white">
                <span>Total Due:</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handlePlaceOrder}
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="shadow-glow hover:shadow-glow-lg rounded-2xl py-4 font-black"
            >
              Confirm & Place Order • {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {showNewAddressModal && (
        <Modal
          isOpen={showNewAddressModal}
          onClose={() => setShowNewAddressModal(false)}
          title="Add New Delivery Address"
          maxWidth="md"
        >
          <form onSubmit={handleAddNewAddress} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      newLabel === lbl
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Street Address / House & Road
              </label>
              <input
                type="text"
                required
                placeholder="e.g. House 14, Road 7, Block F"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Area
              </label>
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="Gulshan 2">Gulshan 2</option>
                <option value="Gulshan 1">Gulshan 1</option>
                <option value="Banani">Banani</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Uttara">Uttara</option>
                <option value="Mirpur">Mirpur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Special Delivery Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. 3rd Floor, elevator right side"
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <Button variant="primary" size="md" fullWidth type="submit">
              Save Delivery Address
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
