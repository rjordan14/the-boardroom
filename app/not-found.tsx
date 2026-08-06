import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-board-bg px-6 text-center">
      <div className="font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-lime">
        THE BOARDROOM
      </div>
      <div className="font-mono text-[20px] font-extrabold text-board-heading">
        This room doesn&apos;t exist
      </div>
      <Link
        href="/"
        className="mt-2 border border-board-border px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
      >
        ← BACK TO THE LOBBY
      </Link>
    </div>
  );
}
