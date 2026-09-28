import { useRouteError } from "react-router";
import ErrorBanner from "../components/ErrorBanner";

export default function ErrorPage() {
  const error = useRouteError();

  let errorMessage;
  if (error === 404) {
    errorMessage = 'Repo not found — check the username and repo name and try again.';
  } else if (error === 403) {
    errorMessage = 'Rate limited by GitHub — try again after some time.';
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Something went wrong - try again after some time.';
  }

  return <ErrorBanner message={errorMessage} />;
}