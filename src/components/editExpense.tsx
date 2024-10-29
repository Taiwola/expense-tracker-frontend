import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Ensure you have the right imports for Popover components
import { Button } from "@/components/ui/button"; // Import the Button component for actions
import {z} from "zod";
import {useQuery} from "react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { fetchExpense } from "@/api/expense/route";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Check, Circle, PlusSquareIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Budget, Category } from "@/types/types";
import { CategoryPopover } from "./categoryPopover";

interface EditExpensePopoverProps {
  expenseId: string; // Only expenseId is passed
}

const schema = z.object({
    description: z.string().min(1, "Description can not be empty"),
    amount: z.number(),
    categoryId: z.string().min(1, "Category can not be empty"),
    budgetId: z.string().min(1, "Budget can not be empty")
});


export type EdExpenseSchema = z.infer<typeof schema>;



const EditExpensePopover: React.FC<EditExpensePopoverProps> = ({ expenseId }) => {
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState({
        category: false,
        budget: false,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgets, setBudget] = useState<Budget[]>([]);
    const [loading, setIsloading] = useState(false);
    const {toast} = useToast();
    const [showpopover, setShowpopover] = useState(false);

const {data, isLoading, isError} = useQuery("fetch expense", () => fetchExpense(expenseId), {
    retry: false
})



useEffect(() => {
    const fetchData = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const [categoriesResponse, budgetsResponse] = await Promise.all([
                fetch("http://localhost:3000/api/category", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }),
                fetch("http://localhost:3000/api/budget", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                })
            ]);

              // Convert responses to JSON
              const categories = await categoriesResponse.json();
              const budgets = await budgetsResponse.json();
            // Check if responses are okay
            if (!categoriesResponse.ok || !budgetsResponse.ok) {
                console.log(categories.message);
                console.log(categories.message);
                throw new Error('Failed to fetch data');
            }

          

            setBudget(budgets);
            setCategories(categories);

        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error (e.g., set an error state)
        }
    };

    fetchData();
}, []);


  const { control, setValue, handleSubmit, formState: { errors }} = useForm<EdExpenseSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
        amount: data?.amount || 0,
        description: data?.description || "",
        budgetId: data?.budget?.id || "",
        categoryId: data?.category?.id || "",
    },
  })

  const onSubmit = async () => {
  
  };

  
  const toggleDropdown = (field: "category" | "budget") => {
    setDropdownOpen((prev) => ({
        ...prev,
        [field]: !prev[field],
    }));
};

  return (
    <div>
         {showpopover && (
                <Popover open={showpopover} onOpenChange={setShowpopover}>
                    <PopoverTrigger asChild>
                        {/* Invisible trigger element */}
                        <span />
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                       <CategoryPopover onClose={() => false} />
                    </PopoverContent>
                </Popover>
            )}
             <Popover>
      <PopoverTrigger className="text-left text-sm font-semibold cursor-pointer">
        Edit Expense
      </PopoverTrigger>
      <PopoverContent className="p-4 bg-white border border-gray-200 rounded-md shadow-lg">
        <h3 className="font-semibold mb-2">Edit Expense</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="amount"
                                type="number"
                                className="col-span-2 h-8"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                        )}
                    />
                    {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="description"
                                type="text"
                                className="col-span-2 h-8"
                                {...field}
                            />
                        )}
                    />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>

                <div className="flex space-x-4">
                <div className="flex-1">
    <Label className="text-sm font-medium">Category</Label>
    <div
        onClick={() => toggleDropdown('category')}
        className="w-full mt-1 text-sm border border-gray-300 rounded-md p-2 cursor-pointer"
    >
        {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "Select a category"}
    </div>

    {dropdownOpen.category && (
        <Command className="relative mt-2 border border-gray-300 rounded-md shadow-lg bg-white">
            <CommandInput
                placeholder="Search category..."
                className="w-full text-sm border-b border-gray-300 rounded-t-md p-2 focus:outline-none"
            />
            <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty className="p-2 text-gray-500">
                    No category found.
                </CommandEmpty>

                <CommandGroup className="bg-white">
                    <CommandItem
                        className="bg-white cursor-pointer p-2 hover:bg-gray-100"
                        
                    >
                        <span className="inline-flex w-full h-full items-center hover:text-black/55" onClick={() => setShowpopover(true)}>
                            <PlusSquareIcon className="mr-2" /> Create new
                        </span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator className="my-1" />

                <CommandGroup className="bg-white">
                    {categories.map((category) => (
                        <CommandItem
                            key={category.id}
                            value={category.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onSelect={(currentValue) => {
                                setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
                                setValue('categoryId', currentValue);
                                setDropdownOpen((prev) => ({ ...prev, category: false }));
                            }}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCategory === category.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {category.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )}
    
    {errors.categoryId && (
        <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
    )}
</div>


<div className="flex-1">
    <Label className="text-sm font-medium">Budget</Label>
    <div
        onClick={() => toggleDropdown('budget')}
        className="w-full mt-1 text-sm border border-gray-300 rounded-md p-2 cursor-pointer"
    >
        {selectedBudget ? budgets.find((b) => b.id === selectedBudget)?.month : "Select a budget"}
    </div>

    {dropdownOpen.budget && (
        <Command className="relative mt-2 border border-gray-300 rounded-md shadow-lg bg-white">
            <CommandInput
                placeholder="Search budget..."
                className="w-full text-sm border-b border-gray-300 rounded-t-md p-2 focus:outline-none"
            />
            <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty className="p-2 text-gray-500">
                    No budget found.
                </CommandEmpty>

                <CommandGroup className="bg-white">
                    {budgets.map((budget) => (
                        <CommandItem
                            key={budget.id}
                            value={budget.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onSelect={(currentValue) => {
                                setSelectedBudget(currentValue === selectedBudget ? "" : currentValue);
                                setValue('budgetId', currentValue);
                                setDropdownOpen((prev) => ({ ...prev, budget: false }));
                            }}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedBudget === budget.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {budget.month}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )}

    {errors.budgetId && (
        <p className="mt-1 text-sm text-red-500">{errors.budgetId.message}</p>
    )}
</div>

                </div>
                <div className="flex justify-end mt-2">
            <Button variant="ghost" onClick={() => {/* Handle cancel logic here */}}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="ml-2"
              disabled={isLoading}
            >
                {loading && (
          <motion.span
          className="mr-2 h-4 w-4"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <Circle />
        </motion.span>
      )}
              Save Changes
            </Button>
          </div>
            </form>
      </PopoverContent>
    </Popover>
    </div>
   
  );
};

export default EditExpensePopover;
