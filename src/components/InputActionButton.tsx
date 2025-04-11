import { Button, ButtonProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface InputActionButtonProps extends ButtonProps {
  label?: string;
}

export default function InputActionButton({
  label = 'Action +',
  ...rest
}: InputActionButtonProps) {
  return (
    <Button
      type="submit"
      color="primary"
      variant="outlined"
      size="small"
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
              ? `${theme.palette.primary.dark} !important`
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
      {...rest}
    >
      {label}
    </Button>
  );
}
