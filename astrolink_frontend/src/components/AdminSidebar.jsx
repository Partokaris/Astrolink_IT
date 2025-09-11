import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Package, FolderKanban, MessageSquare, BarChart2, LogOut } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-black/70 backdrop-blur-lg border-r border-gray-800 p-6 sticky top-0 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          AstroLink Admin
        </h2>

        <nav className="space-y-4 text-gray-300">
          <Link to="/admin" className="flex items-center gap-3 hover:text-pink-400">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 hover:text-purple-400">
            <Package size={18} /> Products
          </Link>
          <Link to="/admin/projects" className="flex items-center gap-3 hover:text-indigo-400">
            <FolderKanban size={18} /> Projects
          </Link>
          <Link to="/admin/testimonials" className="flex items-center gap-3 hover:text-pink-300">
            <MessageSquare size={18} /> Testimonials
          </Link>
          <Link to="/admin/sales" className="flex items-center gap-3 hover:text-green-400">
            <BarChart2 size={18} /> Sales
          </Link>
        </nav>
      </div>

      <button className="flex items-center gap-3 text-red-400 hover:text-red-300">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
