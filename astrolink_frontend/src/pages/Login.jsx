import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) { // ✅ receive setUser from App
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      const { token, user } = res.data;

      if (token) {
        // ✅ Save token & user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Update global user state so Navbar updates immediately
        setUser(user);

        alert(`Welcome back, ${user.username}!`);

        // ✅ Redirect based on role
        if (user.role === "super_admin") {
          navigate("/super-admin-dashboard");
        } else if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/"); // normal users go to homepage
        }
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 font-semibold transition transform hover:scale-[1.02] shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
