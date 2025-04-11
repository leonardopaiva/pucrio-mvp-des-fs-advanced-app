import { useState } from 'react';
import { Typography, Box, Button, Paper, Tooltip, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PageContainer from '../../../components/PageContainer';
import { useAppointments } from '../../../context/AppointmentContext';
import { Appointment } from '../../../services/interfaces';

/*
  This component renders a calendar that displays the events for each day of the current month.
  It allows navigation between months and, when an event is clicked, redirects to the update screen.
  Appointments are retrieved from context (local storage), following the pattern established in MainContentAppointments.
*/
function Calendar() {
  const { appointments } = useAppointments();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  function getEventsForDay(day: Date) {
    return appointments.filter((event: Appointment) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  }

  function handlePrevMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }

  function handleNextMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }

  function getIconByTag(tag: string) {
    const size = '0.8rem';
    switch (tag) {
      case 'Consulta':
        return <AssignmentIcon sx={{ fontSize: size }} />;
      case 'Urgência':
        return <WarningIcon sx={{ fontSize: size }} />;
      case 'Especialidade':
        return <MedicalServicesIcon sx={{ fontSize: size }} />;
      case 'Exame':
        return <MedicalServicesIcon sx={{ fontSize: size }} />;
      default:
        return <AssignmentIcon sx={{ fontSize: size }} />;
    }
  }

  let linkColor = isDarkMode ? theme.palette.primary.light : theme.palette.primary.main;
  let linkHoverColor = isDarkMode ? theme.palette.primary.main : theme.palette.primary.dark;

  return (
    <PageContainer>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Calendário de Eventos
        </Typography>
        <Grid container justifyContent="space-between" sx={{ marginBottom: 2 }}>
          <Button variant="outlined" onClick={handlePrevMonth}>
            Anterior
          </Button>
          <Typography variant="h6">{format(currentDate, 'MMMM yyyy')}</Typography>
          <Button variant="outlined" onClick={handleNextMonth}>
            Próximo
          </Button>
        </Grid>
        <Grid container spacing={0.5} justifyContent="center">
          {daysInMonth.map((day: Date) => {
            const eventsForDay = getEventsForDay(day);
            return (
              <Grid key={day.getTime()} component="div" size={{ xs: 4, sm: 4, md: 1.6 }}>
                <Paper
                  sx={{
                    padding: 1,
                    textAlign: 'center',
                    backgroundColor: isDarkMode ? '#2c2c2c' : 'lightgray',
                    position: 'relative',
                    minHeight: 100,
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography variant="body2">{format(day, 'd')}</Typography>
                  {eventsForDay.length > 0 && (
                    <Box sx={{ position: 'relative', width: '100%', paddingTop: 1 }}>
                      {eventsForDay.map((event, idx) => (
                        <Tooltip
                          key={idx}
                          arrow
                          title={
                            <div>
                              <strong>Doutor:</strong> {event.doctor_name}
                              <br />
                              <strong>Observação:</strong> {event.observation}
                              <br />
                              <strong>Localização:</strong> {event.location_name}
                            </div>
                          }
                        >
                          <Link
                            to={{
                              pathname: `/dashboard/appointments/update/${event.id}`,
                            } as any}
                            style={{ textDecoration: 'none' }}
                          >
                            <Typography
                              gutterBottom
                              component="h5"
                              sx={{
                                display: 'block',
                                color: linkColor,
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                marginBottom: 0.5,
                                '&:hover': {
                                  textDecoration: 'underline',
                                  color: linkHoverColor,
                                },
                              }}
                            >
                              {getIconByTag(event.tag)} {event.name}
                            </Typography>
                          </Link>
                        </Tooltip>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Calendar;
