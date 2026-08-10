import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/chain/Providers";
import { FirePitDemoButton } from "@/components/ui/FirePitDemoButton";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Boardroom",
  description:
    "The community decides who launches. Vote on head-to-head crypto project pitches on Robinhood Chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full font-mono antialiased">
        <Providers>{children}</Providers>
        {/* Sits after {children} in normal document flow — the literal
            last thing on every page, at the true bottom once you scroll
            all the way down. A fixed-position badge here instead read as
            floating text drifting over whatever content was underneath
            it while scrolling, which is illegible and distracting. */}
        <div className="flex flex-col items-center gap-2 border-t border-[#161914] px-[clamp(14px,4vw,48px)] py-5 text-center font-mono text-[9px] leading-[1.8] text-[#5C6653]">
          <div>a Ronald Jorlin website</div>
          <div>
            webmaster and{" "}
            <a
              href="https://www.ultimate-hoff-fan-club.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted transition hover:text-board-lime"
            >
              chief hoffster
            </a>
          </div>
          <FirePitDemoButton />
        </div>
      </body>
    </html>
  );
}
