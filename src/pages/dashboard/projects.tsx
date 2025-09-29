import api from "@/utils/apiClient";
import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProjectsDashboard({ projects }: any) {
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, { title, slug, description });
        toast.success("Project updated");
      } else {
        await api.post("/projects", { title, slug, description });
        toast.success("Project created");
      }
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      window.location.reload();
    } catch {
      toast.error("Error deleting project");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setEditing(null);
            setTitle("");
            setSlug("");
            setDescription("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p: any) => (
          <div
            key={p._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-gray-600">{p.description}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setEditing(p);
                  setTitle(p.title);
                  setSlug(p.slug);
                  setDescription(p.description);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(editing || title) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] space-y-4">
            <h2 className="font-bold text-xl">
              {editing ? "Edit Project" : "New Project"}
            </h2>
            <input
              className="border px-3 py-2 w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border px-3 py-2 w-full"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <textarea
              className="border px-3 py-2 w-full"
              placeholder="Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setSlug("");
                  setDescription("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SSR fetch
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?all=true`);
  const projects = await res.json();
  return { props: { projects } };
};
