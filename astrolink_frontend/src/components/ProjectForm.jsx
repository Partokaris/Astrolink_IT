import React, { useState } from "react";
import axios from "axios";

export default function ProjectForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: ""
  });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token"); // include auth if needed
      const res = await axios.post(
        "http://127.0.0.1:5000/api/uploads/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data.image_url; // backend should return URL
    } catch (err) {
      alert("Image upload failed: " + (err.response?.data?.error || ""));
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = form.image_url;
    if (file) {
      imageUrl = await uploadImage();
      if (!imageUrl) return; // stop if upload fails
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:5000/api/projects",
        { ...form, image_url: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project created successfully!");
      setForm({ title: "", description: "", image_url: "" });
      setFile(null);
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
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
        Add Project
      </button>
    </form>
  );
}
