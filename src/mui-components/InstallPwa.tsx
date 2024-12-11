import { Tooltip, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';

/*
  InstallButton
  feature that will ask the users for the PWA instalation
*/
export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  function checkIfAppIsInstalled(): void {
    if (!window.matchMedia('(display-mode: standalone)').matches) return;
    setIsInstalled(true);
  }

  useEffect(() => {
    checkIfAppIsInstalled();

    const handler = (e: any): void => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  function handleInstallClick(): void {
    if (isInstalled) return window.alert('O aplicativo já está instalado!');
    // if (!deferredPrompt) return window.alert('Parece que o seu navegador não suporta a instalação do PWA ou ele já está instalado.');

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA.');
      } else {
        console.log('Usuário rejeitou a instalação do PWA.');
      }
      setDeferredPrompt(null);
    });
  }

  return (
    <Tooltip title="Instalar Web APP / PWA" arrow>
      <Button
        color="inherit"
        size="small"
        variant="outlined"
        aria-label="Instalar PWA"
        sx={{ alignSelf: 'center' }}
        onClick={handleInstallClick}
      >
        <AddToHomeScreenIcon />
        Instalar
      </Button>
    </Tooltip>
  );
};
