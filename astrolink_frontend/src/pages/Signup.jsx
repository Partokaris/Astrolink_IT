import React, { useState } from "react";
import { signupUser } from "../api";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(formData);
      alert("Signup successful!");
      console.log(res.data);
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-semibold transition transform hover:scale-[1.02] shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
