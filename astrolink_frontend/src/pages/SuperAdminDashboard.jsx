import React from "react";
import Topbar from "../components/Topbar";
import AdminForm from "../components/AdminForm";
import ProjectForm from "../components/ProjectForm";
import StatsCard from "../components/StatsCard";
import { FaUsers, FaProjectDiagram, FaBoxOpen } from "react-icons/fa";

export default function SuperAdminDashboard({ currentUser }) {
  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-700 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Super Admin</h2>
        <nav className="flex flex-col gap-4">
          <a href="#stats" className="hover:text-purple-400 transition">Dashboard</a>
          <a href="#admins" className="hover:text-purple-400 transition">Manage Admins</a>
          <a href="#projects" className="hover:text-purple-400 transition">Manage Projects</a>
          <a href="#products" className="hover:text-purple-400 transition">Manage Products</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Topbar currentUser={currentUser} />

        {/* Stats Section */}
        <section id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatsCard title="Users" value="24" icon={<FaUsers />} />
          <StatsCard title="Projects" value="12" icon={<FaProjectDiagram />} />
          <StatsCard title="Products" value="36" icon={<FaBoxOpen />} />
        </section>

        {/* Admin Management */}
        <section id="admins" className="mt-10">
          <h3 className="text-xl font-bold mb-4">Create Admin</h3>
          <AdminForm />
        </section>

        {/* Project Management */}
        <section id="projects" className="mt-10">
          <h3 className="text-xl font-bold mb-4">Add New Project</h3>
          <ProjectForm />
        </section>
      </div>
    </div>
  );
}
