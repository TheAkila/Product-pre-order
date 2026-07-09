'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [ordersTest, setOrdersTest] = useState<any>(null);
  const [envTest, setEnvTest] = useState<any>(null);
  const [ordersSimpleTest, setOrdersSimpleTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const envVars = {
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
    PAYHERE_MERCHANT_ID: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ? '✓ Set' : '✗ Missing',
    PAYHERE_MODE: process.env.NEXT_PUBLIC_PAYHERE_MODE || 'Not set',
    ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? '✓ Set' : '✗ Missing',
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'Not set',
  };

  const testApiEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTestResults({ status: response.status, data });
    } catch (error) {
      setTestResults({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const testOrdersEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      setOrdersTest({ 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error) {
      setOrdersTest({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const testEnvEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/env-check');
      const data = await response.json();
      setEnvTest({ status: response.status, data });
    } catch (error) {
      setEnvTest({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const testOrdersSimpleEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders-test');
      const data = await response.json();
      setOrdersSimpleTest({ status: response.status, data });
    } catch (error) {
      setOrdersSimpleTest({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Dashboard</h1>
        
        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Variable</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(envVars).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="py-2 font-mono text-sm">{key}</td>
                  <td className="py-2">
                    <span className={value.includes('✓') ? 'text-green-600' : 'text-red-600'}>
                      {value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* API Tests */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">API Tests</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={testApiEndpoint}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test /api/test'}
              </button>
              <button
                onClick={testEnvEndpoint}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test /api/env-check'}
              </button>
              <button
                onClick={testOrdersSimpleEndpoint}
                disabled={loading}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test /api/orders-test'}
              </button>
              <button
                onClick={testOrdersEndpoint}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test /api/orders (Full)'}
              </button>
            </div>
            
            {testResults && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold">Test API Results:</h3>
                <pre className="text-xs overflow-x-auto mt-2">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
            
            {envTest && (
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <h3 className="font-bold">Environment Check Results:</h3>
                <pre className="text-xs overflow-x-auto mt-2">
                  {JSON.stringify(envTest, null, 2)}
                </pre>
              </div>
            )}
            
            {ordersSimpleTest && (
              <div className="mt-4 p-4 bg-yellow-50 rounded">
                <h3 className="font-bold">Orders Test Results:</h3>
                <pre className="text-xs overflow-x-auto mt-2">
                  {JSON.stringify(ordersSimpleTest, null, 2)}
                </pre>
              </div>
            )}
            
            {ordersTest && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <h3 className="font-bold">Orders API Results:</h3>
                <pre className="text-xs overflow-x-auto mt-2">
                  {JSON.stringify(ordersTest, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Client Info</h2>
          <div className="text-sm space-y-2">
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-red-600 hover:underline">← Back to Home</Link>
          {' | '}
          <Link href="/admin" className="text-red-600 hover:underline">Admin Dashboard →</Link>
        </div>
      </div>
    </div>
  );
}
