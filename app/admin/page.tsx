'use client';

import { useState, useEffect } from 'react';
import { Order, PaymentStatus } from '@/types/order';
import { 
  Download, 
  Loader2, 
  Lock, 
  Search, 
  LogOut, 
  TrendingUp, 
  Package, 
  Users, 
  CreditCard,
  RefreshCw,
  Filter,
  Calendar,
  Eye,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'PROCESSING' | 'SHIPPED' | 'DELIVERED'>('PROCESSING');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (!adminPassword) {
      setError('Admin password not configured. Please set NEXT_PUBLIC_ADMIN_PASSWORD in environment variables.');
      return;
    }
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError(null);
      fetchOrders();
    } else {
      setError('Invalid password');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching orders from:', window.location.origin + '/api/orders');
    console.log('Current time:', new Date().toISOString());
    
    try {
      const response = await fetch('/api/orders', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response received:');
      console.log('- Status:', response.status);
      console.log('- Status Text:', response.statusText);
      console.log('- Headers:', Object.fromEntries(response.headers.entries()));
      console.log('- URL:', response.url);
      console.log('- OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}\nDetails: ${errorText}`);
      }
      
      const text = await response.text();
      console.log('Raw response text length:', text.length);
      console.log('Raw response preview:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      
      if (!text.trim()) {
        throw new Error('Empty response received from server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw text that failed to parse:', text);
        throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }
      
      console.log('Parsed data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      if (data.error) {
        throw new Error(`Server error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
      }
      
      if (Array.isArray(data)) {
        setOrders(data);
        console.log('Orders state set successfully with', data.length, 'items');
      } else {
        console.error('Data is not an array:', data);
        setError(`Invalid data format: expected array, got ${typeof data}`);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      console.error('Error type:', typeof err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('Fetch orders completed');
    }
  };

  const updateDeliveryStatus = async (orderId: string, status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED') => {
    setStatusUpdateError(null);
    setIsUpdatingStatus(true);
    try {
      console.log('Updating delivery status:', orderId, status);
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      
      const response = await fetch(`/api/orders/${orderId}/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatus: status,
          adminPassword: adminPassword,
        }),
      });

      console.log('Update response status:', response.status);
      const responseText = await response.text();
      console.log('Update response:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse response:', e);
        data = { error: 'Invalid response format' };
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || data.details || `Failed to update status (${response.status})`);
      }

      // Update local state
      setOrders(orders.map(o => 
        o.orderId === orderId 
          ? { ...o, deliveryStatus: status, updatedAt: new Date() }
          : o
      ));

      setUpdatingStatusOrderId(null);
      console.log('Delivery status updated successfully');
    } catch (err) {
      console.error('Update delivery status error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update delivery status';
      setStatusUpdateError(errorMessage);
      alert(`Failed to update delivery status: ${errorMessage}`);
    } finally {
      setIsUpdatingStatus(false);
      setUpdatingStatusOrderId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      console.log('Deleting order:', orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      const responseText = await response.text();
      console.log('Delete response text:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        data = { error: responseText || 'Failed to delete order' };
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || `Failed to delete order (${response.status})`);
      }

      // Remove from local state
      setOrders(orders.filter(o => o.orderId !== orderId));
      setShowDeleteConfirm(false);
      setDeletingOrderId(null);
      setIsDeleting(false);
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete order');
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    const filteredOrders = filter === 'ALL' 
      ? orders 
      : orders.filter(order => order.paymentStatus === filter);

    const headers = ['Order ID', 'Name', 'Email', 'Phone', 'Quantity', 'Amount', 'Payment Status', 'Delivery Method', 'Delivery Status', 'Delivery Address', 'Delivery City', 'Delivery Postal Code', 'Created At'];
    const rows = filteredOrders.map(order => [
      order.orderId,
      order.name,
      order.email,
      order.phone,
      order.quantity,
      order.amount,
      order.paymentStatus,
      order.deliveryMethod,
      order.deliveryStatus || 'Pending',
      order.deliveryMethod === 'DELIVER' ? (order.deliveryDetails?.address || '') : 'N/A',
      order.deliveryMethod === 'DELIVER' ? (order.deliveryDetails?.city || '') : 'N/A',
      order.deliveryMethod === 'DELIVER' ? (order.deliveryDetails?.postalCode || '') : 'N/A',
      new Date(order.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredOrders = orders
    .filter(order => filter === 'ALL' || order.paymentStatus === filter)
    .filter(order => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        order.name.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query) ||
        order.phone.includes(query)
      );
    });

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'PAID').length,
    pending: orders.filter(o => o.paymentStatus === 'PENDING_PAYMENT').length,
    cancelled: orders.filter(o => o.paymentStatus === 'CANCELLED').length,
    revenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.amount, 0),
  };

  // Quantity breakdown statistics
  const quantityStats = Array.from(new Set(orders.map(o => o.quantity)))
    .sort((a, b) => a - b)
    .map(q => {
      const qOrders = orders.filter(o => o.quantity === q);
      return {
        quantity: q,
        orders: qOrders.length,
        units: qOrders.reduce((sum, o) => sum + o.quantity, 0),
      };
    });

  const mostPopularQuantity = (() => {
    const counts: Record<number, number> = {};
    orders.forEach(o => { counts[o.quantity] = (counts[o.quantity] || 0) + 1; });
    const entries = Object.entries(counts);
    if (entries.length === 0) return '-';
    entries.sort((a, b) => Number(b[1]) - Number(a[1]));
    return `${entries[0][0]} unit(s)`;
  })();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-brand-lg">
              <Lock size={36} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="font-heading text-4xl font-bold mb-3 text-brand-black">
              Admin Dashboard
            </h1>
            <p className="font-body text-slate-600 text-lg">
              Secure access to order management
            </p>
          </div>

          <form 
            onSubmit={handleLogin} 
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="text-sm font-medium">{error}</div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <label 
                htmlFor="password" 
                className="flex items-center gap-2 font-body text-sm font-semibold mb-3 text-brand-black"
              >
                <Lock size={16} className="text-slate-400" />
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-4 text-brand-black font-body placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all duration-300"
                placeholder="Enter your admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-black to-slate-800 text-white py-4 px-6 font-heading font-bold rounded-xl hover:from-slate-800 hover:to-brand-black active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-xs text-slate-500">
              Lifting Social • Secure Admin Portal
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black">
              Order Dashboard
            </h1>
            <p className="font-body text-lg text-slate-600">
              Real-time overview of pre-order performance and analytics
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={16} />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="bg-white border-2 border-slate-200 text-brand-black px-5 py-2.5 font-semibold rounded-xl hover:border-brand-red hover:text-brand-red transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-brand-red/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-blue-600" strokeWidth={2} />
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-bold text-brand-black">{stats.total}</p>
                <p className="font-body text-xs text-slate-500 uppercase tracking-wider">Total Orders</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{width: `${stats.total > 0 ? 100 : 0}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard size={24} className="text-green-600" strokeWidth={2} />
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-bold text-green-600">{stats.paid}</p>
                <p className="font-body text-xs text-slate-500 uppercase tracking-wider">Paid Orders</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500" 
                style={{width: `${stats.total > 0 ? (stats.paid / stats.total) * 100 : 0}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-yellow-600" strokeWidth={2} />
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="font-body text-xs text-slate-500 uppercase tracking-wider">Pending</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                style={{width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`}}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-red to-red-700 rounded-2xl p-6 shadow-brand-lg text-white hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" strokeWidth={2} />
              </div>
              <div className="text-right">
                <p className="font-heading text-2xl sm:text-3xl font-bold">LKR {stats.revenue.toLocaleString()}</p>
                <p className="font-body text-xs text-white/80 uppercase tracking-wider">Total Revenue</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-white/90">
              <span>From {stats.paid} paid orders</span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye size={24} className="text-purple-600" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="font-body text-xs text-slate-600 uppercase tracking-wider mb-2">Conversion Rate</p>
              <p className="font-heading text-3xl font-bold text-purple-600 mb-1">
                {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
              </p>
              <p className="font-body text-xs text-slate-500">Paid vs Total Orders</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="font-body text-xs text-white/80 uppercase tracking-wider mb-2">Avg Order Value</p>
              <p className="font-heading text-2xl font-bold mb-1">
                LKR {stats.paid > 0 ? Math.round(stats.revenue / stats.paid).toLocaleString() : 0}
              </p>
              <p className="font-body text-xs text-white/80">Per paid order</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-orange-600" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="font-body text-xs text-slate-600 uppercase tracking-wider mb-2">Total Units</p>
              <p className="font-heading text-3xl font-bold text-orange-600 mb-1">
                {orders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
              <p className="font-body text-xs text-slate-500">Gym shakers ordered</p>
            </div>
          </div>
        </div>

        {/* Search, Filter & Export Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-brand-black mb-2">Orders List</h2>
            <p className="font-body text-sm text-slate-600">Search, filter, and manage all pre-orders</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-transparent rounded-xl pl-12 pr-4 py-3.5 text-brand-black font-body placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all duration-300"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as PaymentStatus | 'ALL')}
                className="appearance-none bg-slate-50 border-transparent rounded-xl pl-12 pr-10 py-3.5 text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all duration-300 cursor-pointer min-w-[180px]"
              >
                <option value="ALL">All Orders</option>
                <option value="PAID">Paid</option>
                <option value="PENDING_PAYMENT">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-brand-red to-red-700 text-white px-4 sm:px-6 py-3.5 font-heading font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
              >
                <Download size={18} strokeWidth={2} />
                <span className="hidden sm:inline">Export</span> CSV
              </button>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="bg-slate-100 text-brand-black px-4 sm:px-6 py-3.5 font-heading font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} strokeWidth={2} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100 text-sm">
            <div className="font-body text-slate-600">
              Showing <span className="font-semibold text-brand-black">{filteredOrders.length}</span> of{' '}
              <span className="font-semibold text-brand-black">{orders.length}</span> orders
              {searchQuery && <span className="text-brand-red ml-1">(filtered)</span>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Paid: <span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'PAID').length}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-600">Pending: <span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'PENDING_PAYMENT').length}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">Cancelled: <span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'CANCELLED').length}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                <Loader2 className="animate-spin text-brand-red" size={32} strokeWidth={2} />
              </div>
              <p className="font-heading text-lg font-medium text-brand-black mb-2">Loading orders...</p>
              <p className="font-body text-sm text-slate-500">Fetching the latest data</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <Package size={32} className="text-red-600" strokeWidth={2} />
              </div>
              <p className="font-heading text-lg font-medium text-red-600 mb-2">Error loading orders</p>
              <p className="font-body text-sm text-slate-500 mb-4 text-center max-w-sm">{error}</p>
              <button 
                onClick={fetchOrders} 
                className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Search size={32} className="text-slate-400" strokeWidth={2} />
              </div>
              <p className="font-heading text-lg font-medium text-slate-600 mb-2">No orders found</p>
              <p className="font-body text-sm text-slate-500 mb-4">
                {searchQuery ? `No results for &quot;${searchQuery}&quot;` : 'No orders match the current filters'}
              </p>
              <div className="flex gap-3">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <button 
                  onClick={fetchOrders} 
                  className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-4 px-6 text-left">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Order ID</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Customer</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Email</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Contact</span>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Quantity</span>
                      </th>
                      <th className="py-4 px-6 text-right">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Amount</span>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Status</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Delivery</span>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Delivery Status</span>
                      </th>
                      <th className="py-4 px-6 text-right">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Date</span>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="font-body text-xs font-bold text-slate-700 uppercase tracking-widest">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order, index) => (
                      <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-brand-red rounded-full mr-3 opacity-60"></div>
                            <code className="text-xs bg-slate-100 group-hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-mono transition-colors">
                              {order.orderId.slice(0, 8)}
                            </code>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-body font-semibold text-brand-black">{order.name}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-body text-sm text-slate-600">{order.email}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-body text-slate-600">{order.phone}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 group-hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm rounded-lg transition-colors">
                            {order.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p className="font-body font-bold text-brand-black">
                            LKR {order.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : order.paymentStatus === 'PENDING_PAYMENT'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'PENDING_PAYMENT' ? 'Pending' : 'Cancelled'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            {order.deliveryMethod === 'DELIVER' ? (
                              <div className="space-y-1">
                                <p className="font-body font-semibold text-slate-900">Deliver</p>
                                <div className="text-xs text-slate-500">
                                  <p>{order.deliveryDetails?.address}</p>
                                  <p>{order.deliveryDetails?.city}, {order.deliveryDetails?.postalCode}</p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="font-body font-semibold text-slate-900">Collect</p>
                                <p className="text-xs text-slate-500">At Point</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {order.paymentStatus === 'PAID' ? (
                            <select
                              value={order.deliveryStatus || 'PROCESSING'}
                              onChange={async (e) => {
                                const newStatus = e.target.value as 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
                                if (newStatus === (order.deliveryStatus || 'PROCESSING')) return;
                                if (confirm(`Update delivery status to ${newStatus}? Customer will receive an SMS notification.`)) {
                                  setUpdatingStatusOrderId(order.orderId);
                                  await updateDeliveryStatus(order.orderId, newStatus);
                                }
                              }}
                              disabled={updatingStatusOrderId === order.orderId && isUpdatingStatus}
                              className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-wait ${
                                order.deliveryStatus === 'DELIVERED'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : order.deliveryStatus === 'SHIPPED'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : order.deliveryStatus === 'PROCESSING'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                            </select>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                              No Status
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p className="font-body text-sm text-slate-500" suppressHydrationWarning>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="font-body text-xs text-slate-400" suppressHydrationWarning>
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setDeletingOrderId(order.orderId);
                                setShowDeleteConfirm(true);
                                setDeleteError(null);
                              }}
                              className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                              title="Delete order"
                            >
                              <Trash2 size={18} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-t-2 border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="font-body text-slate-700 font-medium">
                    <span className="text-brand-red font-bold text-lg">{filteredOrders.length}</span>
                    <span className="text-slate-600"> orders displayed</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-700"><span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'PAID').length}</span> Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-700"><span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'PENDING_PAYMENT').length}</span> Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-700"><span className="font-semibold">{filteredOrders.filter(o => o.paymentStatus === 'CANCELLED').length}</span> Cancelled</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deletingOrderId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-6">
                <AlertTriangle className="text-red-600" size={24} strokeWidth={2} />
              </div>
              
              <h2 className="font-heading text-xl font-bold text-brand-black text-center mb-2">
                Delete Order?
              </h2>
              
              <p className="font-body text-sm text-slate-600 text-center mb-2">
                You are about to delete order <span className="font-mono font-semibold text-brand-black">{deletingOrderId.slice(0, 8)}</span>
              </p>
              
              <p className="font-body text-xs text-slate-500 text-center mb-6">
                This action cannot be undone.
              </p>

              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="font-body text-xs text-red-700">{deleteError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingOrderId(null);
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} strokeWidth={2} />
                  Cancel
                </button>
                <button
                  onClick={() => deleteOrder(deletingOrderId)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} strokeWidth={2} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
