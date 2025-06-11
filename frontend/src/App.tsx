import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import './App.css'
import DebtList from './components/DebtList';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', 
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#2196F3', 
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
      <Container maxWidth="md">
        <Box sx={{ 
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Debt Snowball Calculator
          </Typography>
          <DebtList />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
