import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CustomDropdown from "@/components/customDropdown";
import { Separator } from "@/components/ui/separator";
import EditExpensePopover from "@/components/editExpense";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: string
  description: string
  month: string
  day: string,
  year: number,
  date: string,
  amount: number
}


export const columns: ColumnDef<Expense>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
      accessorKey: "description",
      header: "description",
    },
    {
      accessorKey: "day",
      header: "day",
    },
    {
      accessorKey: "year",
      header: "year",
      filterFn: (row, columnId, value) => {
        const yearValue = row.getValue(columnId);
        return yearValue === value;
      },
    },
    {
      accessorKey: "month",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full "
          >
           Month
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        )
      },
      cell: ({row}) => {
        const month = row.getValue("month") as string;
        return <div className="text-center ">{month}</div>
      }
    },
    {
      accessorKey: "date",
      header: "date",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right font-bold">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const expense = row.original
          const {toast} = useToast()
        
          const handleClick = async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/expense/${expense.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const data = await response.json();
              if (!response.ok) {
                return toast({
                  title: "Error",
                  description: data.message,
                });
              }
              toast({
                title: "Expense deleted",
                description: "Expense has been deleted successfully",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "An unexpected error occurred.",
              });
            }
          };
      return (
          <div >
            <CustomDropdown triggerContent="..." className="absolute top-[100%] left-[87%]">
              <div className="flex flex-col gap-2">
              <Link className="text-sm font-semibold " to={`${expense.id}`}>
              <Button variant={"ghost"}>View Expense</Button>
              </Link>
                <Separator />
                <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-red-500">Delete <Trash2 /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClick()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
              </div>
            </CustomDropdown>
        </div>
          );
          
        },
      },
  ]