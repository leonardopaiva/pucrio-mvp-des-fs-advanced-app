import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { DATA_APPOINTMENTS } from './data-appointments';
import LocalStorageService from './services/LocalStorageService';
import { generateSyncQueueItems } from './services/SyncQueueMock';

/* Component to ask if the user wants to initialize some dummy data */
/* triggers if user have no appointment created */
/* DATA_APPOINTMENTS is the dummy data */
export default function DataConfirmInit() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  /*
    * Function to check if localStorage is empty and show the dialog
    * Open the dialog asking the user if they want to initialize dummy data
   */
  function checkDataInStorage() {

    const localStorageService = new LocalStorageService('appointments');
    const items = localStorageService.listItems();

    if (items.length > 0) return;

    setIsDataEmpty(true);
    setOpenDialog(true);

    console.log('isDataEmpty:', isDataEmpty);
  }

  /*
    * Function to initialize dummy data into localStorage
    * Adds the dummy data to localStorage
    * will reload app after finish
    * initialize sync queue too
    * also sets the list in sync-queue local storage
   */
  function initializeDummyData() {
    const localStorageService = new LocalStorageService('appointments');
    DATA_APPOINTMENTS.forEach(appointment => {
      localStorageService.addItem(appointment);
    });
    setOpenDialog(false);

    const syncItems = generateSyncQueueItems();
    localStorage.setItem('sync-queue', JSON.stringify(syncItems));

    window.location.reload();
  }

  /*
   * Check if there is data in localStorage when the component mounts
   */
  useEffect(() => {
    checkDataInStorage();
  }, []);

  return (
    <>
      {/* Conditionally show the dialog if localStorage is empty */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Inicializar Dados</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Não encontramos nenhuma consulta armazenada. Deseja inicializar com dados fictícios?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={initializeDummyData} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
