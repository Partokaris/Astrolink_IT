import React, { useState } from "react";
import axios from "axios";

export default function ProjectForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:5000/api/projects", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Project created successfully!");
      setForm({ title: "", description: "", image_url: "" });
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 border rounded"
        placeholder="Project Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Project Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Image URL"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
        Add Project
      </button>
    </form>
  );
}
