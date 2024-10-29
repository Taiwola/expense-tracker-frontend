import { Budget } from "@/types/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {motion} from "framer-motion"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "react-query";
import { createIncomeRoute } from "@/api/income/route";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "@/hooks/use-toast";

type Props = {
    budgets: Budget[];
};

const schema = z.object({
    amount: z.number().min(0, { message: 'Amount must be a positive number' }),
    year: z
        .number()
        .int()
        .min(1900, { message: 'Year must not be before 1900' })
        .max(new Date().getFullYear() + 10, { message: 'Year must not be more than 10 years in the future' }),
    month: z.string().min(1, { message: 'Month must be a valid string' }),
    source: z.string().min(1, "Source is required"),
    budgetId: z.string().min(1, "You need to select a budget"),
});

export type TIncomeSchema = z.infer<typeof schema>;

export default function IncomePopover({ budgets }: Props) {
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
    const [selectedBudget, setSelectedBudget] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setIsloading] = useState(false);
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<TIncomeSchema>({
        defaultValues: {
            amount: 0,
            year: new Date().getFullYear(),
            month: '',
            budgetId: '',
            source: ''
        },
        resolver: zodResolver(schema),
    });

    const {toast} = useToast();

    const mutatation = useMutation(createIncomeRoute, {
        onSuccess: () => {
            toast({
              variant: "default",
              title: "Success",
              description: "Income was created successfully",
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
          },
    });

    const onSubmit = (data: TIncomeSchema) => {
        setIsloading(true);
        const month = selectedMonth ? selectedMonth.toLocaleString('default', { month: 'long' }) : ""
        // Handle the form submission logic here
        console.log({ ...data, month:  month});
        mutatation.mutate(data);
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <div className="p-6 rounded-lg">
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
                    <Label htmlFor="source">Source</Label>
                    <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="source"
                                type="text"
                                className="col-span-2 h-8"
                                {...field}
                            />
                        )}
                    />
                    {errors.source && <p className="text-red-500">{errors.source.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="month">Month</Label>
                    <Controller
                        name="month"
                        control={control}
                        render={() => (
                            <DatePicker
                                id="month"
                                selected={selectedMonth}
                                onChange={(date) => {
                                    setSelectedMonth(date);
                                    const month = date ? date.toLocaleString('default', { month: 'long' }) : '';
                                    setValue('month', month);
                                }}
                                showMonthYearPicker
                                dateFormat="MMMM yyyy"
                                className="col-span-2 h-8 w-full border border-gray-300 rounded-md p-2"
                                placeholderText="Select month"
                            />
                        )}
                    />
                    {errors.month && <p className="text-red-500">{errors.month.message}</p>}
                </div>

                <div>
                    <Label htmlFor="year">Year</Label>
                    <Controller
                        name="year"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="year"
                                type="number"
                                className="col-span-2 h-8"
                                {...field}
                            />
                        )}
                    />
                    {errors.year && <p className="text-red-500">{errors.year.message}</p>}
                </div>

                <div>
                <Label>Budget</Label>
                        <div onClick={toggleDropdown} className="w-full border text-xs border-gray-300 rounded-md p-2 cursor-pointer">
                            {selectedBudget ? budgets.find((b) => b.id === selectedBudget)?.month : "Select a budget"}
                        </div>
                        {dropdownOpen && (
                            <Command>
                                <CommandInput
                                    placeholder="Search budget..."
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                <CommandList>
                                    <CommandEmpty>No budget found.</CommandEmpty>
                                    <CommandGroup>
                                        {budgets.map((budget) => (
                                            <CommandItem
                                                key={budget.id}
                                                value={budget.id}
                                                onSelect={(currentValue) => {
                                                    setSelectedBudget(currentValue === selectedBudget ? "" : currentValue);
                                                    setValue('budgetId', currentValue);
                                                    setDropdownOpen(false);
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
                        <p className="text-xs">* Select a budget to track income effectively</p>
                    {errors.budgetId && <p className="text-red-500">{errors.budgetId.message}</p>}
                </div>

                <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-500"
      disabled={loading}
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
      Submit
    </Button>
            </form>
        </div>
    );
}
