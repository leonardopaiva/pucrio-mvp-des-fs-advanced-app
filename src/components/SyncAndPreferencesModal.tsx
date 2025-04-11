import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Avatar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import SyncQueueDisplay from './SyncQueueDisplay';
import { useSyncQueue } from '../context/SyncQueueContext';
import UserPreferencesPanel from './UserPreferencesPanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sync-tabpanel-${index}`}
      aria-labelledby={`sync-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `sync-tab-${index}`,
    'aria-controls': `sync-tabpanel-${index}`,
  };
}

interface SyncAndPreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

const SyncAndPreferencesModal: React.FC<SyncAndPreferencesModalProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const { loadQueue } = useSyncQueue();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (open) {
      loadQueue();
    }
  }, [open, loadQueue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabIndex(newValue);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : ''}
          </Avatar>
          <Typography variant="h6">{user?.name || 'User'}</Typography>
          <Button
            onClick={logout}
            color="primary"
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="sync and preferences tabs">
          <Tab label="Salvamento na nuvem" {...a11yProps(0)} />
          <Tab label="Preferências" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <Typography variant="body1">
            Aqui você poderá ver os itens pendentes de sincronização e receber feedback dos já sincronizados.
          </Typography>
          <SyncQueueDisplay />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Ajuste as preferências do usuário:
          </Typography>
          <UserPreferencesPanel />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default SyncAndPreferencesModal;
