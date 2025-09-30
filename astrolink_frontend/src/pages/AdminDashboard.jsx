import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // not logged in
          return;
        }

        const res = await axios.get("http://127.0.0.1:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = res.data.user;
        setUser(currentUser);

        if (currentUser.role_id !== 1) {
  // only super admin can stay here
        if (currentUser.role_id === 2) {
          navigate("/restricted-admin-dashboard"); // later you can build limited admin dashboard
        } else {
          navigate("/user-dashboard");
        }
      }

      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <span className="text-gray-400">Welcome, {user.username} 👋</span>
        </div>

        <ProductManagement />
      </main>
    </div>
  );
}


function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:5000/api/products/${product.id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">{editing ? `Edit: ${editing.name}` : "Add Product"}</h2>
        {editing ? (
          <ProductForm onSuccess={() => fetchProducts()} initialData={editing} isEdit onDone={() => setEditing(null)} />
        ) : (
          <ProductForm onSuccess={fetchProducts} />
        )}
      </div>

      <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
        <div className="grid gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
          {products.length === 0 && <p className="text-gray-400">No products yet.</p>}
        </div>
      </div>
    </div>
  );
}
