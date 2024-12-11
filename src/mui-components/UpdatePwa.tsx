import { Button, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const UpdatePwa = () => {
  const handleUpdateClick = () => {
    // Pergunta ao usuário se deseja atualizar a versão
    const userConfirmed = window.confirm('Deseja atualizar para a versão mais recente do app?');

    if (userConfirmed && navigator.serviceWorker) {
      // Chama registration.update() sem verificação
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.update(); // Força a atualização do service worker
          alert('O app está sendo atualizado!');
        })
        .catch((error) => {
          console.error('Erro ao tentar atualizar o PWA:', error);
        });
    }
  };

  return (
    <Tooltip title="Atualizar o app" arrow>
      <Button
        color="primary"
        variant="contained"
        onClick={handleUpdateClick}
        startIcon={<RefreshIcon />}
      >
        Atualizar
      </Button>
    </Tooltip>
  );
};

export default UpdatePwa;
