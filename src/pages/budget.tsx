
import { useQuery } from "react-query"
import LoadingOverlay from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Budget as BudgetType } from "@/types/types"
import { findAllBudgetsForUser } from "@/api/budget/route"
import { DataTable } from "./budget table/data-table"
import { columns } from "./budget table/data-column"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import BudgetPopover from "@/components/budgetPopover"

type Props = {}



export default function Budget({}: Props) {
  const {data, isError, isLoading} = useQuery("findBudgetsForUser", findAllBudgetsForUser, {
    retry: false
  });


  if (isLoading) {
    <LoadingOverlay />
  }

  if (isError) {
    <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
            <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
  }

  const budgets: BudgetType[] = data?.data || [];;

  const budget = budgets?.map((e) => {
  
    const amount = e.amount;
    const id = e.id;
    
    return {
      id: id,
      month: e.month,
      year: e.year,
      amount: amount,
    };
  });
  


  
 
  return (

    <div className="container mx-auto py-10">

      <div className="flex flex-col">
        <div className="flex justify-end">
        <Popover>
        <PopoverTrigger asChild>
        <Button
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 border-blue-800 bg-blue-900 text-white hover:bg-blue-800"
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="radix-:rpv:"
  data-state="closed"
>
  Create Budgets 📝
</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
       <BudgetPopover />
      </PopoverContent>
        </Popover>
        </div>
    
    <DataTable columns={columns} data={budget} />
        </div>
  </div>
  )
}