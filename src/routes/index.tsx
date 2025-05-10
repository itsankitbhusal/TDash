import Dashboard from "@/pages/Dashboard/index.tsx";
import Homepage from "@/pages/Homepage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default router;
