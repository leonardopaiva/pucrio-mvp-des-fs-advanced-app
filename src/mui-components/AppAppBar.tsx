import * as React from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Sitemark from './SitemarkIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../util/body-size';
import publicRoutes, { AppRoute } from '../routes/publicRoutes';
import { useEffect, useState } from 'react';
import { scrollToTop, smoothScrollToTopWithBounce } from '../util/animate-scroll';
import AppGlobalStatesService from '../services/AppGlobalStatesService';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Tooltip } from '@mui/material';



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


// const StyledToolbar = styled(Toolbar)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   flexShrink: 0,
//   borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
//   backdropFilter: 'blur(24px)',
//   border: '1px solid',
//   borderColor: (theme.vars || theme).palette.divider,
//   backgroundColor: theme.vars
//     ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
//     : alpha(theme.palette.background.default, 0.4),
//   boxShadow: (theme.vars || theme).shadows[1],
//   padding: '8px 12px',
// }));

/* 
  AppAppBar
  this is the APP Header, includes desktop and mobile version.
  will set menu active item based on url 
  set some colors based on theme
  animate the scroll based on scroll position
*/

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [routes, setRoutes] = useState(publicRoutes as AppRoute[]);
  const [activeRoute, setActiveRoute] = useState({} as AppRoute);
  const [filteredRoutes, setFilteredRoutes] = useState([] as AppRoute[]); 
  const [isAnimating, setIsAnimating] = useState(false);

  const location = useLocation();

  const theme = useTheme();
  const navigate = useNavigate();

  const exampleGlobalState = AppGlobalStatesService.getExampleGlobalState();

  const iconColor = theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark;


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  /* 
    animate the scroll based on scroll position
    this is a UX feature, to force scroll to top after
    changing route
  */
  function handleItemClick(target:string = '') {
    if (isAnimating) return; 

    if (activeRoute.path === target) { 
      setIsAnimating(true); 
      smoothScrollToTopWithBounce();
      setTimeout(() => {
        setIsAnimating(false); 
      }, 300)
    }
    else 
      navigate(target);
  }


  useEffect(() => {
    let itemActiveRoute = {} as AppRoute;

    const updatedRoutes = routes.map(route => {
      const isActive = location.pathname === route.path;

      if (isActive) itemActiveRoute = route;

      return {
        ...route,
        active: isActive,
      };
    });


    let filteredRoutesContent = [] as AppRoute[];
    filteredRoutesContent = updatedRoutes.filter(route =>
      route.menuPosition.some(position =>
        position === 'main-menu' || position === 'responsive-menu'
      )
    );

    setActiveRoute(itemActiveRoute);
    setFilteredRoutes(filteredRoutesContent);
    setRoutes(updatedRoutes);

    scrollToTop();
  }, [location]); 

  // useEffect(() => {
  // }, [exampleGlobalState]);
  

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
            <Link to={'appointment'} onClick={() => {
                handleItemClick('/appointment')
              }}>
              <Sitemark color={iconColor}/>
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {filteredRoutes.map((route) => (
                route.menuPosition.includes('main-menu') && (
                  <Button
                    key={route.path}
                    component={Link}
                    to={route.path}
                    variant={route.active ? 'outlined' : 'text'}
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
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {/* <Button color="primary" variant="text" size="small">
              Sign in
            </Button> */}
            {exampleGlobalState && (
                <Tooltip title="Like">
                  <ThumbUpIcon />
                </Tooltip>
              )}
            <Link 
              to="/appointment/new-appointment" 
              style={{ textDecoration: 'none' }}
              onClick={() => {
                handleItemClick('/appointment/new-appointment')
              }}
              >
              <Button color="primary" variant="contained" size="small" >
                Cadastrar +
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <Link 
              to="/appointment/new-appointment" 
              style={{ textDecoration: 'none' }}
              onClick={() => {
                handleItemClick('/appointment/new-appointment')
              }}
              >
              <Button color="primary" variant="contained" size="small" >
                Cadastrar +
              </Button>
            </Link>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* RESPONSIVE MENU ITEMS */ }
                {filteredRoutes.map((route) => (
                  route.menuPosition.includes('responsive-menu') && (
                    <MenuItem key={route.path}>
                      <Button component={Link} to={route.path} fullWidth>
                        {route.label}
                      </Button>
                    </MenuItem>
                  )
                ))}
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Link to="/appointment/new-appointment" style={{ textDecoration: 'none', width: '100%' }} >
                    <Button color="primary" variant="contained" size="small" fullWidth>
                      Cadastrar Consulta
                    </Button>
                  </Link>
                </MenuItem>

                {/* <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem> */}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
