import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Appointment } from '../../../services/interfaces';

interface CopyAppointmentDialogProps {
  open: boolean;
  handleClose: () => void;
  appointmentList: Appointment[];
  handleCopyAppointment: (appointment: Appointment) => void;
}

/*
  CopyAppointmentDialog
  Feature that will copy on appointment and fill the new appointment form
  with the data
*/
export default function CopyAppointmentDialog({ open, handleClose, appointmentList, handleCopyAppointment }: CopyAppointmentDialogProps) {
  const handleCopy = (appointment: Appointment) => {
    handleCopyAppointment(appointment);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Copy Appointment</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Clique no botão copiar da consulta listada, ao fazer isso, o conteúdo do formulário será substituído pelo da consulta selecionada.
        </DialogContentText>

        {appointmentList && appointmentList.length > 0 ? (
          <ul>
            {appointmentList.map((appointment: Appointment, index) => (
              <li key={index} className="appointment-item">
                <span>{appointment.name}</span>
                <button onClick={() => handleCopy(appointment)} className="copy-button">
                  Copiar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem consultas disponíveis.</p>
        )}


      </DialogContent>
      {/* <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
