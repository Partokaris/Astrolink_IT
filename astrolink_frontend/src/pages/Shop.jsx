import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
