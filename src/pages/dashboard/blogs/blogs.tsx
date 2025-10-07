/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/apiClient";
import RichTextEditor from "@/components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X } from "lucide-react";

interface Blog {
  _id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
  image?: string;
}

export default function BlogsDashboard({ blogs }: { blogs: Blog[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<Blog>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    tags: [],
    published: false,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Generate slug from title
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  // Handle form changes
  const handleChange = (key: keyof Blog, value: any) => {
    setForm((prev) => {
      if (key === "title" && !editing) {
        const slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        return { ...prev, title: value, slug };
      }
      return { ...prev, [key]: value };
    });
  };

  // Save or update blog
  const handleSave = async () => {
    try {
      if (!form.title || !form.content) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = {
        ...form,
        slug: generateSlug(form.title),
        tags: (form.tags || []).map((t) => t.trim()).filter(Boolean),
      };

      if (editing && editing._id) {
        await api.put(`api/blogs/${editing._id}`, payload);
        toast.success("Blog updated successfully!");
      } else {
        await api.post("api/blogs", payload);
        toast.success("Blog created successfully!");
      }

      setShowModal(false);
      setEditing(null);
      window.location.reload();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Error saving blog");
    }
  };

  // Delete blog
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`api/blogs/${id}`);
      toast.success("Blog deleted");
      window.location.reload();
    } catch {
      toast.error("Error deleting blog");
    }
  };

  // Image upload
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

  // Open new blog modal
  const openNewModal = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      tags: [],
      published: false,
      image: "",
    });
    setImagePreview("");
    setShowModal(true);
  };

  // Open edit blog modal
  const openEditModal = (blog: Blog) => {
    setEditing(blog);
    setForm({
      ...blog,
      tags: blog.tags || [],
      excerpt: blog.excerpt || "",
      published: blog.published || false,
    });
    setImagePreview(blog.image || "");
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          <Plus size={18} /> New Blog
        </button>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {b.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">/{b.slug}</p>
                {b.excerpt && (
                  <p className="text-sm text-gray-600 mb-2">{b.excerpt}</p>
                )}
                {(Array.isArray(b.tags) && b.tags.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {b.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p
                  className="text-gray-600 text-sm mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: (b.content || "").substring(0, 150) + "...",
                  }}
                />
                <p
                  className={`mt-2 text-xs font-medium ${
                    b.published ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {b.published ? "Published" : "Draft"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(b._id!)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-lg"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? "Edit Blog" : "Create Blog"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  className="border px-3 py-2 w-full rounded-lg"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />

                <input
                  className="border px-3 py-2 w-full rounded-lg text-gray-600"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  disabled={!!editing}
                />

                <textarea
                  className="border px-3 py-2 w-full rounded-lg"
                  placeholder="Excerpt (short summary)"
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                />

                <RichTextEditor
                  value={form.content}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, content: value }))
                  }
                />

                <input
                  className="border px-3 py-2 w-full rounded-lg"
                  placeholder="Tags (comma separated)"
                  value={(form.tags || []).join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "tags",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      handleChange("published", e.target.checked)
                    }
                  />
                  <label className="text-gray-700 text-sm font-medium">
                    Published
                  </label>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-600">
                    Blog Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border w-full p-2 rounded-lg"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-44 object-cover rounded-lg mt-3"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SSR fetch
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?all=true`
  );
  const blogs = await res.json();
  return { props: { blogs } };
};
