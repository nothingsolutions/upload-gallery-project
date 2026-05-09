import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    // Fetch top 22 (20 max visible + 2 blurred teasers) and total count
    const result = await cloudinary.search
      .expression("folder:site-uploads")
      .sort_by("created_at", "desc")
      .max_results(22)
      .execute();

    return NextResponse.json({
      items: result.resources ?? [],
      totalCount: result.total_count ?? 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
