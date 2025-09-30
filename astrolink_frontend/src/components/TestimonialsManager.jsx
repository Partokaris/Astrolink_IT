import React, { useEffect, useState } from "react";
import { fetchTestimonials, addTestimonial, deleteTestimonial } from "../api";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    try {
      const res = await addTestimonial({ name, comment });
      setName("");
      setComment("");
      // refresh
      load();
    } catch (err) {
      console.error("Failed to add testimonial", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete testimonial", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="p-2 rounded bg-gray-700/60 w-1/3"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment"
            className="p-2 rounded bg-gray-700/60 flex-1"
          />
          <button className="bg-purple-600 px-4 rounded">Add</button>
        </div>
      </form>

      {loading ? (
        <p>Loading testimonials...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.length === 0 && <p className="text-gray-400">No testimonials yet.</p>}
          {testimonials.map((t) => (
            <div key={t.id} className="relative">
              <TestimonialCard testimonial={t} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
