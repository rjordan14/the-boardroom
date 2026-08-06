import { NextResponse } from "next/server";
import { getMuxClient, muxConfigured } from "@/lib/video/muxClient";
import { initUpload } from "@/lib/video/store";

export async function POST(request: Request) {
  if (!muxConfigured) {
    // Not an error state for the app — VideoTab.tsx checks this shape
    // and falls back to the existing mock "queued for review" flow.
    return NextResponse.json({ configured: false }, { status: 501 });
  }

  const origin = request.headers.get("origin") ?? "*";
  const mux = getMuxClient();

  const upload = await mux.video.uploads.create({
    cors_origin: origin,
    new_asset_settings: { playback_policies: ["public"] },
  });

  initUpload(upload.id);

  return NextResponse.json({
    configured: true,
    uploadUrl: upload.url,
    uploadId: upload.id,
  });
}
