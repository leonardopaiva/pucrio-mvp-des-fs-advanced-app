import React, { useEffect, useState } from 'react';
import { CssBaseline, Button, Typography, Box } from '@mui/material';
import PageContainer from '../../../components/PageContainer';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../../services/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import CopyAppointmentDialog from './CopyAppointmentDialog';
import { Delete } from '@mui/icons-material';
import { useAppointments } from '../../../context/AppointmentContext';
import { formatDateForInput } from '../../../util/functions';
import SimpleSnackbar from '../../../mui-components/SimpleSnackbar';

const UpdateAppointment: React.FC = () => {
  const { id } = useParams();
  const { appointments, updateAppointment, deleteAppointment } = useAppointments();
  const [initialValues, setInitialValues] = useState<Appointment | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState({
    loading: false,
    message: '',
    data: null,
    status: 0,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const appointment = appointments.find(app => app.id === id);
      if (appointment) {
        setInitialValues({
          ...appointment,
          date: formatDateForInput(appointment.date)
        });
      }
    }
  }, [id, appointments]);

  const handleSubmit = async (values: Appointment) => {
    const result = updateAppointment(values);
    if (!result) {
      setApiResponse({
        loading: false,
        message: 'Falha ao atualizar consulta. Verifique os dados e tente novamente.',
        data: null,
        status: 500,
      });
      setOpenSnackbar(true);
      return;
    }
    setApiResponse({
      loading: false,
      message: 'Consulta atualizada com sucesso! Verifique a fila de sincronização para sincronizar com a nuvem.',
      data: null,
      status: 200,
    });
    setOpenSnackbar(true);
  };

  const handleReset = () => {
    if (id) {
      const appointment = appointments.find(app => app.id === id);
      if (appointment) {
        setInitialValues({
          ...appointment,
          date: formatDateForInput(appointment.date)
        });
      }
    }
  };

  const handleCopy = () => {
    setOpenCopyDialog(true);
  };

  const handleDelete = () => {
    if (id) {
      const confirmOption = window.confirm('Tem certeza de que deseja excluir esta consulta?');
      if (!confirmOption) return;
      deleteAppointment(id);
      navigate('/dashboard/appointments');
    }
  };

  if (!initialValues) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <CssBaseline />
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Atualizar consulta</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Deletar
          </Button>
        </Box>
        <AppointmentForm
          initialValues={initialValues}
          mode="update"
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCopy={handleCopy}
        />
      </PageContainer>
      <CopyAppointmentDialog
        open={openCopyDialog}
        handleClose={() => setOpenCopyDialog(false)}
        appointmentList={appointments}
        handleCopyAppointment={(appointment: Appointment) => {
          setInitialValues({
            ...appointment,
            date: formatDateForInput(appointment.date)
          });
          setOpenCopyDialog(false);
        }}
      />
      <SimpleSnackbar
        message={apiResponse.message}
        showSnackbar={openSnackbar}
        setShowSnackbar={setOpenSnackbar}
      />
    </>
  );
};

export default UpdateAppointment;
