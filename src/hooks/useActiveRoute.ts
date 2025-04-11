import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppRouteInterface } from '../routes/AppRouteInterface';

interface UseActiveRouteReturn {
  activeRoutePath: string;
  filteredRoutes: AppRouteInterface[];
}

export default function useActiveRoute(routes: AppRouteInterface[]): UseActiveRouteReturn {
  const location = useLocation();
  const [activeRoutePath, setActiveRoutePath] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<AppRouteInterface[]>([]);

  useEffect(() => {
    let activePath = '';
    const updatedRoutes = routes.map((route) => {
      const locationSegment = location.pathname.split('/').pop();
      const routeSegment = route.path.split('/').pop();
      const isActive = locationSegment === routeSegment;
      if (isActive) activePath = route.path;
      return { ...route, active: isActive };
    });
    const filtered = updatedRoutes.filter((route) =>
      route.menuPosition.some((position) => position === 'main-menu' || position === 'responsive-menu')
    );
    setActiveRoutePath(activePath);
    setFilteredRoutes(filtered);
  }, [location, routes]);

  return { activeRoutePath, filteredRoutes };
}
