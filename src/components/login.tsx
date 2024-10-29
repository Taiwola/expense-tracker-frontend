import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { ToastAction } from "@radix-ui/react-toast";
import { loginRoute } from "@/api/auth/route";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"), // Example additional validation
});

export type TFormLoginSchema = z.infer<typeof formSchema>;

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormLoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const onMutation = useMutation(loginRoute, {
    onSuccess: async (data: any) => {
      toast({
        variant: "default",
        title: "Login",
        description: data.message,
        className: "border text-black font-medium dark:bg-black dark:text-white",
      });

      // Set session storage based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem("userSession", JSON.stringify(data)); // Save in localStorage for persistent session
      } else {
        sessionStorage.setItem("userSession", JSON.stringify(data)); // Save in sessionStorage for temporary session
      }

      reset();
      navigate(`/dashboard/${data.data.id}`);
    },
    onError: async (error: Error) => {
      toast({
        variant: "destructive", // Use a different variant for errors
        title: "Error",
        description: error.message,
        className: "bg-red-400 text-white font-medium",
        action: <ToastAction altText="Try again" className="hover:bg-red-400">Try again</ToastAction>,
      });
      reset();
    },
  });

  const onSubmit = (data: TFormLoginSchema) => {
    if (!acceptedTerms) {
      return toast({
        description: "You must accept the terms and conditions",
        className: "border bg-white z-[1000] text-black font-medium dark:bg-black dark:text-white",
      });
    }
    onMutation.mutate({ ...data }); // Pass "Remember Me" option to the login request
  };

  return (
    <div className="px-8 mb-4 md:pb-24">
      <h4 className="section-title">Login to your Expense Buddy</h4>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="Enter Your Email" type="email" {...register("email")} />
          {errors?.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" {...register("password")} />
          {errors?.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Checkbox onCheckedChange={() => setAcceptedTerms(!acceptedTerms)} />
          Accept terms and conditions
        </div>
        <div className="flex items-center gap-3">
          <Checkbox onCheckedChange={() => setRememberMe(!rememberMe)} />
          Remember Me
        </div>
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
