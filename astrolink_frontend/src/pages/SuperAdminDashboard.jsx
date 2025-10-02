import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaProjectDiagram, FaUsers, FaComments } from "react-icons/fa";
import AdminProducts from "./AdminProducts";
import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";
import axios from "axios";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import TestimonialsManager from "../components/TestimonialsManager"; // you'll need to create this
import Topbar from "../components/Topbar";
import { fetchOrders, fetchOrdersAdmin, fetchOrderAdmin, updateOrder } from '../api';
import { parsePrice, formatPrice } from '../utils/price';

export default function SuperAdminDashboard({ currentUser }) {
  const [activeSection, setActiveSection] = useState("products");
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersTotals, setOrdersTotals] = useState({ count: 0, revenue: 0 });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderEdit, setOrderEdit] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => { if (activeSection === 'projects') fetchProjects(); }, [activeSection]);
  useEffect(() => { if (activeSection === 'orders') fetchOrdersList(); }, [activeSection, page, startDate, endDate]);

  const fetchOrdersList = async () => {
    try {
      const params = { limit: pageSize, page, start_date: startDate || undefined, end_date: endDate || undefined };
      // backend supports limit; we'll filter by dates client-side if backend doesn't support them
      const res = await fetchOrdersAdmin(params);
      let list = res.data?.orders || [];

      // client-side date filtering if created_at present
      if (startDate) {
        const s = new Date(startDate);
        list = list.filter(o => {
          const d = new Date(o.created_at);
          return !isNaN(d.getTime()) && d >= s;
        });
      }
      if (endDate) {
        const e = new Date(endDate);
        list = list.filter(o => {
          const d = new Date(o.created_at);
          return !isNaN(d.getTime()) && d <= e;
        });
      }

      setOrders(list);
  const revenue = list.reduce((s, o) => s + parsePrice(o.total), 0);
      setOrdersTotals({ count: list.length, revenue });
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      fetchOrdersList();
    } catch (err) {
      alert('Failed to update order');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/90 border-r border-gray-700 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">AstroLink Admin</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveSection("products")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "products" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaBoxOpen /> Products
          </button>

          <button
            onClick={() => setActiveSection("projects")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "projects" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaProjectDiagram /> Projects
          </button>

          <button
            onClick={() => setActiveSection("orders")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "orders" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaBoxOpen /> Orders
          </button>

          <button
            onClick={() => setActiveSection("admins")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "admins" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaUsers /> Admins
          </button>

          <button
            onClick={() => setActiveSection("testimonials")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "testimonials" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaComments /> Testimonials
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Topbar currentUser={currentUser} />

        <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg mt-6">
          {activeSection === "products" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Products</h3>
              <AdminProducts />
            </>
          )}

          {activeSection === "projects" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Add Project</h4>
                  <ProjectForm />
                </div>

                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Uploaded Projects</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div key={p.id} className="relative">
                        <ProjectCard project={p} />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button onClick={async () => { if (!confirm('Delete project?')) return; try { const token = localStorage.getItem('token'); await axios.delete(`http://127.0.0.1:5000/api/projects/${p.id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchProjects(); } catch (e) { alert('Delete failed'); } }} className="text-sm bg-red-600 px-2 py-1 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-gray-400">No projects uploaded yet.</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "admins" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Admins</h3>
              <div className="mb-6">
                <AdminForm />
              </div>
              <AdminList />
            </>
          )}

          {activeSection === "testimonials" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Testimonials</h3>
              <TestimonialsManager />
            </>
          )}

          {activeSection === "orders" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Orders & Sales</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Sales Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><div className="text-gray-400">Orders</div><div>{ordersTotals.count}</div></div>
                    <div className="flex justify-between"><div className="text-gray-400">Revenue</div><div>${formatPrice(parsePrice(ordersTotals.revenue))}</div></div>
                  </div>
                </div>

                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">Recent Orders</h4>
                    <div className="flex gap-2 mb-4">
                      <div>
                        <label className="text-sm text-gray-400">From</label>
                        <input type="date" value={startDate} onChange={(e)=>{ setStartDate(e.target.value); setPage(1); }} className="ml-2 p-1 bg-black rounded" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">To</label>
                        <input type="date" value={endDate} onChange={(e)=>{ setEndDate(e.target.value); setPage(1); }} className="ml-2 p-1 bg-black rounded" />
                      </div>
                      <div className="ml-auto flex items-end gap-2">
                        <button onClick={()=>{ setStartDate(''); setEndDate(''); setPage(1); }} className="text-sm px-2 py-1 bg-gray-700 rounded">Clear</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="text-gray-400">
                            <th className="py-2 px-3">ID</th>
                            <th className="py-2 px-3">When</th>
                            <th className="py-2 px-3">Customer</th>
                            <th className="py-2 px-3">Items</th>
                            <th className="py-2 px-3">Total</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-t border-gray-700">
                              <td className="py-2 px-3">{o.id}</td>
                              <td className="py-2 px-3 text-xs text-gray-400">{(function(){ const d=new Date(o.created_at); return isNaN(d.getTime()) ? '-' : d.toLocaleString(); })()}</td>
                              <td className="py-2 px-3">{o.customer_name}<div className="text-xs text-gray-500">{o.customer_email}</div></td>
                              <td className="py-2 px-3">{(o.items || []).map(i=>`${i.qty||1}× ${i.name}`).join(', ')}</td>
                              <td className="py-2 px-3">${formatPrice(parsePrice(o.total))}</td>
                              <td className="py-2 px-3">{o.status}</td>
                              <td className="py-2 px-3">
                              <select value={o.status} onChange={(e)=>handleUpdateOrderStatus(o.id, e.target.value)} className="bg-black p-1 rounded text-sm">
                                <option value="pending">pending</option>
                                <option value="processing">processing</option>
                                <option value="shipped">shipped</option>
                                <option value="completed">completed</option>
                                <option value="cancelled">cancelled</option>
                              </select>
                              <button onClick={async ()=>{ try { const res = await fetchOrderAdmin(o.id); const order = res.data?.order; if(order){ setSelectedOrder(order); setOrderEdit(null); } else { alert('Order not found'); } } catch(err){ console.error('Failed to fetch order', err); alert('Failed to fetch order'); } }} className="ml-2 text-sm px-2 py-1 bg-gray-700 rounded">Details</button>
                            </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr><td colSpan={7} className="py-4 text-gray-400">No orders yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* pagination */}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-400">Showing {orders.length} orders</div>
                      <div className="flex gap-2">
                        <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 bg-gray-700 rounded">Prev</button>
                        <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 bg-gray-700 rounded">Next</button>
                      </div>
                    </div>
                  </div>
              </div>
            </>
          )}
        </div>
      </main>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order #{selectedOrder.id}</h3>
              <button onClick={()=>{ setSelectedOrder(null); setOrderEdit(null); }} className="text-gray-400">Close</button>
            </div>
            <div className="space-y-3">
              <div><strong>When:</strong> {(function(){ const d=new Date(selectedOrder.created_at); return isNaN(d.getTime()) ? '-' : d.toLocaleString(); })()}</div>

              <div>
                <label className="block text-sm text-gray-400">Customer name</label>
                <input className="w-full p-2 bg-black rounded mt-1" value={(orderEdit?.customer_name) ?? (selectedOrder?.customer_name ?? '')} onChange={(e)=>setOrderEdit((s)=>({...s, customer_name: e.target.value}))} />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Customer email</label>
                <input className="w-full p-2 bg-black rounded mt-1" value={(orderEdit?.customer_email) ?? (selectedOrder?.customer_email ?? '')} onChange={(e)=>setOrderEdit((s)=>({...s, customer_email: e.target.value}))} />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Shipping Address</label>
                <textarea className="w-full p-2 bg-black rounded mt-1" value={(orderEdit?.shipping_address) ?? (selectedOrder?.shipping_address ?? '')} onChange={(e)=>setOrderEdit((s)=>({...s, shipping_address: e.target.value}))} />
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <li key={idx}>{(it.qty||1)}× {it.name} — ${formatPrice(parsePrice(it.price))}</li>
                  ))}
                </ul>
              </div>
              <div className="font-bold">Total: ${formatPrice(parsePrice(selectedOrder.total))}</div>
              <div className="flex gap-2">
                <button onClick={async ()=>{ try{ const payload = { ...(orderEdit||{}), status: 'processing' }; await updateOrder(selectedOrder.id, payload); setSelectedOrder(null); setOrderEdit(null); fetchOrdersList(); }catch(e){alert('Failed to update');} }} className="px-3 py-1 bg-yellow-600 rounded">Mark Processing & Save</button>
                <button onClick={async ()=>{ try{ const payload = { ...(orderEdit||{}), status: 'shipped' }; await updateOrder(selectedOrder.id, payload); setSelectedOrder(null); setOrderEdit(null); fetchOrdersList(); }catch(e){alert('Failed to update');} }} className="px-3 py-1 bg-blue-600 rounded">Mark Shipped & Save</button>
                <button onClick={async ()=>{ try{ const payload = { ...(orderEdit||{}), status: 'completed' }; await updateOrder(selectedOrder.id, payload); setSelectedOrder(null); setOrderEdit(null); fetchOrdersList(); }catch(e){alert('Failed to update');} }} className="px-3 py-1 bg-green-600 rounded">Mark Completed & Save</button>
                <button onClick={async ()=>{ try{ const payload = { ...(orderEdit||{}) }; await updateOrder(selectedOrder.id, payload); setSelectedOrder(null); setOrderEdit(null); fetchOrdersList(); }catch(e){alert('Failed to save');} }} className="px-3 py-1 bg-gray-700 rounded">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
