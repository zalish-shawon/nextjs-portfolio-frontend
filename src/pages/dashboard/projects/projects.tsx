/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/apiClient";
import RichTextEditor from "@/components/RichTextEditor";

interface Project {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  features: string;
  stack: string;
  repoUrl: string;
  liveUrl: string;
  image?: string;
}

export default function ProjectsDashboard({ projects }: { projects: Project[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>({
    title: "",
    slug: "",
    description: "",
    features: "",
    stack: "",
    repoUrl: "",
    liveUrl: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  // ✅ Prevent state reset while typing
  const handleChange = (key: keyof Project, value: string) => {
    setForm((prev) => {
      if (key === "title" && !editing) {
        const slug = generateSlug(value);
        return { ...prev, title: value, slug };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSave = async () => {
    try {
      if (!form.title || !form.description || !form.stack) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = { ...form, slug: generateSlug(form.title) };

      if (editing && editing._id) {
        await api.put(`api/projects/${editing._id}`, payload);
        toast.success("Project updated successfully!");
      } else {
        await api.post("api/projects", payload);
        toast.success("Project created successfully!");
      }

      setShowModal(false);
      setEditing(null);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`api/projects/${id}`);
      toast.success("Project deleted");
      window.location.reload();
    } catch {
      toast.error("Error deleting project");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: data }
      );
      const fileRes = await res.json();
      toast.dismiss(toastId);
      toast.success("Image uploaded!");
      setForm((prev) => ({ ...prev, image: fileRes.secure_url }));
      setImagePreview(fileRes.secure_url);
    } catch {
      toast.dismiss(toastId);
      toast.error("Image upload failed");
    }
  };

  const openNewModal = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      description: "",
      features: "",
      stack: "",
      repoUrl: "",
      liveUrl: "",
      image: "",
    });
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditing(project);
    setForm({ ...project });
    setImagePreview(project.image || "");
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-medium"
        >
          + New Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg shadow hover:shadow-md transition bg-white p-4 flex flex-col justify-between"
          >
            <div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
              <p
                className="text-sm text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: (item.description || "").substring(0, 120) + "...",
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Stack: {item.stack}</p>
            </div>

            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => openEditModal(item)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id!)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[800px] space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="font-bold text-2xl text-gray-800">
              {editing ? "Edit Project" : "New Project"}
            </h2>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border px-3 py-2 w-full rounded"
                placeholder="Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <input
                className="border px-3 py-2 w-full rounded"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                disabled={!!editing}
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Description
              </label>
              <RichTextEditor
                value={form.description}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description: value }))
                }
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Features
              </label>
              <RichTextEditor
                value={form.features}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, features: value }))
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border px-3 py-2 rounded"
                placeholder="Tech Stack (e.g. React, Node.js, MongoDB)"
                value={form.stack}
                onChange={(e) => handleChange("stack", e.target.value)}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="GitHub Repo URL"
                value={form.repoUrl}
                onChange={(e) => handleChange("repoUrl", e.target.value)}
              />
            </div>

            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Live Project URL"
              value={form.liveUrl}
              onChange={(e) => handleChange("liveUrl", e.target.value)}
            />

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Project Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border w-full p-2 rounded"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded mt-2"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?all=true`);
  const projects = await res.json();
  return { props: { projects } };
};
