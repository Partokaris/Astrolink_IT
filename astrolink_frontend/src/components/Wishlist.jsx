import React from "react";

export default function Wishlist({ items = [], onRemove, onClose }) {
  return (
    <aside className="w-80 bg-gray-900/95 border-l border-gray-700 p-4 h-full fixed left-0 top-0 z-30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Wishlist</h3>
        <button onClick={onClose} className="text-gray-400">Close</button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">No wishlist items</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-400">${it.price}</div>
              </div>
              <div>
                <button onClick={() => onRemove(it.id)} className="text-sm text-red-400">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
