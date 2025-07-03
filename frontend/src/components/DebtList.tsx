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
  <Box sx={{ p: 2 }}>
    {/* Intro Section */}
    <Box sx={{ pt: 1, pr: 2, pb: 2, pl: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color = "primary" sx={{ mt: 0 }}>
        How to use:
      </Typography>

      <Typography variant="body1" paragraph>
        Plan and accelerate your debt payoff using the <strong>debt snowball method</strong>. <br />
        Enter your debts, then enter a monthly payment to calculate a payment plan.
      </Typography>

      <Typography variant="body1" paragraph>
        -- <strong>Demo:</strong> Use username <strong>test_1</strong>, click <strong>Load Debts</strong> to retrieve demo debt list.<br />
        -- <strong>Try it:</strong> Use a new username, add debts, and click <strong>Save Debts</strong> to test it yourself.
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 2 }}>
        Built with React(TypeScript) + Python(FastAPI) + PostgreSQL. Deployed on Render.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <a href="https://github.com/yuhsuan-liu/debt-snow-ball-fastapi" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" color="secondary">View GitHub Repo</Button>
        </a>
        <a href="https://www.linkedin.com/in/yuhsuan-liu-yl/" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" color="primary">LinkedIn</Button>
        </a>
        <a href="mailto:yuhsuan.career@gmail.com">
          <Button variant="outlined">Email Me</Button>
        </a>
        <Typography variant="caption" color="text.secondary">
        Created by Yuhsuan Liu
        </Typography>
      </Stack>


    </Box>

    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      alignItems="flex-start"
    >
      <Box sx={{ flex: 1 }}>
      {/* User Controls */}
      <Paper elevation={3} sx={{ pt: 1, pr: 2, pb: 2, pl: 2, mb: 1 }}>
        <Typography variant="h6" gutterBottom={false} sx={{ mb: 1, mt: 0 }}>
          Save/Load Debts
        </Typography>
        <Stack spacing={2} direction="row" alignItems="center">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ flexGrow: 1 }}
            size="small"
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
      <Paper elevation={3} sx={{ pt: 1, pr: 2, pb: 2, pl: 2, mb: 1 }}>
        <Typography variant="h6" gutterBottom={false} sx={{ mb: 1, mt: 0 }}>
          Add New Debt
        </Typography>
        <form onSubmit={handleAddDebt}>
          <Stack spacing={1}>
            <TextField
              label="Debt Name"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Balance"
              type="number"
              value={newDebt.balance}
              onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Minimum Payment"
              type="number"
              value={newDebt.min_payment}
              onChange={(e) => setNewDebt({ ...newDebt, min_payment: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Interest Rate (%)"
              type="number"
              value={newDebt.interest_rate}
              onChange={(e) => setNewDebt({ ...newDebt, interest_rate: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <Button type="submit" variant="contained" color="primary">
              Add Debt
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Display debts list */}
      {debts.length > 0 && (
        <Paper elevation={3} sx={{ pt: 1, pr: 2, pb: 2, pl: 2 }}>
          <Typography variant="h6" gutterBottom={false} sx={{ mb: 0.5, mt: 0 }}>
            Your Debts
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 0.5, px: 1 }}>Name</TableCell>
                  <TableCell align="right" sx={{ py: 0.5, px: 1 }}>Balance</TableCell>
                  <TableCell align="right" sx={{ py: 0.5, px: 1 }}>Min Payment</TableCell>
                  <TableCell align="right" sx={{ py: 0.5, px: 1 }}>Interest Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map((debt, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ py: 0.5, px: 1 }}>{debt.name}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5, px: 1 }}>${debt.balance.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5, px: 1 }}>${debt.min_payment.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5, px: 1 }}>{debt.interest_rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Monthly payment input and calculate button */}
          <Box sx={{ mt: 2.1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Monthly Payment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
              size="small"
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
  </Box>
  );
};

export default DebtList;