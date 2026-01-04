'use client';

import { useState, useEffect } from 'react';
import { Order, PaymentStatus } from '@/types/order';
import { Download, Loader2, Lock } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check - in production, use proper authentication
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setError('Invalid password');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filteredOrders = filter === 'ALL' 
      ? orders 
      : orders.filter(order => order.paymentStatus === filter);

    const headers = ['Order ID', 'Name', 'Phone', 'Size', 'Quantity', 'Amount', 'Payment Status', 'Created At'];
    const rows = filteredOrders.map(order => [
      order.orderId,
      order.name,
      order.phone,
      order.size,
      order.quantity,
      order.amount,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.paymentStatus === filter);

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'PAID').length,
    pending: orders.filter(o => o.paymentStatus === 'PENDING_PAYMENT').length,
    cancelled: orders.filter(o => o.paymentStatus === 'CANCELLED').length,
    revenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.amount, 0),
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2 text-brand-black">Admin Access</h1>
            <p className="font-body text-slate-600">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block font-body text-sm font-semibold mb-2 text-brand-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-black text-white py-3 px-6 font-semibold rounded-lg hover:bg-slate-800 active:scale-95 transition-all touch-manipulation"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-brand-black">Order Dashboard</h1>
          <p className="font-body text-slate-600">Manage and track pre-orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <p className="font-body text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Orders</p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-brand-black">{stats.total}</p>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <p className="font-body text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Paid</p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white border-2 border-yellow-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <p className="font-body text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white border-2 border-red-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <p className="font-body text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Cancelled</p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-gradient-to-br from-brand-red to-red-700 rounded-xl p-4 sm:p-5 shadow-lg col-span-2 md:col-span-1">
            <p className="font-body text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">Revenue</p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-white">LKR {stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <select
              id="payment-status-filter"
              aria-label="Filter orders by payment status"
              value={filter}
              onChange={(e) => setFilter(e.target.value as PaymentStatus | 'ALL')}
              className="w-full sm:w-auto bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-brand-black font-body focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            >
              <option value="ALL">All Orders</option>
              <option value="PAID">Paid</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex-1 sm:flex-none bg-white border border-slate-300 rounded-lg px-5 py-2.5 font-semibold text-brand-black hover:border-brand-red hover:text-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Refresh'}
            </button>
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none bg-brand-black text-white px-5 py-2.5 font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span> CSV
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-16">
              <Loader2 className="animate-spin text-brand-red" size={40} />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 font-semibold mb-1">{error}</div>
              <button onClick={fetchOrders} className="text-brand-red text-sm hover:underline">Try again</button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-body">No orders found</p>
              <button onClick={fetchOrders} className="mt-2 text-brand-red text-sm hover:underline">Refresh</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Order ID</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Size</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Qty</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 font-body text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{order.orderId.slice(0, 8)}</code>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-body text-brand-black font-medium">{order.name}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-body text-slate-600">{order.phone}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className="font-heading font-bold text-brand-red">{order.size}</span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-body text-slate-700 font-semibold">{order.quantity}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-body text-brand-black font-semibold">LKR {order.amount.toLocaleString()}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : order.paymentStatus === 'PENDING_PAYMENT'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'PENDING_PAYMENT' ? 'Pending' : 'Cancelled'}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-body text-slate-500 text-xs" suppressHydrationWarning>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
