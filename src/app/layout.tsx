import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { BrandProvider } from "@/components/brand/brand-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F4EB" },
    { media: "(prefers-color-scheme: dark)", color: "#121620" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Abdullah — AI/ML Engineer & Full-Stack Developer",
    template: "%s | Abdullah Portfolio",
  },
  description:
    "Creative developer portfolio and CMS featuring full-stack web platforms, machine learning systems, and interactive 3D experiences.",
  keywords: [
    "Abdullah",
    "Software Engineer",
    "AI/ML Engineer",
    "Full-Stack Developer",
    "Next.js",
    "Supabase",
    "React Three Fiber",
  ],
  authors: [{ name: "Abdullah" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm-canvas text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BrandProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
