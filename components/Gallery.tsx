"use client";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  created_at: string;
  format: string;
}

interface Props {
  items: MediaItem[];
  totalCount: number;
}

const VISIBLE_COUNT = 10;

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

export default function Gallery({ items, totalCount }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold">
          No uploads yet.
        </p>
      </div>
    );
  }

  const visibleItems = items.slice(0, VISIBLE_COUNT);
  const teaserItems = items.slice(VISIBLE_COUNT, VISIBLE_COUNT + 2);
  const showTeasers = totalCount > VISIBLE_COUNT;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {visibleItems.map((item) => (
        <div
          key={item.public_id}
          className="aspect-square overflow-hidden bg-zinc-900"
        >
          <MediaTile item={item} />
        </div>
      ))}

      {showTeasers &&
        teaserItems.map((item, index) => {
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
  );
}
