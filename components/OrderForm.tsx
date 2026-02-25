'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderFormData, DeliveryMethod } from '@/types/order';
import { Loader2, ShoppingBag, User, Phone, Ruler, Hash, Plus, Minus, Truck, MapPin } from 'lucide-react';

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    quantity: 1,
    deliveryMethod: 'COLLECT',
    deliveryDetails: {
      address: '',
      city: '',
      postalCode: '',
    },
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productPrice = parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '2500');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Please enter your name');
      }
      if (!formData.phone.trim()) {
        throw new Error('Please enter your phone number');
      }
      if (formData.quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
      if (formData.deliveryMethod === 'DELIVER') {
        if (!formData.deliveryDetails?.address?.trim()) {
          throw new Error('Please enter your delivery address');
        }
        if (!formData.deliveryDetails?.city?.trim()) {
          throw new Error('Please enter your city');
        }
        if (!formData.deliveryDetails?.postalCode?.trim()) {
          throw new Error('Please enter your postal code');
        }
      }
      if (!formData.acceptedTerms) {
        throw new Error('Please accept the Terms of Service');
      }
      if (!formData.acceptedPrivacy) {
        throw new Error('Please accept the Privacy Policy');
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await response.json();

      // Redirect to PayHere payment
      window.location.href = `/api/payment/payhere?orderId=${order.orderId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const totalAmount = productPrice * formData.quantity;

  return (
    <section id="order-form" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-black mb-2 sm:mb-3 md:mb-4 px-2">
            Reserve Yours
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto px-3 sm:px-4 leading-relaxed">
            Complete the form below to secure your elite gym shaker. Fast, secure, and simple.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 font-body text-sm font-medium text-slate-700 mb-2">
                <User size={16} strokeWidth={2} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-seamless w-full"
                placeholder="Karlos Nazar"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 font-body text-sm font-medium text-slate-700 mb-2">
                <Phone size={16} strokeWidth={2} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-seamless w-full"
                placeholder="+94 77 123 4567"
                required
                disabled={isSubmitting}
              />
            </div>

            

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="flex items-center gap-2 font-body text-sm font-medium text-slate-700 mb-3">
                <Hash size={16} strokeWidth={2} />
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                  disabled={isSubmitting || formData.quantity <= 1}
                  className="h-12 sm:h-11 w-12 sm:w-11 rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={20} strokeWidth={2.5} className="text-slate-700" />
                </button>

                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="10"
                  value={formData.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setFormData({ ...formData, quantity: Math.max(1, Math.min(10, val)) });
                  }}
                  className="input-seamless flex-1 text-center text-lg sm:text-base font-semibold"
                  required
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: Math.min(10, formData.quantity + 1) })}
                  disabled={isSubmitting || formData.quantity >= 10}
                  className="h-12 sm:h-11 w-12 sm:w-11 rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={20} strokeWidth={2.5} className="text-slate-700" />
                </button>
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div>
              <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                How would you like to receive your order?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Deliver Option */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'DELIVER' })}
                  disabled={isSubmitting}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.deliveryMethod === 'DELIVER'
                      ? 'border-brand-red bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-3">
                    <Truck size={20} strokeWidth={2} className={formData.deliveryMethod === 'DELIVER' ? 'text-brand-red' : 'text-slate-500'} />
                    <div>
                      <p className="font-body font-semibold text-brand-black">Deliver to Address</p>
                      <p className="font-body text-xs text-slate-600 mt-1">Get it delivered to your home</p>
                    </div>
                  </div>
                </button>

                {/* Collect Option */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'COLLECT' })}
                  disabled={isSubmitting}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.deliveryMethod === 'COLLECT'
                      ? 'border-brand-red bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={20} strokeWidth={2} className={formData.deliveryMethod === 'COLLECT' ? 'text-brand-red' : 'text-slate-500'} />
                    <div>
                      <p className="font-body font-semibold text-brand-black">Collect at Point</p>
                      <p className="font-body text-xs text-slate-600 mt-1">Pick up from our location</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Details Form - Show only if DELIVER is selected */}
            {formData.deliveryMethod === 'DELIVER' && (
              <div className="bg-red-50 rounded-xl p-4 sm:p-5 border border-red-200 space-y-4">
                <p className="font-body text-sm font-medium text-brand-red-dark">
                  Please provide your delivery details
                </p>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block font-body text-sm font-medium text-slate-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.deliveryDetails?.address || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      deliveryDetails: { ...formData.deliveryDetails!, address: e.target.value }
                    })}
                    className="input-seamless w-full"
                    placeholder="123 Main Street"
                    required={formData.deliveryMethod === 'DELIVER'}
                    disabled={isSubmitting}
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block font-body text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.deliveryDetails?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      deliveryDetails: { ...formData.deliveryDetails!, city: e.target.value }
                    })}
                    className="input-seamless w-full"
                    placeholder="Colombo"
                    required={formData.deliveryMethod === 'DELIVER'}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label htmlFor="postalCode" className="block font-body text-sm font-medium text-slate-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={formData.deliveryDetails?.postalCode || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      deliveryDetails: { ...formData.deliveryDetails!, postalCode: e.target.value }
                    })}
                    className="input-seamless w-full"
                    placeholder="00100"
                    required={formData.deliveryMethod === 'DELIVER'}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-brand-black relative overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-green-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                20% OFF
              </div>
              
              {/* Regular vs Pre-Order Price Comparison */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-body text-xs text-slate-500">Regular Price:</span>
                  <span className="font-body text-sm text-slate-400 line-through">
                    LKR {(totalAmount * 1.2).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs text-slate-500">Pre-Order Savings:</span>
                  <span className="font-body text-sm font-semibold text-green-600">
                    -LKR {(totalAmount * 0.2).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t pt-3">
                <span className="font-body text-xs sm:text-sm font-medium text-slate-600">Pre-Order Total</span>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-brand-black">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="font-body text-xs text-slate-500">
                  {formData.quantity} {formData.quantity === 1 ? 'item' : 'items'}
                </p>
                <p className="font-body text-xs font-semibold text-green-600">
                   20% Discount Applied
                </p>
              </div>
            </div>

            {/* Legal Agreement Checkboxes */}
            <div className="space-y-4 bg-slate-50 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptedTerms}
                  onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-red focus:ring-brand-red focus:ring-offset-0 accent-brand-red"
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor="acceptTerms" className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand-red hover:underline font-medium">
                    Terms of Service
                  </Link>
                  {' '}and understand the pre-order conditions, including production timelines and refund policy.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptPrivacy"
                  checked={formData.acceptedPrivacy}
                  onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-red focus:ring-brand-red focus:ring-offset-0 accent-brand-red"
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor="acceptPrivacy" className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed">
                  I acknowledge that I have read and agree to the{' '}
                  <Link href="/privacy" className="text-brand-red hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  {' '}regarding the collection and use of my personal information.
                </label>
              </div>

              {(error && (error.includes('Terms') || error.includes('Privacy'))) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-body text-xs text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.acceptedTerms || !formData.acceptedPrivacy}
              className="btn-primary w-full text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} strokeWidth={2.5} />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag size={20} strokeWidth={2.5} />
                  Pay & Reserve Your Shaker
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="font-body text-xs text-slate-500 text-center pt-4">
              <span className="font-medium text-slate-700">Secure Payment:</span> Powered by PayHere. 
              Your payment information is encrypted and secure.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
