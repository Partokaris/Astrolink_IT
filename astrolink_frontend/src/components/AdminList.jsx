// src/components/AdminList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/api/auth/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admins:", err);
        const status = err.response?.status;
        if (status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (status === 403) {
          setError("Access denied. You need super admin privileges.");
        } else {
          setError(err.response?.data?.error || "Failed to fetch admins");
        }
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <p>Loading admins...</p>;
  if (error) return (
    <div>
      <p className="text-red-500">{error}</p>
      {error.includes('login') && (
        <div className="mt-2">
          <a href="/login" className="text-sm text-purple-300 underline">Go to login</a>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">All Admins</h3>
      <table className="min-w-full bg-gray-700 border border-gray-600 rounded">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No admins found.
              </td>
            </tr>
          )}
          {admins.map((admin) => (
            <tr key={admin.id} className="text-center hover:bg-gray-600">
              <td className="py-2 px-4 border-b">{admin.id}</td>
              <td className="py-2 px-4 border-b">{admin.username}</td>
              <td className="py-2 px-4 border-b">{admin.email}</td>
              <td className="py-2 px-4 border-b">{admin.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
