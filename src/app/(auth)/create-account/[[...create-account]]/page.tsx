import type { Metadata } from "next";

import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Account | E-Commerce CMS",
  description:
    "Create an account with E-Commerce CMS to unlock a suite of powerful tools for efficiently managing your online store, streamlining product management, processing orders, customizing your storefront, and much more.",
};

export default function CreateAccountPage() {
  return <SignUp />;
}
