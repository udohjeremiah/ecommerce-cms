"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Store } from "@prisma/client";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CirclePlusIcon,
  StoreIcon,
} from "lucide-react";

import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StoreSwitcherProps {
  stores: Store[];
}

export default function StoreSwitcher({ stores = [] }: StoreSwitcherProps) {
  const params = useParams();

  const [currentStore, setCurrentStore] = useState(
    stores.find((store) => store.id === params.storeId)?.id,
  );
  const [open, setOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const router = useRouter();

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label="Select a store"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            <StoreIcon className="mr-2 h-4 w-4" />
            {currentStore
              ? stores.find((store) => store.id === currentStore)?.name
              : "Select store..."}
            <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search store..." className="h-9" />
            <CommandList>
              <CommandEmpty>No store found.</CommandEmpty>
              <CommandGroup heading="Stores">
                {stores.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.name}
                    onSelect={() => {
                      setCurrentStore(store.id);
                      setOpen(false);
                      router.push(`/${store.id}`);
                    }}
                  >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {store.name}
                    {currentStore === store.id && (
                      <CheckIcon className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowCreateDialog(true);
                  }}
                  className="p-0"
                >
                  <Button variant="default" className="w-full">
                    <CirclePlusIcon className="mr-2 h-4 w-4" />
                    Create Store
                  </Button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showCreateDialog && (
        <CreateStoreDialog
          open={showCreateDialog}
          setOpen={setShowCreateDialog}
        />
      )}
    </>
  );
}
