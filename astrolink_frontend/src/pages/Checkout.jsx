import React, { useState, useEffect } from 'react';
import { createOrder } from '../api';
import { parsePrice, formatPrice } from '../utils/price';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('astrolink_cart_v1') || '[]';
      const parsed = JSON.parse(raw);
      setCart(parsed);
    } catch (e) {
      setCart([]);
    }
  }, []);

  const totalNum = cart.reduce((s, i) => s + parsePrice(i.price), 0);
  const total = formatPrice(totalNum);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        shipping_address: form.shipping_address,
        items: cart,
        total: parseFloat(total)
      };
      const res = await createOrder(payload);
      setMessage({ type: 'success', text: 'Order created. ID: ' + (res.data.order_id || '') });
      // clear cart
      localStorage.removeItem('astrolink_cart_v1');
      setCart([]);
      // navigate to a thank-you or home after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err?.response?.data?.error || 'Failed to create order' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input required type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Shipping address</label>
            <textarea value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} className="w-full p-2 border rounded" />
          </div>

          <div>
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Processing...' : 'Place Order'}</button>
          </div>
        </form>

        <div>
          <h3 className="text-lg font-semibold">Your items</h3>
        {cart.length === 0 ? <p className="text-gray-400">No items in cart</p> : (
            <div className="space-y-2 mt-2">
              {cart.map(it => (
                <div key={it.id} className="flex justify-between p-2 bg-gray-800 rounded">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-400">Qty: {it.qty || 1}</div>
                  </div>
              <div className="font-semibold">${formatPrice(it.price)}</div>
                </div>
              ))}
            <div className="mt-4 flex justify-between font-bold">Total <div>${total}</div></div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
