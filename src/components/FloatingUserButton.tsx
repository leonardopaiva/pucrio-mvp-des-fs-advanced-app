import React, { useState, useEffect } from 'react';
import { IconButton, Avatar, Box, CircularProgress, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import SyncAndPreferencesModal from './SyncAndPreferencesModal';

const FloatingUserButton: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [isSyncing] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTooltipOpen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <Tooltip
          title="Ver preferências e Status da Sincronização na nuvem"
          open={tooltipOpen}
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          arrow
        >
          <IconButton
            onClick={handleButtonClick}
            sx={(theme) => ({
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? `${alpha(theme.palette.primary.main, 0.8)} !important`
                  : `${theme.palette.primary.main} !important`,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? `${alpha(theme.palette.primary.dark, 0.8)} !important`
                    : `${theme.palette.primary.dark} !important`,
              },
            })}
          >
            {isSyncing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Avatar sx={{ width: 40, height: 40 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : ''}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <SyncAndPreferencesModal open={openModal} onClose={handleCloseModal} />
    </>
  );
};

export default FloatingUserButton;
