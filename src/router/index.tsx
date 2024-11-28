import Notfound from "@/components/common/notfound";
import QRS from "@/components/dev_only/qrs";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <QRS />,
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);
export default router;
