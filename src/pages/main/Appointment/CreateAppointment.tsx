import React, { useState } from 'react';
import { CssBaseline } from '@mui/material';
import PageContainer from '../../../components/PageContainer';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../../services/interfaces';
import { formatDateForInput } from '../../../util/functions';
import CopyAppointmentDialog from './CopyAppointmentDialog';
import { useAppointments } from '../../../context/AppointmentContext';
import SimpleSnackbar from '../../../mui-components/SimpleSnackbar';

const defaultValues: Appointment = {
  id: '',
  name: '',
  doctor: '',
  doctor_name: '',
  location: '',
  location_name: '',
  date: '',
  observation: '',
  img: '',
  tag: '',
  description: '',
  user_id: ''
};

interface ApiResponse {
  loading: boolean;
  message: string;
  data: any;
  status: number;
}

const CreateAppointment: React.FC = () => {
  const { appointments, createAppointment } = useAppointments();
  const [formValues, setFormValues] = useState<Appointment>(defaultValues);
  const [openCopyDialog, setOpenCopyDialog] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    loading: false,
    message: '',
    data: null,
    status: 0,
  });
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleSubmit = async (values: Appointment) => {
    const result = createAppointment(values);
    if (!result) {
      setApiResponse({
        loading: false,
        message: 'Falha ao criar consulta. Verifique os dados e tente novamente.',
        data: null,
        status: 500,
      });
      setOpenSnackbar(true);
      return;
    }
    setApiResponse({
      loading: false,
      message: 'Cadastro realizado com sucesso! Verifique a fila de sincronização para sincronizar com a nuvem.',
      data: null,
      status: 200,
    });
    setFormValues(defaultValues);
    setOpenSnackbar(true);
    // navigate('/appointments');
  };

  const handleReset = () => {
    setFormValues(defaultValues);
  };

  // Atualiza os valores do formulário com os dados copiados,
  // ajustando os campos doctor e location e formatando a data
  const handleCopyAppointment = (appointment: Appointment) => {
    setFormValues({
      ...appointment,
      doctor: appointment.doctor_name || '',
      location: appointment.location_name || '',
      date: formatDateForInput(appointment.date)
    });
  };

  const handleCopy = () => {
    setOpenCopyDialog(true);
  };

  return (
    <>
      <CssBaseline />
      <PageContainer>
        <AppointmentForm
          initialValues={formValues}
          mode="create"
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCopy={handleCopy}
        />
      </PageContainer>
      <CopyAppointmentDialog
        open={openCopyDialog}
        handleClose={() => setOpenCopyDialog(false)}
        appointmentList={appointments}
        handleCopyAppointment={handleCopyAppointment}
      />
      <SimpleSnackbar
        message={apiResponse.message}
        showSnackbar={openSnackbar}
        setShowSnackbar={setOpenSnackbar}
      />
    </>
  );
};

export default CreateAppointment;
