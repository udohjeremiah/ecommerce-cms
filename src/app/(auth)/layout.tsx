import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex min-h-dvh max-w-[100dvw] flex-col items-center justify-center overflow-x-hidden font-system antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
