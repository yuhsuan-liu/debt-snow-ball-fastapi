import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS across browsers */}
      <Container maxWidth="md">
        <Box sx={{ 
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <DebtList />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
