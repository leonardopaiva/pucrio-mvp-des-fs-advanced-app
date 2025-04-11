import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import ConfirmSignUpPage from '../../pages/auth/ConfirmSignUpPage';
import { AppRouteInterface } from '../AppRouteInterface';


const authRoutes: AppRouteInterface[] = [
  {
    path: "login",
    element: <LoginPage />,
    label: 'Login',
    menuPosition: ['main-menu', 'responsive-menu']
  },
  {
    path: "register",
    element: <RegisterPage />,
    label: 'Cadastrar',
    menuPosition: ['main-menu', 'responsive-menu']
  },
  {
    path: "confirm-signup",
    element: <ConfirmSignUpPage />,
    label: 'Confirmar Cadastro',
    menuPosition: ['main-menu', 'responsive-menu']
  }
];

export default authRoutes;