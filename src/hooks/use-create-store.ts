import { useContext } from "react";

import { CreateStoreContext } from "@/providers/CreateStoreProvider";

export function useCreateStore() {
  const { createStore, setCreateStore } = useContext(CreateStoreContext);

  return { createStore, setCreateStore };
}
