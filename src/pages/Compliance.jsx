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
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

// Validation regex patterns
const CERTIFICATE_ID_REGEX = /^[A-Z]{3}[0-9]{6}$/;

const COMPLIANCE_TYPES = ['FSSAI License', 'ISO Certification', 'HACCP', 'Environmental Clearance', 'Labor Compliance', 'Tax Compliance'];
const COMPLIANCE_STATUS = ['Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Expired'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low', 'Critical'];
const CERTIFICATION_STATUS = ['Active', 'Expired', 'Pending Renewal', 'Under Process', 'Suspended'];
const AUDIT_TYPES = ['Internal Audit', 'External Audit', 'Regulatory Inspection', 'Customer Audit', 'Supplier Audit', 'Environmental Audit'];
const AUDIT_STATUS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const DOCUMENT_TYPES = ['License', 'Certificate', 'Report', 'Policy', 'Procedure', 'Record'];
const DOCUMENT_CATEGORIES = ['Quality Control', 'Environmental', 'Safety', 'Financial', 'Legal', 'Operational'];

const ComplianceCertification = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Get shared data from context
  const { 
    complianceRecords,
    setComplianceRecords,
    certifications,
    setCertifications,
    audits,
    setAudits,
    calculateSustainabilityIndex
  } = useAppContext();

  // Compliance Records state
  const [complianceForm, setComplianceForm] = useState({
    id: '', type: '', title: '', description: '', status: 'Pending', priority: 'Medium',
    dueDate: '', completedDate: '', assignedTo: '', documents: []
  });
  const [editComplianceIdx, setEditComplianceIdx] = useState(null);
  const [editComplianceForm, setEditComplianceForm] = useState({
    id: '', type: '', title: '', description: '', status: 'Pending', priority: 'Medium',
    dueDate: '', completedDate: '', assignedTo: '', documents: []
  });

  // Certifications state
  const [certificationForm, setCertificationForm] = useState({
    id: '', name: '', issuingAuthority: '', certificateNumber: '', issueDate: '', 
    expiryDate: '', status: 'Active', renewalRequired: false, documentPath: ''
  });

  // Edit states for certifications
  const [editCertificationIdx, setEditCertificationIdx] = useState(null);
  const [editCertificationForm, setEditCertificationForm] = useState({
    id: '', name: '', issuingAuthority: '', certificateNumber: '', issueDate: '', 
    expiryDate: '', status: 'Active', renewalRequired: false, documentPath: ''
  });

  // Audits state
  const [auditForm, setAuditForm] = useState({
    id: '', auditType: '', auditor: '', scheduledDate: '', completedDate: '',
    status: 'Scheduled', findings: '', correctiveActions: '', score: 0
  });

  // Edit states for audits
  const [editAuditIdx, setEditAuditIdx] = useState(null);
  const [editAuditForm, setEditAuditForm] = useState({
    id: '', auditType: '', auditor: '', scheduledDate: '', completedDate: '',
    status: 'Scheduled', findings: '', correctiveActions: '', score: 0
  });

  // Documents state
  const [documents, setDocuments] = useState([
    { id: 'DOC001', name: 'FSSAI Manufacturing License', type: 'License', category: 'Legal', uploadDate: '2025-01-15', expiryDate: '2025-12-31', status: 'Active', size: '2.5 MB' },
    { id: 'DOC002', name: 'Monthly Quality Control Report', type: 'Report', category: 'Quality Control', uploadDate: '2025-06-01', expiryDate: '2025-07-01', status: 'Active', size: '1.8 MB' }
  ]);

  const [documentForm, setDocumentForm] = useState({
    id: '', name: '', type: '', category: '', uploadDate: '', expiryDate: '', status: 'Active', size: ''
  });

  // Edit states for documents
  const [editDocumentIdx, setEditDocumentIdx] = useState(null);
  const [editDocumentForm, setEditDocumentForm] = useState({
    id: '', name: '', type: '', category: '', uploadDate: '', expiryDate: '', status: 'Active', size: ''
  });

  // Validation errors
  const [certificateError, setCertificateError] = useState('');

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
        borderRadius: '12px',
        backgroundColor: isSelected ? '#ff9800' : 'transparent',
        color: isSelected ? '#fff' : '#ff9800',
        border: '2px dashed #ff9800',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '120px',
        margin: '0 6px',
        '&:hover': { backgroundColor: isSelected ? '#f57c00' : '#fff3e0' }
      },
      {
        borderRadius: '20px 20px 20px 4px',
        backgroundColor: isSelected ? '#9c27b0' : '#fff',
        color: isSelected ? '#fff' : '#9c27b0',
        border: '2px solid #9c27b0',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#7b1fa2' : '#f3e5f5' }
      }
    ];
    return styles[index] || {};
  };

  // Compliance handlers
  const handleComplianceChange = (e) => {
    setComplianceForm({ ...complianceForm, [e.target.name]: e.target.value });
  };

  const handleAddCompliance = (e) => {
    e.preventDefault();
    if (complianceForm.type && complianceForm.title && complianceForm.description && complianceForm.dueDate) {
      const newCompliance = { 
        ...complianceForm, 
        id: `COMP${String(complianceRecords.length + 1).padStart(3, '0')}` 
      };
      setComplianceRecords([newCompliance, ...complianceRecords]);
      setComplianceForm({ id: '', type: '', title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '', completedDate: '', assignedTo: '', documents: [] });
    }
  };

  const handleDeleteCompliance = (idx) => setComplianceRecords(complianceRecords.filter((_, i) => i !== idx));

  const handleEditCompliance = (idx) => {
    setEditComplianceIdx(idx);
    setEditComplianceForm(complianceRecords[idx]);
  };

  const handleEditComplianceChange = (e) => {
    setEditComplianceForm({ ...editComplianceForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditCompliance = () => {
    if (editComplianceIdx !== null) {
      const updated = [...complianceRecords];
      updated[editComplianceIdx] = editComplianceForm;
      setComplianceRecords(updated);
      setEditComplianceIdx(null);
    }
  };

  // Certification handlers
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    if (name === 'certificateNumber') {
      if (!CERTIFICATE_ID_REGEX.test(value)) setCertificateError('Format: ABC123456 (3 letters + 6 digits)');
      else setCertificateError('');
    }
    setCertificationForm({ ...certificationForm, [name]: value });
  };

  const handleAddCertification = (e) => {
    e.preventDefault();
    if (certificationForm.name && certificationForm.issuingAuthority && certificationForm.certificateNumber && !certificateError) {
      const newCertification = { 
        ...certificationForm, 
        id: `CERT${String(certifications.length + 1).padStart(3, '0')}` 
      };
      setCertifications([newCertification, ...certifications]);
      setCertificationForm({ id: '', name: '', issuingAuthority: '', certificateNumber: '', issueDate: '', expiryDate: '', status: 'Active', renewalRequired: false, documentPath: '' });
    }
  };

  const handleDeleteCertification = (idx) => setCertifications(certifications.filter((_, i) => i !== idx));

  // Certification edit handlers
  const handleEditCertification = (idx) => {
    setEditCertificationIdx(idx);
    setEditCertificationForm(certifications[idx]);
  };

  const handleEditCertificationChange = (e) => {
    const { name, value } = e.target;
    if (name === 'certificateNumber') {
      if (!CERTIFICATE_ID_REGEX.test(value)) setCertificateError('Format: ABC123456 (3 letters + 6 digits)');
      else setCertificateError('');
    }
    setEditCertificationForm({ ...editCertificationForm, [name]: value });
  };

  const handleSaveEditCertification = () => {
    if (editCertificationIdx !== null && !certificateError) {
      const updated = [...certifications];
      updated[editCertificationIdx] = editCertificationForm;
      setCertifications(updated);
      setEditCertificationIdx(null);
    }
  };

  // Audit handlers
  const handleAuditChange = (e) => {
    setAuditForm({ ...auditForm, [e.target.name]: e.target.value });
  };

  const handleAddAudit = (e) => {
    e.preventDefault();
    if (auditForm.auditType && auditForm.auditor && auditForm.scheduledDate) {
      const newAudit = { 
        ...auditForm, 
        id: `AUD${String(audits.length + 1).padStart(3, '0')}` 
      };
      setAudits([newAudit, ...audits]);
      setAuditForm({ id: '', auditType: '', auditor: '', scheduledDate: '', completedDate: '', status: 'Scheduled', findings: '', correctiveActions: '', score: 0 });
    }
  };

  const handleDeleteAudit = (idx) => setAudits(audits.filter((_, i) => i !== idx));

  // Audit edit handlers
  const handleEditAudit = (idx) => {
    setEditAuditIdx(idx);
    setEditAuditForm(audits[idx]);
  };

  const handleEditAuditChange = (e) => {
    setEditAuditForm({ ...editAuditForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditAudit = () => {
    if (editAuditIdx !== null) {
      const updated = [...audits];
      updated[editAuditIdx] = editAuditForm;
      setAudits(updated);
      setEditAuditIdx(null);
    }
  };

  // Document handlers
  const handleDocumentChange = (e) => {
    setDocumentForm({ ...documentForm, [e.target.name]: e.target.value });
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (documentForm.name && documentForm.type && documentForm.category) {
      const newDocument = { 
        ...documentForm, 
        id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setDocuments([newDocument, ...documents]);
      setDocumentForm({ id: '', name: '', type: '', category: '', uploadDate: '', expiryDate: '', status: 'Active', size: '' });
    }
  };

  const handleDeleteDocument = (idx) => setDocuments(documents.filter((_, i) => i !== idx));

  // Document edit handlers
  const handleEditDocument = (idx) => {
    setEditDocumentIdx(idx);
    setEditDocumentForm(documents[idx]);
  };

  const handleEditDocumentChange = (e) => {
    setEditDocumentForm({ ...editDocumentForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditDocument = () => {
    if (editDocumentIdx !== null) {
      const updated = [...documents];
      updated[editDocumentIdx] = editDocumentForm;
      setDocuments(updated);
      setEditDocumentIdx(null);
    }
  };

  // Calculate statistics
  const totalCompliance = complianceRecords.length;
  const compliantRecords = complianceRecords.filter(c => c.status === 'Compliant').length;
  const pendingCompliance = complianceRecords.filter(c => c.status === 'Pending').length;
  const expiredCertifications = certifications.filter(c => c.status === 'Expired' || c.status === 'Pending Renewal').length;
  const sustainabilityIndex = calculateSustainabilityIndex;

  const tabLabels = [
    { label: 'Compliance Records', icon: <AssignmentIcon /> },
    { label: 'Certifications', icon: <VerifiedIcon /> },
    { label: 'Audits & Inspections', icon: <CheckCircleIcon /> },
    { label: 'Document Management', icon: <DescriptionIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 0,
        background: `linear-gradient(135deg, ${
          ['#2196f3', '#4caf50', '#ff9800', '#9c27b0'][tab]
        } 0%, ${
          ['#21cbf3', '#8bc34a', '#ffc107', '#e91e63'][tab]
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
              Sustainability Index: {sustainabilityIndex}% | Calculated from compliance parameters
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 3 }}>
        {/* Compliance Alerts */}
        {(pendingCompliance > 0 || expiredCertifications > 0) && (
          <Box sx={{ mb: 3, mt: 2 }}>
            {expiredCertifications > 0 && (
              <Alert severity="error" sx={{ mb: 1, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningIcon />
                  <Typography fontWeight="bold">
                    {expiredCertifications} certification(s) require immediate attention
                  </Typography>
                </Stack>
              </Alert>
            )}
            {pendingCompliance > 0 && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PendingIcon />
                  <Typography fontWeight="bold">
                    {pendingCompliance} compliance task(s) are pending
                  </Typography>
                </Stack>
              </Alert>
            )}
          </Box>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 0 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              ml: 7,
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
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
                  <Typography variant="h3" fontWeight="bold">{totalCompliance}</Typography>
                  <Typography variant="body1">Total Compliance</Typography>
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
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{compliantRecords}</Typography>
                  <Typography variant="body1">Compliant</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Up to date
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
                  <PendingIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{pendingCompliance}</Typography>
                  <Typography variant="body1">Pending</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Need attention
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
                  <VerifiedIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{certifications.length}</Typography>
                  <Typography variant="body1">Certifications</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Active & pending
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
            </Button>
          ))}
        </Box>

        {/* Compliance Records Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>📋</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Compliance Record</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  These records directly affect Sustainability Index calculation
                </Typography>
              </Stack>
              <form onSubmit={handleAddCompliance}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Compliance Type" name="type" value={complianceForm.type}
                      onChange={handleComplianceChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {COMPLIANCE_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={complianceForm.priority}
                      onChange={handleComplianceChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Title" name="title" value={complianceForm.title}
                      onChange={handleComplianceChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Description" name="description" value={complianceForm.description}
                      onChange={handleComplianceChange} required
                      multiline rows={3}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Due Date" name="dueDate" value={complianceForm.dueDate}
                      onChange={handleComplianceChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Assigned To" name="assignedTo" value={complianceForm.assignedTo}
                      onChange={handleComplianceChange} required
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
                    >
                      Add Compliance Record (Updates Sustainability Index)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Compliance Records (Affects Sustainability Index)
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceRecords.map((record, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                      <TableCell><Chip label={record.type} color="primary" variant="outlined" /></TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>{record.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.priority} 
                          color={record.priority === 'Critical' || record.priority === 'High' ? 'error' : 
                                 record.priority === 'Medium' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{record.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          color={record.status === 'Compliant' ? 'success' : 
                                 record.status === 'Non-Compliant' || record.status === 'Expired' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{record.assignedTo}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditCompliance(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteCompliance(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {complianceRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📋</Avatar>
                          <Typography variant="h6" color="text.secondary">No compliance records found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Certifications Tab */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>🏆</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Certification</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Active certifications contribute to Sustainability Index
                </Typography>
              </Stack>
              <form onSubmit={handleAddCertification}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Certification Name" name="name" value={certificationForm.name}
                      onChange={handleCertificationChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Issuing Authority" name="issuingAuthority" value={certificationForm.issuingAuthority}
                      onChange={handleCertificationChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Certificate Number" name="certificateNumber" value={certificationForm.certificateNumber}
                      onChange={handleCertificationChange} required
                      error={!!certificateError}
                      helperText={certificateError || "Format: ABC123456"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={certificationForm.status}
                      onChange={handleCertificationChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {CERTIFICATION_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Issue Date" name="issueDate" value={certificationForm.issueDate}
                      onChange={handleCertificationChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Expiry Date" name="expiryDate" value={certificationForm.expiryDate}
                      onChange={handleCertificationChange} type="date"
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
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c 30%, #689f38 90%)',
                        }
                      }}
                      disabled={!!certificateError}
                    >
                      Add Certification (Updates Sustainability Index)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Active Certifications (Affects Sustainability Index)
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Certification</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Authority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Certificate No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Issue Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Expiry Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certifications.map((cert, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell>{cert.name}</TableCell>
                      <TableCell>{cert.issuingAuthority}</TableCell>
                      <TableCell><Chip label={cert.certificateNumber} color="success" variant="outlined" /></TableCell>
                      <TableCell>{cert.issueDate}</TableCell>
                      <TableCell>{cert.expiryDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={cert.status} 
                          color={cert.status === 'Active' ? 'success' : 
                                 cert.status === 'Expired' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditCertification(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteCertification(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {certifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🏆</Avatar>
                          <Typography variant="h6" color="text.secondary">No certifications found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Audits Tab */}
        {tab === 2 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>🔍</Avatar>
                <Typography variant="h5" fontWeight="bold">Schedule Audit</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Audit scores contribute to Sustainability Index
                </Typography>
              </Stack>
              <form onSubmit={handleAddAudit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Audit Type" name="auditType" value={auditForm.auditType}
                      onChange={handleAuditChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {AUDIT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Auditor" name="auditor" value={auditForm.auditor}
                      onChange={handleAuditChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Scheduled Date" name="scheduledDate" value={auditForm.scheduledDate}
                      onChange={handleAuditChange} type="date"
                      InputLabelProps={{ shrink: true }} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={auditForm.status}
                      onChange={handleAuditChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {AUDIT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Score (0-100)" name="score" value={auditForm.score}
                      onChange={handleAuditChange} type="number"
                      inputProps={{ min: 0, max: 100 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Completed Date" name="completedDate" value={auditForm.completedDate}
                      onChange={handleAuditChange} type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Findings" name="findings" value={auditForm.findings}
                      onChange={handleAuditChange}
                      multiline rows={3}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Corrective Actions" name="correctiveActions" value={auditForm.correctiveActions}
                      onChange={handleAuditChange}
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
                        background: 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #f57c00 30%, #ffb300 90%)',
                        }
                      }}
                    >
                      Schedule Audit (Updates Sustainability Index)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#ff9800', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Audit Records (Affects Sustainability Index)
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(255,152,0,0.2)' : '#fff3e0' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Audit Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Auditor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Scheduled Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audits.map((audit, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,152,0,0.05)' } }}>
                      <TableCell><Chip label={audit.auditType} color="warning" variant="outlined" /></TableCell>
                      <TableCell>{audit.auditor}</TableCell>
                      <TableCell>{audit.scheduledDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={audit.status} 
                          color={audit.status === 'Completed' ? 'success' : 
                                 audit.status === 'In Progress' ? 'info' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {audit.score > 0 ? (
                          <Typography fontWeight="bold" color={audit.score >= 80 ? 'success.main' : audit.score >= 60 ? 'warning.main' : 'error.main'}>
                            {audit.score}%
                          </Typography>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditAudit(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteAudit(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {audits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🔍</Avatar>
                          <Typography variant="h6" color="text.secondary">No audits scheduled</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Document Management Tab */}
        {tab === 3 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.05) 100%)' : 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#9c27b0', width: 48, height: 48 }}>📄</Avatar>
                <Typography variant="h5" fontWeight="bold">Upload Document</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Document management supports compliance tracking
                </Typography>
              </Stack>
              <form onSubmit={handleAddDocument}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Document Name" name="name" value={documentForm.name}
                      onChange={handleDocumentChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Document Type" name="type" value={documentForm.type}
                      onChange={handleDocumentChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {DOCUMENT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Category" name="category" value={documentForm.category}
                      onChange={handleDocumentChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {DOCUMENT_CATEGORIES.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="File Size" name="size" value={documentForm.size}
                      onChange={handleDocumentChange}
                      placeholder="e.g., 2.5 MB"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Expiry Date" name="expiryDate" value={documentForm.expiryDate}
                      onChange={handleDocumentChange} type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={documentForm.status}
                      onChange={handleDocumentChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Expired">Expired</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
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
                        background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
                        boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7b1fa2 30%, #c2185b 90%)',
                        }
                      }}
                      startIcon={<UploadFileIcon />}
                    >
                      Upload Document
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#9c27b0', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Document Library
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(156,39,176,0.2)' : '#f3e5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Document Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Upload Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Expiry Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(156,39,176,0.05)' } }}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell><Chip label={doc.type} color="secondary" variant="outlined" /></TableCell>
                      <TableCell><Chip label={doc.category} size="small" color="info" /></TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>{doc.expiryDate || 'No expiry'}</TableCell>
                      <TableCell>{doc.size || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={doc.status} 
                          color={doc.status === 'Active' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditDocument(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteDocument(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📄</Avatar>
                          <Typography variant="h6" color="text.secondary">No documents uploaded</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Edit Compliance Dialog */}
        <Dialog open={editComplianceIdx !== null} onClose={() => setEditComplianceIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>✏️</Avatar>Edit Compliance Record
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Compliance Type" name="type" value={editComplianceForm.type}
                  onChange={handleEditComplianceChange} required select
                >
                  {COMPLIANCE_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Priority" name="priority" value={editComplianceForm.priority}
                  onChange={handleEditComplianceChange} required select
                >
                  {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Title" name="title" value={editComplianceForm.title}
                  onChange={handleEditComplianceChange} required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Description" name="description" value={editComplianceForm.description}
                  onChange={handleEditComplianceChange} required
                  multiline rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={editComplianceForm.status}
                  onChange={handleEditComplianceChange} required select
                >
                  {COMPLIANCE_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Due Date" name="dueDate" value={editComplianceForm.dueDate}
                  onChange={handleEditComplianceChange} type="date"
                  InputLabelProps={{ shrink: true }} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Completed Date" name="completedDate" value={editComplianceForm.completedDate}
                  onChange={handleEditComplianceChange} type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Assigned To" name="assignedTo" value={editComplianceForm.assignedTo}
                  onChange={handleEditComplianceChange} required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditComplianceIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditCompliance} variant="contained" sx={{ borderRadius: 2 }}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Certification Dialog */}
        <Dialog open={editCertificationIdx !== null} onClose={() => setEditCertificationIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>Edit Certification
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Certification Name" name="name" value={editCertificationForm.name}
                  onChange={handleEditCertificationChange} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Issuing Authority" name="issuingAuthority" value={editCertificationForm.issuingAuthority}
                  onChange={handleEditCertificationChange} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Certificate Number" name="certificateNumber" value={editCertificationForm.certificateNumber}
                  onChange={handleEditCertificationChange} required
                  error={!!certificateError}
                  helperText={certificateError || "Format: ABC123456"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={editCertificationForm.status}
                  onChange={handleEditCertificationChange} required select
                >
                  {CERTIFICATION_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Issue Date" name="issueDate" value={editCertificationForm.issueDate}
                  onChange={handleEditCertificationChange} type="date"
                  InputLabelProps={{ shrink: true }} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Expiry Date" name="expiryDate" value={editCertificationForm.expiryDate}
                  onChange={handleEditCertificationChange} type="date"
                  InputLabelProps={{ shrink: true }} required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditCertificationIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditCertification} variant="contained" sx={{ borderRadius: 2 }} disabled={!!certificateError}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Audit Dialog */}
        <Dialog open={editAuditIdx !== null} onClose={() => setEditAuditIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(255,152,0,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>✏️</Avatar>Edit Audit
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Audit Type" name="auditType" value={editAuditForm.auditType}
                  onChange={handleEditAuditChange} required select
                >
                  {AUDIT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Auditor" name="auditor" value={editAuditForm.auditor}
                  onChange={handleEditAuditChange} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Scheduled Date" name="scheduledDate" value={editAuditForm.scheduledDate}
                  onChange={handleEditAuditChange} type="date"
                  InputLabelProps={{ shrink: true }} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={editAuditForm.status}
                  onChange={handleEditAuditChange} required select
                >
                  {AUDIT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Score (0-100)" name="score" value={editAuditForm.score}
                  onChange={handleEditAuditChange} type="number"
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Completed Date" name="completedDate" value={editAuditForm.completedDate}
                  onChange={handleEditAuditChange} type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Findings" name="findings" value={editAuditForm.findings}
                  onChange={handleEditAuditChange}
                  multiline rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Corrective Actions" name="correctiveActions" value={editAuditForm.correctiveActions}
                  onChange={handleEditAuditChange}
                  multiline rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditAuditIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditAudit} variant="contained" sx={{ borderRadius: 2 }}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Document Dialog */}
        <Dialog open={editDocumentIdx !== null} onClose={() => setEditDocumentIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(156,39,176,0.1)' : '#f3e5f5', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>✏️</Avatar>Edit Document
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Document Name" name="name" value={editDocumentForm.name}
                  onChange={handleEditDocumentChange} required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Document Type" name="type" value={editDocumentForm.type}
                  onChange={handleEditDocumentChange} required select
                >
                  {DOCUMENT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Category" name="category" value={editDocumentForm.category}
                  onChange={handleEditDocumentChange} required select
                >
                  {DOCUMENT_CATEGORIES.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="File Size" name="size" value={editDocumentForm.size}
                  onChange={handleEditDocumentChange}
                  placeholder="e.g., 2.5 MB"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Expiry Date" name="expiryDate" value={editDocumentForm.expiryDate}
                  onChange={handleEditDocumentChange} type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={editDocumentForm.status}
                  onChange={handleEditDocumentChange} required select
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDocumentIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveEditDocument} variant="contained" sx={{ borderRadius: 2 }}>Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ComplianceCertification;
