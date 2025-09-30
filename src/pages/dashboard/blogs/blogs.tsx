import { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/apiClient";
import RichTextEditor from "@/components/RichTextEditor";

export default function BlogsDashboard({ blogs }: any) {
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [content, setContent] = useState("");
  const [blogList, setBlogList] = useState(blogs);


  // 🔹 Upload image to Cloudinary
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    try {
      let imageUrl = typeof image === "string" ? image : null;
      if (image && typeof image !== "string") {
        imageUrl = await uploadImage(image);
      }

      const fetchBlogs = async () => {
        const res = await api.get("/blogs?all=true");
        setBlogList(res.data);
      };

      const payload = {
        title,
        slug,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()),
        published,
        image: imageUrl,
        content,
      };

      if (editing) {
        await api.put(`api/blogs/${editing._id}`, payload);
        // toast.success("Blog updated");
            await fetchBlogs();
    toast.success(editing ? "Blog updated" : "Blog created");
    setEditing(null);
      } else {
        await api.post("api/blogs", payload);
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
            setExcerpt("");
            setTags("");
            setPublished(false);
            setImage(null);
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
                  setExcerpt(b.excerpt || "");
                  setTags(b.tags?.join(", ") || "");
                  setPublished(b.published || false);
                  setImage(b.image || null);
                  setContent(b.content || "");
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[700px] space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-xl">
              {editing ? "Edit Blog" : "New Blog"}
            </h2>

            {/* Title */}
            <input
              className="border px-3 py-2 w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Slug */}
            <input
              className="border px-3 py-2 w-full"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            {/* Excerpt */}
            <input
              className="border px-3 py-2 w-full"
              placeholder="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />

            {/* Tags */}
            <input
              className="border px-3 py-2 w-full"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            {/* Published */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>Published</span>
            </label>

            {/* Image */}
            <div>
              {image && (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) setImage(e.target.files[0]);
                }}
              />
            </div>

            {/* Content */}
            <RichTextEditor value={content} onChange={setContent} />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setSlug("");
                  setExcerpt("");
                  setTags("");
                  setPublished(false);
                  setImage(null);
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?all=true`
  );
  const blogs = await res.json();
  return { props: { blogs } };
};
