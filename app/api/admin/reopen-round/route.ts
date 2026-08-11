import { NextResponse } from "next/server";
import { reopenRound } from "@/lib/tournament/store";

/** Undoes an admin close — see reopenRound's own comment on why this
 *  is safe to offer (no real ballot data underneath to lose). */
export async function POST() {
  reopenRound();
  return NextResponse.json({ ok: true });
}
