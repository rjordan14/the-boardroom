import { NextResponse } from "next/server";
import { getUploadStatus } from "@/lib/video/store";

export async function GET(request: Request) {
  const uploadId = new URL(request.url).searchParams.get("uploadId");
  if (!uploadId) {
    return NextResponse.json({ error: "uploadId is required" }, { status: 400 });
  }

  const status = getUploadStatus(uploadId);
  return NextResponse.json(status ?? { state: "unknown" });
}
