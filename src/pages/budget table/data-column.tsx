import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import CustomDropdown from "@/components/customDropdown";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Budget = {
    id: string,
    year: number,
    month: string,
    amount:number
}





export const columns: ColumnDef<Budget>[] = [
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
          const budget = row.original
          const {toast} = useToast()
        
          const handleClick = async () => {
            try {
                const token = sessionStorage.getItem("token");
              const response = await fetch(`https://expense-tracker-backend-5spz.onrender.com/api/budget/${budget.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
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
                title: "Budget deleted",
                description: "Budget has been deleted successfully"
              });
              window.location.reload();
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
              <div className="flex z-50 flex-col gap-2">
              <Link className="text-sm font-semibold " to={`${budget.id}`}>
              <Button variant={"ghost"}>View Budget</Button>
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