"use client";

import UploadBox from "@/components/UploadBox";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  created_at: string;
  format: string;
}

interface Props {
  visibleItems: MediaItem[];
  teaserItems: MediaItem[];
  totalCount: number;
  canExpand: boolean;
  onUploadForMore: () => void;
}

function MediaTile({ item }: { item: MediaItem }) {
  if (item.resource_type === "video") {
    return (
      <video
        src={item.secure_url}
        controls
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.secure_url}
      alt={item.public_id.split("/").pop() ?? item.public_id}
      className="w-full h-full object-cover"
    />
  );
}

export default function Gallery({
  visibleItems,
  teaserItems,
  totalCount,
  canExpand,
  onUploadForMore,
}: Props) {
  if (visibleItems.length === 0 && teaserItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold">
          No uploads yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {visibleItems.map((item) => (
          <div
            key={item.public_id}
            className="aspect-square overflow-hidden bg-zinc-900"
          >
            <MediaTile item={item} />
          </div>
        ))}

        {teaserItems.map((item, index) => {
          const isLast = index === teaserItems.length - 1;
          return (
            <div
              key={item.public_id}
              className="aspect-square overflow-hidden bg-zinc-900 relative"
            >
              <div className="w-full h-full blur-sm scale-110 pointer-events-none select-none">
                <MediaTile item={item} />
              </div>
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <p className="text-white text-xs tracking-widest uppercase font-bold text-center px-2">
                    +{totalCount} pictures
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canExpand && (
        <div className="mt-1 bg-zinc-950 border border-zinc-800 px-6 py-8 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-white text-2xl tracking-widest uppercase font-bold">
              Wanna see more??
            </p>
            <p className="text-zinc-500 text-xs tracking-widest uppercase">
              join the party, upload a picture to see more.
            </p>
          </div>

          <div className="flex gap-1 pointer-events-none select-none">
            {teaserItems.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.public_id}
                src={item.secure_url}
                alt=""
                className="w-12 h-12 object-cover opacity-30 blur-sm"
              />
            ))}
          </div>

          <div className="w-full">
            <UploadBox onUploadComplete={onUploadForMore} />
          </div>
        </div>
      )}
    </div>
  );
}
