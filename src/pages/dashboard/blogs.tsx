import { GetServerSideProps } from "next";
import { useState } from "react";
import Editor from "../../components/Editor";
import toast from "react-hot-toast";

export default function DashboardBlogs({
  initialBlogs,
}: {
  initialBlogs: any[];
}) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function openNew() {
    setEditing(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setPublished(true);
    setImageFile(null);
    setOpen(true);
  }
  function openEdit(b: any) {
    setEditing(b);
    setTitle(b.title || "");
    setSlug(b.slug || "");
    setExcerpt(b.excerpt || "");
    setContent(b.content || "");
    setPublished(!!b.published);
    setImageFile(null);
    setOpen(true);
  }

  async function submitForm() {
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("slug", slug);
      form.append("excerpt", excerpt);
      form.append("content", content);
      form.append("published", String(published));
      if (imageFile) form.append("image", imageFile);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      if (editing) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${editing._id}`,
          { method: "PUT", body: form, headers, credentials: "include" }
        );
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
          method: "POST",
          body: form,
          headers,
          credentials: "include",
        });
      }
      if (!res.ok) throw new Error("Failed");
      const saved = await res.json();
      toast.success(editing ? "Updated" : "Created");
      if (editing)
        setBlogs(blogs.map((b) => (b._id === saved._id ? saved : b)));
      else setBlogs([saved, ...blogs]);
      setOpen(false);
    } catch (err) {
      toast.error("Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete blog?")) return;
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`,
        { method: "DELETE", headers, credentials: "include" }
      );
      if (!res.ok) throw new Error("Delete failed");
      setBlogs(blogs.filter((b) => b._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blogs</h2>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + New Blog
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {b.excerpt ||
                  (b.content || "").replace(/<[^>]+>/g, "").slice(0, 120)}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openEdit(b)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(b._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl p-6 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editing ? "Edit Blog" : "New Blog"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                Close
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Title"
              />
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="slug"
              />
              <input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Excerpt"
              />
              <div>
                <label className="block mb-1 text-sm">Content</label>
                <Editor value={content} onChange={setContent} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />{" "}
                  <span>Published</span>
                </label>
                <label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setImageFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/api/blogs?all=true`, {
      headers: { cookie: ctx.req.headers.cookie || "" },
      credentials: "include",
    });
    const initialBlogs = await res.json();
    return { props: { initialBlogs } };
  } catch {
    return { props: { initialBlogs: [] } };
  }
};
