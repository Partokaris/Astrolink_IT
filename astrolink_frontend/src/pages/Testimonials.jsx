import React, { useEffect, useState } from "react";
import { fetchTestimonials } from "../api";
import TestimonialCard from "../components/TestimonialCard";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials()
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </div>
  );
}
