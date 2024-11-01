import { getUser } from "@/api/user/route";
import LoadingOverlay from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/types";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { updateUser } from "@/api/user/route";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

type Props = {}

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional()
});

export type Tschema = z.infer<typeof schema>

export default function Account({}: Props) {
  const { id: userId } = useParams();
  const {toast} = useToast();
  const [editField, setEditField] = useState<string | null>(null);
  const mutation = useMutation(updateUser, {
    onSuccess: () => {
      toast({description: "User updated successfully!"});
      window.location.reload();
  },
  onError: (error: Error) => {
      toast({description: `Failed to update user: ${error.message}`});
  }
  });

  const { data: userData, isLoading, isError } = useQuery(
    ["getUser", userId],
    () => getUser(userId as string),
    { retry: false }
  );

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error loading user data</p>
        <Button>
          <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  const user: User = userData?.data;

  const { register, handleSubmit, reset } = useForm<Tschema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });

  const handleChangeClick = (field: string | null) => {
    if (field) {
      setEditField(field);
    } else {
      setEditField(null);
      reset(); // Reset the form when closing edit
    }
  };

  const onSubmit = (data: Tschema) => {
    // Add any additional data handling here if needed
   mutation.mutate(data);
    handleChangeClick(null); // Close the editing mode
  };

  if (!user) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <div className="w-full max-w-[700px] mx-auto bg-[#FAFAFA]">
        <div className="p-5 space-y-2">
          <div className="flex items-center justify-center flex-col">
            {editField === "images" ? (
              <div>
                 {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="rounded-full w-32 h-32 mb-4"
                />
              ) : (
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACUCAMAAABRNbASAAAAMFBMVEXk5ueutLeor7Lf4uPn6eqrsbXGysyxt7rZ3N3N0dPJzc/R1Na3vL+/xMbc3+C8wcSQLHgbAAADo0lEQVR4nO2bwbajIAxABYKAgP7/3z7UtlM7bYVgQhfcVXe9J0AIEIeh0+l0Op1Op9PpdDqdTucjAKBWtl+tZQ4kMT/GsLHEyQ4/4wfDPBmpxR0ttAxODT/gB+Cj+Gd2R4po29vZ8EZtD+AyN9WDeZFvzXY9Oap2euDN+6g99Ey74MUvYbvPvamNHSzfw3YL3tjCToUct2QXG8hluqWRjeyxyxrT+8gyu8V8t2TnOGMHvsQtwZlR1HkOOWIUn9xS6CY0W7orHtSE5AodFKslmLIduPLAJSyLnDIYN82TihEzbkVyuEH2vvUSOpYKoDTH3TH0asjlsEJ/qICAddMTtRtyrW5yC7UbeKxbglwOP+WEnKntigq5Fznysq6gAn6FPtOhF2tioZZDL9ZEIJZTFW7CUMvhp1yX+125ocKNXu6XV2tVniOv1Cu2L/rD61ixt3pit6qqhPxgbfErguEQga+E6Q/9UHyJ85Cjv6UDiz4aclxIYOXIU3ACkMlEeo4Tv0VGjkFtQNxrrjAcqVdwS8KQnwtvdoh7Jr5L4RkROba7figuTTTLUr3ZFQ4s6wMTFA4sw5b/bFd2Mcy0Uh92U34+0fx9Etm7GM++dSQ7dg3cEll2slHvC9iTzo003UKz3g2YT5o35Niyo+lr24sOjduZYJjM++jJ4No3goFyRuhj/LTWwbdXWwGw42KE1DtSh8XNP9PetzYaKuunMcZxdN7+RGPfE3Cgtc2DVUbN1js3brgUOjsPrR3Tn6fBTNNN7wtin3K3HyJEZ7fe1wZiMFg3BiHlxzy3LY04ecXsB4OPRnxo1nwxFCY4Nj+A2S1fAvbOUIa1d5hBzaY5hjgaGvINA9Sosfc4KX6RMHypCDmtkb7riYWoFAC1IIbzPwJB9NYBvUBNrH0Il0fP1Q3owe7ajrBUj6OXwVs9fdnKBRivNNv1wjV2GccYlJ67ws3n7FII5AWXOxVvXSfo6hbYjMb9Cru6pIJs5Mumwk6RLIVnKi6gqOO2grUjj9sK8qKn4sG8BMwDBfaJC0G5myfMIUfK25uxr28ou8JXYmynMg5ZdMNY0wOBQBe9E2Met6ooKFHK37ZqKXjimbndCl48877Tu9guO3DsavmhY9wbngh5laeqaZFDo/NaYvg2roNcVoczfx7ZkVlybdzyiuLi7wivkstoq8d8q3cNGR+aQGzklpNM8M17tWTU622y3MZ5ppuFbEVGp+6smnEu1+l0Oh02/gAcny7rcFMbgAAAAABJRU5ErkJggg=="
                  alt="Profile"
                  className="rounded-full w-32 h-32 mb-4"
                />
              )}
                 <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("image")} />
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={() => handleChangeClick(null)}>Close</Button>
                  </form>
              </div>
            ) :<div>
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="rounded-full w-32 h-32 mb-4"
                />
              ) : (
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACUCAMAAABRNbASAAAAMFBMVEXk5ueutLeor7Lf4uPn6eqrsbXGysyxt7rZ3N3N0dPJzc/R1Na3vL+/xMbc3+C8wcSQLHgbAAADo0lEQVR4nO2bwbajIAxABYKAgP7/3z7UtlM7bYVgQhfcVXe9J0AIEIeh0+l0Op1Op9PpdDqdTucjAKBWtl+tZQ4kMT/GsLHEyQ4/4wfDPBmpxR0ttAxODT/gB+Cj+Gd2R4po29vZ8EZtD+AyN9WDeZFvzXY9Oap2euDN+6g99Ey74MUvYbvPvamNHSzfw3YL3tjCToUct2QXG8hluqWRjeyxyxrT+8gyu8V8t2TnOGMHvsQtwZlR1HkOOWIUn9xS6CY0W7orHtSE5AodFKslmLIduPLAJSyLnDIYN82TihEzbkVyuEH2vvUSOpYKoDTH3TH0asjlsEJ/qICAddMTtRtyrW5yC7UbeKxbglwOP+WEnKntigq5Fznysq6gAn6FPtOhF2tioZZDL9ZEIJZTFW7CUMvhp1yX+125ocKNXu6XV2tVniOv1Cu2L/rD61ixt3pit6qqhPxgbfErguEQga+E6Q/9UHyJ85Cjv6UDiz4aclxIYOXIU3ACkMlEeo4Tv0VGjkFtQNxrrjAcqVdwS8KQnwtvdoh7Jr5L4RkROba7figuTTTLUr3ZFQ4s6wMTFA4sw5b/bFd2Mcy0Uh92U34+0fx9Etm7GM++dSQ7dg3cEll2slHvC9iTzo003UKz3g2YT5o35Niyo+lr24sOjduZYJjM++jJ4No3goFyRuhj/LTWwbdXWwGw42KE1DtSh8XNP9PetzYaKuunMcZxdN7+RGPfE3Cgtc2DVUbN1js3brgUOjsPrR3Tn6fBTNNN7wtin3K3HyJEZ7fe1wZiMFg3BiHlxzy3LY04ecXsB4OPRnxo1nwxFCY4Nj+A2S1fAvbOUIa1d5hBzaY5hjgaGvINA9Sosfc4KX6RMHypCDmtkb7riYWoFAC1IIbzPwJB9NYBvUBNrH0Il0fP1Q3owe7ajrBUj6OXwVs9fdnKBRivNNv1wjV2GccYlJ67ws3n7FII5AWXOxVvXSfo6hbYjMb9Cru6pIJs5Mumwk6RLIVnKi6gqOO2grUjj9sK8qKn4sG8BMwDBfaJC0G5myfMIUfK25uxr28ou8JXYmynMg5ZdMNY0wOBQBe9E2Met6ooKFHK37ZqKXjimbndCl48877Tu9guO3DsavmhY9wbngh5laeqaZFDo/NaYvg2roNcVoczfx7ZkVlybdzyiuLi7wivkstoq8d8q3cNGR+aQGzklpNM8M17tWTU622y3MZ5ppuFbEVGp+6smnEu1+l0Oh02/gAcny7rcFMbgAAAAABJRU5ErkJggg=="
                  alt="Profile"
                  className="rounded-full w-32 h-32 mb-4"
                />
              )}
            </div>}
            {editField === "images" ? null : <Button onClick={() => handleChangeClick("images")}>Change Image</Button>}
          </div>
          <div>
            <h2>Account Information</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="border-2 border-black h-[70px] p-3 rounded box-border flex justify-between items-center">
              <div className="flex flex-col">
                First Name
                {editField === "firstName" ? (
                  <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("firstName")} />
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={() => handleChangeClick(null)}>Close</Button>
                  </form>
                ) : (
                  <span>{user.firstName}</span>
                )}
              </div>
              <div>
                {editField === "firstName" ? null : <Button onClick={() => handleChangeClick("firstName")}>Change</Button>}
              </div>
            </div>

            <div className="border-2 border-black h-[70px] p-3 rounded box-border flex justify-between items-center">
              <div className="flex flex-col">
                Last Name
                {editField === "lastName" ? (
                  <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("lastName")} />
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={() => handleChangeClick(null)}>Close</Button>
                  </form>
                ) : (
                  <span>{user.lastName}</span>
                )}
              </div>
              <div>
                {editField === "lastName" ? null : <Button onClick={() => handleChangeClick("lastName")}>Change</Button>}
              </div>
            </div>

            <div className="border-2 border-black h-[70px] p-3 rounded box-border flex justify-between items-center">
              <div className="flex flex-col">
                Email
                {editField === "email" ? (
                  <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("email")} />
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={() => handleChangeClick(null)}>Close</Button>
                  </form>
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
              <div>
                {editField === "email" ? null : <Button onClick={() => handleChangeClick("email")}>Change</Button>}
              </div>
            </div>

            <div className="border-2 border-black h-[70px] p-3 rounded box-border flex justify-between items-center">
              <div className="flex flex-col">
                Password
                {editField === "password" ? (
                  <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="password" {...register("password")} />
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={() => handleChangeClick(null)}>Close</Button>
                  </form>
                ) : (
                  <span>**********</span>
                )}
              </div>
              <div>
                {editField === "password" ? null : <Button onClick={() => handleChangeClick("password")}>Change</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-3 flex flex-col items-center justify-center">
            <div className="w-full max-w-[700px] mx-auto">
              <div className="p-5 space-y-2 bg-[#FAFAFA]">
              <div>
            <h2 className="text-left">Export Data</h2>
          </div>
          <div className="flex gap-3 justify-center">
            <div>
              <Button>
                via email
              </Button>
            </div>
            <div>
              <Button>
                via pdf
              </Button>
            </div>
          </div>
              </div>
            </div>
          </div>
    </div>
  );
}
