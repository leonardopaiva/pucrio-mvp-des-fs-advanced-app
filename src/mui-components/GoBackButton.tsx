import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  /* Navega uma página para trás no histórico */
  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <IconButton
      edge="start"
      color="primary"
      onClick={handleGoBack}
      aria-label="voltar"
      sx={{ marginRight: 2 }} 
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default GoBackButton;