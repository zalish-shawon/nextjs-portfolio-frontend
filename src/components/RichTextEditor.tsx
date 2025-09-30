// components/RichTextEditor.tsx
import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [["bold", "italic", "underline"], ["link", "image"]],
    },
  });

  // Update editor when parent value changes (important for "Edit")
  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value || "";
    }
  }, [quill, value]);

  // Send updates to parent
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return <div ref={quillRef} style={{ minHeight: 200 }} />;
}
