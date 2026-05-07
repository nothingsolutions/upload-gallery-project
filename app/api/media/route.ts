import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const imageResult = await cloudinary.api.resources({
      type: "upload",
      prefix: "site-uploads/",
      resource_type: "image",
      max_results: 50,
    });

    const videoResult = await cloudinary.api.resources({
      type: "upload",
      prefix: "site-uploads/",
      resource_type: "video",
      max_results: 50,
    });

    const all = [...imageResult.resources, ...videoResult.resources].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(all);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
