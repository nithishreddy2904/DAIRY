import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RouteIcon from '@mui/icons-material/Route';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTheme } from '@mui/material/styles';
// For charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bike', 'Refrigerated Truck'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'Electric', 'CNG'];
const VEHICLE_STATUS = ['Available', 'In Transit', 'Maintenance', 'Out of Service'];
const ROUTES = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
const DELIVERY_STATUS = ['Scheduled', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

// Validation regex patterns
const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
const DRIVER_NAME_REGEX = /^[A-Za-z\s]+$/;
const CAPACITY_REGEX = /^[0-9]+$/;

const Logistics = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Vehicles state
  const [vehicleForm, setVehicleForm] = useState({ 
    number: '', type: '', driver: '', capacity: '', status: 'Available', fuelType: 'Diesel' 
  });
  const [vehicles, setVehicles] = useState([
    { number: 'AP09CD1234', type: 'Truck', driver: 'Rajesh Kumar', capacity: '2000', status: 'Available', fuelType: 'Diesel' },
    { number: 'TS10XY5678', type: 'Van', driver: 'Suresh Reddy', capacity: '800', status: 'In Transit', fuelType: 'Petrol' },
    { number: 'KA05AB9876', type: 'Refrigerated Truck', driver: 'Priya Sharma', capacity: '1500', status: 'Available', fuelType: 'Diesel' }
  ]);
  const [editVehicleIdx, setEditVehicleIdx] = useState(null);
  const [editVehicleForm, setEditVehicleForm] = useState({ 
    number: '', type: '', driver: '', capacity: '', status: 'Available', fuelType: 'Diesel' 
  });

  // Validation errors
  const [vehicleNumberError, setVehicleNumberError] = useState('');
  const [driverNameError, setDriverNameError] = useState('');
  const [capacityError, setCapacityError] = useState('');

  // Deliveries state
  const [deliveryForm, setDeliveryForm] = useState({ 
    id: '', date: '', vehicle: '', route: '', status: 'Scheduled', 
    priority: 'Medium', estimatedTime: '', distance: '' 
  });
  const [deliveries, setDeliveries] = useState([
    { id: 'DEL001', date: '2025-06-10', vehicle: 'AP09CD1234', route: 'North Zone', status: 'Delivered', priority: 'High', estimatedTime: '2 hours', distance: '45 km' },
    { id: 'DEL002', date: '2025-06-09', vehicle: 'TS10XY5678', route: 'East Zone', status: 'In Transit', priority: 'Medium', estimatedTime: '1.5 hours', distance: '32 km' },
    { id: 'DEL003', date: '2025-06-08', vehicle: 'KA05AB9876', route: 'South Zone', status: 'Scheduled', priority: 'Low', estimatedTime: '3 hours', distance: '67 km' }
  ]);
  const [editDeliveryIdx, setEditDeliveryIdx] = useState(null);
  const [editDeliveryForm, setEditDeliveryForm] = useState({ 
    id: '', date: '', vehicle: '', route: '', status: 'Scheduled', 
    priority: 'Medium', estimatedTime: '', distance: '' 
  });

  // Vehicle form handlers with validation
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const upperValue = value.toUpperCase();
      if (!VEHICLE_NUMBER_REGEX.test(upperValue) && upperValue !== '') {
        setVehicleNumberError('Format: XX00XX0000 (2 letters, 2 numbers, 2 letters, 4 numbers)');
      } else {
        setVehicleNumberError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: upperValue });
    } else if (name === 'driver') {
      if (!DRIVER_NAME_REGEX.test(value) && value !== '') {
        setDriverNameError('Only alphabets and spaces allowed');
      } else {
        setDriverNameError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: value });
    } else if (name === 'capacity') {
      if (!CAPACITY_REGEX.test(value) && value !== '') {
        setCapacityError('Only numbers allowed');
      } else {
        setCapacityError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: value });
    } else {
      setVehicleForm({ ...vehicleForm, [name]: value });
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (vehicleForm.number && vehicleForm.type && vehicleForm.driver && vehicleForm.capacity && 
        !vehicleNumberError && !driverNameError && !capacityError) {
      setVehicles([{ ...vehicleForm }, ...vehicles]);
      setVehicleForm({ number: '', type: '', driver: '', capacity: '', status: 'Available', fuelType: 'Diesel' });
    }
  };

  const handleDeleteVehicle = (idx) => setVehicles(vehicles.filter((_, i) => i !== idx));

  const handleEditVehicle = (idx) => { 
    setEditVehicleIdx(idx); 
    setEditVehicleForm(vehicles[idx]);
    setVehicleNumberError(''); setDriverNameError(''); setCapacityError('');
  };

  const handleEditVehicleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const upperValue = value.toUpperCase();
      if (!VEHICLE_NUMBER_REGEX.test(upperValue) && upperValue !== '') {
        setVehicleNumberError('Format: XX00XX0000 (2 letters, 2 numbers, 2 letters, 4 numbers)');
      } else {
        setVehicleNumberError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: upperValue });
    } else if (name === 'driver') {
      if (!DRIVER_NAME_REGEX.test(value) && value !== '') {
        setDriverNameError('Only alphabets and spaces allowed');
      } else {
        setDriverNameError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    } else if (name === 'capacity') {
      if (!CAPACITY_REGEX.test(value) && value !== '') {
        setCapacityError('Only numbers allowed');
      } else {
        setCapacityError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    } else {
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    }
  };

  const handleSaveEditVehicle = () => {
    if (editVehicleIdx !== null && !vehicleNumberError && !driverNameError && !capacityError) {
      const updated = [...vehicles];
      updated[editVehicleIdx] = editVehicleForm;
      setVehicles(updated);
      setEditVehicleIdx(null);
    }
  };

  // Delivery form handlers
  const handleDeliveryChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value });
  };

  const handleAddDelivery = (e) => {
    e.preventDefault();
    if (deliveryForm.id && deliveryForm.date && deliveryForm.vehicle && deliveryForm.route) {
      setDeliveries([{ ...deliveryForm }, ...deliveries]);
      setDeliveryForm({ id: '', date: '', vehicle: '', route: '', status: 'Scheduled', priority: 'Medium', estimatedTime: '', distance: '' });
    }
  };

  const handleDeleteDelivery = (idx) => setDeliveries(deliveries.filter((_, i) => i !== idx));

  const handleEditDelivery = (idx) => { 
    setEditDeliveryIdx(idx); 
    setEditDeliveryForm(deliveries[idx]); 
  };

  const handleEditDeliveryChange = (e) => {
    setEditDeliveryForm({ ...editDeliveryForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditDelivery = () => {
    if (editDeliveryIdx !== null) {
      const updated = [...deliveries];
      updated[editDeliveryIdx] = editDeliveryForm;
      setDeliveries(updated);
      setEditDeliveryIdx(null);
    }
  };

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const activeDeliveries = deliveries.filter(d => d.status === 'In Transit').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'Delivered').length;

  // Chart data
  const routeData = ROUTES.map(route => ({
    route: route.replace(' Zone', ''),
    deliveries: deliveries.filter(d => d.route === route).length
  }));

  const statusData = DELIVERY_STATUS.map(status => ({
    name: status,
    value: deliveries.filter(d => d.status === status).length,
    color: status === 'Delivered' ? '#4caf50' : 
           status === 'In Transit' ? '#2196f3' : 
           status === 'Delayed' ? '#f44336' : 
           status === 'Cancelled' ? '#9e9e9e' : '#ff9800'
  }));

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
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
              Logistics & Distribution
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Smart fleet management and delivery optimization
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with uniform padding */}
      <Box sx={{ px: 8 }}>
        {/* Statistics Cards - 4 cards in one row */}
        <Grid container spacing={5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <LocalShippingIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalVehicles}</Typography>
                  <Typography variant="body1">Total Fleet</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {availableVehicles} available
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{activeDeliveries}</Typography>
                  <Typography variant="body1">Active Routes</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    In transit now
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <SpeedIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{completedDeliveries}</Typography>
                  <Typography variant="body1">Completed</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    This period
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <RouteIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{ROUTES.length}</Typography>
                  <Typography variant="body1">Coverage Zones</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Service areas
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section with proper spacing */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {/* Deliveries by Zone Chart */}
          <Box sx={{ flex: '2' }}>
            <Paper elevation={4} sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: 350,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <RouteIcon sx={{ mr: 2, color: '#1976d2' }} />
                Deliveries by Zone
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="route" stroke={isDark ? '#aaa' : '#666'} />
                    <YAxis allowDecimals={false} stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#333' : 'white', 
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="deliveries" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          {/* Delivery Status Chart */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={4} sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: 350,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SpeedIcon sx={{ mr: 2, color: '#4caf50' }} />
                Delivery Status
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {statusData.filter(item => item.value > 0).map((item, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1 }} />
                        <Typography variant="body2">{item.name}</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Enhanced Add Vehicle Form */}
        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>🚛</Avatar>
            <Typography variant="h5" fontWeight="bold">Fleet Registration</Typography>
          </Stack>
          <form onSubmit={handleAddVehicle}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Vehicle Number" 
                  name="number" 
                  value={vehicleForm.number}
                  onChange={handleVehicleChange} 
                  required 
                  error={!!vehicleNumberError}
                  helperText={vehicleNumberError || "Format: AP09CD1234"}
                  placeholder="AP09CD1234"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Vehicle Type" 
                  name="type" 
                  value={vehicleForm.type}
                  onChange={handleVehicleChange} 
                  required 
                  select 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {VEHICLE_TYPES.map((type, idx) => (
                    <MenuItem value={type} key={idx}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Driver Name" 
                  name="driver" 
                  value={vehicleForm.driver}
                  onChange={handleVehicleChange} 
                  required 
                  error={!!driverNameError}
                  helperText={driverNameError || "Only alphabets and spaces"}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Capacity (Liters)" 
                  name="capacity" 
                  value={vehicleForm.capacity}
                  onChange={handleVehicleChange} 
                  required 
                  error={!!capacityError}
                  helperText={capacityError || "Numbers only"}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Fuel Type" 
                  name="fuelType" 
                  value={vehicleForm.fuelType}
                  onChange={handleVehicleChange} 
                  required 
                  select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {FUEL_TYPES.map((fuel, idx) => (
                    <MenuItem value={fuel} key={idx}>{fuel}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth 
                  label="Status" 
                  name="status" 
                  value={vehicleForm.status}
                  onChange={handleVehicleChange} 
                  required 
                  select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {VEHICLE_STATUS.map((status, idx) => (
                    <MenuItem value={status} key={idx}>{status}</MenuItem>
                  ))}
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
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                    }
                  }}
                  disabled={!!vehicleNumberError || !!driverNameError || !!capacityError}
                >
                  Register Vehicle
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Enhanced Vehicles Table */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 32, height: 32 }}>🚗</Avatar>
          Fleet Management
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8], mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.2)' : '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Vehicle Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Driver</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Fuel Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(25,118,210,0.05)' } }}>
                  <TableCell><Chip label={vehicle.number} color="primary" variant="outlined" /></TableCell>
                  <TableCell><Chip label={vehicle.type} size="small" color="info" /></TableCell>
                  <TableCell>{vehicle.driver}</TableCell>
                  <TableCell><Typography fontWeight="bold" color="primary.main">{vehicle.capacity}L</Typography></TableCell>
                  <TableCell><Chip label={vehicle.fuelType} size="small" /></TableCell>
                  <TableCell>
                    <Chip 
                      label={vehicle.status} 
                      color={vehicle.status === 'Available' ? 'success' : 
                             vehicle.status === 'In Transit' ? 'info' : 
                             vehicle.status === 'Maintenance' ? 'warning' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditVehicle(idx)} sx={{ borderRadius: 2 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteVehicle(idx)} sx={{ borderRadius: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🚛</Avatar>
                      <Typography variant="h6" color="text.secondary">No vehicles registered</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Vehicle Dialog */}
        <Dialog open={editVehicleIdx !== null} onClose={() => setEditVehicleIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>✏️</Avatar>Edit Vehicle
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Vehicle Number" 
                  name="number" 
                  value={editVehicleForm.number} 
                  onChange={handleEditVehicleChange} 
                  required 
                  error={!!vehicleNumberError}
                  helperText={vehicleNumberError || "Format: AP09CD1234"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Type" 
                  name="type" 
                  value={editVehicleForm.type} 
                  onChange={handleEditVehicleChange} 
                  required 
                  select
                >
                  {VEHICLE_TYPES.map((type, idx) => (
                    <MenuItem value={type} key={idx}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Driver" 
                  name="driver" 
                  value={editVehicleForm.driver} 
                  onChange={handleEditVehicleChange} 
                  required 
                  error={!!driverNameError}
                  helperText={driverNameError || "Only alphabets and spaces"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Capacity (L)" 
                  name="capacity" 
                  value={editVehicleForm.capacity} 
                  onChange={handleEditVehicleChange} 
                  required 
                  error={!!capacityError}
                  helperText={capacityError || "Numbers only"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Fuel Type" 
                  name="fuelType" 
                  value={editVehicleForm.fuelType} 
                  onChange={handleEditVehicleChange} 
                  required 
                  select
                >
                  {FUEL_TYPES.map((fuel, idx) => (
                    <MenuItem value={fuel} key={idx}>{fuel}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Status" 
                  name="status" 
                  value={editVehicleForm.status} 
                  onChange={handleEditVehicleChange} 
                  required 
                  select
                >
                  {VEHICLE_STATUS.map((status, idx) => (
                    <MenuItem value={status} key={idx}>{status}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditVehicleIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEditVehicle} 
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={!!vehicleNumberError || !!driverNameError || !!capacityError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Logistics;
