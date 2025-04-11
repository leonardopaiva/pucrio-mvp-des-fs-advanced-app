// src/components/Layout.js
import { Outlet } from 'react-router-dom';
import Footer from './core/footer';
import { CssBaseline, Container } from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import DataConfirmInit from '../DataConfirmInit';
import Header from './core/header';
import { useEffect, useState } from 'react';
import AppGlobalStatesService from '../services/AppGlobalStatesService';
import { applyUserPreferences } from '../components/UserPreferencesPanel';


/*
  This is the component responsible for the entire external structure of 
  the pages being generated in this app.

  Layouts are a way to change the app's template, including its header, 
  footer, and other structural elements. They are useful in apps that have 
  both a logged-in user area and a landing page area with different structures.
  In this app, it wasn't very necessary, but it was a way to make the app scalable.
*/
function MainLayout(props: { disableCustomTheme?: boolean }) {
  const [optionCustomScheme, setOptionCustomScheme] = useState(false);

  /*
    optionCustomScheme
    is used to set schema color
    used on src/shared-theme/AppTheme.tsx 
  */
  useEffect(() => {
    console.log('MainLayout: registered setOptionCustomScheme.')
    AppGlobalStatesService.setSetOptionCustomSchemeFn(setOptionCustomScheme);
    applyUserPreferences();
  }, []);

  return (
    <AppTheme
      {...props}
      optionCustomScheme={optionCustomScheme} >
      <CssBaseline enableColorScheme />
      <Header />

      <Container>
        <Outlet />
      </Container>


      <Footer />

      <DataConfirmInit />

    </AppTheme>
  );
}

export default MainLayout;