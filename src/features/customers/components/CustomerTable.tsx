import { useState } from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Customer } from "@/features/customers/customers.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomerBadge } from "./CustomerBadge";
import { Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowRight, ArrowLeft } from "lucide-react";
import ActionButton from "@/components/molecules/ActionButton";

interface CustomerTableProps {
  data: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  globalFilter: string;
}

export function CustomerTable({
  data,
  onEdit,
  onDelete,
  globalFilter,
}: CustomerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent text-xs px-0"
          >
            NAME
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent text-xs px-0"
          >
            DATE ADDED
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <div className="text-xs">{format(date, "MMM. dd, yyyy h:mm a")}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: () => (
        <div className="text-xs font-medium">
          CONTACT NUMBER
        </div>
      ),
      cell: ({ row }) => {
        const phone = (row.getValue('phone') as string) || ''
        return <div className="text-xs font-light">{phone.trim() || '—'}</div>
      }, 
    },
    {
      accessorKey: "customerType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent text-xs px-0"
          >
            TYPE
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => 
      <>
        { row.getValue("customerType") ?
          <CustomerBadge type={row.getValue("customerType")} />
          :  '—'
        }
      </>,
    },
    {
      accessorKey: "notes",
      header: () => (
        <div className="text-xs font-medium">
          NOTES
        </div>
      ),
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string;
        return (
          <div className="max-w-[300px] truncate text-justify font-light text-muted-foreground text-xs italic">
            {notes || "—"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-xs font-medium">
          ACTION
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div>
            <ActionButton
              onUpdate={() => onEdit(row.original)}
              onDelete={() => onDelete(row.original)}
            />
          </div>
        );
      },
      size: 56,
      minSize: 56,
      maxSize: 56,
      enableResizing: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const name = row.original.name.toLowerCase();
      const customerType = row.original.customerType.toLowerCase();
      const notes = (row.original.notes || '').toLowerCase();

      return (
        name.includes(searchValue) ||
        customerType.includes(searchValue) ||
        notes.includes(searchValue)
      );
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-sm">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className="font-semibold"
                    style={
                      header.column.id === "actions"
                        ? { width: '5%', maxWidth: '10%' }
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-accent/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">
                    No customers found. Add your first customer to get started!
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableCell colSpan={6}>
              {/* Pagination */}
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} customers
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableFooter>
        </Table>
      </div>

    </div>
  );
}
