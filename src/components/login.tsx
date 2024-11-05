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
import { forgotPassword, loginRoute } from "@/api/auth/route";
import { useState } from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export type TFormLoginSchema = z.infer<typeof formSchema>;
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormLoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const {
    register: forgotPasswordRegister,
    handleSubmit: handleForgotPasswordSubmit,
  } = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onMutation = useMutation(loginRoute, {
    onSuccess: async (data: any) => {
      toast({
        variant: "default",
        title: "Login",
        description: data.message,
        className: "border text-black font-medium dark:bg-black dark:text-white",
      });

      if (rememberMe) {
        localStorage.setItem("userSession", JSON.stringify(data));
      } else {
        sessionStorage.setItem("userSession", JSON.stringify(data));
      }

      reset();
      navigate(`/dashboard/${data.data.id}`);
    },
    onError: async (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        className: "bg-red-400 text-white font-medium",
        action: <ToastAction altText="Try again" className="hover:bg-red-400">Try again</ToastAction>,
      });
      reset();
    },
  });

  const forgotPasswordMutate = useMutation(forgotPassword, {
    onSuccess: async (data:any) => {
      toast({
        variant: "default",
        title: "Forgot Password",
        description: data.message,
        className: "border text-black font-medium dark:bg-black dark:text-white",
      });
    },
    onError: async (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        className: "bg-red-400 text-white font-medium",
        action: <ToastAction altText="Try again" className="hover:bg-red-400">Try again</ToastAction>,
      });
    },
  });

  const handleForgotPassword = async (data: any) => {
    forgotPasswordMutate.mutate(data);
  }


  //   onSuccess: () => {
  //     toast({
  //       title: "Forgot Password",
  //       description: "Password reset link sent to your email",
  //       className: "border text-black font-medium dark:bg-black dark:text-white",
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error.message,
  //       className: "bg-red-400 text-white font-medium",
  //     });
  //   },
  // });

  // const handleForgotPassword = () => {
  //   const email = watch("email");
  //   if (email) {
  //     forgotPasswordMutation.mutate({ email });
  //   } else {
  //     toast({
  //       description: "Please enter your email address to reset your password.",
  //       className: "border bg-white z-[1000] text-black font-medium dark:bg-black dark:text-white",
  //     });
  //   }
  // };

  const onSubmit = (data: TFormLoginSchema) => {
    if (!acceptedTerms) {
      return toast({
        description: "You must accept the terms and conditions",
        className: "border bg-white z-[1000] text-black font-medium dark:bg-black dark:text-white",
      });
    }
    setLoading(true);
    onMutation.mutate({ ...data });
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
          <Checkbox checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} />
          Remember Me
        </div>
        <div className="mt-2">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="text-sm text-blue-500 underline hover:text-blue-700">
              Forgot password?
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleForgotPasswordSubmit(handleForgotPassword)}
            >
              <Label htmlFor="forgotEmail">Enter your email</Label>
              <Input
                id="forgotEmail"
                placeholder="Enter Your Email"
                type="email"
                {...forgotPasswordRegister("email")}
              />
              <Button type="submit" className="mt-2">Send Reset Link</Button>
            </form>
          </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" disabled={onMutation.isLoading} className="w-full">
          {onMutation.isLoading && (
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
