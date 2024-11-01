
import { useQuery } from "react-query"
import LoadingOverlay from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Link, useParams } from "react-router-dom"
import { Budget, Income as IncomeType, User } from "@/types/types"
import { DataTable } from "./income table/data-table"
import { columns } from "./income table/data-column"
import { findAllIncomeForUser } from "@/api/income/route"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import IncomePopover from "@/components/incomePopover"
import { getUser } from "@/api/user/route"

type Props = {}



export default function Income({}: Props) {
  const {data, isError, isLoading} = useQuery("findIncomeForUser", findAllIncomeForUser, {
    retry: false
  });

  const { id: userId } = useParams();
  const { data:users } = useQuery("getUser", () => getUser(userId as string), {
    retry: false,
  });


  const user: User | undefined = users?.data;
  const budgets: Budget[] = user?.budgets || []; // This ensures budgets is always an array

  if (isLoading) {
    return <LoadingOverlay />
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
          <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  const incomes: IncomeType[] = data?.data || [];;

  const income = incomes?.map((e) => {
  
    const amount = e.amount;
    const id = e.id;
    const source = e.source;
    
    
    return {
      id: id,
      month: e.month,
      year: e.year,
      amount: amount,
      source: source
    };
  });

  const currentYear = new Date().getFullYear();
  const filteredBudgets = budgets.filter(budget => new Date(budget.createdAt).getFullYear() === currentYear);
  
 
  return (

    <div className="container mx-auto py-10">
      <div className="flex flex-col">
        <div className="flex justify-end">
        <Popover>
        <PopoverTrigger asChild>
<Button
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 border-green-600 bg-green-500 text-white hover:bg-green-700"
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="radix-:rpv:"
  data-state="closed"
>
  Create Incomes 🤑
</Button>
</PopoverTrigger>
<PopoverContent className="w-96">
       <IncomePopover budgets={filteredBudgets} />
      </PopoverContent>
</Popover>
        </div>
    <DataTable columns={columns} data={income} />
      </div>

  </div>
  )
}