import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from '../../../mui-components/AppAppBar';
import MainContent from '../../../mui-components/MainContent';
import Latest from '../../../mui-components/Latest';
import Footer from '../../../mui-components/Footer';
import AppTheme from '../../../shared-theme/AppTheme';

export default function OldBlog(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        <Latest />
      </Container>
      <Footer />
    </AppTheme>
  );
}
