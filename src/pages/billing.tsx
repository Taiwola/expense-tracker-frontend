import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Billing() {
    const [selectedPlan, setSelectedPlan] = useState();

    const handlePlanSelect = (data:any) => {
        // Logic to update the selected plan in the backend
       
        // Additional logic to handle billing API calls can be added here
    };

    const pricingTiers = [
      {
          title: "Free",
          monthlyPrice: 0,
          buttonText: "Select Plan",
          popular: false,
          inverse: false,
          features: [
              "Track up to 100 expenses per month",
              "Basic spending reports",
              "Access to web and mobile apps",
              "Expense categorization",
              "Email support",
          ],
      },
      {
          title: "Pro",
          monthlyPrice: 9,
          buttonText: "Upgrade to Pro",
          popular: true,
          inverse: true,
          features: [
              "Unlimited expense tracking",
              "Advanced spending analytics",
              "Custom expense categories",
              "Monthly budget planner",
              "Export to CSV or Excel",
              "Priority support",
              "Recurring expenses and reminders",
          ],
      },
      {
          title: "Business",
          monthlyPrice: 19,
          buttonText: "Upgrade to Business",
          popular: false,
          inverse: false,
          features: [
              "Unlimited expense tracking",
              "Team access with multiple users",
              "Advanced analytics and dashboards",
              "Monthly and yearly budget planning",
              "Export to multiple formats (CSV, Excel, PDF)",
              "API access for custom integrations",
              "Priority support with dedicated account manager",
              "Custom financial insights and recommendations",
              "Enhanced security features",
          ],
      },
  ];
  

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto">
                <div className="section-heading"> 
                    <h2 className="section-title">Your Plan & Billing</h2>
                    <p className="section-description mt-5">Manage your subscription plan and billing details.</p>
                </div>
                <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
                    {pricingTiers.map((price) => (
                        <div
                            key={price.title}
                            className={twMerge(
                                "p-10 max-w-xs w-full border border-[#f1f1f1] rounded-3xl shadow-[0_7px_14px_#EAEAEAEA]",
                                price.inverse && 'border-black bg-black text-white',
                                selectedPlan === price.title && "ring-4 ring-indigo-300"
                            )}
                        >
                            <div className="flex justify-between">
                                <h3 className={twMerge("font-bold text-lg text-black/50", price.inverse && 'text-white/60')}>
                                    {price.title}
                                </h3>
                                {price.popular && (
                                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                                        <motion.span
                                            animate={{ backgroundPositionX: '100%' }}
                                            transition={{ repeat: Infinity, ease: "linear", repeatType: "loop", duration: 1 }}
                                            className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-medium text-transparent bg-clip-text"
                                        >
                                            Popular
                                        </motion.span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-baseline gap-1 mt-[30px]">
                                <span className="text-4xl font-bold tracking-tighter leading-none">${price.monthlyPrice}</span>
                                <span className="tracking-tight font-bold text-black/50">/month</span>
                            </div>
                            <Button
                                className={twMerge(
                                    "w-full mt-[30px]",
                                    price.inverse && 'bg-white text-black hover:text-white',
                                    selectedPlan === price.title && 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                )}
                                disabled={selectedPlan === price.title}
                                onClick={() => handlePlanSelect(price.title)}
                            >
                                {selectedPlan === price.title ? "Current Plan" : price.buttonText}
                            </Button>
                            <ul className="flex flex-col gap-5 mt-[32px]">
                                {price.features.map((feature) => (
                                    <li key={feature} className="text-sm flex items-center gap-4">
                                        <span><CheckIcon /></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
