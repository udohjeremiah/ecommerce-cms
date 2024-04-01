"use client";

import { useParams, useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CopyIcon, EditIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import DeleteProductDialog from "@/components/dialogs/DeleteProductDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  size: string;
  color: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.color}
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.color }}
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
    cell: ({ row }) => <ProductCellActions row={row.original} />,
  },
];

export function ProductCellActions({ row }: { row: ProductColumn }) {
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
              toast.success("✅ Product ID copied successfully.");
            }}
          >
            <Button variant="ghost" className="w-full justify-start">
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy ID
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            onClick={() => router.push(`/${params.storeId}/products/${row.id}`)}
          >
            <Button variant="ghost" className="w-full justify-start">
              <EditIcon className="mr-2 h-4 w-4" />
              Update Product
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteProductDialog
              product={row}
              variant="ghost"
              triggerBtnClassName="w-full justify-start px-2 py-1.5 cursor-default"
            />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
