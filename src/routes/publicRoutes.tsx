import Blog from '../pages/main/Blog/Blog';
import Calendar from '../pages/main/Calendar/Calendar';
import Events from '../pages/main/Events/Events';
import NewAppointment from '../pages/main/Appointment/NewAppointment';
import ListAppointments from '../pages/main/Appointment/ListAppointments';
import { ReactNode } from 'react';

type MenuPosition = 
  | "main-menu"
  | "responsive-menu"
  | "action-button"
  | ""
  | "none";

  type MenuPositionArray = MenuPosition[];

  /*
    path: Caminho da rota
    element: Componente que será renderizado
    label: Texto que pode ser exibido em menus ou links
    menuPosition: onde deve ser exibido
    active: estado para saber se esta ativo
  */
export interface AppRoute {
  path: string;        
  element: ReactNode;  
  label: string;       
  menuPosition: MenuPositionArray; 
  active?: boolean; 
}

const publicRoutes: AppRoute[] = [
  {
    path: "/",
    element: <ListAppointments />,
    label: 'Home',
    menuPosition: ['none']
  },
  {
    path: "/events",
    element: <Events />,
    label: 'Eventos',
    menuPosition: ['none']
  },
  {
    path: "/blog",
    element: <Blog />,
    label: 'Blog',
    menuPosition: ['none']
  },
  {
    path: "/appointment",
    element: <ListAppointments />,
    label: 'Consultas',
    menuPosition: ['main-menu', 'responsive-menu']
  },
  {
    path: "/calendar",
    element: <Calendar />,
    label: 'Calendário',
    menuPosition: ['main-menu', 'responsive-menu']
  },
  {
    path: "/appointment/new-appointment",
    element: <NewAppointment />,
    label: 'Cadastrar Consulta',
    menuPosition: ['main-menu', 'action-button']
  },
  {
    path: "/appointment/update/:id",
    element: <NewAppointment />,
    label: 'Atualizar consulta',
    menuPosition: ['']
  },
];

export default publicRoutes;