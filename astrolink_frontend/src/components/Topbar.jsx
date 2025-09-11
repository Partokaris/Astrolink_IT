import React from "react";

export default function Topbar({ user, onLogout }) {
  return (
    <div className="w-full flex justify-end bg-gray-800 text-white p-4 shadow-md">
      <span className="mr-4">
        {user ? `${user.username} (${user.role})` : "Loading..."}
      </span>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded transition"
        disabled={!user} // disable logout until user is loaded
      >
        Logout
      </button>
    </div>
  );
}
