import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import api from "@/utils/apiClient";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function BlogsDashboard({ blogs }: any) {
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/blogs/${editing._id}`, { title, slug, content });
        toast.success("Blog updated");
      } else {
        await api.post("/blogs", { title, slug, content });
        toast.success("Blog created");
      }
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving blog");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      window.location.reload();
    } catch {
      toast.error("Error deleting blog");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <button
          onClick={() => {
            setEditing(null);
            setTitle("");
            setSlug("");
            setContent("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Blog
        </button>
      </div>

      <ul className="space-y-3">
        {blogs.map((b: any) => (
          <li
            key={b._id}
            className="border p-4 rounded shadow flex justify-between"
          >
            <span>{b.title}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(b);
                  setTitle(b.title);
                  setSlug(b.slug);
                  setContent(b.content);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {(editing || title) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[700px] space-y-4">
            <h2 className="font-bold text-xl">
              {editing ? "Edit Blog" : "New Blog"}
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
            <ReactQuill value={content} onChange={setContent} />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setSlug("");
                  setContent("");
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
