import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // 👈 use new Navbar

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen flex flex-col">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center flex-grow px-6 pt-40 pb-20">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
          Empowering IT Solutions for the Future
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mb-8">
          Build, innovate, and grow with AstroLink IT. From projects to products,
          we bring modern IT solutions closer to you.
        </p>
        <div className="space-x-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 rounded-lg border border-gray-600 hover:border-purple-500 hover:text-purple-400 transition"
          >
            Explore Projects
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-8 py-16 bg-gray-900">
        <h3 className="text-3xl font-bold text-center mb-12">
          What We Offer
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h4 className="text-xl font-semibold mb-3 text-purple-400">
              Products
            </h4>
            <p className="text-gray-400">
              Discover innovative tech products tailored for your business needs.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h4 className="text-xl font-semibold mb-3 text-pink-400">
              Projects
            </h4>
            <p className="text-gray-400">
              Explore our IT projects and request custom solutions.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition">
            <h4 className="text-xl font-semibold mb-3 text-indigo-400">
              Community
            </h4>
            <p className="text-gray-400">
              Rate, comment, and share your experiences with our services.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">What Clients Say</h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow">
            <p className="text-gray-300 mb-4">
              "AstroLink IT transformed our workflow with their cutting-edge
              solutions. Highly recommend!"
            </p>
            <span className="text-sm font-semibold text-purple-400">
              — Jane Doe
            </span>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow">
            <p className="text-gray-300 mb-4">
              "Professional team, innovative projects, and excellent support!"
            </p>
            <span className="text-sm font-semibold text-pink-400">
              — John Smith
            </span>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/testimonials"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow font-semibold"
          >
            Read More
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 bg-gray-900 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AstroLink IT. All rights reserved.
      </footer>
    </div>
  );
}
