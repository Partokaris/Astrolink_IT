import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ active }) {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Super Admin</h2>
      <Link className={`hover:bg-gray-700 p-2 rounded ${active==="dashboard"?"bg-gray-700":""}`} to="/admin">Dashboard</Link>
      <Link className={`hover:bg-gray-700 p-2 rounded ${active==="admins"?"bg-gray-700":""}`} to="/admin/admins">Admins</Link>
      <Link className={`hover:bg-gray-700 p-2 rounded ${active==="projects"?"bg-gray-700":""}`} to="/admin/projects">Projects</Link>
      <Link className={`hover:bg-gray-700 p-2 rounded ${active==="products"?"bg-gray-700":""}`} to="/admin/products">Products</Link>
      <Link className={`hover:bg-gray-700 p-2 rounded ${active==="testimonials"?"bg-gray-700":""}`} to="/admin/testimonials">Testimonials</Link>
    </div>
  );
}
