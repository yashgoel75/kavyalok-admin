"use client";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import Quill from "@/lib/quill";

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      if (containerRef.current) {
        const existingToolbars =
          containerRef.current.querySelectorAll(".ql-toolbar");
        existingToolbars.forEach((toolbar) => toolbar.remove());
      }

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Begin your story here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillInstance.current.clipboard.dangerouslyPasteHTML(value || "");

      quillInstance.current.on("text-change", () => {
        if (quillInstance.current) {
          onChange(quillInstance.current.root.innerHTML);
        }
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (quillInstance.current) {
        const toolbar = containerRef.current?.querySelector(".ql-toolbar");
        if (toolbar) {
          toolbar.remove();
        }
        quillInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (quillInstance.current) {
      const currentHTML = quillInstance.current.root.innerHTML;
      if (value !== currentHTML) {
        const selection = quillInstance.current.getSelection();
        quillInstance.current.clipboard.dangerouslyPasteHTML(value || "");
        if (selection) {
          quillInstance.current.setSelection(selection.index, selection.length);
        }
      }
    }
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <style jsx global>{`
        .ql-toolbar {
          border: 2px solid #e2e8f0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          border-radius: 12px 12px 0 0 !important;
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 100%
          ) !important;
          padding: 12px !important;
        }

        .ql-toolbar .ql-formats {
          margin-right: 20px !important;
        }

        .ql-toolbar button {
          padding: 6px 8px !important;
          border-radius: 6px !important;
          margin: 0 2px !important;
          transition: all 0.2s ease !important;
        }

        .ql-toolbar button:hover {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #4f46e5 !important;
        }

        .ql-toolbar button.ql-active {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #4f46e5 !important;
        }

        .ql-container {
          border: 2px solid #e2e8f0 !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }

        .ql-editor {
          min-height: 280px !important;
          padding: 20px !important;
          color: #374151 !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif !important;
        }

        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
          font-size: 15px !important;
          line-height: 1.6 !important;
        }

        .ql-editor h1 {
          font-size: 24px !important;
          font-weight: 700 !important;
          margin-bottom: 16px !important;
          color: #1f2937 !important;
        }

        .ql-editor h2 {
          font-size: 20px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
          color: #374151 !important;
        }

        .ql-editor h3 {
          font-size: 18px !important;
          font-weight: 600 !important;
          margin-bottom: 10px !important;
          color: #4b5563 !important;
        }

        .ql-editor ul,
        .ql-editor ol {
          margin-bottom: 16px !important;
        }

        .ql-editor li {
          margin-bottom: 4px !important;
        }

        .ql-editor blockquote {
          border-left: 4px solid #4f46e5 !important;
          background: #f8fafc !important;
          padding: 12px 16px !important;
          margin: 16px 0 !important;
          border-radius: 0 8px 8px 0 !important;
        }

        .ql-editor code {
          background: #f3f4f6 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-size: 14px !important;
          color: #dc2626 !important;
        }

        .ql-editor pre {
          background: #1f2937 !important;
          color: #f9fafb !important;
          padding: 16px !important;
          border-radius: 8px !important;
          overflow-x: auto !important;
          margin: 16px 0 !important;
        }

        .ql-editor a {
          color: #4f46e5 !important;
          text-decoration: underline !important;
        }

        .ql-editor a:hover {
          color: #3730a3 !important;
        }

        .ql-snow .ql-tooltip {
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          border: 2px solid #e2e8f0 !important;
        }
      `}</style>

      <div
        ref={editorRef}
        className="bg-white rounded-xl shadow-sm border-2 border-gray-200 focus-within:border-purple-300 focus-within:shadow-lg transition-all duration-300"
      />

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          💡 Rich formatting available • Perfect for detailed instructions
        </span>
      </div>
    </div>
  );
}
