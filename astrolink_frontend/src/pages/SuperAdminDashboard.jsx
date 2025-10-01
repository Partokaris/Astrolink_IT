import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaProjectDiagram, FaUsers, FaComments } from "react-icons/fa";
import AdminProducts from "./AdminProducts";
import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";
import axios from "axios";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import TestimonialsManager from "../components/TestimonialsManager"; // you'll need to create this
import Topbar from "../components/Topbar";

export default function SuperAdminDashboard({ currentUser }) {
  const [activeSection, setActiveSection] = useState("products");
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => { if (activeSection === 'projects') fetchProjects(); }, [activeSection]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/90 border-r border-gray-700 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">AstroLink Admin</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveSection("products")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "products" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaBoxOpen /> Products
          </button>

          <button
            onClick={() => setActiveSection("projects")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "projects" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaProjectDiagram /> Projects
          </button>

          <button
            onClick={() => setActiveSection("admins")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "admins" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaUsers /> Admins
          </button>

          <button
            onClick={() => setActiveSection("testimonials")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              activeSection === "testimonials" ? "bg-purple-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            <FaComments /> Testimonials
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Topbar currentUser={currentUser} />

        <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg mt-6">
          {activeSection === "products" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Products</h3>
              <AdminProducts />
            </>
          )}

          {activeSection === "projects" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Add Project</h4>
                  <ProjectForm />
                </div>

                <div className="p-6 bg-gray-800/70 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Uploaded Projects</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div key={p.id} className="relative">
                        <ProjectCard project={p} />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button onClick={async () => { if (!confirm('Delete project?')) return; try { const token = localStorage.getItem('token'); await axios.delete(`http://127.0.0.1:5000/api/projects/${p.id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchProjects(); } catch (e) { alert('Delete failed'); } }} className="text-sm bg-red-600 px-2 py-1 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-gray-400">No projects uploaded yet.</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "admins" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Admins</h3>
              <div className="mb-6">
                <AdminForm />
              </div>
              <AdminList />
            </>
          )}

          {activeSection === "testimonials" && (
            <>
              <h3 className="text-2xl font-bold mb-6">Manage Testimonials</h3>
              <TestimonialsManager />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
