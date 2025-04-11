import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

interface ActionButtonProps {
  to: string;
  onClick: () => void;
  label?: string;
  fullWidth?: boolean;
}

export default function ActionButton({
  to,
  onClick,
  label = 'Action +',
  fullWidth = false,
}: ActionButtonProps) {
  return (
    <Link
      to={to}
      style={{ textDecoration: 'none', width: fullWidth ? '100%' : 'auto' }}
      onClick={onClick}
    >
      <Button
        color="primary"
        variant="outlined"
        size="small"
        fullWidth={fullWidth}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === 'dark'
              ? `${theme.palette.primary.contrastText} !important`
              : `${theme.palette.primary.contrastText} !important`,
          borderColor:
            theme.palette.mode === 'dark'
              ? `${alpha(theme.palette.primary.dark, 0.8)} !important`
              : `${theme.palette.primary.dark} !important`,
          color:
            theme.palette.mode === 'dark'
              ? `${alpha(theme.palette.primary.dark, 0.8)} !important`
              : `${theme.palette.primary.dark} !important`,
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? `${alpha(theme.palette.primary.dark, 0.8)} !important`
                : `${theme.palette.primary.dark} !important`,
            borderColor:
              theme.palette.mode === 'dark'
                ? `${theme.palette.primary.contrastText} !important`
                : `${theme.palette.primary.contrastText} !important`,
            color:
              theme.palette.mode === 'dark'
                ? `${theme.palette.primary.contrastText} !important`
                : `${theme.palette.primary.contrastText} !important`,
          },
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 'bold',
        })}
      >
        {label}
      </Button>
    </Link>
  );
}
