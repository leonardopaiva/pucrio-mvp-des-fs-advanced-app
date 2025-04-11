import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import RetryIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useSyncQueue } from '../context/SyncQueueContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SyncQueueItem } from '../types/syncQueueItem';
import SyncQueueLocalStorageService from '../services/SyncQueueLocalStorageService';

const LOCAL_STORAGE_KEY = 'sync-queue';
const syncStorage = new SyncQueueLocalStorageService<SyncQueueItem>(LOCAL_STORAGE_KEY);

function getSyncStatusColor(syncStatus: string): string {
  switch (syncStatus) {
    case 'sync-needed':
      return 'orange';
    case 'sync-started':
      return 'blue';
    case 'sync-completed':
      return 'green';
    case 'sync-error':
      return 'red';
    default:
      return 'inherit';
  }
}

function getSyncIcon(syncStatus: string) {
  const color = getSyncStatusColor(syncStatus);
  switch (syncStatus) {
    case 'sync-needed':
      return <HourglassEmptyIcon style={{ color }} />;
    case 'sync-started':
      return <SyncIcon style={{ color }} />;
    case 'sync-completed':
      return <CheckCircleIcon style={{ color }} />;
    case 'sync-error':
      return <ErrorIcon style={{ color }} />;
    default:
      return null;
  }
}

const SyncQueueDisplay: React.FC = () => {
  const { queueItems, loading, refreshQueue } = useSyncQueue();

  const handleRetry = (item: SyncQueueItem) => {
    try {
      const items = syncStorage.listItems();
      const updatedItems = items.map(itemQueue => {
        if (itemQueue.id === item.id) {
          if (itemQueue.syncStatus === 'sync-completed') {
            return itemQueue;
          }
          return { ...itemQueue, syncStatus: 'sync-needed' as 'sync-needed' };
        }
        return itemQueue;
      });
      syncStorage.setItems(updatedItems);
      refreshQueue();
    } catch (err) {
      console.error('Error handling retry', err);
    }
  };

  const handleDeleteSyncItemFromLocalStorage = (item: SyncQueueItem) => {
    if (item.syncStatus !== 'sync-completed') {
      const confirmDelete = window.confirm(
        "Deseja realmente remover o item da fila? Ao fazer isso, o item continuará existindo na lista de consultas, mas deixará de ser enviado para a nuvem."
      );
      if (!confirmDelete) return;
    }
    try {
      const result = syncStorage.removeItem(item.id);
      if (!result.status) {
        console.error("Error removing item:", result.message);
      }
      refreshQueue();
    } catch (err) {
      console.error('Error handling delete', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Sincronização na nuvem</Typography>
      {loading && <CircularProgress size={24} />}
      <List>
        {queueItems.slice().reverse().map((item, index) => {
          const { name, date, location, doctor } = item.data || {};
          let formattedDate = '';
          if (date) {
            try {
              formattedDate = format(new Date(date), "MMMM dd, yyyy HH:mm", { locale: ptBR });
            } catch (error) {
              console.error("Error formatting date", error);
            }
          }
          return (
            <ListItem
              key={`sync-item-${index}`}
              divider
              sx={{
                position: 'relative',
                pl: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                '@media (max-width:440px)': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: -20,
                  top: '20px',
                  '@media (max-width:440px)': {
                    position: 'static',
                    mr: 1,
                  },
                }}
              >
                {getSyncIcon(item.syncStatus)}
              </Box>
              <Box
                sx={{
                  width: '85%',
                  marginRight: 2,
                  '@media (max-width:440px)': {
                    width: '100%',
                  },
                }}
              >
                <ListItemText
                  primary={`${name} (${formattedDate})`}
                  secondary={
                    <>
                      Doctor: {doctor} | Location: {location} | Status: {item.status} | Sync Status:{' '}
                      <span style={{ color: getSyncStatusColor(item.syncStatus) }}>
                        {item.syncStatus}
                      </span>
                    </>
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  '@media (max-width:440px)': {
                    alignSelf: 'flex-end',
                    mt: 1,
                  },
                }}
              >
                {item.syncStatus !== 'sync-completed' && (
                  <Tooltip title="Tentar novamente sincronizar item">
                    <IconButton onClick={() => handleRetry(item)} color="primary" size="small">
                      <RetryIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Remover item da fila (apenas do armazenamento local)">
                  <IconButton onClick={() => handleDeleteSyncItemFromLocalStorage(item)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SyncQueueDisplay;
