'use client';

import { useState } from 'react';
import { OrderFormData, TShirtSize } from '@/types/order';
import { Loader2, ShoppingBag, User, Phone, Ruler, Hash } from 'lucide-react';

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    size: 'M',
    quantity: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizes: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
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
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-brand-black rounded-2xl mb-3 sm:mb-4 md:mb-6 shadow-xl">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-black mb-2 sm:mb-3 md:mb-4 px-2">
            Reserve Yours
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto px-3 sm:px-4 leading-relaxed">
            Complete the form below to secure your limited-edition tee. Fast, secure, and simple.
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

            {/* Size Selection */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-slate-700 mb-3">
                <Ruler size={16} strokeWidth={2} />
                Select Size
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, size })}
                    className={`py-3 sm:py-4 rounded-xl font-heading font-bold text-base sm:text-lg transition-all duration-300 min-h-[52px] sm:min-h-[auto] ${
                      formData.size === size
                        ? 'bg-brand-black text-white shadow-lg'
                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-brand-black active:border-brand-black'
                    }`}
                    disabled={isSubmitting}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="flex items-center gap-2 font-body text-sm font-medium text-slate-700 mb-2">
                <Hash size={16} strokeWidth={2} />
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="input-seamless w-full"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-brand-black">
              <div className="flex justify-between items-center">
                <span className="font-body text-xs sm:text-sm font-medium text-slate-600">Total Amount</span>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-brand-black">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="font-body text-xs text-slate-500 mt-2">
                {formData.quantity} {formData.quantity === 1 ? 'item' : 'items'} · Size {formData.size}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
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
                  Pay & Reserve Your Tee
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="font-body text-xs text-slate-500 text-center pt-4">
              <span className="font-medium text-slate-700">🔒 Secure Payment:</span> Powered by PayHere. 
              Your payment information is encrypted and secure.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
