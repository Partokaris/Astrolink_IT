import React, { useState } from "react";
import axios from "axios";

export default function AdminForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role_id: 2 // default to admin
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before sending
    if (!form.username || !form.email || !form.password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:5000/api/auth/create-admin",
        {
          username: form.username,
          email: form.email,
          password: form.password,
          role_id: String(form.role_id)  // 👈 convert to string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" // important!
          }
        }
      );

      alert("Admin created successfully!");
      setForm({ username: "", email: "", password: "", role_id: 2 }); // reset form
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 border rounded"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="w-full p-2 border rounded"
        value={form.role_id}
        onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
      >
        <option value={2}>Admin</option>
        <option value={3}>Project Admin</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
        Create Admin
      </button>
    </form>
  );
}
