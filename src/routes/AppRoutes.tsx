import Layout from "@/components/layout/Layout";
import { NewsProvider } from "@/context/NewsProvider";
import ArticlePage from "@/pages/ArticlePage";
import Homepage from "@/pages/Homepage";
import NotFound from "@/pages/NotFound";
import Preferences from "@/pages/Preferences";
import Search from "@/pages/Search";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "search", element: <Search /> },
      { path: "preferences", element: <Preferences /> },
      { path: "article/:id", element: <ArticlePage /> },
    ],
  },
]);

const AppRoutes = () => (
  <NewsProvider>
    <RouterProvider router={router} />
  </NewsProvider>
);

export default AppRoutes;
