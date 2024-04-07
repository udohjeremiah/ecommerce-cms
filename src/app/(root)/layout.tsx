import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ClerkProvider, auth } from "@clerk/nextjs";

import "@/styles/globals.css";

import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";
import { Toaster } from "@/components/ui/sonner";

import prisma from "@/lib/prisma";

import ThemeProvider from "@/providers/ThemeProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "E-Commerce CMS",
  description:
    "A comprehensive content management system platform for managing online stores and content, offering robust features for product management, order processing, customization, and more.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({ where: { userId } });

  if (store) {
    redirect(`/${store.id}`);
  }

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
            <CreateStoreDialog defaultState={true} />
            {children}
            <Toaster closeButton richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
