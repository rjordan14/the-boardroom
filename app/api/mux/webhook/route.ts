import { NextResponse } from "next/server";
import { getMuxClient, muxConfigured } from "@/lib/video/muxClient";
import { decideReadyStatus, setUploadStatus } from "@/lib/video/store";

export async function POST(request: Request) {
  if (!muxConfigured) {
    return NextResponse.json({ error: "Mux is not configured" }, { status: 501 });
  }

  const body = await request.text();
  const mux = getMuxClient();

  let event: Awaited<ReturnType<typeof mux.webhooks.unwrap>>;
  try {
    event = await mux.webhooks.unwrap(body, request.headers, process.env.MUX_WEBHOOK_SECRET);
  } catch {
    // Signature didn't verify — reject rather than trust an unverified
    // payload. This is the actual security boundary of this endpoint.
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "video.asset.ready") {
    const { upload_id, id: assetId, duration, playback_ids } = event.data;
    if (!upload_id) return NextResponse.json({ received: true });

    setUploadStatus(
      upload_id,
      decideReadyStatus({
        assetId,
        durationSeconds: duration ?? 0,
        playbackId: playback_ids?.[0]?.id,
      })
    );
  } else if (event.type === "video.asset.errored") {
    const { upload_id, errors } = event.data;
    if (upload_id) {
      setUploadStatus(upload_id, {
        state: "errored",
        message: errors?.messages?.join(" ") || "Mux failed to process the upload.",
      });
    }
  }

  return NextResponse.json({ received: true });
}
