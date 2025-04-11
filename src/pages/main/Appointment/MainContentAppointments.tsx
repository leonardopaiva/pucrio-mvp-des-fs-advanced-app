import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { Fab, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppGlobalStatesService from '../../../services/AppGlobalStatesService';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAppointments } from '../../../context/AppointmentContext';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'default',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function CardFooter({ doctor, date }: { doctor: string, date: string }) {
  const formattedDate = format(new Date(date), "MMMM dd, yyyy HH:mm", { locale: ptBR });
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        <AvatarGroup max={3}>
          <Avatar alt={doctor} src={doctor} sx={{ width: 24, height: 24 }} />
        </AvatarGroup>
        <Typography variant="caption">Doutor: {doctor}</Typography>
      </Box>
      <Typography variant="caption" sx={{ fontSize: '1.7rem', lineHeight: '1.9rem', textAlign: 'right' }}>
        {formattedDate}
      </Typography>
    </Box>
  );
}

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{ 'aria-label': 'search' }}
      />
    </FormControl>
  );
}

export default function MainContentAppointments() {
  const { appointments, loading, deleteAppointment } = useAppointments();
  const navigate = useNavigate();
  const exampleGlobalState = AppGlobalStatesService.getExampleGlobalState();

  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  const handleFocus = (index: number) => { setFocusedCardIndex(index); };
  const handleBlur = () => { setFocusedCardIndex(null); };
  const handleEdit = (id: string) => { navigate(`/dashboard/appointments/update/${id}`); };

  const confirmDelete = async (id: string) => {
    const confirmOption = window.confirm('Tem certeza de que deseja excluir esta consulta?');
    if (!confirmOption) return;
    deleteAppointment(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: '15px' }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Consultas
          {exampleGlobalState && (
            <Tooltip title="Like">
              <ThumbUpIcon />
            </Tooltip>
          )}
        </Typography>
        <Typography>Cadastre suas consultas e visualize-as em um calendário ou lista.</Typography>
      </div>
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Grid container spacing={2} columns={12}>
          {appointments.map(item => (
            <Grid key={item.id} size={{ xs: 12, md: 4 }}>
              <SyledCard
                variant="outlined"
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
              >
                <SyledCardContent>
                  <Typography gutterBottom variant="caption" component="div">
                    {item.tag}
                  </Typography>
                  <Link to={{ pathname: `/dashboard/appointments/update/${item.id}` } as any} style={{ textDecoration: 'none' }}>
                    <Typography color="primary" gutterBottom variant="h6" component="h2" sx={{ paddingRight: '80px' }}>
                      {item.name}
                    </Typography>
                  </Link>
                  <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {item.observation}
                  </StyledTypography>
                </SyledCardContent>
                <CardFooter doctor={item.doctor_name} date={item.date as string} />
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  <Fab
                    size="small"
                    aria-label="edit"
                    onClick={() => handleEdit(item.id)}
                    sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid', borderColor: 'none' }}
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    size="small"
                    aria-label="delete"
                    onClick={() => confirmDelete(item.id)}
                    sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid', borderColor: 'none' }}
                  >
                    <DeleteIcon />
                  </Fab>
                </Box>
              </SyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
