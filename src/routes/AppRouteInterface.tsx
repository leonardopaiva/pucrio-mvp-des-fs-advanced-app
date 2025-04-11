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
export interface AppRouteInterface {
  path: string;
  element: ReactNode;
  label: string;
  menuPosition: MenuPositionArray;
  active?: boolean;
  index?: boolean;
}