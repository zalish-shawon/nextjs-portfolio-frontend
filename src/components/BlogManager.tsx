"use client";
import { useState } from "react";
import Editor from "@/components/Editor";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchBlogs() {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  }

  async function saveBlog(blog: any) {
    try {
      if (editing) {
        await api.put(`/blogs/${editing._id}`, blog);
        toast.success("Blog updated");
      } else {
        await api.post("/blogs", blog);
        toast.success("Blog created");
      }
      fetchBlogs();
      setOpen(false);
      setEditing(null);
    } catch {
      toast.error("Error saving blog");
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Deleted");
      fetchBlogs();
    } catch {
      toast.error("Error deleting");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Blogs</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Blog
        </button>
      </div>

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-gray-600 line-clamp-2">{blog.content}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(blog);
                  setOpen(true);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBlog(blog._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-[600px] max-w-full">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Blog" : "New Blog"}
            </h2>
            <Editor
              initialValue={editing?.content || ""}
              onSave={(content) =>
                saveBlog({
                  title: editing?.title || "Untitled",
                  content,
                })
              }
              onCancel={() => {
                setOpen(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
