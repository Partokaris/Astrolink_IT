import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-bold">{product.name}</h3>
      <p className="mb-2">{product.description}</p>
      <p className="font-semibold">${product.price}</p>
    </div>
  );
}
