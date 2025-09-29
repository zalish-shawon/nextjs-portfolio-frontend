import { GetServerSideProps } from "next";
import { useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

export default function DashboardProjects({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  function openNew() {
    setEditing(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setLiveUrl("");
    setRepoUrl("");
    setThumbnailFile(null);
    setOpen(true);
  }

  function openEdit(p: any) {
    setEditing(p);
    setTitle(p.title || "");
    setSlug(p.slug || "");
    setDescription(p.description || "");
    setLiveUrl(p.liveUrl || "");
    setRepoUrl(p.repoUrl || "");
    setThumbnailFile(null);
    setOpen(true);
  }

  async function submit() {
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("slug", slug);
      form.append("description", description);
      form.append("liveUrl", liveUrl);
      form.append("repoUrl", repoUrl);
      if (thumbnailFile) form.append("image", thumbnailFile);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      if (editing) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${editing._id}`, {
          method: "PUT",
          body: form,
          headers,
          credentials: "include",
        });
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
          method: "POST",
          body: form,
          headers,
          credentials: "include",
        });
      }

      if (!res.ok) throw new Error("Failed");
      const saved = await res.json();

      if (editing) setProjects(projects.map((p) => (p._id === saved._id ? saved : p)));
      else setProjects([saved, ...projects]);

      toast.success(editing ? "Project updated" : "Project created");
      setOpen(false);
    } catch {
      toast.error("Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete project?")) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded">+ New Project</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p._id} className="bg-white rounded shadow overflow-hidden">
            <img src={p.thumbnail || "/placeholder.png"} alt={p.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <div className="flex justify-between mt-3">
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600">Live</a>
                <div className="space-x-2">
                  <button onClick={() => openEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => remove(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl p-6 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editing ? "Edit Project" : "New Project"}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">Close</button>
            </div>

            <div className="space-y-3">
              <input className="w-full p-2 border rounded" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
              <input className="w-full p-2 border rounded" value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="slug" />
              <textarea className="w-full p-2 border rounded" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description" />
              <input className="w-full p-2 border rounded" value={liveUrl} onChange={(e)=>setLiveUrl(e.target.value)} placeholder="Live URL" />
              <input className="w-full p-2 border rounded" value={repoUrl} onChange={(e)=>setRepoUrl(e.target.value)} placeholder="Repo URL" />
              <input type="file" onChange={(e)=>setThumbnailFile(e.target.files ? e.target.files[0] : null)} />
              <div className="flex justify-end gap-3 mt-3">
                <button onClick={()=>setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
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
    const res = await fetch(`${API}/api/projects`, {
      headers: { cookie: ctx.req.headers.cookie || "" },
      credentials: "include",
    });
    const initialProjects = await res.json();
    return { props: { initialProjects } };
  } catch {
    return { props: { initialProjects: [] } };
  }
};
