import { useState, useEffect } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Container, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sitemark from '../SitemarkIcon';
import { Link, useNavigate } from 'react-router-dom';
import { scrollToTop, smoothScrollToTopWithBounce } from '../../util/animate-scroll';
import AppGlobalStatesService from '../../services/AppGlobalStatesService';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Tooltip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import ActionButton from '../../components/ActionButton';
import { AppRouteInterface } from '../../routes/AppRouteInterface';
import authRoutes from '../../routes/sections/authRoutes';
import dashboardRoutes from '../../routes/sections/dashboardRoutes';
import publicRoutes from '../../routes/publicRoutes';
import useActiveRoute from '../../hooks/useActiveRoute';
import notPublicRoutes from '../../routes/notPublicRoutes';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

export default function MainAppBar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const newActionUrl = "appointments/new-appointment";

  // Inicializa as rotas de acordo com a autenticação
  const [routes, setRoutes] = useState<AppRouteInterface[]>(isLoggedIn ? notPublicRoutes : publicRoutes);
  const navigate = useNavigate();
  const theme = useTheme();
  const exampleGlobalState = AppGlobalStatesService.getExampleGlobalState();

  const { activeRoutePath, filteredRoutes } = useActiveRoute(routes);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  function handleItemClick(target: string = '') {
    if (target === activeRoutePath) {
      smoothScrollToTopWithBounce();
    } else {
      navigate(target);
    }
  }

  useEffect(() => {
    // Atualiza as rotas baseadas no estado de autenticação
    setRoutes(isLoggedIn ? dashboardRoutes : authRoutes);
  }, [isLoggedIn]);

  useEffect(() => {
    scrollToTop();
  }, [activeRoutePath]);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link to={'/appointment'} onClick={() => handleItemClick('/appointment')}>
              <Sitemark color={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark} />
            </Link>
            <DesktopMenu routes={filteredRoutes} activeRoutePath={activeRoutePath} />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {exampleGlobalState && (
              <Tooltip title="Like">
                <ThumbUpIcon />
              </Tooltip>
            )}
            {isLoggedIn && (
              <ActionButton
                to={newActionUrl}
                onClick={() => handleItemClick(newActionUrl)}
                label="Cadastrar +"
              />
            )}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {isLoggedIn && (
              <ActionButton
                to={newActionUrl}
                onClick={() => handleItemClick(newActionUrl)}
                label="Cadastrar +"
              />
            )}
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <MobileMenu
              open={open}
              toggleDrawer={toggleDrawer}
              routes={filteredRoutes}
              handleItemClick={handleItemClick}
            />
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
