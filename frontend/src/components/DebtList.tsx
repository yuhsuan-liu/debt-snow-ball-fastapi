import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { Debt } from '../types/debt';

export default function DebtList() {
  // State management for debts and form
  const [debts, setDebts] = useState<Debt[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: '',
    min_payment: '',
    interest_rate: '',
  });
  const [plan, setPlan] = useState<any>(null);

  // Handle form submission for new debt
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const debt = {
      ...newDebt,
      balance: parseFloat(newDebt.balance),
      min_payment: parseFloat(newDebt.min_payment),
      interest_rate: parseFloat(newDebt.interest_rate),
    };
    setDebts([...debts, debt]);
    setNewDebt({ name: '', balance: '', min_payment: '', interest_rate: '' });
  };

  // Calculate snowball plan
  const calculatePlan = async () => {
    try {
      const response = await fetch('http://localhost:8000/calculate-snowball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debts,
          monthly_payment: parseFloat(monthlyPayment),
        }),
      });
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Error calculating plan:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Typography variant="h4" align="center" gutterBottom>
        Debt Snowball Calculator
      </Typography>

      {/* Add new debt form */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Debt
        </Typography>
        <form onSubmit={handleAddDebt}>
          <Stack spacing={2}>
            <TextField
              label="Debt Name"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Balance"
              type="number"
              value={newDebt.balance}
              onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Minimum Payment"
              type="number"
              value={newDebt.min_payment}
              onChange={(e) => setNewDebt({ ...newDebt, min_payment: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Interest Rate (%)"
              type="number"
              value={newDebt.interest_rate}
              onChange={(e) => setNewDebt({ ...newDebt, interest_rate: e.target.value })}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Add Debt
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Debts list */}
      {debts.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Debts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
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
                    <TableCell align="right">${debt.balance}</TableCell>
                    <TableCell align="right">${debt.min_payment}</TableCell>
                    <TableCell align="right">{debt.interest_rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Monthly payment input and calculate button */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Monthly Payment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={calculatePlan}
              disabled={!monthlyPayment}
            >
              Calculate Plan
            </Button>
          </Box>
        </Paper>
      )}

      {/* Results section */}
      {plan && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Plan
          </Typography>
          {/* Add plan display logic here */}
        </Paper>
      )}
    </Box>
  );
}