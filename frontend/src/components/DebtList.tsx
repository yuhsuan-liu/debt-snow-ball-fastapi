import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

// Mock data for development
const mockDebts = [
  {
    name: "Credit Card A",
    balance: 5000,
    minPayment: 100,
    interestRate: 18.99
  },
  {
    name: "Personal Loan",
    balance: 3000,
    minPayment: 150,
    interestRate: 12.5
  }
];

export default function DebtList() {
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [debts] = useState(mockDebts); // TODO: Replace with API call

  const handleCalculate = () => {
    // TODO: Add API call to calculate snowball
    console.log('Calculating with monthly payment:', monthlyPayment);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Your Debts
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.default' }}>
                <TableCell>Name</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="right">Min Payment</TableCell>
                <TableCell align="right">Interest Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {debts.map((debt, index) => (
                <TableRow key={index}>
                  <TableCell>{debt.name}</TableCell>
                  <TableCell align="right">{formatCurrency(debt.balance)}</TableCell>
                  <TableCell align="right">{formatCurrency(debt.minPayment)}</TableCell>
                  <TableCell align="right">{debt.interestRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <TextField
            label="Total Monthly Payment"
            type="number"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ minWidth: 200 }}
          />
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCalculate}
            startIcon={<CalculateIcon />}
            disabled={!monthlyPayment || debts.length === 0}
          >
            Calculate Snowball Plan
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}