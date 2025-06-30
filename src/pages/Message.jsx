import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useTheme } from '@mui/material/styles';

// Validation regex patterns
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;

const MESSAGE_STATUS = ['Sent', 'Delivered', 'Read', 'Failed'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const TARGET_AUDIENCE = ['All Farmers', 'Quality Team', 'Logistics Team', 'Management', 'Suppliers'];
const ANNOUNCEMENT_STATUS = ['Draft', 'Published', 'Archived'];

const Message = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Direct Messages state
  const [messageForm, setMessageForm] = useState({
    id: '', farmerId: '', message: '', timestamp: '', status: 'Sent', priority: 'Medium', subject: ''
  });
  const [messages, setMessages] = useState([
    { id: 'MSG001', farmerId: 'FARM001', subject: 'Payment Update', message: 'Your payment has been processed successfully.', timestamp: '2025-06-09 14:30', status: 'Read', priority: 'Medium' },
    { id: 'MSG002', farmerId: 'FARM002', subject: 'Quality Test Results', message: 'Your milk quality test results are excellent.', timestamp: '2025-06-09 10:15', status: 'Delivered', priority: 'High' }
  ]);
  const [editMessageIdx, setEditMessageIdx] = useState(null);
  const [editMessageForm, setEditMessageForm] = useState({
    id: '', farmerId: '', message: '', timestamp: '', status: 'Sent', priority: 'Medium', subject: ''
  });

  // Announcements state
  const [announcementForm, setAnnouncementForm] = useState({
    id: '', title: '', content: '', targetAudience: 'All Farmers', priority: 'Medium', publishDate: '', status: 'Draft', views: 0
  });
  const [announcements, setAnnouncements] = useState([
    { id: 'ANN001', title: 'New Quality Standards', content: 'We are implementing new quality standards effective from next month.', targetAudience: 'All Farmers', priority: 'High', publishDate: '2025-06-08', status: 'Published', views: 156 },
    { id: 'ANN002', title: 'Maintenance Schedule', content: 'Collection centers will be closed for maintenance on Sunday.', targetAudience: 'All Farmers', priority: 'Medium', publishDate: '2025-06-07', status: 'Published', views: 89 }
  ]);

  // Group Messages state
  const [groupForm, setGroupForm] = useState({
    id: '', groupName: '', message: '', timestamp: '', senderName: '', memberCount: 0
  });
  const [groupMessages, setGroupMessages] = useState([
    { id: 'GRP001', groupName: 'Quality Team', message: 'Weekly quality meeting scheduled for tomorrow.', timestamp: '2025-06-09 16:00', senderName: 'Quality Manager', memberCount: 12 },
    { id: 'GRP002', groupName: 'Logistics Team', message: 'New delivery routes have been optimized.', timestamp: '2025-06-09 11:30', senderName: 'Logistics Head', memberCount: 8 }
  ]);

  // Validation errors
  const [farmerIdError, setFarmerIdError] = useState('');

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
      },
      {
        borderRadius: '20px 20px 20px 4px',
        backgroundColor: isSelected ? '#ff9800' : '#fff',
        color: isSelected ? '#fff' : '#ff9800',
        border: '2px solid #ff9800',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '120px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#f57c00' : '#fff3e0' }
      }
    ];
    return styles[index] || {};
  };

  // Message handlers with validation
  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    setMessageForm({ ...messageForm, [name]: value });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageForm.farmerId && messageForm.message && messageForm.subject && !farmerIdError) {
      const newMessage = { 
        ...messageForm, 
        id: `MSG${String(messages.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString() 
      };
      setMessages([newMessage, ...messages]);
      setMessageForm({ id: '', farmerId: '', message: '', timestamp: '', status: 'Sent', priority: 'Medium', subject: '' });
    }
  };

  const handleDeleteMessage = (idx) => setMessages(messages.filter((_, i) => i !== idx));

  const handleEditMessage = (idx) => {
    setEditMessageIdx(idx);
    setEditMessageForm(messages[idx]);
    setFarmerIdError('');
  };

  const handleEditMessageChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    setEditMessageForm({ ...editMessageForm, [name]: value });
  };

  const handleSaveEditMessage = () => {
    if (editMessageIdx !== null && !farmerIdError) {
      const updated = [...messages];
      updated[editMessageIdx] = editMessageForm;
      setMessages(updated);
      setEditMessageIdx(null);
    }
  };

  // Announcement handlers
  const handleAnnouncementChange = (e) => {
    setAnnouncementForm({ ...announcementForm, [e.target.name]: e.target.value });
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (announcementForm.title && announcementForm.content && announcementForm.targetAudience) {
      const newAnnouncement = { 
        ...announcementForm, 
        id: `ANN${String(announcements.length + 1).padStart(3, '0')}`,
        publishDate: new Date().toISOString().split('T')[0],
        views: 0
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementForm({ id: '', title: '', content: '', targetAudience: 'All Farmers', priority: 'Medium', publishDate: '', status: 'Draft', views: 0 });
    }
  };

  const handleDeleteAnnouncement = (idx) => setAnnouncements(announcements.filter((_, i) => i !== idx));

  // Group message handlers
  const handleGroupChange = (e) => {
    setGroupForm({ ...groupForm, [e.target.name]: e.target.value });
  };

  const handleAddGroupMessage = (e) => {
    e.preventDefault();
    if (groupForm.groupName && groupForm.message && groupForm.senderName) {
      const newGroupMessage = { 
        ...groupForm, 
        id: `GRP${String(groupMessages.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString(),
        memberCount: parseInt(groupForm.memberCount.toString()) || 0
      };
      setGroupMessages([newGroupMessage, ...groupMessages]);
      setGroupForm({ id: '', groupName: '', message: '', timestamp: '', senderName: '', memberCount: 0 });
    }
  };

  const handleDeleteGroupMessage = (idx) => setGroupMessages(groupMessages.filter((_, i) => i !== idx));

  // Calculate statistics
  const totalMessages = messages.length;
  const readMessages = messages.filter(m => m.status === 'Read').length;
  const pendingMessages = messages.filter(m => m.status === 'Sent' || m.status === 'Delivered').length;
  const totalAnnouncements = announcements.length;

  const tabLabels = [
    { label: 'Direct Messages', icon: <MessageIcon /> },
    { label: 'Announcements', icon: <AnnouncementIcon /> },
    { label: 'Group Messages', icon: <GroupIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 0,
        background: `linear-gradient(135deg, ${
          ['#2196f3', '#4caf50', '#ff9800'][tab]
        } 0%, ${
          ['#21cbf3', '#8bc34a', '#ffc107'][tab]
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
              Connect and communicate with your network
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              ml: 6,
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <SendIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalMessages}</Typography>
                  <Typography variant="body1">Total Messages</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All conversations
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
                  <MarkEmailReadIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{readMessages}</Typography>
                  <Typography variant="body1">Read Messages</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Acknowledged
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
                  <MarkEmailUnreadIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{pendingMessages}</Typography>
                  <Typography variant="body1">Pending</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Awaiting response
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
                  <AnnouncementIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalAnnouncements}</Typography>
                  <Typography variant="body1">Announcements</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Published
                  </Typography>
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
              {idx === 0 && <Badge badgeContent={messages.length} color="secondary" sx={{ ml: 1 }} />}
            </Button>
          ))}
        </Box>

        {/* Direct Messages Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>💬</Avatar>
                <Typography variant="h5" fontWeight="bold">Send Direct Message</Typography>
              </Stack>
              <form onSubmit={handleSendMessage}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={messageForm.farmerId}
                      onChange={handleMessageChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={messageForm.priority}
                      onChange={handleMessageChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Subject" name="subject" value={messageForm.subject}
                      onChange={handleMessageChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Message" name="message" value={messageForm.message}
                      onChange={handleMessageChange} required
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
                      disabled={!!farmerIdError}
                      startIcon={<SendIcon />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>📝</Avatar>
              Message History
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.map((message, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                      <TableCell><Chip label={message.farmerId} color="primary" variant="outlined" /></TableCell>
                      <TableCell sx={{ maxWidth: 150 }}>{message.subject}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>{message.message}</TableCell>
                      <TableCell>{message.timestamp}</TableCell>
                      <TableCell>
                        <Chip 
                          label={message.priority} 
                          color={message.priority === 'High' ? 'error' : message.priority === 'Medium' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={message.status} 
                          color={message.status === 'Read' ? 'success' : message.status === 'Delivered' ? 'info' : message.status === 'Failed' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditMessage(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteMessage(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {messages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>💬</Avatar>
                          <Typography variant="h6" color="text.secondary">No messages sent yet</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Announcements Tab */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>📢</Avatar>
                <Typography variant="h5" fontWeight="bold">Create Announcement</Typography>
              </Stack>
              <form onSubmit={handleAddAnnouncement}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Title" name="title" value={announcementForm.title}
                      onChange={handleAnnouncementChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Target Audience" name="targetAudience" value={announcementForm.targetAudience}
                      onChange={handleAnnouncementChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {TARGET_AUDIENCE.map(audience => <MenuItem key={audience} value={audience}>{audience}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={announcementForm.priority}
                      onChange={handleAnnouncementChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={announcementForm.status}
                      onChange={handleAnnouncementChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {ANNOUNCEMENT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Content" name="content" value={announcementForm.content}
                      onChange={handleAnnouncementChange} required
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
                      startIcon={<AnnouncementIcon />}
                    >
                      Create Announcement
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Published Announcements
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Audience</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Views</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {announcements.map((announcement, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell sx={{ maxWidth: 200 }}>{announcement.title}</TableCell>
                      <TableCell><Chip label={announcement.targetAudience} size="small" color="info" /></TableCell>
                      <TableCell>
                        <Chip 
                          label={announcement.priority} 
                          color={announcement.priority === 'High' ? 'error' : announcement.priority === 'Medium' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={announcement.status} 
                          color={announcement.status === 'Published' ? 'success' : announcement.status === 'Draft' ? 'warning' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell><Typography fontWeight="bold">{announcement.views}</Typography></TableCell>
                      <TableCell>{announcement.publishDate}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteAnnouncement(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {announcements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📢</Avatar>
                          <Typography variant="h6" color="text.secondary">No announcements created</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Group Messages Tab */}
        {tab === 2 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>👥</Avatar>
                <Typography variant="h5" fontWeight="bold">Post Group Message</Typography>
              </Stack>
              <form onSubmit={handleAddGroupMessage}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Group Name" name="groupName" value={groupForm.groupName}
                      onChange={handleGroupChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Sender Name" name="senderName" value={groupForm.senderName}
                      onChange={handleGroupChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Member Count" name="memberCount" value={groupForm.memberCount}
                      onChange={handleGroupChange} type="number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Message" name="message" value={groupForm.message}
                      onChange={handleGroupChange} required
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
                        background: 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #f57c00 30%, #ffb300 90%)',
                        }
                      }}
                      startIcon={<GroupIcon />}
                    >
                      Post to Group
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#ff9800', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Group Conversations
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(255,152,0,0.2)' : '#fff3e0' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Group</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Sender</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Members</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupMessages.map((group, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,152,0,0.05)' } }}>
                      <TableCell><Chip label={group.groupName} color="warning" variant="outlined" /></TableCell>
                      <TableCell>{group.senderName}</TableCell>
                      <TableCell sx={{ maxWidth: 250 }}>{group.message}</TableCell>
                      <TableCell><Typography fontWeight="bold">{group.memberCount}</Typography></TableCell>
                      <TableCell>{group.timestamp}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteGroupMessage(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {groupMessages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>👥</Avatar>
                          <Typography variant="h6" color="text.secondary">No group messages posted</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Edit Message Dialog */}
        <Dialog open={editMessageIdx !== null} onClose={() => setEditMessageIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>✏️</Avatar>Edit Message
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Farmer ID" name="farmerId" value={editMessageForm.farmerId}
                  onChange={handleEditMessageChange} required
                  error={!!farmerIdError}
                  helperText={farmerIdError || "Format: ABC1234"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Priority" name="priority" value={editMessageForm.priority}
                  onChange={handleEditMessageChange} required select
                >
                  {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Subject" name="subject" value={editMessageForm.subject}
                  onChange={handleEditMessageChange} required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Message" name="message" value={editMessageForm.message}
                  onChange={handleEditMessageChange} required
                  multiline rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditMessageIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditMessage} variant="contained" sx={{ borderRadius: 2 }}
              disabled={!!farmerIdError}>Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Message;
