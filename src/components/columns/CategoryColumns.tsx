"use client";

import { useParams, useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CopyIcon, EditIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import DeleteCategoryDialog from "@/components/dialogs/DeleteCategoryDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "billboardLabel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Billboard
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryCellActions row={row.original} />,
  },
];

export function CategoryCellActions({ row }: { row: CategoryColumn }) {
  const params = useParams();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <div className="space-y-1">
          <DropdownMenuItem
            asChild
            onClick={() => {
              navigator.clipboard.writeText(row.id);
              toast.success("✅ Category ID copied successfully.");
            }}
          >
            <Button variant="ghost" className="w-full justify-start">
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy ID
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            onClick={() =>
              router.push(`/${params.storeId}/categories/${row.id}`)
            }
          >
            <Button variant="ghost" className="w-full justify-start">
              <EditIcon className="mr-2 h-4 w-4" />
              Update Category
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteCategoryDialog
              category={row}
              variant="ghost"
              triggerBtnClassName="w-full justify-start px-2 py-1.5 cursor-default"
            />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
