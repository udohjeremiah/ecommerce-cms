import type { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Log In | E-Commerce CMS",
  description:
    "Log in to E-Commerce CMS to gain access to powerful tools for managing your online store, streamlining product management, efficiently processing orders, customizing your storefront, and much more.",
};

export default function LoginPage() {
  return <SignIn />;
}
