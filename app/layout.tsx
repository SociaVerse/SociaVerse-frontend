import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar"; // <-- IMPORT THE NAVBAR
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/ui/custom-toast";

import { MouseSpotlight } from "@/components/mouse-spotlight";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: "SociaVerse",
  description: "Welcome to the Socialverse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <MouseSpotlight />
              <Navbar />
              <main className="flex-1 flex flex-col relative z-10">
                <PageTransition>{children}</PageTransition>
              </main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}