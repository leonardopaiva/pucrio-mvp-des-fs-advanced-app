import { AppRouteInterface } from './AppRouteInterface';
import authRoutes from './sections/authRoutes';

const publicRoutes: AppRouteInterface[] = [
  ...authRoutes
];

export default publicRoutes;