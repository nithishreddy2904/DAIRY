import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Rating
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTheme } from '@mui/material/styles';
// For charts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// Validation regex patterns
const NAME_REGEX = /^[A-Za-z\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REVIEW_CATEGORIES = ['Product Quality', 'Service', 'Delivery', 'Pricing', 'Customer Support', 'Overall Experience'];
const REVIEW_STATUS = ['New', 'In Progress', 'Responded', 'Resolved', 'Escalated'];
const FEEDBACK_TYPES = ['Complaint', 'Suggestion', 'Compliment', 'Quality Issue', 'Service Request'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

const Review = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Reviews state
  const [reviewForm, setReviewForm] = useState({
    id: '', customerName: '', customerEmail: '', category: '', rating: 0,
    subject: '', comment: '', date: '', status: 'New'
  });
  const [reviews, setReviews] = useState([
    { id: 'REV001', customerName: 'Rajesh Kumar', customerEmail: 'rajesh@email.com', category: 'Product Quality', rating: 5, subject: 'Excellent milk quality', comment: 'The milk quality is consistently excellent. Very satisfied with the freshness and taste.', date: '2025-06-08', status: 'Responded', response: 'Thank you for your positive feedback! We are committed to maintaining the highest quality standards.', responseDate: '2025-06-09' },
    { id: 'REV002', customerName: 'Priya Sharma', customerEmail: 'priya@email.com', category: 'Delivery', rating: 3, subject: 'Delivery timing issues', comment: 'Sometimes the delivery is delayed. Would appreciate more punctual service.', date: '2025-06-07', status: 'In Progress' },
    { id: 'REV003', customerName: 'Suresh Reddy', customerEmail: 'suresh@email.com', category: 'Service', rating: 4, subject: 'Good customer service', comment: 'The customer service team is helpful and responsive to queries.', date: '2025-06-06', status: 'New' }
  ]);
  const [editReviewIdx, setEditReviewIdx] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({
    id: '', customerName: '', customerEmail: '', category: '', rating: 0,
    subject: '', comment: '', date: '', status: 'New'
  });

  // Feedback state
  const [feedbackForm, setFeedbackForm] = useState({
    id: '', farmerName: '', farmerId: '', feedbackType: '', rating: 0,
    message: '', date: '', priority: 'Medium', status: 'Open'
  });
  const [feedback, setFeedback] = useState([
    { id: 'FB001', farmerName: 'Ravi Patel', farmerId: 'FARM001', feedbackType: 'Suggestion', rating: 4, message: 'Please consider increasing the milk collection frequency during peak season.', date: '2025-06-08', priority: 'Medium', status: 'In Review' },
    { id: 'FB002', farmerName: 'Lakshmi Devi', farmerId: 'FARM002', feedbackType: 'Complaint', rating: 2, message: 'Payment processing is taking longer than usual this month.', date: '2025-06-07', priority: 'High', status: 'Open' }
  ]);

  // Response dialog state
  const [responseDialog, setResponseDialog] = useState({
    open: false, reviewId: '', response: ''
  });

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Tab styling function
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#2196f3' : 'transparent',
        color: isSelected ? '#fff' : '#2196f3',
        border: '2px solid #2196f3',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#1976d2' : '#e3f2fd' }
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

  // Review handlers with validation
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'customerEmail') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const handleRatingChange = (newValue) => {
    setReviewForm({ ...reviewForm, rating: newValue || 0 });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (reviewForm.customerName && reviewForm.customerEmail && reviewForm.category && 
        reviewForm.subject && reviewForm.comment && !nameError && !emailError) {
      const newReview = { 
        ...reviewForm, 
        id: `REV${String(reviews.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0] 
      };
      setReviews([newReview, ...reviews]);
      setReviewForm({ id: '', customerName: '', customerEmail: '', category: '', rating: 0, subject: '', comment: '', date: '', status: 'New' });
    }
  };

  const handleDeleteReview = (idx) => setReviews(reviews.filter((_, i) => i !== idx));

  const handleEditReview = (idx) => {
    setEditReviewIdx(idx);
    setEditReviewForm(reviews[idx]);
    setNameError(''); setEmailError('');
  };

  const handleEditReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'customerEmail') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    setEditReviewForm({ ...editReviewForm, [name]: value });
  };

  const handleSaveEditReview = () => {
    if (editReviewIdx !== null && !nameError && !emailError) {
      const updated = [...reviews];
      updated[editReviewIdx] = editReviewForm;
      setReviews(updated);
      setEditReviewIdx(null);
    }
  };

  // Response handlers
  const handleOpenResponse = (reviewId) => {
    setResponseDialog({ open: true, reviewId, response: '' });
  };

  const handleSaveResponse = () => {
    const updated = reviews.map(review => 
      review.id === responseDialog.reviewId 
        ? { ...review, response: responseDialog.response, responseDate: new Date().toISOString().split('T')[0], status: 'Responded' }
        : review
    );
    setReviews(updated);
    setResponseDialog({ open: false, reviewId: '', response: '' });
  };

  // Feedback handlers
  const handleFeedbackChange = (e) => {
    setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });
  };

  const handleFeedbackRatingChange = (newValue) => {
    setFeedbackForm({ ...feedbackForm, rating: newValue || 0 });
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (feedbackForm.farmerName && feedbackForm.farmerId && feedbackForm.feedbackType && feedbackForm.message) {
      const newFeedback = { 
        ...feedbackForm, 
        id: `FB${String(feedback.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0] 
      };
      setFeedback([newFeedback, ...feedback]);
      setFeedbackForm({ id: '', farmerName: '', farmerId: '', feedbackType: '', rating: 0, message: '', date: '', priority: 'Medium', status: 'Open' });
    }
  };

  const handleDeleteFeedback = (idx) => setFeedback(feedback.filter((_, i) => i !== idx));

  // Calculate statistics
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'New' || r.status === 'In Progress').length;
  const resolvedReviews = reviews.filter(r => r.status === 'Responded' || r.status === 'Resolved').length;

  // Chart data
  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star`,
    count: reviews.filter(r => r.rating === rating).length
  }));

  const categoryData = REVIEW_CATEGORIES.map(cat => ({
    category: cat.replace(' ', '\n'),
    count: reviews.filter(r => r.category === cat).length,
    fullName: cat
  })).filter(item => item.count > 0);

  const tabLabels = [
    { label: 'Customer Reviews', icon: <StarIcon /> },
    { label: 'Farmer Feedback', icon: <FeedbackIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3, // Added gap between header and content
        background: `linear-gradient(135deg, ${
          ['#2196f3', '#4caf50'][tab]
        } 0%, ${
          ['#21cbf3', '#8bc34a'][tab]
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
              {tabLabels[tab].label}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Monitor feedback and enhance customer satisfaction
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with proper padding and margins */}
      <Box sx={{ 
        px: 4, // Increased horizontal padding
        ml: 2, // Added left margin
        mr: 2  // Added right margin for balance
      }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              ml: 5,
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <StarIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{avgRating.toFixed(1)}</Typography>
                  <Typography variant="body1">Average Rating</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Out of 5 stars
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
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalReviews}</Typography>
                  <Typography variant="body1">Total Reviews</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All time
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
                  <TrendingDownIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{pendingReviews}</Typography>
                  <Typography variant="body1">Pending</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Need response
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
                  <ThumbUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{resolvedReviews}</Typography>
                  <Typography variant="body1">Resolved</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Completed
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section - Increased Heights with Better Spacing */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1' }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 2, color: '#ff9800' }} />
                Rating Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis 
                      dataKey="rating" 
                      stroke={isDark ? '#aaa' : '#666'}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#333' : 'white', 
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8
                      }} 
                    />
                    <Bar dataKey="count" fill="#ff9800" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: '1' }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FeedbackIcon sx={{ mr: 2, color: '#2196f3' }} />
                Review Categories
              </Typography>
              <Box sx={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                    <Legend />
                  </PieChart>
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

        {/* Customer Reviews Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>⭐</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Customer Review</Typography>
              </Stack>
              <form onSubmit={handleAddReview}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Customer Name" name="customerName" value={reviewForm.customerName}
                      onChange={handleReviewChange} required
                      error={!!nameError}
                      helperText={nameError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Customer Email" name="customerEmail" value={reviewForm.customerEmail}
                      onChange={handleReviewChange} required
                      error={!!emailError}
                      helperText={emailError}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Category" name="category" value={reviewForm.category}
                      onChange={handleReviewChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {REVIEW_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>Rating</Typography>
                      <Rating
                        value={reviewForm.rating}
                        onChange={(_, newValue) => handleRatingChange(newValue)}
                        size="large"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Subject" name="subject" value={reviewForm.subject}
                      onChange={handleReviewChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Comment" name="comment" value={reviewForm.comment}
                      onChange={handleReviewChange} required
                      multiline rows={4}
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
                        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
                        }
                      }}
                      disabled={!!nameError || !!emailError}
                    >
                      Add Review
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>📝</Avatar>
              Customer Reviews
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{review.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{review.customerEmail}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Chip label={review.category} size="small" color="info" /></TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>{review.subject}</TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={review.status} 
                          color={review.status === 'Responded' || review.status === 'Resolved' ? 'success' : 
                                 review.status === 'In Progress' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleOpenResponse(review.id)} sx={{ borderRadius: 2 }}>
                            <ReplyIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditReview(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteReview(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>⭐</Avatar>
                          <Typography variant="h6" color="text.secondary">No reviews found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Farmer Feedback Tab */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>💬</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Farmer Feedback</Typography>
              </Stack>
              <form onSubmit={handleAddFeedback}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer Name" name="farmerName" value={feedbackForm.farmerName}
                      onChange={handleFeedbackChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={feedbackForm.farmerId}
                      onChange={handleFeedbackChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Feedback Type" name="feedbackType" value={feedbackForm.feedbackType}
                      onChange={handleFeedbackChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {FEEDBACK_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={feedbackForm.priority}
                      onChange={handleFeedbackChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>Satisfaction Rating</Typography>
                      <Rating
                        value={feedbackForm.rating}
                        onChange={(_, newValue) => handleFeedbackRatingChange(newValue)}
                        size="large"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Feedback Message" name="message" value={feedbackForm.message}
                      onChange={handleFeedbackChange} required
                      multiline rows={4}
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
                    >
                      Add Feedback
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Farmer Feedback
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedback.map((fb, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{fb.farmerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{fb.farmerId}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Chip label={fb.feedbackType} size="small" color="info" /></TableCell>
                      <TableCell>
                        <Rating value={fb.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250 }}>{fb.message}</TableCell>
                      <TableCell>
                        <Chip 
                          label={fb.priority} 
                          color={fb.priority === 'High' ? 'error' : fb.priority === 'Medium' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={fb.status} 
                          color={fb.status === 'Resolved' || fb.status === 'Closed' ? 'success' : 
                                 fb.status === 'In Review' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteFeedback(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {feedback.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>💬</Avatar>
                          <Typography variant="h6" color="text.secondary">No feedback found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Response Dialog */}
        <Dialog open={responseDialog.open} onClose={() => setResponseDialog({ open: false, reviewId: '', response: '' })} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>💬</Avatar>Respond to Review
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Response"
              multiline
              rows={4}
              value={responseDialog.response}
              onChange={(e) => setResponseDialog({ ...responseDialog, response: e.target.value })}
              placeholder="Write your response to the customer..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setResponseDialog({ open: false, reviewId: '', response: '' })} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleSaveResponse} variant="contained" sx={{ borderRadius: 2 }}>
              Send Response
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={editReviewIdx !== null} onClose={() => setEditReviewIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>✏️</Avatar>Edit Review
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Customer Name" name="customerName" value={editReviewForm.customerName}
                  onChange={handleEditReviewChange} required
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Customer Email" name="customerEmail" value={editReviewForm.customerEmail}
                  onChange={handleEditReviewChange} required
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Category" name="category" value={editReviewForm.category}
                  onChange={handleEditReviewChange} required select
                >
                  {REVIEW_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={editReviewForm.status}
                  onChange={handleEditReviewChange} required select
                >
                  {REVIEW_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Subject" name="subject" value={editReviewForm.subject}
                  onChange={handleEditReviewChange} required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Comment" name="comment" value={editReviewForm.comment}
                  onChange={handleEditReviewChange} required
                  multiline rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditReviewIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditReview} variant="contained" sx={{ borderRadius: 2 }}
              disabled={!!nameError || !!emailError}>Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Review;
