"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/utils";

interface CoverImageFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor="coverImage" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
        Cover Image <span className="text-[var(--muted-foreground)] normal-case tracking-normal">(URL or upload, optional)</span>
      </label>
      <div className="flex gap-2">
        <input
          id="coverImage"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        />
        <label
          className="shrink-0 cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--muted)] focus-within:ring-2 focus-within:ring-[var(--ring)]"
          style={{ borderColor: "oklch(0.91 0.015 60)" }}
        >
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Cover preview" className="mt-2 h-24 w-auto rounded-lg object-cover" />
      )}
    </div>
  );
}
