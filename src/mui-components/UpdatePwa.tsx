import { Button, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const UpdatePwa = () => {
  const handleUpdateClick = () => {
    const userConfirmed = window.confirm('Deseja atualizar para a versão mais recente do app?');

    if (userConfirmed && navigator.serviceWorker) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.update().then(() => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Erro ao tentar atualizar o PWA:', error);
        });
    }
  };

  return (
    <Tooltip title="Atualizar o app" arrow>
      <Button
        color="inherit"
        size="small"
        variant="outlined"
        aria-label="Atualizar o app"
        onClick={handleUpdateClick}
        sx={{ alignSelf: 'center' }}
        startIcon={<RefreshIcon />}
      />
    </Tooltip>
  );
};

export default UpdatePwa;
