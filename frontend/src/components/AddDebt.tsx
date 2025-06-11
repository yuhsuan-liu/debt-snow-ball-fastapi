import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface DebtFormData {
  name: string;
  balance: string;
  minPayment: string;
  interestRate: string;
}

const initialFormData: DebtFormData = {
  name: '',
  balance: '',
  minPayment: '',
  interestRate: '',
};

export default function AddDebt() {
  const [formData, setFormData] = useState<DebtFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to save debt
    console.log('Submitting:', formData);
    setFormData(initialFormData); // Reset form after submission
  };

  return (
    <Card sx={{ 
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Add New Debt
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ 
          display: 'grid', 
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        }}>
          <TextField
            label="Debt Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Credit Card"
            fullWidth
            required
          />
          
          <TextField
            label="Balance"
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
            required
          />
          
          <TextField
            label="Minimum Payment"
            type="number"
            value={formData.minPayment}
            onChange={(e) => setFormData({ ...formData, minPayment: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
            required
          />
          
          <TextField
            label="Interest Rate"
            type="number"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ 
              gridColumn: { xs: '1', sm: '1 / -1' },
              width: { xs: '100%', sm: 'auto' },
              justifySelf: { sm: 'start' },
            }}
          >
            Add Debt
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}