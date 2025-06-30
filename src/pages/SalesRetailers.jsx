import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
// For charts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// Validation regex patterns
const NAME_REGEX = /^[A-Za-z\s]+$/;
const LOCATION_REGEX = /^[A-Za-z\s]+$/;
const CONTACT_REGEX = /^\d{10}$/;
const AMOUNT_REGEX = /^\d+$/;

const COLORS = ['#6c63ff', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

const SalesRetailers = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get shared data from context
  const { 
    retailers, 
    addRetailer, 
    updateRetailer, 
    deleteRetailer,
    sales,
    addSale,
    updateSale,
    deleteSale
  } = useAppContext();

  // Local state for retailer forms
  const [retailerForm, setRetailerForm] = useState({ name: '', location: '', contact: '' });
  const [editRetailerIdx, setEditRetailerIdx] = useState(null);
  const [editRetailerForm, setEditRetailerForm] = useState({ name: '', location: '', contact: '' });

  // Local state for sales forms
  const [saleForm, setSaleForm] = useState({ date: '', retailer: '', amount: '' });
  const [editSaleIdx, setEditSaleIdx] = useState(null);
  const [editSaleForm, setEditSaleForm] = useState({ date: '', retailer: '', amount: '' });

  // Validation states
  const [nameError, setNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [contactError, setContactError] = useState('');
  const [amountError, setAmountError] = useState('');

  // Tab state
  const [tab, setTab] = useState(0);

  // Tab styling function
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#6c63ff' : 'transparent',
        color: isSelected ? '#fff' : '#6c63ff',
        border: '2px solid #6c63ff',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#5a52d5' : '#f8f9ff' }
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
      }
    ];
    return styles[index] || {};
  };

  // Retailer form handlers with validation
  const handleRetailerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      if (!NAME_REGEX.test(value) && value !== '') setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'location') {
      if (!LOCATION_REGEX.test(value) && value !== '') setLocationError('Only alphabets and spaces allowed');
      else setLocationError('');
    }
    if (name === 'contact') {
      if (!/^\d{0,10}$/.test(value)) setContactError('Only numbers, max 10 digits');
      else if (value.length === 10 || value.length === 0) setContactError('');
      else setContactError('Contact must be 10 digits');
    }
    setRetailerForm({ ...retailerForm, [name]: value });
  };

  const handleAddRetailer = (e) => {
    e.preventDefault();
    
    // Check if retailer name already exists
    const existingRetailer = retailers.find(r => r.name.toLowerCase() === retailerForm.name.toLowerCase());
    if (existingRetailer) {
      setNameError('Retailer name already exists');
      return;
    }

    // Check if contact already exists
    const existingContact = retailers.find(r => r.contact === retailerForm.contact);
    if (existingContact) {
      setContactError('Contact number already registered');
      return;
    }

    // Final validation
    const nameValid = NAME_REGEX.test(retailerForm.name);
    const locationValid = LOCATION_REGEX.test(retailerForm.location);
    const contactValid = CONTACT_REGEX.test(retailerForm.contact);

    setNameError(nameValid ? '' : 'Only alphabets and spaces allowed');
    setLocationError(locationValid ? '' : 'Only alphabets and spaces allowed');
    setContactError(contactValid ? '' : 'Contact must be 10 digits');

    if (nameValid && locationValid && contactValid) {
      addRetailer({ ...retailerForm });
      setRetailerForm({ name: '', location: '', contact: '' });
    }
  };

  const handleDeleteRetailer = (idx) => deleteRetailer(idx);
  
  const handleEditRetailer = (idx) => {
    setEditRetailerIdx(idx);
    setEditRetailerForm(retailers[idx]);
    setNameError('');
    setLocationError('');
    setContactError('');
  };

  const handleEditRetailerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      if (!NAME_REGEX.test(value) && value !== '') setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'location') {
      if (!LOCATION_REGEX.test(value) && value !== '') setLocationError('Only alphabets and spaces allowed');
      else setLocationError('');
    }
    if (name === 'contact') {
      if (!/^\d{0,10}$/.test(value)) setContactError('Only numbers, max 10 digits');
      else if (value.length === 10 || value.length === 0) setContactError('');
      else setContactError('Contact must be 10 digits');
    }
    setEditRetailerForm({ ...editRetailerForm, [name]: value });
  };

  const handleSaveEditRetailer = () => {
    const nameValid = NAME_REGEX.test(editRetailerForm.name);
    const locationValid = LOCATION_REGEX.test(editRetailerForm.location);
    const contactValid = CONTACT_REGEX.test(editRetailerForm.contact);

    setNameError(nameValid ? '' : 'Only alphabets and spaces allowed');
    setLocationError(locationValid ? '' : 'Only alphabets and spaces allowed');
    setContactError(contactValid ? '' : 'Contact must be 10 digits');

    if (editRetailerIdx !== null && nameValid && locationValid && contactValid) {
      updateRetailer(editRetailerIdx, editRetailerForm);
      setEditRetailerIdx(null);
    }
  };

  // Sales form handlers with validation
  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      if (!AMOUNT_REGEX.test(value) && value !== '') setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setSaleForm({ ...saleForm, [name]: value });
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    const amountValid = AMOUNT_REGEX.test(saleForm.amount);
    setAmountError(amountValid ? '' : 'Only numbers allowed');
    if (saleForm.date && saleForm.retailer && amountValid) {
      addSale({ ...saleForm });
      setSaleForm({ date: '', retailer: '', amount: '' });
    }
  };

  const handleDeleteSale = (idx) => deleteSale(idx);
  
  const handleEditSale = (idx) => { 
    setEditSaleIdx(idx); 
    setEditSaleForm(sales[idx]); 
    setAmountError(''); 
  };

  const handleEditSaleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      if (!AMOUNT_REGEX.test(value) && value !== '') setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setEditSaleForm({ ...editSaleForm, [name]: value });
  };

  const handleSaveEditSale = () => {
    const amountValid = AMOUNT_REGEX.test(editSaleForm.amount);
    setAmountError(amountValid ? '' : 'Only numbers allowed');
    if (editSaleIdx !== null && amountValid) {
      updateSale(editSaleIdx, editSaleForm);
      setEditSaleIdx(null);
    }
  };

  // Analytics calculations
  const totalRetailers = retailers.length;
  const totalSales = sales.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const avgSaleAmount = sales.length > 0 ? totalSales / sales.length : 0;
  const topRetailer = sales.length > 0
    ? sales.reduce((a, b) => (Number(a.amount) > Number(b.amount) ? a : b)).retailer
    : 'No sales yet';

  // Chart data
  const salesByRetailer = retailers.map(retailer => ({
    name: retailer.name,
    sales: sales.filter(s => s.retailer === retailer.name).reduce((sum, s) => sum + Number(s.amount), 0)
  })).filter(item => item.sales > 0);

  const monthlySales = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + Number(sale.amount);
    return acc;
  }, {});

  const monthlyData = Object.entries(monthlySales).map(([month, amount]) => ({
    month,
    amount
  }));

  const tabLabels = [
    { label: 'Retailers', icon: <StoreIcon /> },
    { label: 'Sales', icon: <AttachMoneyIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: `linear-gradient(135deg, ${
          ['#6c63ff', '#4caf50'][tab]
        } 0%, ${
          ['#48c6ef', '#8bc34a'][tab]
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
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 80, height: 80 }}>
            {tabLabels[tab].icon}
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              Sales & Retailers Management
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Manage your retail network and track sales performance
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with proper spacing */}
      <Box sx={{ px: 3 }}>
        {/* Analytics Cards with improved alignment */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, flexShrink: 0 }}>
                  <StoreIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                    {totalRetailers}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    Total Retailers
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Active partners
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, flexShrink: 0 }}>
                  <AttachMoneyIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ lineHeight: 1.2, fontSize: '1.8rem' }}>
                    ₹{(totalSales / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    Total Sales
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Revenue generated
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, flexShrink: 0 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ lineHeight: 1.2, fontSize: '1.8rem' }}>
                    ₹{(avgSaleAmount / 1000).toFixed(1)}K
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    Avg Sale
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Per transaction
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, flexShrink: 0 }}>
                  <EmojiEventsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold" 
                    sx={{ 
                      lineHeight: 1.2, 
                      fontSize: '1.4rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {topRetailer}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    Top Retailer
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Best performer
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1' }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 400 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Sales by Retailer
              </Typography>
              <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByRetailer}
                      dataKey="sales"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      label={({ name, value }) => `${name}: ₹${(value/1000).toFixed(1)}K`}
                    >
                      {salesByRetailer.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: '1' }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 400 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Monthly Sales Trend
              </Typography>
              <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        </Box>

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

        {/* Retailers Tab */}
        {tab === 0 && (
          <>
            {/* Add Retailer Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(108,99,255,0.05) 100%)' : 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#6c63ff', width: 48, height: 48 }}>🏪</Avatar>
                <Typography variant="h5" fontWeight="bold">Add New Retailer</Typography>
              </Stack>
              <form onSubmit={handleAddRetailer}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Retailer Name" name="name" value={retailerForm.name}
                      onChange={handleRetailerChange} required
                      error={!!nameError}
                      helperText={nameError || "Only alphabets and spaces allowed"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Location" name="location" value={retailerForm.location}
                      onChange={handleRetailerChange} required
                      error={!!locationError}
                      helperText={locationError || "City or area name"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Contact" name="contact" value={retailerForm.contact}
                      onChange={handleRetailerChange} required
                      error={!!contactError}
                      helperText={contactError || "10-digit mobile number"}
                      inputProps={{ maxLength: 10 }}
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
                        background: 'linear-gradient(45deg, #6c63ff 30%, #48c6ef 90%)',
                        boxShadow: '0 3px 5px 2px rgba(108, 99, 255, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a52d5 30%, #3ba3d4 90%)',
                        }
                      }}
                      disabled={!!nameError || !!locationError || !!contactError}
                    >
                      Add Retailer
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Retailers Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#6c63ff', mr: 2, width: 32, height: 32 }}>🏪</Avatar>
              Retailers Directory
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(108,99,255,0.2)' : '#f8f9ff' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Sales</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {retailers.map((retailer, idx) => {
                    const retailerSales = sales.filter(s => s.retailer === retailer.name).reduce((sum, s) => sum + Number(s.amount), 0);
                    return (
                      <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(108,99,255,0.05)' } }}>
                        <TableCell><Chip label={retailer.name} color="primary" variant="outlined" /></TableCell>
                        <TableCell>{retailer.location}</TableCell>
                        <TableCell>{retailer.contact}</TableCell>
                        <TableCell>
                          <Typography fontWeight="bold" color="success.main">
                            ₹{retailerSales.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton color="primary" onClick={() => handleEditRetailer(idx)} sx={{ borderRadius: 2 }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteRetailer(idx)} sx={{ borderRadius: 2 }}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {retailers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🏪</Avatar>
                          <Typography variant="h6" color="text.secondary">No retailers registered</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Sales Tab */}
        {tab === 1 && (
          <>
            {/* Add Sale Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>💰</Avatar>
                <Typography variant="h5" fontWeight="bold">Record New Sale</Typography>
              </Stack>
              <form onSubmit={handleAddSale}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Sale Date" name="date" value={saleForm.date}
                      onChange={handleSaleChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select fullWidth label="Retailer" name="retailer" value={saleForm.retailer}
                      onChange={handleSaleChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {retailers.map(retailer => (
                        <MenuItem key={retailer.name} value={retailer.name}>
                          {retailer.name} - {retailer.location}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Amount (₹)" name="amount" value={saleForm.amount}
                      onChange={handleSaleChange} required
                      error={!!amountError}
                      helperText={amountError || "Sale amount in rupees"}
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
                      disabled={!!amountError}
                    >
                      Record Sale
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Sales Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>💰</Avatar>
              Sales Records
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Retailer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell><Chip label={sale.retailer} color="success" variant="outlined" /></TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          ₹{Number(sale.amount).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditSale(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteSale(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>💰</Avatar>
                          <Typography variant="h6" color="text.secondary">No sales recorded</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Edit Retailer Dialog */}
        <Dialog open={editRetailerIdx !== null} onClose={() => setEditRetailerIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(108,99,255,0.1)' : '#f8f9ff', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#6c63ff', mr: 2 }}>✏️</Avatar>Edit Retailer
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Retailer Name" name="name" value={editRetailerForm.name} 
                  onChange={handleEditRetailerChange} sx={{ mb: 2 }} required 
                  error={!!nameError} helperText={nameError} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Location" name="location" value={editRetailerForm.location} 
                  onChange={handleEditRetailerChange} sx={{ mb: 2 }} required 
                  error={!!locationError} helperText={locationError} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Contact" name="contact" value={editRetailerForm.contact} 
                  onChange={handleEditRetailerChange} sx={{ mb: 2 }} required 
                  error={!!contactError} helperText={contactError} 
                  inputProps={{ maxLength: 10 }} 
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditRetailerIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditRetailer} variant="contained" sx={{ borderRadius: 2 }}
              disabled={!!nameError || !!locationError || !!contactError}
            >Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Sale Dialog */}
        <Dialog open={editSaleIdx !== null} onClose={() => setEditSaleIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>Edit Sale
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Sale Date" name="date" value={editSaleForm.date} 
                  onChange={handleEditSaleChange} type="date"
                  InputLabelProps={{ shrink: true }} required sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  select fullWidth label="Retailer" name="retailer" value={editSaleForm.retailer} 
                  onChange={handleEditSaleChange} required sx={{ mb: 2 }}
                >
                  {retailers.map(retailer => (
                    <MenuItem key={retailer.name} value={retailer.name}>
                      {retailer.name} - {retailer.location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Amount (₹)" name="amount" value={editSaleForm.amount} 
                  onChange={handleEditSaleChange} required 
                  error={!!amountError} helperText={amountError} 
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditSaleIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditSale} variant="contained" sx={{ borderRadius: 2 }}
              disabled={!!amountError}
            >Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SalesRetailers;
