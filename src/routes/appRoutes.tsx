import AdminLayout from "../layouts/admin-layout";
import MainLayout from "../layouts/main-layout";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";

const appRoutes = [
  {
    path: "/",
    element: <MainLayout />, 
    children: publicRoutes, 
  },
  {
    path: "/admin",
    element: <AdminLayout />, 
    children: adminRoutes,
  },
];

export default appRoutes;