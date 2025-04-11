import React, { createContext, useContext, useState } from 'react';

/* 
  Componentes escutando 
  appointmentsDirty é escutado por: AppointmentContext
*/
interface SharedAppContextType {
  appointmentsDirty: boolean;
  setAppointmentsDirty: (dirty: boolean) => void;
}

const SharedAppContext = createContext<SharedAppContextType | undefined>(undefined);

export const SharedAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointmentsDirty, setAppointmentsDirty] = useState<boolean>(false);
  return (
    <SharedAppContext.Provider value={{ appointmentsDirty, setAppointmentsDirty }}>
      {children}
    </SharedAppContext.Provider>
  );
};

export const useSharedApp = (): SharedAppContextType => {
  const context = useContext(SharedAppContext);
  if (!context) {
    throw new Error('useSharedApp must be used within a SharedAppProvider');
  }
  return context;
};
