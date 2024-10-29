import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary mb-4">Oops!</h1>
      <p className="text-lg text-muted-foreground mb-2">
        Sorry, an unexpected error has occurred.
      </p>

      {isRouteErrorResponse(error) ? (
        <p className="text-xl text-secondary text-black">
          <i>{error.statusText || "Unknown error"}</i>
        </p>
      ) : (
        <p className="text-xl text-secondary text-black">
          <i>{(error as Error)?.message || "Unknown error"}</i>
        </p>
      )}

      <a
        href="/"
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90"
      >
        Go back home
      </a>
    </div>
  );
}
