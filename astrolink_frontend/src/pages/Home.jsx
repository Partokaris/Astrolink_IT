import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProjectCard from "../components/ProjectCard";
import { fetchProducts, fetchProjects, fetchTestimonials } from "../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data.slice(0,8))).catch(()=>{});
    fetchProjects().then(res => setProjects(res.data.slice(0,6))).catch(()=>{});
    fetchTestimonials().then(res => setTestimonials(res.data.slice(0,3))).catch(()=>{});
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400">
            Empowering IT Solutions for Modern Businesses
          </h1>
          <p className="text-gray-300 mb-6 max-w-xl">AstroLink IT connects you with quality IT products and expertly delivered projects — built for performance and reliability.</p>
          <div className="flex gap-4">
            <Link to="/shop" className="px-5 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 font-semibold">Shop Now</Link>
            <Link to="/projects" className="px-5 py-3 rounded-lg border border-gray-700">Our Projects</Link>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {products.slice(0,4).map(p => (
            <div key={p.id} className="bg-gray-800 rounded-lg p-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-purple-300 mb-2">Quality Products</h3>
            <p className="text-gray-400">Hand-picked IT hardware and accessories for businesses.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-pink-300 mb-2">Expert Projects</h3>
            <p className="text-gray-400">Delivery-focused teams to implement your IT projects end-to-end.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-indigo-300 mb-2">Reliable Support</h3>
            <p className="text-gray-400">Support plans and after-sales service to keep systems running.</p>
          </div>
        </div>
      </section>

      {/* Projects preview */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Link to="/projects" className="text-purple-300">See all</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map(pr => <ProjectCard key={pr.id} project={pr} />)}
            {projects.length === 0 && <div className="text-gray-400">No projects yet.</div>}
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">What clients say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300 mb-3">"{t.comment}"</p>
                <div className="text-sm font-semibold text-purple-300">- {t.name}</div>
              </div>
            ))}
            {testimonials.length === 0 && <div className="text-gray-400">No testimonials yet.</div>}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
          <p className="text-gray-400 mb-6">Contact us to discuss your project or explore our product catalog.</p>
          <Link to="/contact" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold">Contact Sales</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AstroLink IT. All rights reserved.
      </footer>
    </div>
  );
}
