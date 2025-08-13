import { useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { Debt } from '../types/debt';
import { userApi } from '../services/api';
import ChatBot from './ChatBot';
import styles from './DebtList.module.css';

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
      
      const response = await fetch('https://debt-snow-ball-fastapi.onrender.com/calculate-snowball', {
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
      const parsedDebts = loadedDebts.map((debt: any) => ({
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
  <div className={styles.container}>
    <ChatBot />

    {/* Intro Section */}
    <div className={styles.introSection}>
      <Typography
        variant="h5"
        gutterBottom
        className={styles.introTitle}
      >
        🚀 How to use:
      </Typography>

      <Typography variant="body1" className={styles.introText}>
        Plan and accelerate your debt payoff using the <strong>debt snowball method</strong>. <br />
        Enter your debts, then enter a monthly payment to calculate a payment plan.
      </Typography>

      <Typography variant="body1" className={styles.introText}>
        💡 <strong>Demo:</strong> Use username <strong>test_1</strong>, click <strong>Load Debts</strong> to retrieve demo debt list.<br />
        ✨ <strong>Try it:</strong> Use a new username, add debts, and click <strong>Save Debts</strong> to test it yourself.
      </Typography>

      <Typography variant="body1" className={styles.techText}>
        Built with React(TypeScript) + Python(FastAPI) + PostgreSQL. Deployed on Render.
      </Typography>

      <div className={styles.linkButtons}>
        <a href="https://github.com/yuhsuan-liu/debt-snow-ball-fastapi" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" color="secondary" size="small">
            📚 View GitHub Repo
          </Button>
        </a>
        <a href="https://www.linkedin.com/in/yuhsuan-liu-yl/" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" color="primary" size="small">
            💼 LinkedIn
          </Button>
        </a>
        <a href="mailto:yuhsuan.career@gmail.com">
          <Button variant="outlined" size="small">
            📧 Email Me
          </Button>
        </a>
        <Typography variant="caption" className={styles.createdBy}>
          Created by Yuhsuan Liu
        </Typography>
      </div>
    </div>

    <div className={styles.mainLayout}>
      <div className={styles.leftColumn}>
        {/* User Controls */}
        <div className={styles.card}>
          <Typography variant="h6" className={styles.cardTitle}>
            💾 Save/Load Debts
          </Typography>
          <div className={styles.formRowResponsive}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.textField}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDebts}
              disabled={!username || debts.length === 0}
              className={styles.submitButton}
            >
              💾 Save Debts
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLoadDebts}
              disabled={!username}
              className={styles.submitButton}
            >
              📥 Load Debts
            </Button>
          </div>
          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}
        </div>

        {/* Add new debt form */}
        <div className={styles.card}>
          <Typography variant="h6" className={styles.cardTitle}>
            ➕ Add New Debt
          </Typography>
          <form onSubmit={handleAddDebt}>
            <div className={styles.formStack}>
              <TextField
                label="Debt Name"
                value={newDebt.name}
                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                required
                fullWidth
                size="small"
                placeholder="e.g., Credit Card, Student Loan"
              />
              <div className={styles.formRowResponsive}>
                <TextField
                  label="Balance"
                  type="number"
                  value={newDebt.balance}
                  onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  placeholder="10000"
                />
                <TextField
                  label="Minimum Payment"
                  type="number"
                  value={newDebt.min_payment}
                  onChange={(e) => setNewDebt({ ...newDebt, min_payment: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  placeholder="200"
                />
              </div>
              <TextField
                label="Interest Rate (%)"
                type="number"
                value={newDebt.interest_rate}
                onChange={(e) => setNewDebt({ ...newDebt, interest_rate: e.target.value })}
                required
                fullWidth
                size="small"
                placeholder="18.5"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.addDebtButton}
              >
                ➕ Add Debt
              </Button>
            </div>
          </form>
        </div>

        {/* Display debts list */}
        {debts.length > 0 && (
          <div className={styles.card}>
            <Typography variant="h6" className={styles.cardTitle}>
              📊 Your Debts
            </Typography>
            <TableContainer className={styles.tableContainer}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeaderCell}>
                      Name
                    </TableCell>
                    <TableCell align="right" className={styles.tableHeaderCell}>
                      Balance
                    </TableCell>
                    <TableCell align="right" className={styles.tableHeaderCell}>
                      Min Payment
                    </TableCell>
                    <TableCell align="right" className={styles.tableHeaderCell}>
                      Interest Rate
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debts.map((debt, index) => (
                    <TableRow key={index} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {debt.name}
                      </TableCell>
                      <TableCell align="right" className={styles.tableCell}>
                        ${debt.balance.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" className={styles.tableCell}>
                        ${debt.min_payment.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" className={styles.tableCell}>
                        {debt.interest_rate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Monthly payment input and calculate button */}
            <div className={styles.formRowResponsive}>
              <TextField
                label="Monthly Payment"
                type="number"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                required
                className={styles.textField}
                size="small"
                placeholder="Enter total monthly payment"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={calculatePlan}
                disabled={!monthlyPayment}
                className={styles.submitButton}
              >
                🧮 Calculate Plan
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Payment Plan Results */}
      {paymentPlan.length > 0 && (
        <div className={styles.rightColumn}>
          <div className={styles.paymentPlanContainer}>
            <Typography
              variant="h6"
              gutterBottom
              className={styles.paymentPlanTitle}
            >
              🎯 Debt Snowball Payment Plan
            </Typography>

            {/* Summary Statistics */}
            <div className={styles.summaryBox}>
              <Typography
                variant="subtitle1"
                className={styles.summaryText}
              >
                🎉 Total Months to Debt Freedom: {paymentPlan.length}
              </Typography>
            </div>

            {/* Monthly Breakdown */}
            {paymentPlan.map((month, index) => (
              <div key={index} className={styles.monthSection}>
                <Typography
                  variant="subtitle1"
                  className={styles.monthTitle}
                >
                  📅 Month {month.month}
                </Typography>
                <TableContainer className={styles.tableContainer}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className={styles.tableHeaderCell}>
                          Debt Name
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Payment
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Remaining Balance
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {month.payments.map((payment, pIndex) => (
                        <TableRow key={pIndex} className={styles.tableRow}>
                          <TableCell className={styles.tableCell}>
                            {payment.name}
                          </TableCell>
                          <TableCell align="right" className={styles.tableCell}>
                            ${payment.payment.toFixed(2)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={payment.remaining_balance === 0 ? styles.paidOffCell : styles.tableCell}
                          >
                            {payment.remaining_balance === 0
                              ? '✅ PAID OFF!'
                              : `$${payment.remaining_balance.toFixed(2)}`
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default DebtList;