import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Tooltip, Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

const PREFERENCE_KEY = 'user-preferences';

interface UserPreferences {
  fontSize: number;
}

const defaultPreferences: UserPreferences = {
  fontSize: 19,
};

export function applyUserPreferences(): void {
  const storedPrefs = localStorage.getItem(PREFERENCE_KEY);
  if (storedPrefs) {
    try {
      const prefs: UserPreferences = JSON.parse(storedPrefs);
      document.documentElement.style.fontSize = `${prefs.fontSize}px`;
    } catch (error) {
      console.error('Error parsing user preferences', error);
      document.documentElement.style.fontSize = `${defaultPreferences.fontSize}px`;
    }
  } else {
    document.documentElement.style.fontSize = `${defaultPreferences.fontSize}px`;
  }
}

const UserPreferencesPanel: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const storedPrefs = localStorage.getItem(PREFERENCE_KEY);
    if (storedPrefs) {
      try {
        const parsed = JSON.parse(storedPrefs) as UserPreferences;
        setPreferences(parsed);
        document.documentElement.style.fontSize = `${parsed.fontSize}px`;
      } catch (error) {
        console.error('Error reading user preferences', error);
      }
    } else {
      document.documentElement.style.fontSize = `${defaultPreferences.fontSize}px`;
    }
  }, []);

  const savePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(newPrefs));
    document.documentElement.style.fontSize = `${newPrefs.fontSize}px`;
  };

  const handleDecrease = () => {
    const newFontSize = preferences.fontSize - 1;
    savePreferences({ ...preferences, fontSize: newFontSize });
  };

  const handleIncrease = () => {
    const newFontSize = preferences.fontSize + 1;
    savePreferences({ ...preferences, fontSize: newFontSize });
  };

  const handleReset = () => {
    savePreferences(defaultPreferences);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Diminuir tamanho do texto" arrow>
          <IconButton onClick={handleDecrease} color="inherit">
            <FormatSizeIcon />
            <RemoveIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="body1">
          Tamanho do Texto: {preferences.fontSize}px
        </Typography>
        <Tooltip title="Aumentar tamanho do texto" arrow>
          <IconButton onClick={handleIncrease} color="inherit">
            <FormatSizeIcon />
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Button variant="outlined" onClick={handleReset}>
        Reset para padrão
      </Button>
    </Box>
  );
};

export default UserPreferencesPanel;
