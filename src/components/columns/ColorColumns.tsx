"use client";

import { useParams, useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CopyIcon, EditIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import DeleteColorDialog from "@/components/dialogs/DeleteColorDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
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
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.value}
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.value }}
          ></div>
        </div>
      );
    },
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
    cell: ({ row }) => <BillboardCellActions row={row.original} />,
  },
];

export function BillboardCellActions({ row }: { row: ColorColumn }) {
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
              toast.success("✅ Color ID copied successfully.");
            }}
          >
            <Button variant="ghost" className="w-full justify-start">
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy ID
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            onClick={() => router.push(`/${params.storeId}/colors/${row.id}`)}
          >
            <Button variant="ghost" className="w-full justify-start">
              <EditIcon className="mr-2 h-4 w-4" />
              Update Color
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteColorDialog
              color={row}
              variant="ghost"
              triggerBtnClassName="w-full justify-start px-2 py-1.5 cursor-default"
            />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
