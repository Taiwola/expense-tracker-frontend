import { getUser } from "@/api/user/route";
import LoadingOverlay from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/types";
import { forwardRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { updateUser } from "@/api/user/route";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { exportPdf } from "@/api/report/route";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional()
});

export type Tschema = z.infer<typeof schema>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => (
  <div className="mb-4 w-full">
    <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
    <Input ref={ref} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200" />
  </div>
));

export default function Account() {
  const { id: userId } = useParams();
  const { toast } = useToast();
  const [editField, setEditField] = useState<string | null>(null);

  const mutation = useMutation(updateUser, {
    onSuccess: () => {
      toast({ description: "User updated successfully!" });
      refetchUserData();
    },
    onError: (error: Error) => {
      toast({ description: `Failed to update user: ${error.message}` });
    }
  });

  const { data: userData, isLoading, isError, refetch: refetchUserData } = useQuery(
    ["getUser", userId],
    () => getUser(userId as string),
    { retry: false }
  );

  const { register, handleSubmit, reset } = useForm<Tschema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: userData?.data?.firstName,
      lastName: userData?.data?.lastName,
      email: userData?.data?.email,
      password: ""
    }
  });

  const handleChangeClick = (field: string | null) => {
    setEditField(field);
    if (!field) reset();
  };

  const { refetch: refetchPDF } = useQuery("exportPDF", exportPdf, {
    enabled: false,
    retry: false,
    onError: (error) => console.error("Error downloading PDF:", error),
  });

  const handleDownloadPdf = async () => {
    try {
      await refetchPDF();
      toast({ description: "PDF downloaded successfully!" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({ description: `Error downloading PDF: ${errorMessage}` });
    }
  };

  const onSubmit = (data: Tschema) => {
    if (!data.password) {
      delete data.password;
    }
    mutation.mutate(data);
    handleChangeClick(null);
  };

  if (isLoading) return <LoadingOverlay />;
  if (isError) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center text-gray-700">
        <p>Error loading user data</p>
        <Button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg">
          <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  const user: User = userData?.data;
  if (!user) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center text-gray-700">
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex flex-col items-center">
          {editField === "image" ? (
            <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
              <Input type="text" {...register("image")} />
              <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">Save</Button>
              <Button type="button" onClick={() => handleChangeClick(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Close</Button>
            </form>
          ) : (
            <>
              <img
                src={user.image || "placeholder_image_url"}
                alt="Profile"
                className="rounded-full w-24 h-24 mb-4 shadow-md"
              />
              <Button onClick={() => handleChangeClick("image")} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">Edit Image</Button>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["firstName", "lastName", "email", "password"].map(field => (
            <div key={field} className="flex justify-center space-x-2 items-center">
              <CustomInput
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                {...register(field as keyof Tschema)}
                disabled={editField !== field}
                type={field === "password" ? "password" : "text"}
              />
              {editField === field ? (
                <Button type="button" onClick={() => handleChangeClick(null)} className="text-sm ">Close</Button>
              ) : (
                <Button type="button" onClick={() => handleChangeClick(field)} className="text-sm ">Edit</Button>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <Button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Changes</Button>
            <Button type="button" onClick={handleDownloadPdf} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Download PDF</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
