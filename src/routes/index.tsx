import Dashboard from "@/pages/Dashboard/index.tsx";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <>Hello to react app</>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default router;
