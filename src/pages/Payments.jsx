import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge, Tabs, Tab, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useTheme } from '@mui/material/styles';
// For charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Validation regex patterns
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;
const BILL_ID_REGEX = /^[A-Z]{3}[0-9]{4}$/;

const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Check', 'UPI', 'Digital Wallet'];
const PAYMENT_STATUS = ['Completed', 'Pending', 'Failed', 'Processing'];
const BILL_STATUS = ['Paid', 'Unpaid', 'Overdue', 'Partially Paid'];
const BILL_CATEGORIES = ['Milk Purchase', 'Equipment', 'Maintenance', 'Transport', 'Utilities', 'Other'];

const Payments = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Payments State
  const [paymentForm, setPaymentForm] = useState({
    farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer', 
    remarks: '', status: 'Completed', transactionId: ''
  });
  const [payments, setPayments] = useState([
    { farmerId: 'FARM0001', paymentDate: '2025-06-05', amount: '15000', paymentMode: 'Bank Transfer', remarks: 'Monthly payment', status: 'Completed', transactionId: 'TXN123456' },
    { farmerId: 'FARM0002', paymentDate: '2025-06-04', amount: '12000', paymentMode: 'UPI', remarks: 'Milk supply payment', status: 'Completed', transactionId: 'TXN123457' }
  ]);
  const [editPaymentIdx, setEditPaymentIdx] = useState(null);
  const [editPaymentForm, setEditPaymentForm] = useState({
    farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer', 
    remarks: '', status: 'Completed', transactionId: ''
  });

  // Bills State
  const [billForm, setBillForm] = useState({
    billId: '', farmerId: '', billDate: '', dueDate: '', amount: '', 
    description: '', status: 'Unpaid', category: 'Milk Purchase'
  });
  const [bills, setBills] = useState([
    { billId: 'BIL0001', farmerId: 'FARM0001', billDate: '2025-06-01', dueDate: '2025-06-15', amount: '8000', description: 'Milk supply for May', status: 'Paid', category: 'Milk Purchase' },
    { billId: 'BIL0002', farmerId: 'FARM0003', billDate: '2025-06-03', dueDate: '2025-06-17', amount: '5500', description: 'Equipment maintenance', status: 'Unpaid', category: 'Maintenance' }
  ]);
  const [editBillIdx, setEditBillIdx] = useState(null);
  const [editBillForm, setEditBillForm] = useState({
    billId: '', farmerId: '', billDate: '', dueDate: '', amount: '', 
    description: '', status: 'Unpaid', category: 'Milk Purchase'
  });

  // Validation Errors
  const [farmerIdError, setFarmerIdError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [billIdError, setBillIdError] = useState('');

  // Tab styling function
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#9c27b0' : 'transparent',
        color: isSelected ? '#fff' : '#9c27b0',
        border: '2px solid #9c27b0',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#7b1fa2' : '#f3e5f5' }
      },
      {
        borderRadius: '8px 8px 0 0',
        backgroundColor: isSelected ? '#4caf50' : '#f5f5f5',
        color: isSelected ? '#fff' : '#4caf50',
        border: '1px solid #4caf50',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 2px',
        '&:hover': { backgroundColor: isSelected ? '#388e3c' : '#e8f5e9' }
      },
      {
        borderRadius: '12px',
        backgroundColor: isSelected ? '#2196f3' : 'transparent',
        color: isSelected ? '#fff' : '#2196f3',
        border: '2px dashed #2196f3',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '120px',
        margin: '0 6px',
        '&:hover': { backgroundColor: isSelected ? '#1976d2' : '#e3f2fd' }
      }
    ];
    return styles[index] || {};
  };

  // Payment handlers with validation
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  const handlePaymentRadio = (e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value });

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (paymentForm.farmerId && paymentForm.paymentDate && paymentForm.amount && 
        paymentForm.paymentMode && !farmerIdError && !amountError) {
      const newPayment = { 
        ...paymentForm, 
        transactionId: paymentForm.transactionId || `TXN${Date.now()}` 
      };
      setPayments([newPayment, ...payments]);
      setPaymentForm({ farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer', remarks: '', status: 'Completed', transactionId: '' });
    }
  };

  const handleDeletePayment = (idx) => setPayments(payments.filter((_, i) => i !== idx));

  const handleEditPayment = (idx) => {
    setEditPaymentIdx(idx);
    setEditPaymentForm(payments[idx]);
    setFarmerIdError(''); setAmountError('');
  };

  const handleEditPaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setEditPaymentForm({ ...editPaymentForm, [name]: value });
  };

  const handleEditPaymentRadio = (e) => setEditPaymentForm({ ...editPaymentForm, paymentMode: e.target.value });

  const handleSaveEditPayment = () => {
    if (editPaymentIdx !== null && !farmerIdError && !amountError) {
      const updated = [...payments];
      updated[editPaymentIdx] = editPaymentForm;
      setPayments(updated);
      setEditPaymentIdx(null);
    }
  };

  // Bill handlers with validation
  const handleBillChange = (e) => {
    const { name, value } = e.target;
    if (name === 'billId') {
      if (!BILL_ID_REGEX.test(value)) setBillIdError('Format: BIL0001 (3 letters + 4 digits)');
      else setBillIdError('');
    }
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setBillForm({ ...billForm, [name]: value });
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    if (billForm.billId && billForm.farmerId && billForm.billDate && billForm.dueDate && 
        billForm.amount && billForm.description && !billIdError && !farmerIdError && !amountError) {
      setBills([{ ...billForm }, ...bills]);
      setBillForm({ billId: '', farmerId: '', billDate: '', dueDate: '', amount: '', description: '', status: 'Unpaid', category: 'Milk Purchase' });
    }
  };

  const handleDeleteBill = (idx) => setBills(bills.filter((_, i) => i !== idx));

  const handleEditBill = (idx) => {
    setEditBillIdx(idx);
    setEditBillForm(bills[idx]);
    setBillIdError(''); setFarmerIdError(''); setAmountError('');
  };

  const handleEditBillChange = (e) => {
    const { name, value } = e.target;
    if (name === 'billId') {
      if (!BILL_ID_REGEX.test(value)) setBillIdError('Format: BIL0001 (3 letters + 4 digits)');
      else setBillIdError('');
    }
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setEditBillForm({ ...editBillForm, [name]: value });
  };

  const handleSaveEditBill = () => {
    if (editBillIdx !== null && !billIdError && !farmerIdError && !amountError) {
      const updated = [...bills];
      updated[editBillIdx] = editBillForm;
      setBills(updated);
      setEditBillIdx(null);
    }
  };

  // Calculate statistics
  const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const totalBills = bills.reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0);
  const unpaidBills = bills.filter(b => b.status === 'Unpaid').length;
  const overdueBills = bills.filter(b => b.status === 'Overdue').length;

  // Chart data
  const paymentModeData = PAYMENT_MODES.map(mode => ({
    mode,
    count: payments.filter(p => p.paymentMode === mode).length,
    amount: payments.filter(p => p.paymentMode === mode).reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
  }));

  const billCategoryData = BILL_CATEGORIES.map(category => ({
    category,
    amount: bills.filter(b => b.category === category).reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0)
  }));

  const tabLabels = [
    { label: 'Payment Management', icon: <PaymentIcon /> },
    { label: 'Bills & Invoices', icon: <ReceiptIcon /> },
    { label: 'Analytics', icon: <AssessmentIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 3,
        mb: 0,
        background: `linear-gradient(135deg, ${
          ['#9c27b0', '#4caf50', '#2196f3'][tab]
        } 0%, ${
          ['#e91e63', '#8bc34a', '#21cbf3'][tab]
        } 100%)`,
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
            {tabLabels[tab].icon}
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {tabLabels[tab].label}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Comprehensive payment and billing management
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={4} sx={{ mb: 3, mt: 0 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              ml:10,
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUpIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">₹{totalPayments.toLocaleString()}</Typography>
                  <Typography variant="body2">Total Payments</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <HistoryIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">{pendingPayments}</Typography>
                  <Typography variant="body2">Pending Payments</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ReceiptIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">₹{totalBills.toLocaleString()}</Typography>
                  <Typography variant="body2">Total Bills</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #f44336 0%, #ff7043 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingDownIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">{overdueBills}</Typography>
                  <Typography variant="body2">Overdue Bills</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Custom Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={tabObj.label}
              onClick={() => setTab(idx)}
              sx={getTabStyle(idx, tab === idx)}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>

        {/* Payment Management Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.05) 100%)' : 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#9c27b0', width: 48, height: 48 }}>💰</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Payment</Typography>
              </Stack>
              <form onSubmit={handleAddPayment}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={paymentForm.farmerId}
                      onChange={handlePaymentChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234 (letters + 4 digits)"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Payment Date" name="paymentDate" value={paymentForm.paymentDate}
                      onChange={handlePaymentChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Amount (INR)" name="amount" value={paymentForm.amount}
                      onChange={handlePaymentChange} required
                      error={!!amountError}
                      helperText={amountError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Transaction ID" name="transactionId" value={paymentForm.transactionId}
                      onChange={handlePaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Payment Mode" name="paymentMode" value={paymentForm.paymentMode}
                      onChange={handlePaymentChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PAYMENT_MODES.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Status" name="status" value={paymentForm.status}
                      onChange={handlePaymentChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PAYMENT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Remarks" name="remarks" value={paymentForm.remarks}
                      onChange={handlePaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7b1fa2 30%, #c2185b 90%)',
                        }
                      }}
                      disabled={!!farmerIdError || !!amountError}
                    >
                      Add Payment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#9c27b0', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Payment Records
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(156,39,176,0.2)' : '#f3e5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Mode</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Transaction ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(156,39,176,0.05)' } }}>
                      <TableCell><Chip label={payment.farmerId} color="secondary" variant="outlined" /></TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell><Typography fontWeight="bold" color="secondary.main">₹{payment.amount}</Typography></TableCell>
                      <TableCell><Chip label={payment.paymentMode} size="small" color="info" /></TableCell>
                      <TableCell><Chip label={payment.status} color={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'} size="small" /></TableCell>
                      <TableCell>{payment.transactionId}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditPayment(idx)} sx={{ borderRadius: 2 }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDeletePayment(idx)} sx={{ borderRadius: 2 }}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>💰</Avatar>
                          <Typography variant="h6" color="text.secondary">No payments recorded</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Edit Payment Dialog */}
            <Dialog open={editPaymentIdx !== null} onClose={() => setEditPaymentIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(156,39,176,0.1)' : '#f3e5f5', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>✏️</Avatar>
                Edit Payment
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={editPaymentForm.farmerId}
                      onChange={handleEditPaymentChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234 (letters + 4 digits)"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Payment Date" name="paymentDate" value={editPaymentForm.paymentDate}
                      onChange={handleEditPaymentChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Amount (INR)" name="amount" value={editPaymentForm.amount}
                      onChange={handleEditPaymentChange} required
                      error={!!amountError}
                      helperText={amountError}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Transaction ID" name="transactionId" value={editPaymentForm.transactionId}
                      onChange={handleEditPaymentChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Payment Mode" name="paymentMode" value={editPaymentForm.paymentMode}
                      onChange={handleEditPaymentChange} required
                    >
                      {PAYMENT_MODES.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Status" name="status" value={editPaymentForm.status}
                      onChange={handleEditPaymentChange} required
                    >
                      {PAYMENT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Remarks" name="remarks" value={editPaymentForm.remarks}
                      onChange={handleEditPaymentChange}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditPaymentIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditPayment} variant="contained" sx={{ borderRadius: 2 }}
                  disabled={!!farmerIdError || !!amountError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Bills & Invoices Tab */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>📄</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Bill</Typography>
              </Stack>
              <form onSubmit={handleAddBill}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Bill ID" name="billId" value={billForm.billId}
                      onChange={handleBillChange} required
                      error={!!billIdError}
                      helperText={billIdError || "Format: BIL0001"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={billForm.farmerId}
                      onChange={handleBillChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Bill Date" name="billDate" value={billForm.billDate}
                      onChange={handleBillChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Due Date" name="dueDate" value={billForm.dueDate}
                      onChange={handleBillChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Amount (INR)" name="amount" value={billForm.amount}
                      onChange={handleBillChange} required
                      error={!!amountError}
                      helperText={amountError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Category" name="category" value={billForm.category}
                      onChange={handleBillChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_CATEGORIES.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Status" name="status" value={billForm.status}
                      onChange={handleBillChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Description" name="description" value={billForm.description}
                      onChange={handleBillChange} required
                      multiline rows={3}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c 30%, #689f38 90%)',
                        }
                      }}
                      disabled={!!billIdError || !!farmerIdError || !!amountError}
                    >
                      Add Bill
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Bills & Invoices
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Bill ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell><Chip label={bill.billId} color="success" variant="outlined" /></TableCell>
                      <TableCell>{bill.farmerId}</TableCell>
                      <TableCell><Typography fontWeight="bold" color="success.main">₹{bill.amount}</Typography></TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell><Chip label={bill.category} size="small" color="info" /></TableCell>
                      <TableCell><Chip label={bill.status} color={bill.status === 'Paid' ? 'success' : bill.status === 'Overdue' ? 'error' : 'warning'} size="small" /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditBill(idx)} sx={{ borderRadius: 2 }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteBill(idx)} sx={{ borderRadius: 2 }}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📄</Avatar>
                          <Typography variant="h6" color="text.secondary">No bills created</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Edit Bill Dialog */}
            <Dialog open={editBillIdx !== null} onClose={() => setEditBillIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>Edit Bill
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Bill ID" name="billId" value={editBillForm.billId}
                      onChange={handleEditBillChange} required
                      error={!!billIdError}
                      helperText={billIdError || "Format: BIL0001"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={editBillForm.farmerId}
                      onChange={handleEditBillChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Bill Date" name="billDate" value={editBillForm.billDate}
                      onChange={handleEditBillChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Due Date" name="dueDate" value={editBillForm.dueDate}
                      onChange={handleEditBillChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Amount (INR)" name="amount" value={editBillForm.amount}
                      onChange={handleEditBillChange} required
                      error={!!amountError}
                      helperText={amountError}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Category" name="category" value={editBillForm.category}
                      onChange={handleEditBillChange} required
                    >
                      {BILL_CATEGORIES.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select fullWidth label="Status" name="status" value={editBillForm.status}
                      onChange={handleEditBillChange} required
                    >
                      {BILL_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Description" name="description" value={editBillForm.description}
                      onChange={handleEditBillChange} required
                      multiline rows={3}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditBillIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditBill} variant="contained" sx={{ borderRadius: 2 }}
                  disabled={!!billIdError || !!farmerIdError || !!amountError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Analytics Tab */}
        {tab === 2 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Payment Methods Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#9c27b0', '#4caf50', '#2196f3', '#e91e63', '#f44336'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Bill Categories</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={billCategoryData}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Payments;
