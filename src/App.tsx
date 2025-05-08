import { RouterProvider } from "react-router";
import router from "@/routes/index.tsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
