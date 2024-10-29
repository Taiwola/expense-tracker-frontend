import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    getFilteredRowModel,
    getCoreRowModel,
    SortingState,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
  } from "@tanstack/react-table"
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { useState } from "react"
  import { Input } from "@/components/ui/input"
  import {
      DropdownMenu,
      DropdownMenuCheckboxItem,
      DropdownMenuContent,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu"
  import { DataTablePagination } from "@/components/pagination";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  
  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
  }
  
  export function DataTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
      const [sorting, setSorting] = useState<SortingState>([])
      const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
          []
        )
        const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
        const [rowSelection, setRowSelection] = useState({})
        const [yearFilter, setYearFilter] = useState<number>();
        const [monthFilter, setMonthFilter] = useState<string>("");
        const [dayFilter, setDayFilter] = useState<string>("");
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    });
  
    const handleFilterChange = (filterValue: string, filterType: string) => {
      switch (filterType) {
        case "year":
          const year = filterValue ? parseInt(filterValue) : undefined;
          setYearFilter(year);
          table.getColumn("year")?.setFilterValue(year); // Ensure 'year' is the actual column id
          break;
        case "month":
          setMonthFilter(filterValue);
          table.getColumn("month")?.setFilterValue(filterValue); // Ensure 'month' is the actual column id
          break;
        case "day":
          setDayFilter(filterValue);
          table.getColumn("day")?.setFilterValue(filterValue); // Ensure 'day' is the actual column id
          break;
      }
    };
    
    
    
  
    const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = [
      "January", "February", "March", "April", "May", 
      "June", "July", "August", "September", "October", 
      "November", "December"
    ];
  
    return (
      <div>
           <div className="flex gap-2 items-center py-4">
          <Input
            placeholder="Filter months..."
            value={(table.getColumn("month")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-2">
          <Select
    onValueChange={(value) => handleFilterChange(value === "all" ? "" : value, "year")}
  >
    <SelectTrigger className="w-[100px] border-dotted focus:none">
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Years</SelectItem> {/* Special value for clearing the filter */}
      {years.map((year) => (
        <SelectItem key={year} value={year}>
          {year}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  
  <Select
    onValueChange={(value) => handleFilterChange(value === "all" ? "" : value, "month")}
  >
    <SelectTrigger className="w-[100px] border-dotted focus:none">
      <SelectValue placeholder="Month" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Months</SelectItem> {/* Special value for clearing the filter */}
      {months.map((month) => (
        <SelectItem key={month} value={month}>
          {month}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      </div>
    )
  }
  