import { Budget, Category } from "@/types/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import { Check, Circle, PlusSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CategoryPopover } from "./categoryPopover";
import { useMutation } from "react-query";
import { createExpenseRoute } from "@/api/expense/route";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import {motion} from "framer-motion";

type Props = {
    budgets: Budget[];
    categories: Category[];
};

const schema = z.object({
    amount: z.number().min(0, { message: 'Amount must be a positive number' }),
    description: z.string().optional(),
    budgetId: z.string().uuid({ message: "You need to select a valid budget" }),
    categoryId: z.string().uuid({ message: "You need to select a valid category" }),
});

export type TExpenseSchema = z.infer<typeof schema>;

export default function ExpensePopoverContent({ budgets, categories }: Props) {
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState({
        category: false,
        budget: false,
    });
    const [showpopover, setShowpopover] = useState(false);
    const [loading, setIsloading] = useState(false);
    const {toast} = useToast();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<TExpenseSchema>({
        defaultValues: {
            amount: 0,
            description: '',
            budgetId: '',
            categoryId: '',
        },
        resolver: zodResolver(schema),
    });

    const mutation = useMutation(createExpenseRoute,
        {
            onSuccess: () => {
                toast({
                  variant: "default",
                  title: "Success",
                  description: "Expense was created successfully",
                  className: "border text-black font-medium dark:bg-black dark:text-white",
                });
                setTimeout(() => {
                  window.location.reload();
              }, 1000);
              },
              onError: (error: Error) => {
                toast({
                  variant: "default",
                  title: "Error",
                  description: error.message,
                  className: "bg-red-400 text-white font-medium",
                  action: (
                    <ToastAction altText="Try again" className="hover:bg-red-400">
                      Try again
                    </ToastAction>
                  ),
                });
        }
    }
    );

    const onSubmit = (data: TExpenseSchema) => {
        console.log(data);
        setIsloading(true);
        // Implement the logic to create the expense with the data
        try {
            mutation.mutate(data);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error creating expense"
            })
        }
    };

    const toggleDropdown = (field: "category" | "budget") => {
        setDropdownOpen((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    return (
        <div className="relative p-8 rounded-lg">
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

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-500" disabled={loading}>
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
                    Submit
                </Button>
            </form>
        </div>
    );
}
