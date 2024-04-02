"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CopyIcon,
  EditIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";

import DeleteBillboardDialog from "@/components/dialogs/DeleteBillboardDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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

export function BillboardCellActions({ row }: { row: BillboardColumn }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const params = useParams();
  const router = useRouter();

  return (
    <>
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
              onClick={() => {
                navigator.clipboard.writeText(row.id);
                toast.success("✅ Billboard ID copied successfully.");
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/${params.storeId}/billboards/${row.id}`)
              }
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Billboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Billboard
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDeleteDialog && (
        <DeleteBillboardDialog
          open={showDeleteDialog}
          setOpen={setShowDeleteDialog}
          billboard={row}
        />
      )}
    </>
  );
}
