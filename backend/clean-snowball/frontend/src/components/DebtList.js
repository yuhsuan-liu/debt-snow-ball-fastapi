import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Stack, Alert, } from '@mui/material';
import { userApi } from '../services/api';
const DebtList = () => {
    // State for managing debts and form inputs
    const [debts, setDebts] = useState([]);
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [newDebt, setNewDebt] = useState({
        name: '',
        balance: '',
        min_payment: '',
        interest_rate: '',
    });
    const [paymentPlan, setPaymentPlan] = useState([]);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    // Handle adding a new debt
    const handleAddDebt = (e) => {
        e.preventDefault();
        const debt = {
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
            }
            else {
                console.error('No plan data in response');
            }
        }
        catch (error) {
            console.error('Error calculating plan:', error);
        }
    };
    // Handle saving debts and payment plan
    const handleSaveDebts = async () => {
        if (!username || debts.length === 0 || paymentPlan.length === 0)
            return;
        try {
            try {
                // Attempt to create user, but ignore if "already in use"
                await userApi.createUser(username);
            }
            catch (err) {
                if (err instanceof Error && err.message.includes("Username already in use")) {
                    // Ignore it — user already exists
                }
                else {
                    throw err;
                }
                // else: continue — user exists, which is fine
            }
            console.log("Saving debts...", debts);
            await userApi.saveDebts(username, debts); // Save debts first
            console.log("Debts saved successfully");
            const totalMonths = paymentPlan.length;
            const planData = Object.fromEntries(paymentPlan.map((p, i) => [i, p]) // Index-based object structure
            );
            const payload = {
                monthly_payment: parseFloat(monthlyPayment),
                total_months: totalMonths,
                plan_data: planData,
            };
            await userApi.savePlan(username, payload); // Save the full plan too
            setError("");
        }
        catch (err) {
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
        }
        catch (err) {
            setError('Failed to load debts. ' + (err instanceof Error ? err.message : String(err)));
        }
    };
    return (_jsxs(Box, { sx: { p: 2 }, children: [_jsxs(Box, { sx: { pt: 1, pr: 2, pb: 2, pl: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, fontWeight: "bold", color: "primary", sx: { mt: 0 }, children: "How to use:" }), _jsxs(Typography, { variant: "body1", paragraph: true, children: ["Plan and accelerate your debt payoff using the ", _jsx("strong", { children: "debt snowball method" }), ". ", _jsx("br", {}), "Enter your debts, then enter a monthly payment to calculate a payment plan."] }), _jsxs(Typography, { variant: "body1", paragraph: true, children: ["-- ", _jsx("strong", { children: "Demo:" }), " Use username ", _jsx("strong", { children: "test_1" }), ", click ", _jsx("strong", { children: "Load Debts" }), " to retrieve demo debt list.", _jsx("br", {}), "-- ", _jsx("strong", { children: "Try it:" }), " Use a new username, add debts, and click ", _jsx("strong", { children: "Save Debts" }), " to test it yourself."] }), _jsx(Typography, { variant: "body1", paragraph: true, sx: { fontStyle: 'italic', mb: 2 }, children: "Built with React(TypeScript) + Python(FastAPI) + PostgreSQL. Deployed on Render." }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mb: 1 }, children: [_jsx("a", { href: "https://github.com/yuhsuan-liu/debt-snow-ball-fastapi", target: "_blank", rel: "noopener noreferrer", children: _jsx(Button, { variant: "outlined", color: "secondary", children: "View GitHub Repo" }) }), _jsx("a", { href: "https://www.linkedin.com/in/yuhsuan-liu-yl/", target: "_blank", rel: "noopener noreferrer", children: _jsx(Button, { variant: "outlined", color: "primary", children: "LinkedIn" }) }), _jsx("a", { href: "mailto:yuhsuan.career@gmail.com", children: _jsx(Button, { variant: "outlined", children: "Email Me" }) }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Created by Yuhsuan Liu" })] })] }), _jsxs(Stack, { direction: { xs: "column", md: "row" }, spacing: 3, alignItems: "flex-start", children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsxs(Paper, { elevation: 3, sx: { pt: 1, pr: 2, pb: 2, pl: 2, mb: 1 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: false, sx: { mb: 1, mt: 0 }, children: "Save/Load Debts" }), _jsxs(Stack, { spacing: 2, direction: "row", alignItems: "center", children: [_jsx(TextField, { label: "Username", value: username, onChange: (e) => setUsername(e.target.value), sx: { flexGrow: 1 }, size: "small" }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleSaveDebts, disabled: !username || debts.length === 0, children: "Save Debts" }), _jsx(Button, { variant: "outlined", color: "primary", onClick: handleLoadDebts, disabled: !username, children: "Load Debts" })] }), error && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }))] }), _jsxs(Paper, { elevation: 3, sx: { pt: 1, pr: 2, pb: 2, pl: 2, mb: 1 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: false, sx: { mb: 1, mt: 0 }, children: "Add New Debt" }), _jsx("form", { onSubmit: handleAddDebt, children: _jsxs(Stack, { spacing: 1, children: [_jsx(TextField, { label: "Debt Name", value: newDebt.name, onChange: (e) => setNewDebt({ ...newDebt, name: e.target.value }), required: true, fullWidth: true, size: "small" }), _jsx(TextField, { label: "Balance", type: "number", value: newDebt.balance, onChange: (e) => setNewDebt({ ...newDebt, balance: e.target.value }), required: true, fullWidth: true, size: "small" }), _jsx(TextField, { label: "Minimum Payment", type: "number", value: newDebt.min_payment, onChange: (e) => setNewDebt({ ...newDebt, min_payment: e.target.value }), required: true, fullWidth: true, size: "small" }), _jsx(TextField, { label: "Interest Rate (%)", type: "number", value: newDebt.interest_rate, onChange: (e) => setNewDebt({ ...newDebt, interest_rate: e.target.value }), required: true, fullWidth: true, size: "small" }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", children: "Add Debt" })] }) })] }), debts.length > 0 && (_jsxs(Paper, { elevation: 3, sx: { pt: 1, pr: 2, pb: 2, pl: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: false, sx: { mb: 0.5, mt: 0 }, children: "Your Debts" }), _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { sx: { py: 0.5, px: 1 }, children: "Name" }), _jsx(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: "Balance" }), _jsx(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: "Min Payment" }), _jsx(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: "Interest Rate" })] }) }), _jsx(TableBody, { children: debts.map((debt, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { py: 0.5, px: 1 }, children: debt.name }), _jsxs(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: ["$", debt.balance.toFixed(2)] }), _jsxs(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: ["$", debt.min_payment.toFixed(2)] }), _jsxs(TableCell, { align: "right", sx: { py: 0.5, px: 1 }, children: [debt.interest_rate, "%"] })] }, index))) })] }) }), _jsxs(Box, { sx: { mt: 2.1, display: 'flex', gap: 2, alignItems: 'center' }, children: [_jsx(TextField, { label: "Monthly Payment", type: "number", value: monthlyPayment, onChange: (e) => setMonthlyPayment(e.target.value), required: true, sx: { flexGrow: 1 }, size: "small" }), _jsx(Button, { variant: "contained", color: "secondary", onClick: calculatePlan, disabled: !monthlyPayment, children: "Calculate Plan" })] })] }))] }), paymentPlan.length > 0 && (_jsx(Box, { sx: { width: { xs: '100%', md: '40%' } }, children: _jsxs(Paper, { elevation: 3, sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Debt Snowball Payment Plan" }), _jsx(Box, { sx: { mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }, children: _jsxs(Typography, { variant: "subtitle2", color: "primary", children: ["Total Months to Debt Freedom: ", paymentPlan.length] }) }), paymentPlan.map((month, index) => (_jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "subtitle1", sx: { fontWeight: 'bold', color: 'primary.main', mb: 1 }, children: ["Month ", month.month] }), _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Debt Name" }), _jsx(TableCell, { align: "right", children: "Payment" }), _jsx(TableCell, { align: "right", children: "Remaining Balance" })] }) }), _jsx(TableBody, { children: month.payments.map((payment, pIndex) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: payment.name }), _jsxs(TableCell, { align: "right", children: ["$", payment.payment.toFixed(2)] }), _jsxs(TableCell, { align: "right", children: ["$", payment.remaining_balance.toFixed(2)] })] }, pIndex))) })] }) })] }, index)))] }) }))] })] }));
};
export default DebtList;
