import { Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AdminLayout from "../layouts/admin-layout";
import MainLayout from "../layouts/main-layout";
import adminRoutes from "./sections/adminRoutes";
import authRoutes from "./sections/authRoutes";
import publicRoutes from "./publicRoutes";
import dashboardRoutes from './sections/dashboardRoutes';
import ProtectedIndex from './guards/ProtectedIndex';
import ProtectedRoute from './guards/ProtectedRoute';
import NotProtectedRoute from './guards/NotProtectedRoute';
import AuthLayout from '../layouts/auth-layout';

// Component that wraps all routes with the AuthProvider
const RootRoutes = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const appRoutes = [
  {
    path: "/",
    element: <RootRoutes />,  // Root that provides the authentication context for all routes
    children: [
      {
        index: true,
        element: <ProtectedIndex />,
      },
      {
        path: "login",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "register",
        element: <Navigate to="/auth/register" replace />,
      },
      {
        path: "confirm-signup",
        element: <Navigate to="/auth/confirm-signup" replace />,
      },
      {
        path: "dashboard/*",
        element: <MainLayout />,
        children: [
          {
            // ProtectedRoute is a guard that checks if a token exists in local storage;
            // if not found, it redirects the user to the login page.
            element: <ProtectedRoute />,
            children: dashboardRoutes,
          },
        ],
      },
      {
        element: <MainLayout />,
        children: publicRoutes,
      },
      {
        path: "admin/*",
        element: <AdminLayout />,
        children: adminRoutes,
      },
      {
        path: "auth/*",
        element: <AuthLayout />,
        children: [
          {
            // NotProtectedRoute is a guard that checks if a token exists in local storage;
            // if it finds one, it redirects the user to the dashboard.
            element: <NotProtectedRoute />,
            children: authRoutes,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default appRoutes;
