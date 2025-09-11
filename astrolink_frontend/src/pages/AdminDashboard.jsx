import React from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <span className="text-gray-400">Welcome, Admin 👋</span>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-pink-400">Products</h3>
            <p className="text-2xl font-bold">42</p>
          </div>
          <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-purple-400">Projects</h3>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-indigo-400">Testimonials</h3>
            <p className="text-2xl font-bold">67</p>
          </div>
          <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-green-400">Sales</h3>
            <p className="text-2xl font-bold">$12.5K</p>
          </div>
        </div>

        {/* Placeholder for charts / tables */}
        <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-400">Charts and data tables will go here 🚀</p>
        </div>
      </main>
    </div>
  );
}
