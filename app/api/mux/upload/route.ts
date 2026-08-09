import { NextResponse } from "next/server";
import { getMuxClient, muxConfigured } from "@/lib/video/muxClient";
import { initUpload, type UploadKind } from "@/lib/video/store";

export async function POST(request: Request) {
  if (!muxConfigured) {
    // Not an error state for the app — VideoTab.tsx checks this shape
    // and falls back to the existing mock "queued for review" flow.
    return NextResponse.json({ configured: false }, { status: 501 });
  }

  const origin = request.headers.get("origin") ?? "*";
  const mux = getMuxClient();

  // Empty body is fine (defaults to a "pitch" upload with no project
  // context) — keeps this endpoint backward-compatible with any caller
  // that doesn't send one.
  const body = await request.json().catch(() => ({}));
  const kind: UploadKind = body.kind === "qa-answer" ? "qa-answer" : "pitch";
  const projectKey = typeof body.projectKey === "string" ? body.projectKey : undefined;
  const questionId = typeof body.questionId === "string" ? body.questionId : undefined;

  const upload = await mux.video.uploads.create({
    cors_origin: origin,
    new_asset_settings: { playback_policies: ["public"] },
  });

  initUpload(upload.id, { kind, projectKey, questionId });

  return NextResponse.json({
    configured: true,
    uploadUrl: upload.url,
    uploadId: upload.id,
  });
}
