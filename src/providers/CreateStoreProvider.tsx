"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

interface CreateStoreContextType {
  createStore: boolean;
  setCreateStore: Dispatch<SetStateAction<boolean>>;
}

interface CreateStoreProviderProps {
  children: React.ReactNode;
}

export const CreateStoreContext = createContext<CreateStoreContextType>({
  createStore: false,
  setCreateStore: () => {},
});

export default function CreateStoreProvider({
  children,
}: CreateStoreProviderProps) {
  const [createStore, setCreateStore] = useState<boolean>(false);

  return (
    <CreateStoreContext.Provider value={{ createStore, setCreateStore }}>
      {children}
    </CreateStoreContext.Provider>
  );
}
