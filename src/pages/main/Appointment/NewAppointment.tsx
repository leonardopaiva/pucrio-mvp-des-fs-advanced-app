import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CopyAppointmentDialog from './CopyAppointmentDialog';
import AppTheme from '../../../shared-theme/AppTheme';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Appointment } from '../../../services/interfaces';
import { ApiResponse } from '../../../services/api-response.type';
import { generateUniqueId } from '../../../util/functions';
import LocalStorageService from '../../../services/LocalStorageService';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import GoBackButton from '../../../mui-components/GoBackButton';

import { Delete } from '@mui/icons-material';
import { AppointmentService } from '../../../services/AppointmentService';
import SimpleSnackbar from '../../../mui-components/SimpleSnackbar';

const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  padding: theme.spacing(4),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const validateField = (value: string, field: string) => {
  switch (field) {
    case 'name':
      return value ? '' : 'Nome inválido!';
    case 'doctor':
      return value ? '' : 'Nome do médico inválido!';
    case 'location':
      return value ? '' : 'Localização inválida!';
    case 'date':
      return value ? '' : 'Data inválida!';
    case 'observation':
      return value ? '' : 'Observação inválida!';
    default:
      return '';
  }
};

const defaultContent = {
  title: 'Cadastrar Consulta',
  mode: 'create',
  form: {} as Appointment
}

type FormErrors = {
  name?: string;   
  doctor?: string;
  location?: string;
  date?: string;
  observation?: string;
};

export default function NewAppointment(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const backgroundColor = theme.palette.mode == 'light' ? '#fff' : '#000'; 

  const appointmentService = new AppointmentService();
  const appointmentLocalStorage = new LocalStorageService<Appointment>('appointments');

  const { id } = useParams();

  const [content, setContent] = useState<{title: string, mode: string, form: Appointment}>(defaultContent);

  const [appointment, setAppointment] = useState<Appointment>({} as Appointment);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const [errors, setErrors] = React.useState<FormErrors>({
    name: '',
    doctor: '',
    location: '',
    date: '',
    observation: '',
  });

  const [open, setOpen] = React.useState(false);

  const [apiResponse, setApiResponse] = React.useState<ApiResponse>({
    loading: false,
    message: '',
    data: null,
    status: 0,
  });

  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);

  /* get appointments */
  /* all request are just fake request, the important is the catch */
  React.useEffect(() => {
    axios.get('http://127.0.0.1:5000/appointsments')
      .then(res => setAppointmentList(res.data.appointsments))
      .catch(() => {
        const items = appointmentLocalStorage.listItems();
        setAppointmentList(items);
      })
  }, [])

  /* get apoointment by id, necessary to enable update mode */
  React.useEffect(() => {
    if (!id) setContent(defaultContent);
    else {
      axios.get(`http://127.0.0.1:5000/appointment/${id}`)
        .then(res => setAppointment(res.data.appointment))
        .catch(() => {
            const appointment = appointmentLocalStorage.findItemById(id) as Appointment;
            setContent({
              title: 'Atualizar consulta',
              mode: 'update',
              form: appointment
            });
        })
    }
  }, [id])

  const handleClickOpen = () => {
    console.log(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* will clear all input values reseting the form and navigate to new appointment */
  const resetForm = () => {
    setContent({
      ...content,
      form: {
        ...{} as Appointment, 
      },
    });
    navigate('/appointment/new-appointment'); 
  };


  /* will validate empty fields and give feedback close to the input */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setContent((prevContent) => ({
      ...prevContent,
      form: {
        ...prevContent.form,
        [field]: e.target.value,
      },
    }));

    
    const value = e.target.value;
    const errorMessage = validateField(value, field);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));
  };


  async function sendDelete () {
    const requestData = {} as Appointment;
    requestData.id = id as string;

    if (!requestData.id) return alert('Item inválido!');

    const confirmDelete = window.confirm('Você tem certeza que deseja excluir esta consulta?');
    if (!confirmDelete) return;

    setApiResponse({ loading: true, message: 'Enviando dados...', data: null, status: 0 });
    setOpenSnackbar(true);

    await appointmentService.sendHttp('delete', requestData, onSendSuccess, onDeleteError)

  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;
    const fields = ['name', 'doctor', 'location', 'date', 'observation'];

    /* check erros on any field */
    const updatedErrors: any = {};
    fields.forEach((field) => {
      const inputValue = (document.getElementById(field) as HTMLInputElement).value;
      const errorMessage = validateField(inputValue, field);
      if (errorMessage) {
        updatedErrors[field] = errorMessage;
        isValid = false;
      } else {
        updatedErrors[field] = '';
      }
    });

    // Update error state
    setErrors(updatedErrors);

    if (!isValid) return console.log('Formulário inválido!');
      
    const data = new FormData(event.currentTarget);
    const requestData = {
      id: (id) ? id : generateUniqueId(),
      name: data.get('name'),
      doctor: data.get('doctor'),
      location: data.get('location'),
      date: data.get('date'),
      observation: data.get('observation'),
      img: '',
      tag: '',
      description: ''
    } as Appointment;

    /* after validations will submit the form */
    submitForm(requestData);
    
  };
  
  /*
    onSendSuccess is just a dummy function, the code will never
    be success, because theres no backend right now
  */
  const onSendSuccess = function (apiResponse: ApiResponse) {
    setApiResponse({
      loading: false,
      message: apiResponse.message,
      data: apiResponse.data,
      status: apiResponse.status,
    });
  }
  
  /*
    onCreateError will save data on localstorage
  */
  const onCreateError = function (apiResponse: ApiResponse) {
    let localStorageResponse = {status: false, message: 'Um erro ocorreu!'};
    localStorageResponse = appointmentLocalStorage.addItem(apiResponse.data as Appointment);

    let message = 'Os dados foram salvos localmente. No entanto, não conseguimos salvar na nuvem neste momento';
    
    if (localStorageResponse.status === false) {
      setOpenSnackbar(false);
      alert(`Um erro ocorreu ${localStorageResponse.message}`);
      message = '';
    } else {
      setOpenSnackbar(true);
    }

    setApiResponse({
      loading: false,
      message: message,
      data: null,
      status: 500,
    });

  }

  /* updates data on localstorage */
  const onUpdateError = function (apiResponse: ApiResponse) {
    let localStorageResponse = {status: false, message: 'Um erro ocorreu!'};
    let data = apiResponse.data as Appointment;

    localStorageResponse = appointmentLocalStorage.updateItem(data.id, data);

    let message = 'Os dados foram salvos localmente. No entanto, não conseguimos salvar na nuvem neste momento';
    if (localStorageResponse.status === false) 
      message = `Um erro ocorreu ${localStorageResponse.message}`;

    if (localStorageResponse.status === false) {
      setOpenSnackbar(false);
      alert(`Um erro ocorreu ${localStorageResponse.message}`);
      message = '';
    } else {
      setOpenSnackbar(true);
    }

    setApiResponse({
      loading: false,
      message: message,
      data: null,
      status: 500,
    });

  }

  /* deletes data from localstorage */
  const onDeleteError = function () {
    let localStorageResponse = {status: false, message: 'Um erro ocorreu!'};
    localStorageResponse = appointmentLocalStorage.removeItem(id as string);

    let message = 'Item removido localmente. No entanto, não conseguimos salvar na nuvem neste momento';
    if (localStorageResponse.status === false) 
      message = `Um erro ocorreu ${localStorageResponse.message}`;

    setApiResponse({
      loading: false,
      message: message,
      data: null,
      status: 500,
    });

    setOpenSnackbar(true);

    resetForm();

  }

  /* 
    The feature copy data will copy one appointment and fill
    the form with the data
  */
  const handleCopyAppointment = (appointment: Appointment) => {
    setContent({
      ...content,
      form: {
        ...appointment, 
      },
    });
  };


  /* 
    after validations this function will make the api call
    will check mode 'create' or 'update' then make the fake
    request, so the errorFunctions onCreateError and 
    onUpdateError will make the create or update
  */
  const submitForm = async (requestData: Appointment) => {
    try {
      
      setApiResponse({ loading: true, message: 'Enviando dados...', data: null, status: 0 });
      setOpenSnackbar(true);

      if (content.mode === 'create')
        await appointmentService.sendHttp('create', requestData, onSendSuccess, onCreateError)
      else
        await appointmentService.sendHttp('update', requestData, onSendSuccess, onUpdateError)

    } catch (error) {
      console.log('Erro em submitForm: ', error);
    }
  };



  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', lineHeight: '2.5rem' }}
            >
              {id && <GoBackButton />} {content.title} 
            </Typography>
              {/* delete button */}
              {content.mode === 'update' && id && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => {
                    sendDelete();
                  }}
                  sx={{
                    alignSelf: 'center',
                    ml: 2,
                    borderColor: 'error.dark', 
                    color: {backgroundColor},
                    '&:hover': {
                      borderColor: 'error.light',
                    }
                  }}
                >
                  Deletar
                </Button>
              )}
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <Grid
              container
              sx={{
                mt: {
                  xs: 4,
                  sm: 0,
                },
                backgroundColor: 'background.paper',
                pb: 4,
              }}
            >
              {/* name */}
              <Grid
                size={{ xs: 12, sm: 12, lg: 4 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  borderRight: { sm: 'none', md: '1px solid' },
                  borderColor: { sm: 'none', md: 'divider' },
                  alignItems: 'start',
                  pt: 4,
                  px: 2,
                  gap: 4,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">Nome</FormLabel>
                  <TextField
                    error={!!errors.name}
                    helperText={errors.name}
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nome da consulta"
                    autoComplete="name"
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.name ? 'error' : 'primary'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'name')}
                    value={content.form?.name || ''}
                  />
                </FormControl>
              </Grid>

              {/* doctor */}
              <Grid
                size={{ xs: 12, sm: 12, lg: 4 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  borderRight: { sm: 'none', md: '1px solid' },
                  borderColor: { sm: 'none', md: 'divider' },
                  alignItems: 'start',
                  pt: 4,
                  px: 2,
                  gap: 4,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="doctor">Médico</FormLabel>
                  <TextField
                    error={!!errors.doctor}
                    helperText={errors.doctor}
                    id="doctor"
                    type="text"
                    name="doctor"
                    placeholder="Nome do médico"
                    autoComplete="doctor"
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.doctor ? 'error' : 'primary'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'doctor')}
                    value={content.form?.doctor || ''}
                  />
                </FormControl>
              </Grid>

              {/* location */}
              <Grid
                size={{ xs: 12, sm: 12, lg: 4 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  borderRight: { sm: 'none', md: '1px solid' },
                  borderColor: { sm: 'none', md: 'divider' },
                  alignItems: 'start',
                  pt: 4,
                  px: 2,
                  gap: 4,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="location">Localização</FormLabel>
                  <TextField
                    error={!!errors.location}
                    helperText={errors.location}
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Digite o endereço"
                    autoComplete="location"
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.location ? 'error' : 'primary'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'location')}
                    value={content.form?.location || ''}
                  />
                </FormControl>
              </Grid>

              {/* date */}
              <Grid
                size={{ xs: 12, sm: 12, lg: 4 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  borderRight: { sm: 'none', md: '1px solid' },
                  borderColor: { sm: 'none', md: 'divider' },
                  alignItems: 'start',
                  pt: 4,
                  px: 2,
                  gap: 4,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="date">Data</FormLabel>
                  <TextField
                    error={!!errors.date}
                    helperText={errors.date}
                    id="date"
                    type="datetime-local"
                    name="date"
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.date ? 'error' : 'primary'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'date')}
                    value={content.form?.date || ''}
                  />
                </FormControl>
              </Grid>

              {/* observation */}
              <Grid
                size={{ xs: 12, sm: 12, lg: 4 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  borderRight: { sm: 'none', md: '1px solid' },
                  borderColor: { sm: 'none', md: 'divider' },
                  alignItems: 'start',
                  pt: 4,
                  px: 2,
                  gap: 4,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="observation">Observação</FormLabel>
                  <TextField
                    error={!!errors.observation}
                    helperText={errors.observation}
                    id="observation"
                    type="text"
                    name="observation"
                    placeholder="Observações sobre a consulta"
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.observation ? 'error' : 'primary'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'observation')}
                    value={content.form?.observation || ''}
                  />
                </FormControl>
              </Grid>
              
            </Grid>

            <Grid container >

              <Grid
                size={{ xs: 12, sm: 12, lg: 12 }}
                sx={{
                  display: { xs: 'flex', md: 'flex' },
                  flexDirection: 'column',
                  textAlign: 'center',
                  margin: '30px auto 0 auto'
                }}
              >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={apiResponse.loading}
                    sx={{ 
                      position: 'relative', 
                      mb: 1 
                    }}

                  >
                    {apiResponse.loading && (
                      <CircularProgress size={24} sx={
                        { 
                          position: 'absolute', 
                          top: '15%', 
                          left: {xs: '70%', sm: '60%', lg: '55%'}, 
                          transform: 'translate(-50%, -50%)', 
                          color: backgroundColor 
                        }} />
                    )}
                    <span style={{ color: apiResponse.loading ? backgroundColor : 'inherit' }}>
                      {apiResponse.loading ? 'Carregando...' : 'Enviar'}
                    </span>
                  </Button>

                    
                  {
                  /*
                    CopyAppointmentDialog: 
                    copy appointment feature, will fill the form with 
                    another appointment data.
                  */
                  }
                  <CopyAppointmentDialog 
                    open={open} 
                    handleClose={handleClose} 
                    appointmentList={appointmentList}
                    handleCopyAppointment={handleCopyAppointment}
                  />
                  <div>
                    <Link
                      component="button"
                      type="button"
                      onClick={resetForm}
                      variant="body2"
                      sx={{ alignSelf: 'center' }}
                    >
                      Limpar formulário
                    </Link> &nbsp; ou &nbsp;
                    <Link
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                      >
                        Copiar uma consulta da lista
                      </Link>
                  </div>
                  
              </Grid>

            </Grid>
            
          </Box>
        </Card>
      </SignInContainer>
      <SimpleSnackbar 
        message={apiResponse.message}
        showSnackbar={openSnackbar} 
        setShowSnackbar={setOpenSnackbar} />
      <Box sx={{ display: { xs: 'none', sm: 'block' }, height: '150px' }}></Box>
    </AppTheme>
  );
}