import { NextRequest, NextResponse } from "next/server";
import { searchArtworks } from "@/lib/search-actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchArtworks(q);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
