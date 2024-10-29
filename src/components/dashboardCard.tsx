import { PiggyBank, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    title: string,
    amount: number,
    description?: string
}

const iconMap: { [key: string]: any } = {
    "Savings": PiggyBank,
    "Wallet": Wallet,
    "Income": TrendingUp,
    "Expenses": TrendingDown
};

const backgroundColorMap: { [key: string]: string } = {
    "Income": "bg-green-100/70 text-green-400",
    "Expenses": "text-red-400 bg-red-100/50"
};

export default function DashboardCard({ title, amount, description }: Props) {
  const IconComponent = iconMap[title] || Wallet;
  const backgroundColor = backgroundColorMap[title] || "bg-[#EAEEFE]";

  // Format the amount with commas and two decimal places
  const formatAmount = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'NGN', // Set to Nigerian Naira
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card className="flex-1 relative">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="section-description text-left text-2xl font-sans">
          {amount ? formatAmount(amount) : formatAmount(0)}
        </CardTitle>
      </CardHeader>
      <IconComponent 
        size={35} 
        className={`absolute right-4 top-4 text-muted-foreground ${backgroundColor} rounded-full p-2`} 
      />
      <CardFooter>
        {
          description && (
            <p className="text-[10px] text-muted-foreground">
            {description}
            </p>
          )
        }
      </CardFooter>
    </Card>
  );
}