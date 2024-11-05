import { Card, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { resetPasswordRoute } from "@/api/auth/route";
import { useMutation } from "react-query";

// Define your schema for validation
const passwordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirmation password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type TResetPassword = z.infer<typeof passwordSchema>

export const ResetPassword = () => {
  const params= useParams();
  const token = params.token as string;
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const { toast } = useToast();

   console.log(token)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TResetPassword>({
    resolver: zodResolver(passwordSchema),
  });

  const mutation = useMutation(resetPasswordRoute, {
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Success",
        description: data.message,
      });
      reset(); // Clear form inputs after success
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    },
  });

  const onSubmit = (data: TResetPassword) => {
    const options = {
        token: token,
        newPassword: data.newPassword
    }
    mutation.mutate(options); // Pass token and new password
  };

  return (
    <div className="bg-[#EAEEFE] min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
          <Card className="shadow-lg rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} // Navigate to home page
                className="text-gray-700"
              >
                Back to Home
              </Button>
            </div>
            <CardTitle className="text-center text-2xl font-semibold mb-4">Reset Password</CardTitle>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                {...register("newPassword")}
                className={`mt-1 p-2 border rounded-md w-full ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className={`mt-1 p-2 border rounded-md w-full ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button disabled={mutation.isLoading} className="w-full mt-4 text-white">
              {mutation.isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
};
