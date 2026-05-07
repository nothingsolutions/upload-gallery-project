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
}

export default function Gallery({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold">
          No uploads yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {items.map((item) => (
        <div
          key={item.public_id}
          className="aspect-square overflow-hidden bg-zinc-900"
        >
          {item.resource_type === "video" ? (
            <video
              src={item.secure_url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.secure_url}
              alt={item.public_id.split("/").pop() ?? item.public_id}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
