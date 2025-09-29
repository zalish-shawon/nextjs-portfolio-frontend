"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);

  async function fetchProjects() {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Failed to fetch projects");
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Deleted");
      fetchProjects();
    } catch {
      toast.error("Error deleting");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={p.thumbnail || "/placeholder.png"}
              alt="project"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-600 line-clamp-2 mb-2">{p.description}</p>
              <div className="flex justify-between">
                <a
                  href={p.liveUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Live
                </a>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(p._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
