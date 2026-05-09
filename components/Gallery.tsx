"use client";

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
  onExpand: () => void;
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
  onExpand,
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
        <button
          onClick={onExpand}
          className="w-full mt-1 group relative aspect-[3/1] overflow-hidden bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-colors cursor-pointer border-0"
        >
          <p className="text-white text-xs tracking-widest uppercase font-bold">
            Wanna see more??
          </p>
          <div className="flex gap-1">
            {teaserItems.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.public_id}
                src={item.secure_url}
                alt=""
                className="w-10 h-10 object-cover opacity-40 blur-sm group-hover:opacity-60 transition-opacity"
              />
            ))}
          </div>
          <p className="text-zinc-500 text-xs tracking-widest uppercase">
            tap to load 10 more
          </p>
        </button>
      )}
    </div>
  );
}
