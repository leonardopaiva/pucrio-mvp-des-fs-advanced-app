import { useState } from 'react';
import { Typography, Box, Button, Paper, Tooltip, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import React from 'react';
import { Appointment } from '../../../services/interfaces';
import LocalStorageService from '../../../services/LocalStorageService';
import { Link } from 'react-router-dom';

import AssignmentIcon from '@mui/icons-material/Assignment';  
import WarningIcon from '@mui/icons-material/Warning';        
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; 

/*
This component renders a calendar that displays events for each day of the current month.
It allows users to navigate between months, view events, and click on them to get more details.
*/
export default function Calendar() {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);

  /*
  Fetch the appointment list from the API or localStorage if the API fails.
  */
  React.useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/appointments')
      .then((res) => setAppointmentList(res.data.appointment))
      .catch(() => {
        const appointmentLocalStorage = new LocalStorageService<Appointment>('appointments');
        const items = appointmentLocalStorage.listItems();
        setAppointmentList(items);
      });
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first and last day of the current month
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  // List of all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  /*
  Filter events by the given date.
  */
  function getEventsForDay(day: Date) {
    return appointmentList.filter((event) => {
      const eventDate = parseISO(event.date as string);
      return isSameDay(eventDate, day);
    });
  }

  /*
  Navigate to the previous month by subtracting one month from the current date.
  */
  function handlePrevMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1); // Subtract 1 from the current month
      return newDate;
    });
  }

  /*
  Navigate to the next month by adding one month to the current date.
  */
  function handleNextMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1); // Add 1 to the current month
      return newDate;
    });
  }

  /*
  Return the appropriate icon based on the event tag.
  */
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
        return <AssignmentIcon sx={{ fontSize: size }} />; // Default case
    }
  }

  /* set some colors based on theme light or dark */
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Calendário de Eventos
      </Typography>

      {/* Month Navigation */}
      <Grid container justifyContent="space-between" sx={{ marginBottom: 2 }}>
        <Button variant="outlined" onClick={handlePrevMonth}>
          Anterior
        </Button>
        <Typography variant="h6">{format(currentDate, 'MMMM yyyy')}</Typography>
        <Button variant="outlined" onClick={handleNextMonth}>
          Próximo
        </Button>
      </Grid>

      {/* Calendar */}
      <Grid container spacing={0.5} justifyContent="center">
        {daysInMonth.map((day: Date) => {
          const eventsForDay = getEventsForDay(day);

          let linkColor = isDarkMode ? theme.palette.primary.light : theme.palette.primary.main; // Link color
          let linkHoverColor = isDarkMode ? theme.palette.primary.main : theme.palette.primary.dark; // Link hover color

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

                {/* Event List */}
                {eventsForDay.length > 0 && (
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: 1 }}>
                    {eventsForDay.map((event, idx) => (
                      <Tooltip
                        key={idx}
                        arrow
                        title={
                          <div>
                            <strong>Doutor:</strong> {event.doctor}
                            <br />
                            <strong>Observação:</strong> {event.observation}
                            <br />
                            <strong>Localização:</strong> {event.location}
                          </div>
                        }
                      >
                        <Link
                          to={{
                            pathname: `/appointment/update/${event.id}`,
                          } as any}
                          style={{ textDecoration: 'none' }}
                        >
                          <Typography
                            color="primary"
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
                            {getIconByTag(event.tag)}
                            {event.name}
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
  );
}

