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
  image: string;
  github: string;
  live: string;
}

export default function ProjectsDashboard({ projects }: { projects: Project[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>({
    title: "",
    slug: "",
    description: "",
    image: "",
    github: "",
    live: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Helper to generate slug
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleChange = (key: keyof Project, value: string) => {
    // Auto-generate slug when creating a new project
    if (key === "title" && !editing) {
      setForm({ ...form, title: value, slug: generateSlug(value) });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (!form.title || !form.description) {
        toast.error("Please fill all required fields");
        return;
      }

      if (editing && editing._id) {
        // Update project (keep slug same)
        await api.put(`api/projects/${editing._id}`, form);
        toast.success("Project updated successfully!");
      } else {
        // Create new project
        const payload = { ...form, slug: generateSlug(form.title) };
        await api.post("api/projects", payload);
        toast.success("Project created successfully!");
      }

      setShowModal(false);
      setEditing(null);
      window.location.reload();
    } catch (err: any) {
      toast.dismiss();
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
      setForm({ ...form, image: fileRes.secure_url });
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
      image: "",
      github: "",
      live: "",
    });
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditing(project);
    setForm({ ...project });
    setImagePreview(project.image);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Project
        </button>
      </div>

      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p._id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openEditModal(p)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id!)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[700px] space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-xl">
              {editing ? "Edit Project" : "New Project"}
            </h2>

            <input
              className="border px-3 py-2 w-full"
              placeholder="Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            <input
              className="border px-3 py-2 w-full"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              disabled={!!editing}
            />

            <RichTextEditor
              value={form.description}
              onChange={(value) => handleChange("description", value)}
            />

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Project Image
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
                  className="w-full h-40 object-cover rounded mt-2"
                />
              )}
            </div>

            <input
              className="border px-3 py-2 w-full"
              placeholder="GitHub Link"
              value={form.github}
              onChange={(e) => handleChange("github", e.target.value)}
            />

            <input
              className="border px-3 py-2 w-full"
              placeholder="Live Site Link"
              value={form.live}
              onChange={(e) => handleChange("live", e.target.value)}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?all=true`);
  const projects = await res.json();
  return { props: { projects } };
};
