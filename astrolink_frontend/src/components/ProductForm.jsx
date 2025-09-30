import React, { useState } from "react";
import axios from "axios";

const CATEGORY_OPTIONS = ["Printers", "Desktops", "Laptops", "Formcleaners", "Accessories", "Networking", "Servers", "Peripherals"];

export default function ProductForm({ onSuccess, initialData = null, isEdit = false, onDone }) {
  const [form, setForm] = useState(initialData ? { name: initialData.name || "", price: initialData.price || "", description: initialData.description || "", image_url: initialData.image_url || "", id: initialData.id, category: initialData.category || "Accessories" } : { name: "", price: "", description: "", image_url: "", category: "Accessories" });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadImage = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:5000/api/uploads/upload-image", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data.image_url;
    } catch (err) {
      alert("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image_url;
    if (file) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

  try {
      const token = localStorage.getItem("token");
      if (isEdit && form.id) {
        // update
        await axios.put(
          `http://127.0.0.1:5000/api/products/${form.id}`,
      { name: form.name, price: parseFloat(form.price || 0), description: form.description, image_url: imageUrl, category: form.category },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        alert("Product updated");
        if (onDone) onDone();
        if (onSuccess) onSuccess();
      } else {
        await axios.post(
          "http://127.0.0.1:5000/api/products",
          { name: form.name, price: parseFloat(form.price || 0), description: form.description, image_url: imageUrl, category: form.category },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        alert("Product added");
        setForm({ name: "", price: "", description: "", image_url: "" });
        setFile(null);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      alert("Failed to add/update product: " + (err.response?.data?.error || ""));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input className="w-full p-2 border rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className="w-full p-2 border rounded" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
      <select className="w-full p-2 border rounded bg-black" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
  <button className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? "Update Product" : "Add Product"}</button>
    </form>
  );
}
