"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
];

interface Props {
  onUploadComplete: () => void;
}

export default function UploadBox({ onUploadComplete }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<void> => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(`${file.name}: unsupported file type`);
    }

    const signRes = await fetch("/api/sign");
    if (!signRes.ok) throw new Error("Failed to get upload signature");
    const { signature, timestamp, cloudName, apiKey } = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", "site-uploads");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData }
    );

    if (!uploadRes.ok) throw new Error(`${file.name}: upload failed`);
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];

      setErrors([]);
      setUploading(fileArray.map((f) => f.name));

      await Promise.all(
        fileArray.map(async (file) => {
          try {
            await uploadFile(file);
          } catch (err) {
            newErrors.push(err instanceof Error ? err.message : String(err));
          }
        })
      );

      setUploading([]);
      if (newErrors.length > 0) setErrors(newErrors);
      onUploadComplete();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUploadComplete]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="mb-8">
      <div
        className={`border-2 transition-colors cursor-pointer p-12 text-center ${
          isDragging
            ? "border-white bg-zinc-800"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-950"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs tracking-widest uppercase font-bold text-zinc-400">
              Uploading...
            </p>
            {uploading.map((name) => (
              <p
                key={name}
                className="text-xs text-zinc-600 truncate max-w-xs mx-auto"
              >
                {name}
              </p>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs tracking-widest uppercase font-bold text-zinc-300">
              Drop pics or vids here or click to browse
            </p>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-500 tracking-wide uppercase">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
