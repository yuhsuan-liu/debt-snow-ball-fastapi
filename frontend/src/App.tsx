import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography } from '@mui/material';
import DebtList from './components/DebtList';
import styles from './App.module.css';

// Create a modern green theme similar to Stripe/Acorn
const theme = createTheme({
  palette: {
    primary: {
      main: '#00D924', // Bright modern green
      light: '#4AE54A',
      dark: '#00B01E',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0A84FF', // Modern blue accent
      light: '#5AC8FA',
      dark: '#007AFF',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00D924',
      light: '#4AE54A',
      dark: '#00B01E',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1D29',
      secondary: '#6B7280',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      color: '#1A1D29',
      fontSize: '2.25rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      color: '#1A1D29',
      fontSize: '1.5rem',
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      color: '#1A1D29',
      fontSize: '1.125rem',
      letterSpacing: '-0.025em',
    },
    body1: {
      color: '#374151',
      lineHeight: 1.6,
      fontSize: '1rem',
    },
    body2: {
      color: '#6B7280',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      color: '#1A1D29',
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      color: '#6B7280',
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        },
        contained: {
          backgroundColor: '#00D924',
          color: '#ffffff !important',
          maxWidth: '200px',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: '#00B01E',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
          },
          '&:disabled': {
            backgroundColor: '#D1D5DB',
            color: '#9CA3AF',
          },
        },
        outlined: {
          borderColor: '#D1D5DB',
          color: '#374151',
          backgroundColor: '#FFFFFF',
          maxWidth: '200px',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            borderColor: '#9CA3AF',
          },
        },
        text: {
          color: '#6B7280',
          maxWidth: '200px',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#D1D5DB',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00D924',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6B7280',
            '&.Mui-focused': {
              color: '#00D924',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#1A1D29',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" disableGutters className={styles.appContainer}>
        <div className={styles.mainContent}>
          <Typography
            variant="h4"
            component="h1"
            className={styles.title}
          >
            💰 Debt Snowball Calculator
          </Typography>

          <div className={styles.contentWrapper}>
            <DebtList />
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
