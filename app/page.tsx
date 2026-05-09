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

const INITIAL_VISIBLE = 10;
const MAX_VISIBLE = 20;

export default function Home() {
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchMedia = useCallback(async (expandAfter = false) => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setAllItems(Array.isArray(data.items) ? data.items : []);
      setTotalCount(typeof data.totalCount === "number" ? data.totalCount : 0);
      setExpanded(expandAfter);
    } catch {
      setAllItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const visibleCount = expanded ? MAX_VISIBLE : INITIAL_VISIBLE;
  const visibleItems = allItems.slice(0, visibleCount);
  const teaserItems = allItems.slice(visibleCount, visibleCount + 2);
  const canExpand = !expanded && totalCount > INITIAL_VISIBLE;

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
            <Gallery
              visibleItems={visibleItems}
              teaserItems={teaserItems}
              totalCount={totalCount}
              canExpand={canExpand}
              onUploadForMore={() => fetchMedia(true)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
