"use client";

import { useEffect } from "react";

import { useCreateStore } from "@/hooks/use-create-store";

export default function RootCreateStore() {
  const { createStore, setCreateStore } = useCreateStore();

  useEffect(() => {
    if (!createStore) {
      setCreateStore(true);
    }
  });

  return null;
}
