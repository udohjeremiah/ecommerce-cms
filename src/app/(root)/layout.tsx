import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";

import ThemeProvider from "@/providers/ThemeProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "E-Commerce CMS",
  description:
    "A comprehensive content management system platform for managing online stores and content, offering robust features for product management, order processing, customization, and more.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex min-h-dvh max-w-[100dvw] flex-col overflow-x-hidden font-system antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster closeButton richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
