// src/mui-components/AppBar/MobileMenu.tsx
import { Box, Drawer, IconButton, MenuItem, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface MobileMenuProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
  routes: { path: string; label: string; menuPosition: string[] }[];
  handleItemClick: (target: string) => void;
}

export default function MobileMenu({ open, toggleDrawer, routes, handleItemClick }: MobileMenuProps) {
  return (
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        {routes.map((route) =>
          route.menuPosition.includes('responsive-menu') && (
            <MenuItem key={route.path}>
              <Button
                component={Link}
                to={route.path}
                fullWidth
                onClick={() => {
                  handleItemClick(route.path);
                  // Close the mobile menu
                  toggleDrawer(false)();
                }}
              >
                {route.label}
              </Button>
            </MenuItem>
          )
        )}
        <Divider sx={{ my: 3 }} />
        {/* Additional mobile-specific items can go here */}
      </Box>
    </Drawer>
  );
}
