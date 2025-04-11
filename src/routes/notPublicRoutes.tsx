import { AppRouteInterface } from './AppRouteInterface';
import dashboardRoutes from './sections/dashboardRoutes';

const notPublicRoutes: AppRouteInterface[] = [
  ...dashboardRoutes
];

export default notPublicRoutes;