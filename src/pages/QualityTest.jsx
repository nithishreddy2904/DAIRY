import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Alert, LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
// For charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Validation regex patterns
const SAMPLE_ID_REGEX = /^SAMPLE[0-9]{6}$/;
const BATCH_ID_REGEX = /^BATCH[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const TEST_TYPES = ['Routine Test', 'Special Test', 'Compliance Test', 'Research Test'];
const TEST_STATUS = ['Pending', 'In Progress', 'Completed', 'Failed'];
const QUALITY_GRADES = ['A+', 'A', 'B', 'C', 'D'];
const ADULTERATION_TYPES = ['None Detected', 'Water', 'Starch', 'Urea', 'Detergent', 'Salt'];

const QualityTest = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // MODIFIED: Get shared data from context for Dashboard linking
  const { 
    qualityTests,
    setQualityTests,
    farmers,
    generateQualityDistribution
  } = useAppContext();

  // Quality Test State
  const [testForm, setTestForm] = useState({
    id: '', batchId: '', sampleId: '', farmerId: '', farmerName: '', testDate: '', testType: 'Routine Test',
    fatContent: '', proteinContent: '', lactoseContent: '', snfContent: '', phLevel: '', bacteriaCount: '',
    adulteration: 'None Detected', overallGrade: 'A+', status: 'Pending', remarks: '', testedBy: ''
  });

  const [editTestIdx, setEditTestIdx] = useState(null);
  const [editTestForm, setEditTestForm] = useState({
    id: '', batchId: '', sampleId: '', farmerId: '', farmerName: '', testDate: '', testType: 'Routine Test',
    fatContent: '', proteinContent: '', lactoseContent: '', snfContent: '', phLevel: '', bacteriaCount: '',
    adulteration: 'None Detected', overallGrade: 'A+', status: 'Pending', remarks: '', testedBy: ''
  });

  // Validation Errors
  const [sampleIdError, setSampleIdError] = useState('');
  const [batchIdError, setBatchIdError] = useState('');
  const [fatError, setFatError] = useState('');
  const [proteinError, setProteinError] = useState('');
  const [phError, setPhError] = useState('');
  const [bacteriaError, setBacteriaError] = useState('');
  const [testedByError, setTestedByError] = useState('');

  // Quality Test handlers with validation
  const handleTestChange = (e) => {
    const { name, value } = e.target;
    
    // Validation
    if (name === 'sampleId') {
      if (!SAMPLE_ID_REGEX.test(value)) setSampleIdError('Format: SAMPLE000001 (SAMPLE + 6 digits)');
      else setSampleIdError('');
    }
    if (name === 'batchId') {
      if (!BATCH_ID_REGEX.test(value)) setBatchIdError('Format: BATCH0001 (BATCH + 4 digits)');
      else setBatchIdError('');
    }
    if (name === 'fatContent' || name === 'proteinContent' || name === 'lactoseContent' || name === 'snfContent') {
      if (!NUMERIC_REGEX.test(value)) setFatError('Only numbers allowed');
      else setFatError('');
    }
    if (name === 'phLevel') {
      if (!NUMERIC_REGEX.test(value) || (value && (parseFloat(value) < 0 || parseFloat(value) > 14))) {
        setPhError('pH must be between 0-14');
      } else setPhError('');
    }
    if (name === 'bacteriaCount') {
      if (!NUMERIC_REGEX.test(value)) setBacteriaError('Only numbers allowed');
      else setBacteriaError('');
    }
    if (name === 'testedBy') {
      if (!NAME_REGEX.test(value)) setTestedByError('Only alphabets and spaces allowed');
      else setTestedByError('');
    }
    if (name === 'farmerId') {
      const selectedFarmer = farmers.find(f => f.id === value);
      setTestForm({ ...testForm, [name]: value, farmerName: selectedFarmer ? selectedFarmer.name : '' });
      return;
    }

    setTestForm({ ...testForm, [name]: value });
  };

  const handleAddTest = (e) => {
    e.preventDefault();
    if (testForm.batchId && testForm.sampleId && testForm.farmerId && testForm.testDate && 
        testForm.testedBy && !sampleIdError && !batchIdError && !fatError && !proteinError && 
        !phError && !bacteriaError && !testedByError) {
      const newTest = { 
        ...testForm, 
        id: `QT${String(qualityTests.length + 1).padStart(3, '0')}` 
      };
      setQualityTests([newTest, ...qualityTests]);
      setTestForm({
        id: '', batchId: '', sampleId: '', farmerId: '', farmerName: '', testDate: '', testType: 'Routine Test',
        fatContent: '', proteinContent: '', lactoseContent: '', snfContent: '', phLevel: '', bacteriaCount: '',
        adulteration: 'None Detected', overallGrade: 'A+', status: 'Pending', remarks: '', testedBy: ''
      });
    }
  };

  const handleDeleteTest = (idx) => setQualityTests(qualityTests.filter((_, i) => i !== idx));

  const handleEditTest = (idx) => {
    setEditTestIdx(idx);
    setEditTestForm(qualityTests[idx]);
    // Reset errors
    setSampleIdError(''); setBatchIdError(''); setFatError(''); setProteinError(''); 
    setPhError(''); setBacteriaError(''); setTestedByError('');
  };

  const handleEditTestChange = (e) => {
    const { name, value } = e.target;
    
    // Same validation as add form
    if (name === 'sampleId') {
      if (!SAMPLE_ID_REGEX.test(value)) setSampleIdError('Format: SAMPLE000001 (SAMPLE + 6 digits)');
      else setSampleIdError('');
    }
    if (name === 'batchId') {
      if (!BATCH_ID_REGEX.test(value)) setBatchIdError('Format: BATCH0001 (BATCH + 4 digits)');
      else setBatchIdError('');
    }
    if (name === 'fatContent' || name === 'proteinContent' || name === 'lactoseContent' || name === 'snfContent') {
      if (!NUMERIC_REGEX.test(value)) setFatError('Only numbers allowed');
      else setFatError('');
    }
    if (name === 'phLevel') {
      if (!NUMERIC_REGEX.test(value) || (value && (parseFloat(value) < 0 || parseFloat(value) > 14))) {
        setPhError('pH must be between 0-14');
      } else setPhError('');
    }
    if (name === 'bacteriaCount') {
      if (!NUMERIC_REGEX.test(value)) setBacteriaError('Only numbers allowed');
      else setBacteriaError('');
    }
    if (name === 'testedBy') {
      if (!NAME_REGEX.test(value)) setTestedByError('Only alphabets and spaces allowed');
      else setTestedByError('');
    }
    if (name === 'farmerId') {
      const selectedFarmer = farmers.find(f => f.id === value);
      setEditTestForm({ ...editTestForm, [name]: value, farmerName: selectedFarmer ? selectedFarmer.name : '' });
      return;
    }

    setEditTestForm({ ...editTestForm, [name]: value });
  };

  const handleSaveEditTest = () => {
    if (editTestIdx !== null && !sampleIdError && !batchIdError && !fatError && 
        !proteinError && !phError && !bacteriaError && !testedByError) {
      const updated = [...qualityTests];
      updated[editTestIdx] = editTestForm;
      setQualityTests(updated);
      setEditTestIdx(null);
    }
  };

  // MODIFIED: Calculate statistics using shared data
  const totalTests = qualityTests.length;
  const completedTests = qualityTests.filter(t => t.status === 'Completed').length;
  const pendingTests = qualityTests.filter(t => t.status === 'Pending').length;
  const averageScore = qualityTests.length > 0 ? 
    qualityTests.reduce((sum, test) => {
      const gradePoints = { 'A+': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55 };
      return sum + (gradePoints[test.overallGrade] || 0);
    }, 0) / qualityTests.length : 0;

  // MODIFIED: Chart data using shared data and real-time quality distribution
  const qualityDistribution = generateQualityDistribution;
  
  const testTypeData = TEST_TYPES.map(type => ({
    type,
    count: qualityTests.filter(t => t.testType === type).length
  }));

  const monthlyTestData = [
    { month: 'Jan', tests: qualityTests.filter(t => t.testDate?.includes('2025-01')).length },
    { month: 'Feb', tests: qualityTests.filter(t => t.testDate?.includes('2025-02')).length },
    { month: 'Mar', tests: qualityTests.filter(t => t.testDate?.includes('2025-03')).length },
    { month: 'Apr', tests: qualityTests.filter(t => t.testDate?.includes('2025-04')).length },
    { month: 'May', tests: qualityTests.filter(t => t.testDate?.includes('2025-05')).length },
    { month: 'Jun', tests: qualityTests.filter(t => t.testDate?.includes('2025-06')).length }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        borderRadius: 0, p: 3, mb: 2,
        background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
        color: '#fff', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
            <ScienceIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Quality Testing Laboratory
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Real-time quality distribution linked to Dashboard | Average Score: {averageScore.toFixed(1)}%
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Quality Alerts */}
      {pendingTests > 0 && (
        <Box sx={{ px: 3, mb: 3 }}>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AssignmentIcon />
              <Typography fontWeight="bold">
                {pendingTests} quality test(s) are pending completion
              </Typography>
            </Stack>
          </Alert>
        </Box>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ px: 3, mb: 4 }}>
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
                <ScienceIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold">{totalTests}</Typography>
                <Typography variant="body1">Total Tests</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  All records
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
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <VerifiedUserIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold">{completedTests}</Typography>
                <Typography variant="body1">Completed</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Verified results
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
                <AssignmentIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold">{pendingTests}</Typography>
                <Typography variant="body1">Pending</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Need completion
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
                <TrendingUpIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold">{averageScore.toFixed(0)}%</Typography>
                <Typography variant="body1">Avg Score</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Quality rating
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ px: 3 }}>
        {/* Add Quality Test Form */}
        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>🧪</Avatar>
            <Typography variant="h5" fontWeight="bold">Add Quality Test</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Test results update Dashboard quality distribution in real-time
            </Typography>
          </Stack>
          <form onSubmit={handleAddTest}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Batch ID" name="batchId" value={testForm.batchId} onChange={handleTestChange} required
                  error={!!batchIdError} helperText={batchIdError || "Format: BATCH0001"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Sample ID" name="sampleId" value={testForm.sampleId} onChange={handleTestChange} required
                  error={!!sampleIdError} helperText={sampleIdError || "Format: SAMPLE000001"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Farmer" name="farmerId" value={testForm.farmerId} onChange={handleTestChange} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  {farmers.map(farmer => <MenuItem key={farmer.id} value={farmer.id}>{farmer.name} ({farmer.id})</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Test Date" name="testDate" value={testForm.testDate} onChange={handleTestChange} type="date"
                  InputLabelProps={{ shrink: true }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Test Type" name="testType" value={testForm.testType} onChange={handleTestChange} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  {TEST_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tested By" name="testedBy" value={testForm.testedBy} onChange={handleTestChange} required
                  error={!!testedByError} helperText={testedByError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Fat Content %" name="fatContent" value={testForm.fatContent} onChange={handleTestChange}
                  error={!!fatError} helperText={fatError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Protein Content %" name="proteinContent" value={testForm.proteinContent} onChange={handleTestChange}
                  error={!!proteinError} helperText={proteinError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="pH Level" name="phLevel" value={testForm.phLevel} onChange={handleTestChange}
                  error={!!phError} helperText={phError || "Range: 0-14"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Bacteria Count" name="bacteriaCount" value={testForm.bacteriaCount} onChange={handleTestChange}
                  error={!!bacteriaError} helperText={bacteriaError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Overall Grade" name="overallGrade" value={testForm.overallGrade} onChange={handleTestChange} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  {QUALITY_GRADES.map(grade => <MenuItem key={grade} value={grade}>{grade}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Status" name="status" value={testForm.status} onChange={handleTestChange} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  {TEST_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Remarks" name="remarks" value={testForm.remarks} onChange={handleTestChange}
                  multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                  disabled={!!sampleIdError || !!batchIdError || !!fatError || !!proteinError || !!phError || !!bacteriaError || !!testedByError}>
                  Add Quality Test (Updates Dashboard Chart)
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
          Quality Test Records (Linked to Dashboard)
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8], mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Test ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Batch ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Test Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Grade</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Tested By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualityTests.map((test, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                  <TableCell><Chip label={test.id} color="success" variant="outlined" /></TableCell>
                  <TableCell>{test.batchId}</TableCell>
                  <TableCell>{test.farmerName}</TableCell>
                  <TableCell>{test.testDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={test.overallGrade} 
                      color={test.overallGrade === 'A+' || test.overallGrade === 'A' ? 'success' : 
                             test.overallGrade === 'B' ? 'warning' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={test.status} 
                      color={test.status === 'Completed' ? 'success' : 
                             test.status === 'In Progress' ? 'info' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{test.testedBy}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditTest(idx)} sx={{ borderRadius: 2 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTest(idx)} sx={{ borderRadius: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {qualityTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🧪</Avatar>
                      <Typography variant="h6" color="text.secondary">No quality tests found</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quality Distribution (Dashboard Link)</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={qualityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {qualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Monthly Test Trends</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyTestData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tests" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Test Dialog */}
        <Dialog open={editTestIdx !== null} onClose={() => setEditTestIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>Edit Quality Test
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Batch ID" name="batchId" value={editTestForm.batchId} onChange={handleEditTestChange} required
                  error={!!batchIdError} helperText={batchIdError || "Format: BATCH0001"} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Sample ID" name="sampleId" value={editTestForm.sampleId} onChange={handleEditTestChange} required
                  error={!!sampleIdError} helperText={sampleIdError || "Format: SAMPLE000001"} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Farmer" name="farmerId" value={editTestForm.farmerId} onChange={handleEditTestChange} required>
                  {farmers.map(farmer => <MenuItem key={farmer.id} value={farmer.id}>{farmer.name} ({farmer.id})</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Test Date" name="testDate" value={editTestForm.testDate} onChange={handleEditTestChange} type="date"
                  InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Test Type" name="testType" value={editTestForm.testType} onChange={handleEditTestChange} required>
                  {TEST_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tested By" name="testedBy" value={editTestForm.testedBy} onChange={handleEditTestChange} required
                  error={!!testedByError} helperText={testedByError} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Fat Content %" name="fatContent" value={editTestForm.fatContent} onChange={handleEditTestChange}
                  error={!!fatError} helperText={fatError} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Protein Content %" name="proteinContent" value={editTestForm.proteinContent} onChange={handleEditTestChange}
                  error={!!proteinError} helperText={proteinError} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="pH Level" name="phLevel" value={editTestForm.phLevel} onChange={handleEditTestChange}
                  error={!!phError} helperText={phError || "Range: 0-14"} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Bacteria Count" name="bacteriaCount" value={editTestForm.bacteriaCount} onChange={handleEditTestChange}
                  error={!!bacteriaError} helperText={bacteriaError} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Overall Grade" name="overallGrade" value={editTestForm.overallGrade} onChange={handleEditTestChange} required>
                  {QUALITY_GRADES.map(grade => <MenuItem key={grade} value={grade}>{grade}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Status" name="status" value={editTestForm.status} onChange={handleEditTestChange} required>
                  {TEST_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Remarks" name="remarks" value={editTestForm.remarks} onChange={handleEditTestChange}
                  multiline rows={3} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditTestIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditTest} variant="contained" sx={{ borderRadius: 2 }}
              disabled={!!sampleIdError || !!batchIdError || !!fatError || !!proteinError || !!phError || !!bacteriaError || !!testedByError}>
              Save Changes (Updates Dashboard)
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default QualityTest;
