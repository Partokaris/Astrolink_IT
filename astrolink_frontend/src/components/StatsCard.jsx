import React from "react";

export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md flex items-center justify-between border border-gray-700">
      <div>
        <h4 className="text-gray-400 text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-4xl">{icon}</div>}
    </div>
  );
}
