import type { Metadata } from "next";
import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/ui/custom-toast";
import { OfflineDetector } from "@/components/offline-detector";

import { MouseSpotlight } from "@/components/mouse-spotlight";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: "SociaVerse - The Ultimate College Event & Social Platform",
  description: "Connect, explore, and transcend with SociaVerse. The all-in-one digital campus platform for events, gaming, and student communities.",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png" },
      { url: "/favicon.png" },
    ],
    apple: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <OfflineDetector />
              <MouseSpotlight />
              {!isMaintenanceMode && <Navbar />}
              {!isMaintenanceMode && (
                <Suspense fallback={null}>
                  <MobileNav />
                </Suspense>
              )}
              <main className="flex-1 flex flex-col relative z-10 w-full">
                <PageTransition>{children}</PageTransition>
              </main>
              {!isMaintenanceMode && <Footer />}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}