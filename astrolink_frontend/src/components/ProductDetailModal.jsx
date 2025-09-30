import React from "react";

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">Close</button>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url.startsWith("/") ? `http://127.0.0.1:5000${product.image_url}` : product.image_url}
                alt={product.name}
                className="object-contain"
                style={{ maxHeight: '420px', width: '100%' }}
              />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            {product.category && <div className="text-sm text-purple-300 mb-2">{product.category}</div>}
            <p className="text-gray-300 mb-4">{product.description}</p>
            <div className="text-3xl font-bold mb-4">${product.price}</div>
            <div className="flex gap-3">
              <button onClick={() => { onAddToCart && onAddToCart(product); onClose(); }} className="bg-purple-600 px-4 py-2 rounded">Add to Cart</button>
              <button onClick={onClose} className="bg-gray-700 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
