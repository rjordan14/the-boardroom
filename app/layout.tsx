import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/chain/Providers";
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
        <div className="pointer-events-none fixed bottom-2 right-2.5 z-30 text-right font-mono text-[9px] leading-[1.6] text-[#3A4033]">
          <div>a Ronald Jorlin website</div>
          <div>
            webmaster and{" "}
            <a
              href="https://www.ultimate-hoff-fan-club.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto underline decoration-dotted transition hover:text-board-lime"
            >
              chief hoffster
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
