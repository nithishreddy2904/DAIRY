import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Slider, Rating, LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Validation regex patterns
const EMPLOYEE_ID_REGEX = /^[A-Z]{3}[0-9]{4}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const DEPARTMENTS = ['Production', 'Quality Control', 'Logistics', 'Administration', 'Sales', 'Maintenance'];
const POSITIONS = ['Manager', 'Supervisor', 'Operator', 'Technician', 'Assistant', 'Analyst'];
const EMPLOYEE_STATUS = ['Active', 'Inactive', 'On Leave', 'Terminated'];
const ATTENDANCE_STATUS = ['Present', 'Absent', 'Late', 'Half Day'];
const TASK_PRIORITIES = ['High', 'Medium', 'Low'];
const TASK_STATUS = ['Assigned', 'In Progress', 'Completed', 'Overdue'];
const PERFORMANCE_RATINGS = ['Excellent', 'Good', 'Average', 'Poor'];

// Employee Satisfaction Parameters with proper weights
const SATISFACTION_PARAMETERS = {
  jobSatisfaction: { weight: 0.30, label: 'Job Satisfaction' },
  workLifeBalance: { weight: 0.25, label: 'Work-Life Balance' },
  compensationSatisfaction: { weight: 0.20, label: 'Compensation Satisfaction' },
  careerGrowth: { weight: 0.15, label: 'Career Growth' },
  workEnvironment: { weight: 0.10, label: 'Work Environment' }
};

const WorkforceManagement = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get shared data from context
  const { 
    employees,
    setEmployees,
    employeeData,
    updateEmployeeData,
    calculateEmployeeSatisfaction
  } = useAppContext();

  const [tab, setTab] = useState(0);

  // Employee State
  const [employeeForm, setEmployeeForm] = useState({
    id: '', name: '', position: '', department: '', phone: '', email: '', 
    salary: '', joinDate: '', status: 'Active'
  });
  const [editEmployeeIdx, setEditEmployeeIdx] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({
    id: '', name: '', position: '', department: '', phone: '', email: '', 
    salary: '', joinDate: '', status: 'Active'
  });

  // Employee Satisfaction Survey State - THESE ARE THE CALCULATION PARAMETERS
  const [surveyForm, setSurveyForm] = useState({
    employeeId: '',
    jobSatisfaction: 5,
    workLifeBalance: 5,
    compensationSatisfaction: 5,
    workEnvironmentRating: 5,
    surveyDate: new Date().toISOString().split('T')[0]
  });

  // Performance Data State (for Career Growth calculation) - CALCULATION PARAMETER
  const [performanceForm, setPerformanceForm] = useState({
    employeeId: '',
    careerGrowthRating: 5,
    performanceScore: 80,
    trainingCompleted: 0,
    attendanceRate: 95
  });

  // Attendance State
  const [attendance, setAttendance] = useState([
    { employeeId: 'EMP0001', date: '2025-06-26', checkIn: '09:00', checkOut: '18:00', hoursWorked: '8', status: 'Present' },
    { employeeId: 'EMP0002', date: '2025-06-26', checkIn: '09:15', checkOut: '18:00', hoursWorked: '7.75', status: 'Late' },
    { employeeId: 'EMP0003', date: '2025-06-26', checkIn: '09:00', checkOut: '18:00', hoursWorked: '8', status: 'Present' }
  ]);

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '', date: '', checkIn: '', checkOut: '', hoursWorked: '', status: 'Present'
  });

  // Task State
  const [tasks, setTasks] = useState([
    { taskId: 'TSK001', employeeId: 'EMP0001', title: 'Quality Control Review', description: 'Review daily quality reports', priority: 'High', status: 'In Progress', dueDate: '2025-06-28', assignedDate: '2025-06-25' },
    { taskId: 'TSK002', employeeId: 'EMP0002', title: 'Equipment Maintenance', description: 'Routine maintenance check', priority: 'Medium', status: 'Assigned', dueDate: '2025-06-30', assignedDate: '2025-06-26' }
  ]);

  const [taskForm, setTaskForm] = useState({
    taskId: '', employeeId: '', title: '', description: '', priority: 'Medium', 
    status: 'Assigned', dueDate: '', assignedDate: ''
  });

  // Performance State
  const [performance, setPerformance] = useState([
    { employeeId: 'EMP0001', month: '2025-06', rating: 'Excellent', goals: 'Improve team leadership', achievements: 'Led successful quality initiative', feedback: 'Outstanding performance' },
    { employeeId: 'EMP0002', month: '2025-06', rating: 'Good', goals: 'Enhance technical skills', achievements: 'Completed advanced training', feedback: 'Consistent performer' }
  ]);

  const [performanceReviewForm, setPerformanceReviewForm] = useState({
    employeeId: '', month: '', rating: 'Good', goals: '', achievements: '', feedback: ''
  });

  // Validation Errors
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [salaryError, setSalaryError] = useState('');

  // Employee handlers with validation
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id') {
      if (!EMPLOYEE_ID_REGEX.test(value)) setEmployeeIdError('Format: EMP0001 (3 letters + 4 digits)');
      else setEmployeeIdError('');
    }
    if (name === 'name') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'phone') {
      if (!PHONE_REGEX.test(value)) setPhoneError('Must be 10 digits');
      else setPhoneError('');
    }
    if (name === 'email') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    if (name === 'salary') {
      if (!NUMERIC_REGEX.test(value)) setSalaryError('Only numbers allowed');
      else setSalaryError('');
    }
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (employeeForm.id && employeeForm.name && employeeForm.position && employeeForm.department && 
        employeeForm.phone && employeeForm.email && employeeForm.salary && employeeForm.joinDate && 
        !employeeIdError && !nameError && !phoneError && !emailError && !salaryError) {
      setEmployees(prev => [...prev, { ...employeeForm }]);
      setEmployeeForm({ id: '', name: '', position: '', department: '', phone: '', email: '', salary: '', joinDate: '', status: 'Active' });
    }
  };

  const handleDeleteEmployee = (idx) => {
    setEmployees(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditEmployee = (idx) => {
    setEditEmployeeIdx(idx);
    setEditEmployeeForm(employees[idx]);
    setEmployeeIdError(''); setNameError(''); setPhoneError(''); setEmailError(''); setSalaryError('');
  };

  const handleEditEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id') {
      if (!EMPLOYEE_ID_REGEX.test(value)) setEmployeeIdError('Format: EMP0001 (3 letters + 4 digits)');
      else setEmployeeIdError('');
    }
    if (name === 'name') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'phone') {
      if (!PHONE_REGEX.test(value)) setPhoneError('Must be 10 digits');
      else setPhoneError('');
    }
    if (name === 'email') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    if (name === 'salary') {
      if (!NUMERIC_REGEX.test(value)) setSalaryError('Only numbers allowed');
      else setSalaryError('');
    }
    setEditEmployeeForm({ ...editEmployeeForm, [name]: value });
  };

  const handleSaveEditEmployee = () => {
    if (editEmployeeIdx !== null && !employeeIdError && !nameError && !phoneError && !emailError && !salaryError) {
      setEmployees(prev => {
        const updated = [...prev];
        updated[editEmployeeIdx] = editEmployeeForm;
        return updated;
      });
      setEditEmployeeIdx(null);
    }
  };

  // Survey handlers - THESE UPDATE THE CALCULATION PARAMETERS
  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurveyForm({ ...surveyForm, [name]: value });
  };

  const handleSurveySliderChange = (name) => (event, value) => {
    setSurveyForm({ ...surveyForm, [name]: value });
  };

  const handleAddSurvey = (e) => {
    e.preventDefault();
    if (surveyForm.employeeId && surveyForm.surveyDate) {
      const newSurvey = { ...surveyForm };
      const existingSurveyIndex = employeeData.surveys.findIndex(s => s.employeeId === surveyForm.employeeId);
      
      if (existingSurveyIndex >= 0) {
        const updatedSurveys = [...employeeData.surveys];
        updatedSurveys[existingSurveyIndex] = newSurvey;
        updateEmployeeData({ surveys: updatedSurveys });
      } else {
        updateEmployeeData({ surveys: [...employeeData.surveys, newSurvey] });
      }
      
      setSurveyForm({
        employeeId: '',
        jobSatisfaction: 5,
        workLifeBalance: 5,
        compensationSatisfaction: 5,
        workEnvironmentRating: 5,
        surveyDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Performance handlers - THESE UPDATE THE CALCULATION PARAMETERS
  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;
    setPerformanceForm({ ...performanceForm, [name]: value });
  };

  const handlePerformanceSliderChange = (name) => (event, value) => {
    setPerformanceForm({ ...performanceForm, [name]: value });
  };

  const handleAddPerformance = (e) => {
    e.preventDefault();
    if (performanceForm.employeeId) {
      const newPerformance = { ...performanceForm };
      const existingPerformanceIndex = employeeData.performanceData.findIndex(p => p.employeeId === performanceForm.employeeId);
      
      if (existingPerformanceIndex >= 0) {
        const updatedPerformance = [...employeeData.performanceData];
        updatedPerformance[existingPerformanceIndex] = newPerformance;
        updateEmployeeData({ performanceData: updatedPerformance });
      } else {
        updateEmployeeData({ performanceData: [...employeeData.performanceData, newPerformance] });
      }
      
      setPerformanceForm({
        employeeId: '',
        careerGrowthRating: 5,
        performanceScore: 80,
        trainingCompleted: 0,
        attendanceRate: 95
      });
    }
  };

  // Attendance handlers
  const handleAttendanceChange = (e) => {
    setAttendanceForm({ ...attendanceForm, [e.target.name]: e.target.value });
  };

  const handleAddAttendance = (e) => {
    e.preventDefault();
    if (attendanceForm.employeeId && attendanceForm.date && attendanceForm.checkIn && attendanceForm.checkOut) {
      setAttendance(prev => [...prev, { ...attendanceForm }]);
      setAttendanceForm({ employeeId: '', date: '', checkIn: '', checkOut: '', hoursWorked: '', status: 'Present' });
    }
  };

  const handleDeleteAttendance = (idx) => {
    setAttendance(prev => prev.filter((_, i) => i !== idx));
  };

  // Task handlers
  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskForm.taskId && taskForm.employeeId && taskForm.title && taskForm.description && taskForm.dueDate) {
      setTasks(prev => [...prev, { ...taskForm }]);
      setTaskForm({ taskId: '', employeeId: '', title: '', description: '', priority: 'Medium', status: 'Assigned', dueDate: '', assignedDate: '' });
    }
  };

  const handleDeleteTask = (idx) => {
    setTasks(prev => prev.filter((_, i) => i !== idx));
  };

  // Performance Review handlers
  const handlePerformanceReviewChange = (e) => {
    setPerformanceReviewForm({ ...performanceReviewForm, [e.target.name]: e.target.value });
  };

  const handleAddPerformanceReview = (e) => {
    e.preventDefault();
    if (performanceReviewForm.employeeId && performanceReviewForm.month && performanceReviewForm.rating) {
      setPerformance(prev => [...prev, { ...performanceReviewForm }]);
      setPerformanceReviewForm({ employeeId: '', month: '', rating: 'Good', goals: '', achievements: '', feedback: '' });
    }
  };

  const handleDeletePerformanceReview = (idx) => {
    setPerformance(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const pendingTasks = tasks.filter(t => t.status === 'Assigned' || t.status === 'In Progress').length;
  const employeeSatisfaction = calculateEmployeeSatisfaction;

  // Chart data
  const departmentData = DEPARTMENTS.map(dept => ({
    department: dept,
    count: employees.filter(e => e.department === dept).length
  })).filter(item => item.count > 0);

  const attendanceData = ATTENDANCE_STATUS.map(status => ({
    status,
    count: attendance.filter(a => a.status === status).length
  })).filter(item => item.count > 0);

  const satisfactionData = [
    { name: 'Satisfied', value: employeeSatisfaction, color: '#4caf50' },
    { name: 'Needs Improvement', value: 100 - employeeSatisfaction, color: '#ff9800' }
  ];

  // Satisfaction breakdown by parameter
  const satisfactionBreakdown = Object.entries(SATISFACTION_PARAMETERS).map(([key, param]) => {
    const avgScore = employeeData.surveys.length > 0 
      ? employeeData.surveys.reduce((sum, survey) => sum + (survey[key] || 5), 0) / employeeData.surveys.length
      : 5;
    return {
      parameter: param.label,
      score: (avgScore * 10).toFixed(1),
      weight: (param.weight * 100).toFixed(0)
    };
  });

  const tabLabels = [
    { label: 'Employee Management', icon: <PeopleIcon /> },
    { label: 'Satisfaction Survey', icon: <SentimentSatisfiedIcon /> },
    { label: 'Performance Data', icon: <TrendingUpIcon /> },
    { label: 'Attendance Tracking', icon: <AccessTimeIcon /> },
    { label: 'Task Assignment', icon: <AssignmentIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #795548 0%, #8d6e63 100%)',
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
            <SentimentSatisfiedIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              Workforce Management
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Employee Satisfaction: {employeeSatisfaction}% | Comprehensive workforce management system
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with proper spacing */}
      <Box sx={{ px: 3 }}>
        {/* Statistics Cards */}
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
                  <PeopleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalEmployees}</Typography>
                  <Typography variant="body1">Total Employees</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All registered
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
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{activeEmployees}</Typography>
                  <Typography variant="body1">Active Employees</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Currently working
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
                  <AccessTimeIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{presentToday}</Typography>
                  <Typography variant="body1">Present Today</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Attendance marked
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #795548 0%, #8d6e63 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <SentimentSatisfiedIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{employeeSatisfaction}%</Typography>
                  <Typography variant="body1">Satisfaction</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Employee rating
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Employee Department Distribution */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              height: 350,
              borderRadius: 2,
              borderTop: '4px solid #2196f3',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Employee Department Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          {/* Satisfaction Breakdown */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              height: 350,
              borderRadius: 2,
              borderTop: '4px solid #795548',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Satisfaction Parameter Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={satisfactionBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#f0f0f0'} />
                    <XAxis dataKey="parameter" stroke={isDark ? '#aaa' : '#666'} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#795548" name="Score %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Custom Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={tabObj.label}
              onClick={() => setTab(idx)}
              sx={{
                borderRadius: '25px',
                backgroundColor: tab === idx ? '#795548' : 'transparent',
                color: tab === idx ? '#fff' : '#795548',
                border: '2px solid #795548',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: '140px',
                margin: '0 4px',
                '&:hover': { backgroundColor: tab === idx ? '#6d4c41' : '#efebe9' }
              }}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>

        {/* Tab Content */}
        {tab === 0 && (
          <>
            {/* Add Employee Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(121,85,72,0.1) 0%, rgba(121,85,72,0.05) 100%)' : 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#795548', width: 48, height: 48 }}>👤</Avatar>
                <Typography variant="h5" fontWeight="bold">Add New Employee</Typography>
              </Stack>
              <form onSubmit={handleAddEmployee}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Employee ID" name="id" value={employeeForm.id}
                      onChange={handleEmployeeChange} required
                      error={!!employeeIdError}
                      helperText={employeeIdError || "Format: EMP0001"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Full Name" name="name" value={employeeForm.name}
                      onChange={handleEmployeeChange} required
                      error={!!nameError}
                      helperText={nameError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Position" name="position" value={employeeForm.position}
                      onChange={handleEmployeeChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {POSITIONS.map(pos => <MenuItem key={pos} value={pos}>{pos}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Department" name="department" value={employeeForm.department}
                      onChange={handleEmployeeChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {DEPARTMENTS.map(dept => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Phone" name="phone" value={employeeForm.phone}
                      onChange={handleEmployeeChange} required
                      error={!!phoneError}
                      helperText={phoneError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Email" name="email" value={employeeForm.email}
                      onChange={handleEmployeeChange} required
                      error={!!emailError}
                      helperText={emailError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Salary" name="salary" value={employeeForm.salary}
                      onChange={handleEmployeeChange} required
                      error={!!salaryError}
                      helperText={salaryError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Join Date" name="joinDate" value={employeeForm.joinDate}
                      onChange={handleEmployeeChange} type="date"
                      InputLabelProps={{ shrink: true }} required
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
                        background: 'linear-gradient(45deg, #795548 30%, #8d6e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(121, 85, 72, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6d4c41 30%, #795548 90%)',
                        }
                      }}
                      disabled={!!employeeIdError || !!nameError || !!phoneError || !!emailError || !!salaryError}
                    >
                      Add Employee
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Employee Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#795548', mr: 2, width: 32, height: 32 }}>👥</Avatar>
              Employee Directory
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.2)' : '#efebe9' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(121,85,72,0.05)' } }}>
                      <TableCell><Chip label={employee.id} color="primary" variant="outlined" /></TableCell>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{employee.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{employee.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell><Chip label={employee.department} size="small" color="info" /></TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.status} 
                          color={employee.status === 'Active' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditEmployee(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteEmployee(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>👤</Avatar>
                          <Typography variant="h6" color="text.secondary">No employees registered</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Employee Satisfaction Survey Tab - CALCULATION PARAMETERS */}
        {tab === 1 && (
          <>
            {/* Add Survey Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(121,85,72,0.1) 0%, rgba(121,85,72,0.05) 100%)' : 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#795548', width: 48, height: 48 }}>😊</Avatar>
                <Typography variant="h5" fontWeight="bold">Employee Satisfaction Survey</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  These parameters calculate the Employee Satisfaction shown on Dashboard
                </Typography>
              </Stack>
              <form onSubmit={handleAddSurvey}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Employee" name="employeeId" value={surveyForm.employeeId}
                      onChange={handleSurveyChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Survey Date" name="surveyDate" value={surveyForm.surveyDate}
                      onChange={handleSurveyChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  {/* Job Satisfaction - 30% Weight */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <WorkIcon sx={{ mr: 1, color: '#795548' }} />
                      Job Satisfaction (Weight: 30%)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Rate your overall job satisfaction including work environment, role clarity, and job security
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">Poor</Typography>
                        <Slider
                          value={surveyForm.jobSatisfaction}
                          onChange={handleSurveySliderChange('jobSatisfaction')}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">Excellent</Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Work-Life Balance - 25% Weight */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, color: '#795548' }} />
                      Work-Life Balance (Weight: 25%)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Rate your work-life balance including flexible scheduling and personal time respect
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">Poor</Typography>
                        <Slider
                          value={surveyForm.workLifeBalance}
                          onChange={handleSurveySliderChange('workLifeBalance')}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">Excellent</Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Compensation Satisfaction - 20% Weight */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: '#795548' }} />
                      Compensation Satisfaction (Weight: 20%)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Rate your satisfaction with salary, benefits, and incentive programs
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">Poor</Typography>
                        <Slider
                          value={surveyForm.compensationSatisfaction}
                          onChange={handleSurveySliderChange('compensationSatisfaction')}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">Excellent</Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Work Environment - 10% Weight */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ mr: 1, color: '#795548' }} />
                      Work Environment (Weight: 10%)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Rate your work environment including safety standards, equipment quality, and workplace culture
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">Poor</Typography>
                        <Slider
                          value={surveyForm.workEnvironmentRating}
                          onChange={handleSurveySliderChange('workEnvironmentRating')}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">Excellent</Typography>
                      </Stack>
                    </Box>
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
                        background: 'linear-gradient(45deg, #795548 30%, #8d6e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(121, 85, 72, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6d4c41 30%, #795548 90%)',
                        }
                      }}
                    >
                      Submit Survey (Updates Dashboard)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Survey Results Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#795548', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Survey Results (Used for Dashboard Calculation)
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.2)' : '#efebe9' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Job Satisfaction (30%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Work-Life Balance (25%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Compensation (20%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Work Environment (10%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Survey Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.surveys.map((survey, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(121,85,72,0.05)' } }}>
                      <TableCell><Chip label={survey.employeeId} color="primary" variant="outlined" /></TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={survey.jobSatisfaction / 2} readOnly size="small" />
                          <Typography variant="body2" fontWeight="bold">{survey.jobSatisfaction}/10</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={survey.workLifeBalance / 2} readOnly size="small" />
                          <Typography variant="body2" fontWeight="bold">{survey.workLifeBalance}/10</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={survey.compensationSatisfaction / 2} readOnly size="small" />
                          <Typography variant="body2" fontWeight="bold">{survey.compensationSatisfaction}/10</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={survey.workEnvironmentRating / 2} readOnly size="small" />
                          <Typography variant="body2" fontWeight="bold">{survey.workEnvironmentRating}/10</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{survey.surveyDate}</TableCell>
                    </TableRow>
                  ))}
                  {employeeData.surveys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>😊</Avatar>
                          <Typography variant="h6" color="text.secondary">No surveys completed</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Performance Data Tab - CALCULATION PARAMETER (Career Growth) */}
        {tab === 2 && (
          <>
            {/* Add Performance Data Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(121,85,72,0.1) 0%, rgba(121,85,72,0.05) 100%)' : 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#795548', width: 48, height: 48 }}>📈</Avatar>
                <Typography variant="h5" fontWeight="bold">Employee Performance Data</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Career Growth Rating (15% weight) contributes to Employee Satisfaction
                </Typography>
              </Stack>
              <form onSubmit={handleAddPerformance}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Employee" name="employeeId" value={performanceForm.employeeId}
                      onChange={handlePerformanceChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Training Completed" name="trainingCompleted" value={performanceForm.trainingCompleted}
                      onChange={handlePerformanceChange} type="number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  {/* Career Growth Rating - 15% Weight for Employee Satisfaction */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ mr: 1, color: '#795548' }} />
                      Career Growth Rating (Weight: 15% for Employee Satisfaction)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Rate career growth opportunities including training and promotion prospects
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">Poor</Typography>
                        <Slider
                          value={performanceForm.careerGrowthRating}
                          onChange={handlePerformanceSliderChange('careerGrowthRating')}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">Excellent</Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Performance Score */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ mr: 1, color: '#795548' }} />
                      Performance Score
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Overall performance score based on KPIs and objectives
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">0%</Typography>
                        <Slider
                          value={performanceForm.performanceScore}
                          onChange={handlePerformanceSliderChange('performanceScore')}
                          min={0}
                          max={100}
                          step={5}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">100%</Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Attendance Rate */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, color: '#795548' }} />
                      Attendance Rate
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Employee attendance rate percentage
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">0%</Typography>
                        <Slider
                          value={performanceForm.attendanceRate}
                          onChange={handlePerformanceSliderChange('attendanceRate')}
                          min={0}
                          max={100}
                          step={1}
                          marks
                          valueLabelDisplay="on"
                          sx={{ flexGrow: 1, color: '#795548' }}
                        />
                        <Typography variant="body2">100%</Typography>
                      </Stack>
                    </Box>
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
                        background: 'linear-gradient(45deg, #795548 30%, #8d6e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(121, 85, 72, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6d4c41 30%, #795548 90%)',
                        }
                      }}
                    >
                      Submit Performance Data (Updates Dashboard)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Performance Data Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#795548', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Performance Records (Career Growth affects Employee Satisfaction)
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.2)' : '#efebe9' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Career Growth (15%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Performance Score</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Training Completed</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Attendance Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.performanceData.map((perf, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(121,85,72,0.05)' } }}>
                      <TableCell><Chip label={perf.employeeId} color="primary" variant="outlined" /></TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={perf.careerGrowthRating / 2} readOnly size="small" />
                          <Typography variant="body2" fontWeight="bold">{perf.careerGrowthRating}/10</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={perf.performanceScore} 
                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" fontWeight="bold">{perf.performanceScore}%</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${perf.trainingCompleted} courses`} 
                          color={perf.trainingCompleted >= 10 ? 'success' : perf.trainingCompleted >= 5 ? 'warning' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={perf.attendanceRate} 
                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                            color={perf.attendanceRate >= 95 ? 'success' : perf.attendanceRate >= 85 ? 'warning' : 'error'}
                          />
                          <Typography variant="body2" fontWeight="bold">{perf.attendanceRate}%</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {employeeData.performanceData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📈</Avatar>
                          <Typography variant="h6" color="text.secondary">No performance data available</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Attendance Tracking Tab */}
        {tab === 3 && (
          <>
            {/* Add Attendance Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(121,85,72,0.1) 0%, rgba(121,85,72,0.05) 100%)' : 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#795548', width: 48, height: 48 }}>⏰</Avatar>
                <Typography variant="h5" fontWeight="bold">Mark Attendance</Typography>
              </Stack>
              <form onSubmit={handleAddAttendance}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth 
                      label="Employee" 
                      name="employeeId" 
                      value={attendanceForm.employeeId}
                      onChange={handleAttendanceChange} 
                      required 
                      select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Date" name="date" value={attendanceForm.date}
                      onChange={handleAttendanceChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth label="Check In" name="checkIn" value={attendanceForm.checkIn}
                      onChange={handleAttendanceChange} type="time"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth label="Check Out" name="checkOut" value={attendanceForm.checkOut}
                      onChange={handleAttendanceChange} type="time"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth label="Hours Worked" name="hoursWorked" value={attendanceForm.hoursWorked}
                      onChange={handleAttendanceChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth label="Status" name="status" value={attendanceForm.status}
                      onChange={handleAttendanceChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {ATTENDANCE_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
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
                        background: 'linear-gradient(45deg, #795548 30%, #8d6e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(121, 85, 72, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6d4c41 30%, #795548 90%)',
                        }
                      }}
                    >
                      Mark Attendance
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Attendance Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#795548', mr: 2, width: 32, height: 32 }}>⏰</Avatar>
              Attendance Records
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.2)' : '#efebe9' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check In</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check Out</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Hours</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((record, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(121,85,72,0.05)' } }}>
                      <TableCell><Chip label={record.employeeId} color="primary" variant="outlined" /></TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.hoursWorked}h</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          color={record.status === 'Present' ? 'success' : record.status === 'Late' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteAttendance(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Task Assignment Tab */}
        {tab === 4 && (
          <>
            {/* Add Task Form */}
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark ? 'linear-gradient(135deg, rgba(121,85,72,0.1) 0%, rgba(121,85,72,0.05) 100%)' : 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' 
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#795548', width: 48, height: 48 }}>📋</Avatar>
                <Typography variant="h5" fontWeight="bold">Assign New Task</Typography>
              </Stack>
              <form onSubmit={handleAddTask}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Task ID" name="taskId" value={taskForm.taskId}
                      onChange={handleTaskChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Employee" name="employeeId" value={taskForm.employeeId}
                      onChange={handleTaskChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Task Title" name="title" value={taskForm.title}
                      onChange={handleTaskChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Description" name="description" value={taskForm.description}
                      onChange={handleTaskChange} required multiline rows={3}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={taskForm.priority}
                      onChange={handleTaskChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {TASK_PRIORITIES.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Due Date" name="dueDate" value={taskForm.dueDate}
                      onChange={handleTaskChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Assigned Date" name="assignedDate" value={taskForm.assignedDate}
                      onChange={handleTaskChange} type="date"
                      InputLabelProps={{ shrink: true }} required
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
                        background: 'linear-gradient(45deg, #795548 30%, #8d6e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(121, 85, 72, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6d4c41 30%, #795548 90%)',
                        }
                      }}
                    >
                      Assign Task
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Tasks Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#795548', mr: 2, width: 32, height: 32 }}>📋</Avatar>
              Task Assignments
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.2)' : '#efebe9' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Task ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(121,85,72,0.05)' } }}>
                      <TableCell><Chip label={task.taskId} color="primary" variant="outlined" /></TableCell>
                      <TableCell>{task.employeeId}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.priority} 
                          color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status} 
                          color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteTask(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Edit Employee Dialog */}
        <Dialog open={editEmployeeIdx !== null} onClose={() => setEditEmployeeIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(121,85,72,0.1)' : '#efebe9', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#795548', mr: 2 }}>✏️</Avatar>Edit Employee
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Employee ID" name="id" value={editEmployeeForm.id} 
                  onChange={handleEditEmployeeChange} required 
                  error={!!employeeIdError} helperText={employeeIdError} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Full Name" name="name" value={editEmployeeForm.name} 
                  onChange={handleEditEmployeeChange} required 
                  error={!!nameError} helperText={nameError} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Position" name="position" value={editEmployeeForm.position} 
                  onChange={handleEditEmployeeChange} required select
                >
                  {POSITIONS.map(pos => <MenuItem key={pos} value={pos}>{pos}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Department" name="department" value={editEmployeeForm.department} 
                  onChange={handleEditEmployeeChange} required select
                >
                  {DEPARTMENTS.map(dept => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Phone" name="phone" value={editEmployeeForm.phone} 
                  onChange={handleEditEmployeeChange} required 
                  error={!!phoneError} helperText={phoneError} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Email" name="email" value={editEmployeeForm.email} 
                  onChange={handleEditEmployeeChange} required 
                  error={!!emailError} helperText={emailError} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Salary" name="salary" value={editEmployeeForm.salary} 
                  onChange={handleEditEmployeeChange} required 
                  error={!!salaryError} helperText={salaryError} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Status" name="status" value={editEmployeeForm.status} 
                  onChange={handleEditEmployeeChange} required select
                >
                  {EMPLOYEE_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditEmployeeIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEditEmployee} 
              variant="contained" 
              sx={{ borderRadius: 2 }}
              disabled={!!employeeIdError || !!nameError || !!phoneError || !!emailError || !!salaryError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default WorkforceManagement;
