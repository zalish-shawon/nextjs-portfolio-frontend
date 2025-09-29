"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded border"
        />
      )}
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
