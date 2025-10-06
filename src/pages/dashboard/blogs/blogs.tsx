import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/apiClient";
import RichTextEditor from "@/components/RichTextEditor";

interface Blog {
  _id?: string;
  title: string;
  slug?: string;
  content: string;
  image?: string;
}

export default function BlogsDashboard({ blogs }: { blogs: Blog[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<Blog>({
    title: "",
    slug: "",
    content: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleChange = (key: keyof Blog, value: string) => {
    if (key === "title" && !editing) {
      setForm({ ...form, title: value, slug: generateSlug(value) });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (!form.title || !form.content) {
        toast.error("Please fill all required fields");
        return;
      }

      if (editing && editing._id) {
        await api.put(`api/blogs/${editing._id}`, form);
        toast.success("Blog updated successfully!");
      } else {
        const payload = { ...form, slug: generateSlug(form.title) };
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
      content: "",
      image: "",
    });
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditing(blog);
    setForm({ ...blog });
    setImagePreview(blog.image || "");
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Blog
        </button>
      </div>

      <ul className="space-y-3">
        {blogs.map((b) => (
          <li
            key={b._id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{b.title}</h2>
              <p
                className="text-sm text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: (b.content || "").substring(0, 150) + "...",
                }}
              />
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openEditModal(b)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b._id!)}
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
              {editing ? "Edit Blog" : "New Blog"}
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
              value={form.content}
              onChange={(value) => handleChange("content", value)}
            />

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Blog Image
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

// SSR fetch
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?all=true`);
  const blogs = await res.json();
  return { props: { blogs } };
};
