import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={project.image_url || "https://via.placeholder.com/300"} alt={project.title} className="w-full h-40 object-cover mb-2 rounded" />
      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
}
