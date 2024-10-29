import { useForm, Controller } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";
import {useMutation} from "react-query";
import { createBudgetRoute } from "@/api/budget/route";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Circle } from "lucide-react";
import {motion} from "framer-motion";

const schema = z.object({
  amount: z.number().min(0, { message: 'Amount must be a positive number' }),
  year: z
    .number()
    .int()
    .min(1900, { message: 'Year must not be before 1900' })
    .max(new Date().getFullYear() + 10, { message: 'Year must not be more than 10 years in the future' }),
  month: z.string().min(1, { message: 'Month must be a valid string' }),
});

export type TBudgetSchema = z.infer<typeof schema>;

export default function BudgetPopover() {
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
    const [loading, setIsloading] = useState(false);
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<TBudgetSchema>({
        defaultValues: {
          amount: 0,
          year: new Date().getFullYear(),
          month: '',
        },
        resolver: zodResolver(schema),
      });
      const {toast} = useToast()

      const mutation = useMutation(createBudgetRoute, {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Success",
            description: "Budget was created successfully",
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

      console.log(mutation.data);
    
      const onSubmit = (data: TBudgetSchema) => {
        const month = selectedMonth ? selectedMonth.toLocaleString('default', { month: 'long' }) : ""
        // Handle the form submission logic here
        console.log({ ...data, month:  month});
        setIsloading(true);
        const options = {
          ...data,
          month: month
        }
        mutation.mutate(options);
      };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
    <div className="grid gap-2">
      <div className="flex flex-col items-start gap-4 mt-2">
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
      </div>
      {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
      <div className="flex flex-col items-start gap-4 mt-2">
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
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          )}
        />
      </div>
      {errors.year && <p className="text-red-500">{errors.year.message}</p>}
      <div className="flex flex-col items-start gap-4 mt-2">
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
                  // Set month value in the form as a string
                  const month = date ? date.toLocaleString('default', { month: 'long' }) : '';
                  setValue('month', month);
                }}
                showMonthYearPicker
                dateFormat="MMMM yyyy"
                className="col-span-2 h-8"
                placeholderText="Select month"
              />
            )}
          />
      </div>
      {errors.month && <p className="text-red-500">{errors.month.message}</p>}
    </div>
    <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={loading}>
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
  )
}