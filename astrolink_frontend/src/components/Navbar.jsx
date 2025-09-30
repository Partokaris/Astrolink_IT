import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    if (onLogout) onLogout();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleDashboardClick = () => {
    if (!user) return;
    switch (user.role) {
      case "super_admin":
        navigate("/super-admin-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "user":
        navigate("/user-dashboard");
        break;
      default:
        navigate("/");
    }
    setMenuOpen(false); // close mobile menu if open
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 
    bg-black/60 backdrop-blur-md border-b border-gray-800 
    sticky top-0 z-50 text-white">

      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        AstroLink IT
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
        <Link to="/" className="hover:text-purple-400">Home</Link>
        <Link to="/shop" className="hover:text-purple-400">Shop</Link>
        <Link to="/projects" className="hover:text-purple-400">Projects</Link>
        <Link to="/testimonials" className="hover:text-purple-400">Testimonials</Link>

        {/* Dashboard Button for Admins */}
        {isLoggedIn && (user.role === "admin" || user.role === "super_admin") && (
          <button
            onClick={handleDashboardClick}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow"
          >
            Dashboard
          </button>
        )}

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow"
          >
            Login
          </Link>
        ) : (
          <>
            <span className="mr-2">{user.username} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-gray-300 hover:text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-4 flex flex-col space-y-4 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
          <Link to="/testimonials" onClick={() => setMenuOpen(false)}>Testimonials</Link>

          {/* Dashboard Button for Mobile */}
          {isLoggedIn && (user.role === "admin" || user.role === "super_admin") && (
            <button
              onClick={handleDashboardClick}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow"
            >
              Dashboard
            </button>
          )}

          {!isLoggedIn ? (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          ) : (
            <>
              <span>{user.username} ({user.role})</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
