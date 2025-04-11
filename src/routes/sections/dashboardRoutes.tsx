// src/routes/dashboardRoutes.tsx
import ListAppointments from '../../pages/main/Appointment/ListAppointments';
import CreateAppointment from '../../pages/main/Appointment/CreateAppointment';
import UpdateAppointment from '../../pages/main/Appointment/UpdateAppointment';
import Calendar from '../../pages/main/Calendar/Calendar';
import { AppRouteInterface } from '../AppRouteInterface';
import { NotFound } from '../guards/NotFound';
import Map from '../../pages/main/Appointment/Map';

const dashboardRoutes: AppRouteInterface[] = [
  {
    index: true,
    element: <ListAppointments />,
    label: 'Dashboard',
    menuPosition: ['none'],
    path: '',
  },
  {
    path: "appointments",
    element: <ListAppointments />,
    label: 'Consultas',
    menuPosition: ['main-menu', 'responsive-menu'],
  },
  {
    path: "appointments/new-appointment",
    element: <CreateAppointment />,
    label: 'Cadastrar Consulta',
    menuPosition: ['main-menu', 'action-button'],
  },
  {
    path: "appointments/update/:id",
    element: <UpdateAppointment />,
    label: 'Atualizar Consulta',
    menuPosition: ['none'],
  },
  {
    path: "appointments/calendar",
    element: <Calendar />,
    label: 'Calendário',
    menuPosition: ['main-menu', 'responsive-menu'],
  },
  {
    path: "appointments/map",
    element: <Map />,
    label: 'Mapa',
    menuPosition: ['main-menu', 'responsive-menu'],
  },
  {
    path: "*",
    element: <NotFound />,
    label: '',
    menuPosition: ['none'],
  },
];

export default dashboardRoutes;
