import { getUser } from "@/api/user/route";
import LoadingOverlay from "@/components/loading";
import { Button } from "@/components/ui/button";
import { User } from "@/types/types";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userSessionString = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");
  let userSession;

  // Check if the user session exists
  if (userSessionString) {
    try {
      // Parse the JSON string into an object
      userSession = JSON.parse(userSessionString);
    } catch (error) {
      console.error("Failed to parse user session:", error);
      window.location.href = '/';
      return null; // Prevent further rendering
    }
  } else {
    console.log("No user session found in local storage.");
    window.location.href = '/';
    return null; // Prevent further rendering
  }

  const userId = userSession?.data?.id;

  // If userId is not present, redirect to the homepage
  if (!userId) {
    window.location.href = '/';
    return null;
  }

  const { data, isError, isLoading } = useQuery(["getUser", userId], () => getUser(userId as string), {
    retry: false,
  });

  const user: User | undefined = data?.data;

  // Set userId in sessionStorage only if the user data is available
  if (user?.id) {
    sessionStorage.setItem("userId", user.id);
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError || !user) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
            <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
