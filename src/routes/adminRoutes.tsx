import Dashboard from "../pages/admin/dashboard/Dashboard";
import Settings from "../pages/admin/settins/Settings";

const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];

export default adminRoutes;