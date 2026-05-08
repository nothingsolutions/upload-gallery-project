"use client";

import { useCallback, useEffect, useState } from "react";
import Gallery from "@/components/Gallery";
import UploadBox from "@/components/UploadBox";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  created_at: string;
  format: string;
}

export default function Home() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(Array.isArray(data.items) ? data.items : []);
      setTotalCount(typeof data.totalCount === "number" ? data.totalCount : 0);
    } catch {
      setMedia([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <UploadBox onUploadComplete={fetchMedia} />

        <div className="border-t border-zinc-900 pt-8">
          <p className="text-xs tracking-widest uppercase font-bold text-zinc-600 mb-4">
            All Uploads
          </p>
          {loading ? (
            <p className="text-xs tracking-widest uppercase text-zinc-700 py-16 text-center">
              Loading...
            </p>
          ) : (
            <Gallery items={media} totalCount={totalCount} />
          )}
        </div>
      </div>
    </main>
  );
}
