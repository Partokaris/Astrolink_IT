import React, { useState } from "react";

export default function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const src = project.image_url
    ? (project.image_url.startsWith("/") ? `http://127.0.0.1:5000${project.image_url}` : project.image_url)
    : "https://via.placeholder.com/300";

  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={src} alt={project.title} className="w-full h-40 object-cover mb-2 rounded" />
      <h3 className="text-xl font-bold mb-1 text-white">{project.title}</h3>
      <p
        className="text-sm"
        style={!expanded ? { color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } : { color: '#d1d5db' }}
      >
        {project.description}
      </p>
      {project.description && project.description.length > 140 && (
        <button onClick={() => setExpanded((s) => !s)} className="text-xs text-purple-300 mt-2">
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
