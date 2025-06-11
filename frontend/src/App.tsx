import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DebtList from './components/DebtList';
import AddDebt from './components/AddDebt';

// Create a custom theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Success Green
    },
    secondary: {
      main: '#2196F3', // Progress Blue
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#4CAF50',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
  },
});

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides consistent base styles */}
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header Section */}
          <Typography variant="h1" gutterBottom>
            Debt Snowball Planner
          </Typography>
          <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
            Your Journey to Financial Freedom
          </Typography>

          {/* Main Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AddDebt />
            <DebtList />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
