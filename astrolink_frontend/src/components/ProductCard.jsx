import React from "react";

export default function ProductCard({ product, onEdit, onDelete, onAddToCart, onToggleWishlist, isWishlisted, onShowDetails }) {
  return (
    <div className="bg-gradient-to-br from-gray-800/70 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
      <div className="relative bg-gray-700">
        <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-black">
          {product.image_url ? (
            <img
              src={product.image_url.startsWith("/") ? `http://127.0.0.1:5000${product.image_url}` : product.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
              style={{ objectPosition: 'center' }}
            />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={() => onAddToCart && onAddToCart(product)} className="bg-purple-600 text-white text-xs px-3 py-1 rounded">Add</button>
          <button onClick={() => onToggleWishlist && onToggleWishlist(product)} className={`text-xs px-3 py-1 rounded ${isWishlisted ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-200'}`}>{isWishlisted ? '♥' : '♡'}</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
          {product.category && <span className="text-xs bg-purple-700 text-purple-100 px-2 py-0.5 rounded">{product.category}</span>}
        </div>

        <p className="text-sm text-gray-300 h-12 overflow-hidden">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xl font-bold text-white">${product.price}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => onShowDetails && onShowDetails(product)} className="text-sm px-3 py-1 bg-gray-700 rounded text-gray-200">View</button>
            {onEdit && <button onClick={() => onEdit(product)} className="text-sm px-3 py-1 bg-yellow-600 rounded">Edit</button>}
            {onDelete && <button onClick={() => onDelete(product)} className="text-sm px-3 py-1 bg-red-600 rounded">Delete</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
