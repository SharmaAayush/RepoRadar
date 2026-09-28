import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage";
import RepoDetailPage from "../pages/RepoDetailPage";
import ComparePage from "../pages/ComparePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import FavoritesPage from "../pages/FavoritesPage";
import NotFoundPage from "../pages/NotFoundPage";
import Layout from "../layouts/Layout";
import { repoLoader } from "../loaders/repoLoader";
import RepoDetailLayout from "../layouts/RepoDetailLayout";
import ErrorPage from "../pages/ErrorPage";
import { favoritesLoader } from "../loaders/favoritesLoader";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        Component: RepoDetailLayout,
        children: [
          {
            path: '/repo/:owner/:name',
            element: <RepoDetailPage />,
            loader: repoLoader,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: '/compare',
        element: <ComparePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/favorites',
        element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>,
        loader: favoritesLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ]
  },
]);