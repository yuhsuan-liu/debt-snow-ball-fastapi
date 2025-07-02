import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import DebtList from './components/DebtList';

// Create a theme with hopeful and motivating colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Growth-oriented green
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#2196F3', // Trustworthy blue
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
      color: '#2E7D32',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" disableGutters sx={{ height: '100vh', pt: 0, pb: 0 }}>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          pt: 0,
          transform: 'scale(0.95)',
          transformOrigin: 'top center',
        }}>
          <Typography variant="h4" component="h1" gutterBottom={false} sx={{ mt: 0, mb: 2, pt: 0 }}>
            Debt Snowball Calculator
          </Typography>
          <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
            <DebtList />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
