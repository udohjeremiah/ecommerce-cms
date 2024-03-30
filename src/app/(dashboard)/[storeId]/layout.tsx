import { redirect } from "next/navigation";

import { auth, ClerkProvider } from "@clerk/nextjs";

import "@/styles/globals.css";

import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

import prisma from "@/lib/prisma";

import CreateStoreProvider from "@/providers/CreateStoreProvider";
import ThemeProvider from "@/providers/ThemeProvider";

interface DashboardLayoutProps {
  params: { storeId: string };
  children: React.ReactNode;
}

export default async function DashboardLayout({
  params,
  children,
}: DashboardLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
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
            <CreateStoreProvider>
              <Header />
              {children}
              <Footer />
              <CreateStoreDialog />
              <Toaster closeButton richColors />
            </CreateStoreProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
