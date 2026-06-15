import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kathmandu Arts | Himalayan Heritage Archive",
  description:
    "Discover authentic Himalayan Thangka masterpieces. Bridging centuries of tradition with the global collector.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
        precedence="default"
      />
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased bg-background text-on-background custom-scrollbar`}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-secondary)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-on-secondary)",
            },
          }}
        />
      </body>
    </html>
  );
}
