import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar"; // <-- IMPORT THE NAVBAR

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
          "min-h-screen bg-background font-sans antialiased flex flex-col", // <-- ADDED 'flex flex-col'
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar /> 
          <main className="flex-1 flex flex-col"> {/* Wrap children in main */}
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}