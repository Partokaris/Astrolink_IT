import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Shop from "./pages/Shop";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Testimonials from "./pages/Testimonials";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

// Dashboards
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles, user }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/testimonials" element={<Testimonials />} />

        {/* Protected Routes */}
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]} user={user}>
              <SuperAdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]} user={user}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "super_admin"]} user={user}>
              <UserDashboard user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
