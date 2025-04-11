// src/components/Layout.js (ou src/layouts/main-layout.tsx)
import { Outlet } from 'react-router-dom';
import Footer from './core/footer';
import { CssBaseline, Container } from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import DataConfirmInit from '../DataConfirmInit';
import Header from './core/header';
import { useEffect, useState } from 'react';
import AppGlobalStatesService from '../services/AppGlobalStatesService';
import FloatingUserButton from '../components/FloatingUserButton';
import { SyncQueueProvider } from '../context/SyncQueueContext';
import { AppointmentProvider } from '../context/AppointmentContext';
import { SharedAppProvider } from '../context/SharedAppContext';
import { applyUserPreferences } from '../components/UserPreferencesPanel';

/*
  Esse componente é responsável pela estrutura externa (header, footer, etc.) das páginas.
  Também insere os contexts
*/
function MainLayout(props: { disableCustomTheme?: boolean }) {
  const [optionCustomScheme, setOptionCustomScheme] = useState(false);

  useEffect(() => {
    console.log('MainLayout: registered setOptionCustomScheme.')
    AppGlobalStatesService.setSetOptionCustomSchemeFn(setOptionCustomScheme);
    applyUserPreferences();
  }, []);

  return (
    <AppTheme {...props} optionCustomScheme={optionCustomScheme}>
      <CssBaseline enableColorScheme />
      <SharedAppProvider>
        <SyncQueueProvider>
          <AppointmentProvider>
            <Header />
            <Container>
              <Outlet />
            </Container>
            <Footer />
            <FloatingUserButton />
          </AppointmentProvider>
        </SyncQueueProvider>
      </SharedAppProvider>
      <DataConfirmInit />
    </AppTheme>
  );
}

export default MainLayout;
