import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppRouteInterface } from '../../routes/AppRouteInterface';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

interface DesktopMenuProps {
  routes: AppRouteInterface[];
  activeRoutePath: string;
}

export default function DesktopMenu({ routes, activeRoutePath }: DesktopMenuProps) {
  const theme = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        justifyContent: isLoggedIn ? 'flex-start' : 'flex-end',
      }}
    >
      {routes.map((route) =>
        route.menuPosition.includes('main-menu') && (
          <Button
            key={route.path}
            component={Link}
            to={route.path}
            variant={activeRoutePath === route.path ? 'outlined' : 'text'}
            color="info"
            sx={{
              minWidth: 0,
              fontSize: '1rem',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {route.label}
          </Button>
        )
      )}
    </Box>
  );
}
