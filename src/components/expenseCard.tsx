import {ShoppingBag} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "@/components/ui/progress"

type Props = {
    title: string,
    price: number,
    budgetPrice?: string,
    value: number,
    maxValue: number
}

export default function ExpenseCard({title, price, value, maxValue}: Props) {
    const progressPercentage = (value / maxValue) * 100;
    const formatAmount = (value: number): string => {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'NGN', // Set to Nigerian Naira
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                <span className="bg-[#EAEEFE] rounded-full p-2">
                <ShoppingBag />
                    </span> 
                    <CardDescription>{title}</CardDescription>
                </div>
                <p className="text-muted-foreground text-xs">{formatAmount(price)}</p>
            </CardTitle>
        </CardHeader>
        <CardContent> 
        <div className="flex justify-between">
        <p className="text-xs text-muted-foreground">{formatAmount(value)}</p>
        <p className="text-xs text-muted-foreground">{formatAmount(maxValue)}</p>
      </div>
      <Progress
        max={100}
        value={progressPercentage}
         className="w-full h-2 mt-2 rounded-lg overflow-hidden appearance-none"
      />
      <div className="text-right mt-1">
        <p className="text-xs text-gray-500">{progressPercentage.toFixed(1)}%</p>
      </div>
        </CardContent>
    </Card>
  )
}