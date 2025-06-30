import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, TextField, MenuItem, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, Grid, Card, Chip, Avatar, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext'; // Corrected path

// Validation regex patterns
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const MilkCollection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get shared data from context
  const { 
    farmers,
    milkEntries, 
    addMilkEntry, 
    updateMilkEntry, 
    deleteMilkEntry 
  } = useAppContext();

  // State for milk entries
  const [milkForm, setMilkForm] = useState({ 
    farmerId: '', 
    date: '', 
    quantity: '', 
    shift: 'Morning' 
  });
  const [editMilkIdx, setEditMilkIdx] = useState(null);
  const [editMilkForm, setEditMilkForm] = useState({ 
    farmerId: '', 
    date: '', 
    quantity: '', 
    shift: 'Morning' 
  });

  // Validation errors
  const [milkFarmerIdError, setMilkFarmerIdError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  // Event handlers
  const handleMilkChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) {
        setMilkFarmerIdError('ID must start with letters and end with 4 digits');
      } else {
        setMilkFarmerIdError('');
      }
    }
    if (name === 'quantity') {
      if (!NUMERIC_REGEX.test(value)) {
        setQuantityError('Only numbers allowed');
      } else {
        setQuantityError('');
      }
    }
    setMilkForm({ ...milkForm, [name]: value });
  };

  const handleMilkSelect = (e) => {
    setMilkForm({ ...milkForm, shift: e.target.value });
  };

  const handleAddMilk = (e) => {
    e.preventDefault();
    if (milkForm.farmerId && milkForm.date && milkForm.quantity && milkForm.shift && 
        !milkFarmerIdError && !quantityError) {
      addMilkEntry({ ...milkForm });
      setMilkForm({ farmerId: '', date: '', quantity: '', shift: 'Morning' });
    }
  };

  const handleDeleteMilk = (idx) => {
    deleteMilkEntry(idx);
  };

  const handleEditMilk = (idx) => {
    setEditMilkIdx(idx);
    setEditMilkForm(milkEntries[idx]);
    setMilkFarmerIdError('');
    setQuantityError('');
  };

  const handleEditMilkChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) {
        setMilkFarmerIdError('ID must start with letters and end with 4 digits');
      } else {
        setMilkFarmerIdError('');
      }
    }
    if (name === 'quantity') {
      if (!NUMERIC_REGEX.test(value)) {
        setQuantityError('Only numbers allowed');
      } else {
        setQuantityError('');
      }
    }
    setEditMilkForm({ ...editMilkForm, [name]: value });
  };

  const handleEditMilkSelect = (e) => {
    setEditMilkForm({ ...editMilkForm, shift: e.target.value });
  };

  const handleSaveEditMilk = () => {
    if (editMilkIdx !== null && !milkFarmerIdError && !quantityError) {
      updateMilkEntry(editMilkIdx, editMilkForm);
      setEditMilkIdx(null);
    }
  };

  // Calculate statistics
  const totalQuantity = milkEntries.reduce((sum, entry) => sum + parseFloat(entry.quantity || '0'), 0);
  const todayEntries = milkEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]);
  const morningEntries = milkEntries.filter(entry => entry.shift === 'Morning').length;
  const eveningEntries = milkEntries.filter(entry => entry.shift === 'Evening').length;

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
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
            <LocalShippingIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              Milk Collection & Tracking
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Monitor daily milk collection from farmers
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with uniform padding */}
      <Box sx={{ px: 3 }}>
        {/* Statistics Cards with proper spacing */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">📊</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalQuantity.toFixed(1)}L</Typography>
                  <Typography variant="body1">Total Collection</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All entries
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
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">📝</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{todayEntries.length}</Typography>
                  <Typography variant="body1">Today's Entries</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Current day
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
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">🌅</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{morningEntries}</Typography>
                  <Typography variant="body1">Morning Shifts</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    AM collections
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">🌆</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{eveningEntries}</Typography>
                  <Typography variant="body1">Evening Shifts</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    PM collections
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Add Milk Entry Form with proper alignment */}
        <Paper elevation={6} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' 
        }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>🥛</Avatar>
            <Typography variant="h5" fontWeight="bold">Add Milk Entry</Typography>
          </Stack>
          <form onSubmit={handleAddMilk}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth 
                  label="Farmer" 
                  name="farmerId" 
                  value={milkForm.farmerId}
                  onChange={handleMilkChange} 
                  required
                  error={!!milkFarmerIdError}
                  helperText={milkFarmerIdError || "Select farmer from list"}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {farmers.map(farmer => (
                    <MenuItem key={farmer.id} value={farmer.id}>
                      {farmer.name} ({farmer.id})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Date" 
                  name="date" 
                  value={milkForm.date}
                  onChange={handleMilkChange} 
                  type="date"
                  InputLabelProps={{ shrink: true }} 
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Quantity (Litres)" 
                  name="quantity" 
                  value={milkForm.quantity}
                  onChange={handleMilkChange} 
                  required
                  error={!!quantityError}
                  helperText={quantityError}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select 
                  fullWidth 
                  label="Shift" 
                  name="shift" 
                  value={milkForm.shift}
                  onChange={handleMilkSelect} 
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                </TextField>
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
                  disabled={!!milkFarmerIdError || !!quantityError}
                >
                  Add Milk Entry
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Milk Collection Records Table */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
          Milk Collection Records
        </Typography>
        
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8',
                '& .MuiTableCell-head': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: isDark ? '#fff' : '#2e7d32'
                }
              }}>
                <TableCell>Farmer ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Quantity (L)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milkEntries.map((entry, idx) => (
                <TableRow key={idx} sx={{ 
                  '&:hover': { 
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease'
                  }
                }}>
                  <TableCell>
                    <Chip label={entry.farmerId} color="success" variant="outlined" />
                  </TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.shift} 
                      size="small" 
                      color={entry.shift === 'Morning' ? 'warning' : 'info'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="success.main">
                      {entry.quantity}L
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditMilk(idx)}
                        sx={{ borderRadius: 2 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteMilk(idx)}
                        sx={{ borderRadius: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {milkEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🥛</Avatar>
                      <Typography variant="h6" color="text.secondary">No milk entries recorded</Typography>
                      <Typography variant="body2" color="text.secondary">Start tracking milk collection using the form above</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={editMilkIdx !== null} onClose={() => setEditMilkIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>
            Edit Milk Entry
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth 
                  label="Farmer" 
                  name="farmerId" 
                  value={editMilkForm.farmerId}
                  onChange={handleEditMilkChange} 
                  required
                  error={!!milkFarmerIdError}
                  helperText={milkFarmerIdError || "Select farmer from list"}
                >
                  {farmers.map(farmer => (
                    <MenuItem key={farmer.id} value={farmer.id}>
                      {farmer.name} ({farmer.id})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Date" 
                  name="date" 
                  value={editMilkForm.date}
                  onChange={handleEditMilkChange} 
                  type="date"
                  InputLabelProps={{ shrink: true }} 
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Quantity (Litres)" 
                  name="quantity" 
                  value={editMilkForm.quantity}
                  onChange={handleEditMilkChange} 
                  required
                  error={!!quantityError}
                  helperText={quantityError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select 
                  fullWidth 
                  label="Shift" 
                  name="shift" 
                  value={editMilkForm.shift}
                  onChange={handleEditMilkSelect} 
                  required
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditMilkIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditMilk} 
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={!!milkFarmerIdError || !!quantityError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MilkCollection;
