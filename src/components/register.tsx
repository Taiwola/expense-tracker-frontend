import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { registerRoute } from "@/api/auth/route";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import {motion} from "framer-motion";
import {Circle} from "lucide-react"

// Zod schema for form validation
const registerForm = z.object({
  first_name: z.string().min(1,"First name is required"),
  last_name: z.string().min(1,"Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirm_password: z.string()
    .min(6, "Confirm password must be at least 6 characters long"),
});

export type TFormSchema = z.infer<typeof registerForm>;

export default function Register() {
  const { toast } = useToast();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormSchema>({
    resolver: zodResolver(registerForm),
  });

  // Mutation for handling registration
  const mutation = useMutation(registerRoute, {
    onSuccess: (message: string) => {
      toast({
        variant: "default",
        title: "Success",
        description: message,
        className: "border text-black font-medium dark:bg-black dark:text-white",
      });
      reset();
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

  // Form submission handler
  const onSubmit = (data: TFormSchema) => {
    if (!acceptedTerms) {
      return toast({
        description: "You must accept the terms and conditions",
        className: "border bg-white z-[1000] text-black font-medium dark:bg-black dark:text-white",
      });
    }
    if (data.password !== data.confirm_password) {
      return toast({
        description: "Passwords do not match",
        className: "border bg-white z-[1000] text-black font-medium dark:bg-black dark:text-white",
      });
    }
    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <div className="px-8 mb-4 md:pb-24">
      <h4 className="section-title">Register on Expense Buddy</h4>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>First Name</Label>
          <Input type="text" placeholder="Enter Your First Name" {...register("first_name")} />
          {errors.first_name && <p className="text-sm text-red-500">{errors.first_name.message}</p>}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input type="text" placeholder="Enter Your Last Name" {...register("last_name")} />
          {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="Enter your email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="Enter your password" {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input type="password" placeholder="Confirm your password" {...register("confirm_password")} />
          {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password.message}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Checkbox onCheckedChange={() => setAcceptedTerms(!acceptedTerms)} />
          <span>Accept terms and conditions</span>
        </div>
        <Button className="w-full">
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
          Submit</Button>
      </form>
    </div>
  );
}
