import React, { useState } from "react";
import axios from "axios";

export default function AdminForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "admin" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:5000/api/auth/create-admin", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Admin created successfully!");
    } catch (err) {
      alert("Error: " + err.response?.data?.error || "Unknown error");
    }
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      <input className="w-full p-2 border rounded" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
      <select className="w-full p-2 border rounded" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
        <option value="admin">Admin</option>
        <option value="project_admin">Project Admin</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">Create Admin</button>
    </form>
  );
}
