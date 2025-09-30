import React from "react";

export default function CartSidebar({ items = [], onRemove, onCheckout, onClose }) {
  const total = items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);

  return (
    <aside className="w-96 bg-gray-900/95 border-l border-gray-700 p-4 h-full fixed right-0 top-0 z-40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Cart</h3>
        <button onClick={onClose} className="text-gray-400">Close</button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">Cart is empty</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-400">${it.price}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => onRemove(it.id)} className="text-sm text-red-400">Remove</button>
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-between items-center">
            <div className="font-bold">Total</div>
            <div className="font-semibold">${total.toFixed(2)}</div>
          </div>

          <button onClick={onCheckout} className="mt-4 bg-green-600 px-4 py-2 rounded">Checkout</button>
        </div>
      )}
    </aside>
  );
}
