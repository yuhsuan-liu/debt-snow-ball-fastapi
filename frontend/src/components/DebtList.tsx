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
import { userApi } from '../services/api';

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
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

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
      
      if (data.plan) {
        setPaymentPlan(data.plan);
      } else {
        console.error('No plan data in response');
      }
    } catch (error) {
      console.error('Error calculating plan:', error);
    }
  };

  // Handle saving debts and payment plan
  const handleSaveDebts = async () => {
    if (!username || debts.length === 0 || paymentPlan.length === 0) return;

    try{
      try {
      // Attempt to create user, but ignore if "already in use"
      
        await userApi.createUser(username);
      } catch (err:any) {
        if (err instanceof Error && err.message.includes("Username already in use")) {
        // Ignore it — user already exists
        } else {
          throw err;
        }
        // else: continue — user exists, which is fine
      }
      
      console.log("Saving debts...", debts)
      await userApi.saveDebts(username, debts);      // Save debts first
      console.log("Debts saved successfully");

      const totalMonths = paymentPlan.length;
      const planData = Object.fromEntries(
        paymentPlan.map((p, i) => [i, p])            // Index-based object structure
      );

      const payload = {
        monthly_payment: parseFloat(monthlyPayment),
        total_months: totalMonths,
        plan_data: planData,
      };

      await userApi.savePlan(username, payload);     // Save the full plan too
      setError("");
    } catch (err) {
      setError("Failed to save debts or plan: " + (err instanceof Error ? err.message : String(err)));
    }
  };


  const handleLoadDebts = async () => {
    if (!username) {
      setError('Please enter a username to load your debts');
      return;
    }
    try {
      const loadedDebts = await userApi.loadDebts(username);

      // Convert stringified values to numbers
      const parsedDebts = loadedDebts.map((debt) => ({
        ...debt,
        balance: parseFloat(debt.balance),
        min_payment: parseFloat(debt.min_payment),
        interest_rate: parseFloat(debt.interest_rate),
      }));

      setDebts(parsedDebts);
      setError('');
    } catch (err) {
      setError('Failed to load debts. ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      alignItems="flex-start"
    >
      <Box sx={{ flex: 1 }}>
      {/* User Controls */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Save/Load Debts
        </Typography>
        <Stack spacing={2} direction="row" alignItems="center">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDebts}
            disabled={!username || debts.length === 0}
          >
            Save Debts
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLoadDebts}
            disabled={!username}
          >
            Load Debts
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

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
      </Box>
      {/* Payment Plan Results */}
      {paymentPlan.length > 0 && (
        <Box sx={{ width: { xs: '100%', md: '40%' } }}>
          <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Debt Snowball Payment Plan
          </Typography>
          
          {/* Summary Statistics */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Total Months to Debt Freedom: {paymentPlan.length}
            </Typography>
          </Box>
          {/* Monthly Breakdown */}
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


          </Paper>
        </Box>
      )}
    </Stack>
  );
};

export default DebtList;