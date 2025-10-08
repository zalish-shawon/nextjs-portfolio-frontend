/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import api from "@/utils/apiClient";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

export default function AboutDashboard() {
  const [about, setAbout] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    skills: "",
    experience: [{ company: "", role: "", years: "", description: "" }],
  });

  // Fetch existing about info
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/about");
        if (res.data) {
          const data = res.data;
          setAbout(data);
          setForm({
            ...data,
            skills: data.skills?.join(", ") || "",
            experience: data.experience?.length
              ? data.experience
              : [{ company: "", role: "", years: "", description: "" }],
          });
        }
      } catch {
        toast.error("Failed to load About info");
      }
    })();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleExperienceChange = (index: number, key: string, value: string) => {
    const updated = [...form.experience];
    updated[index][key as keyof typeof updated[0]] = value;
    setForm({ ...form, experience: updated });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { company: "", role: "", years: "", description: "" }],
    });
  };

  const handleSave = async () => {
    try {
      await api.post("/api/about", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });
      toast.success("About info updated!");
      setShowModal(false);
      setAbout(form);
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">About Me</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Info
        </button>
      </div>

      {about ? (
        <div className="bg-white p-5 rounded-lg shadow space-y-4">
          <div>
            <h2 className="text-xl font-bold">{about.name}</h2>
            <p className="text-gray-600">{about.title}</p>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: about.bio }}
          />
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(about.skills) &&
  about.skills.map((s: string, i: number) => (
    <span
      key={i}
      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
    >
      {s}
    </span>
))}

            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Experience</h3>
            <ul className="space-y-3">
              {about.experience?.map((exp: any, i: number) => (
                <li key={i} className="border p-3 rounded">
                  <p className="font-bold">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company} — {exp.years}</p>
                  <p>{exp.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No About info found.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit About Me</h2>

            <input
              className="border px-3 py-2 w-full mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <input
              className="border px-3 py-2 w-full mb-3"
              placeholder="Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            <RichTextEditor
              value={form.bio}
              onChange={(v) => handleChange("bio", v)}
            />

            <div className="mt-4">
              <label className="font-semibold text-sm text-gray-700">
                Skills (comma separated)
              </label>
              <input
                className="border px-3 py-2 w-full mt-1"
                value={form.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
              />
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="font-semibold">Experience</h3>
              {form.experience.map((exp, i) => (
                <div key={i} className="border rounded p-3 space-y-2">
                  <input
                    className="border px-3 py-2 w-full"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(i, "company", e.target.value)}
                  />
                  <input
                    className="border px-3 py-2 w-full"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(i, "role", e.target.value)}
                  />
                  <input
                    className="border px-3 py-2 w-full"
                    placeholder="Years (e.g. 2020–2023)"
                    value={exp.years}
                    onChange={(e) => handleExperienceChange(i, "years", e.target.value)}
                  />
                  <textarea
                    className="border px-3 py-2 w-full"
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(i, "description", e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={addExperience}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                + Add Experience
              </button>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
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
