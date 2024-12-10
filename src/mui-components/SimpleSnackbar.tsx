import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';

interface SimpleSnackbarProps {
    message: string;
    showSnackbar: boolean; 
    setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SimpleSnackbar({message, showSnackbar, setShowSnackbar}: SimpleSnackbarProps) {
  const theme = useTheme(); 

  const handleClose = (
  ) => {
    setShowSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        sx={{
            backgroundColor: theme.palette.mode === 'light' ? '#efefef' : 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              color: theme.palette.mode === 'light' ? '#efefef' : '#333',
            },
          }}

      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={9000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={action}
      />
    </div>
  );
}