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

// Add PaymentPlan type
interface PaymentPlan {
  month: number;
  payments: Array<{
    name: string;
    payment: number;
    remaining_balance: number;
  }>;
}

const DebtList = () => {
  // State for managing debts and form inputs
  const [debts, setDebts] = useState<Debt[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: '',
    min_payment: '',
    interest_rate: '',
  });
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan[]>([]);

  // Handle adding a new debt
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const debt: Debt = {
      name: newDebt.name,
      balance: parseFloat(newDebt.balance),
      min_payment: parseFloat(newDebt.min_payment),
      interest_rate: parseFloat(newDebt.interest_rate),
    };
    setDebts([...debts, debt]);
    // Reset form
    setNewDebt({ name: '', balance: '', min_payment: '', interest_rate: '' });
  };

  // Update calculatePlan to save the results
  const calculatePlan = async () => {
    try {
      console.log('Sending request with:', {
        debts,
        monthly_payment: parseFloat(monthlyPayment),
      });
      
      const response = await fetch('http://localhost:8000/calculate-snowball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debts,
          monthly_payment: parseFloat(monthlyPayment),
        }),
      });
      
      const data = await response.json();
      console.log('Received response:', data);
      
      setPaymentPlan(data);
    } catch (error) {
      console.error('Error calculating plan:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', gap: 3, display: 'flex', flexDirection: 'column' }}>
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

      {/* Display debts list */}
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
                    <TableCell align="right">${debt.balance.toFixed(2)}</TableCell>
                    <TableCell align="right">${debt.min_payment.toFixed(2)}</TableCell>
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

      {/* Payment Plan Results */}
      {paymentPlan.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Debt Snowball Payment Plan
          </Typography>
          {paymentPlan.map((month, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                Month {month.month}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Debt Name</TableCell>
                      <TableCell align="right">Payment</TableCell>
                      <TableCell align="right">Remaining Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {month.payments.map((payment, pIndex) => (
                      <TableRow key={pIndex}>
                        <TableCell>{payment.name}</TableCell>
                        <TableCell align="right">
                          ${payment.payment.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${payment.remaining_balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

          {/* Summary Statistics */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Total Months to Debt Freedom: {paymentPlan.length}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DebtList;