import React from "react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="border rounded-lg p-4 shadow italic">
      <p>"{testimonial.comment}"</p>
      <p className="mt-2 font-bold text-right">- {testimonial.name}</p>
    </div>
  );
}
