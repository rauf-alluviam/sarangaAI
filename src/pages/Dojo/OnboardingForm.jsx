import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Upload,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  FolderOpen,
  Phone,
  Mail,
  CreditCard,
  Home,
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import axios from 'axios';
import { BusinessCenter, PersonOutline } from '@mui/icons-material';

const API_URL = `${import.meta.env.VITE_BACKEND_API}`;

const OnboardingForm = () => {
  // Steps for the form
  const steps = [
    'Personal Information',
    'Professional Details',
    'Documents Upload',
    'Review & Submit',
  ];
  const [activeStep, setActiveStep] = useState(0);

  // Form data state
  const initialFormData = {
    // Personal info
    full_name: '',
    dob: '',
    phone: '',
    email: '',
    gender: '',
    aadhaar_number: '',
    address: '',
    emergency_contact_number: '',
    salary_account_number: '',
    blood_group: '',
    marital_status: '',

    // Professional info
    employees_role: '',
    qualification: '',
    experience: '',
    department: '',
    designation: '',
  };

  const initialDocuments = {
    avatar: [],
    id_proof: [],
    education_certificates: [],
    experience_letters: [],
    other_documents: [],
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  //   const fileInputRef = useRef(null);

  // Validation rules
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'full_name':
        if (!value) error = 'Full name is required';
        break;
      case 'dob':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();

          // Adjust if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          if (age < 18) {
            error = 'Employee must be at least 18 years old';
          }
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Please enter a valid email address';
        break;
      case 'aadhaar_number':
        if (!value) error = 'Aadhaar number is required';
        else if (!/^\d{12}$/.test(value)) error = 'Please enter a valid 12-digit Aadhaar number';
        break;
      case 'emergency_contact_number':
        if (!value) error = 'Emergency contact is required';
        else if (!/^[6-9]\d{9}$/.test(value))
          error = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
        break;
      case 'salary_account_number':
        if (!value) {
          error = 'Salary account number is required';
        } else if (!/^\d{9,18}$/.test(value)) {
          error = 'Please enter a valid salary account number (9–18 digits)';
        }
        break;

      case 'employees_role':
        if (!value) error = 'Employee role is required';
        break;
      default:
        break;
    }

    return error;
  };

  // Handle next/back navigation
  const handleNext = () => {
    // Validate current step before proceeding
    const errors = {};
    let hasErrors = false;

    if (activeStep === 0) {
      // Personal info validation
      const personalFields = [
        'full_name',
        'dob',
        'phone',
        'aadhaar_number',
        'emergency_contact_number',
        'salary_account_number',
      ];
      personalFields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          hasErrors = true;
        }
      });

      // Avatar validation
      if (documents.avatar.length === 0) {
        setError('Please upload an avatar photo');
        hasErrors = true;
      }
    } else if (activeStep === 1) {
      // Professional info validation
      if (!formData.employees_role) {
        errors.employees_role = 'Employee role is required';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setError('');

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field immediately
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle file uploads
  const handleFileUpload = (category, files) => {
    const newFiles = Array.from(files);

    // For avatar, only keep one file
    if (category === 'avatar') {
      setDocuments((prev) => ({
        ...prev,
        [category]: newFiles.slice(0, 1),
      }));

      // Create preview for avatar
      if (newFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(newFiles[0]);
      }
    } else {
      setDocuments((prev) => ({
        ...prev,
        [category]: [...prev[category], ...newFiles],
      }));
    }
  };

  // Remove a file from a category
  const removeFile = (category, index) => {
    setDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));

    // If removing avatar, clear preview
    if (category === 'avatar' && index === 0) {
      setPreviewImage(null);
    }
  };

  // Open file in new tab
  const openFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  // Submit form
  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    setLoading(true);

    try {
      // Convert files to base64 for JSON payload
      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
          reader.onerror = (error) => reject(error);
        });
      };

      // Prepare documents for submission
      const docsPayload = {};
      for (const [category, files] of Object.entries(documents)) {
        if (category === 'avatar' && files.length > 0) {
          const file = files[0];
          docsPayload[category] = {
            filename: file.name,
            content: await convertFileToBase64(file),
          };
        } else {
          docsPayload[category] = await Promise.all(
            files.map(async (file) => ({
              filename: file.name,
              content: await convertFileToBase64(file),
            }))
          );
        }
      }

      // Prepare the payload in the expected format
      const payload = {
        payload: formData,
        docs: docsPayload,
      };

      const response = await axios.post(
        `${API_URL}/submit_onboarding_with_documents`, // ✅ dynamic base URL
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ dynamic token
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setFormData(initialFormData);
        setDocuments(initialDocuments);
        setPreviewImage(null);
        setTimeout(() => {
          navigate(0); // This refreshes the current route
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError(
        'Failed to submit form. Please try again.' + (err?.message ? ` (${err.message})` : '')
      );
    } finally {
      setLoading(false);
    }
  };

  // Field definitions for each step
  const personalFields = [
    {
      name: 'full_name',
      label: 'Full Name',
      type: 'text',
      required: true,
      icon: <Users />,
    },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      icon: <Phone />,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: false,
      icon: <Mail />,
    },
    {
      name: 'aadhaar_number',
      label: 'Aadhaar Number',
      type: 'text',
      required: true,
      icon: <CreditCard />,
    },
    {
      name: 'emergency_contact_number',
      label: 'Emergency Contact',
      type: 'tel',
      required: true,
    },
    {
      name: 'salary_account_number',
      label: 'Salary Account Number',
      type: 'text',
      required: true,
    },
  ];

  const professionalFields = [
    {
      name: 'employees_role',
      label: 'Employee Role',
      type: 'text',
      required: true,
    },
    {
      name: 'qualification',
      label: 'Qualification',
      type: 'text',
      required: false,
      icon: <GraduationCap />,
    },
    {
      name: 'experience',
      label: 'Experience (Years)',
      type: 'number',
      required: false,
      icon: <Briefcase />,
    },
    {
      name: 'department',
      label: 'Department',
      type: 'text',
      required: false,
      icon: <Briefcase />,
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'text',
      required: false,
      icon: <Briefcase />,
    },
  ];

  const additionalFields = [
    {
      name: 'blood_group',
      label: 'Blood Group',
      type: 'text',
      required: false,
    },
    {
      name: 'marital_status',
      label: 'Marital Status',
      type: 'text',
      required: false,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: false,
      multiline: true,
      rows: 3,
      icon: <Home />,
    },
  ];

  const documentCategories = {
    avatar: {
      title: 'Profile Photo',
      description: 'Upload your profile photo (required)',
      accept: 'image/*',
      multiple: false,
      color: '#1976d2',
      required: true,
    },
    id_proof: {
      title: 'Identity Proof',
      description: 'Aadhaar, PAN, Voter ID, etc.',
      accept: 'image/*,.pdf',
      multiple: true,
      color: '#f57c00',
    },
    education_certificates: {
      title: 'Educational Certificates',
      description: 'Degree, Diploma, Marksheets, etc.',
      accept: 'image/*,.pdf',
      multiple: true,
      color: '#388e3c',
    },
    experience_letters: {
      title: 'Experience Letters',
      description: 'Previous employment documents',
      accept: 'image/*,.pdf',
      multiple: true,
      color: '#d32f2f',
    },
    other_documents: {
      title: 'Other Documents',
      description: 'Any other relevant documents',
      accept: 'image/*,.pdf',
      multiple: true,
      color: '#7b1fa2',
    },
  };

  // Render the current step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <PersonOutline color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Personal Information
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Avatar Upload */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar src={previewImage} sx={{ width: 120, height: 120, mb: 2 }} />
                    <Button variant="outlined" component="label" startIcon={<Upload />}>
                      Upload Photo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload('avatar', e.target.files)}
                      />
                    </Button>
                    <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                      Required: JPG, PNG under 2MB
                    </Typography>
                  </Box>
                </Grid>

                {/* Personal Details */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {personalFields.map((field) => (
                      <Grid item xs={12} sm={6} key={field.name}>
                        <TextField
                          fullWidth
                          type={field.type}
                          label={field.label}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                          error={!!fieldErrors[field.name]}
                          helperText={fieldErrors[field.name]}
                          InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                          variant="outlined"
                        />
                      </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!fieldErrors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          label="Gender"
                          sx={{ width: '200px' }} // ✅ use object here
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {fieldErrors.gender && (
                          <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                            {fieldErrors.gender}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1: // Professional Details
        return (
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <BusinessCenter color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Professional Information
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    error={!!fieldErrors.employees_role}
                    sx={{ width: '200px' }}
                  >
                    <InputLabel>Employee Role</InputLabel>
                    <Select
                      name="employees_role"
                      value={formData.employees_role}
                      onChange={handleInputChange}
                      label="Employee Role"
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      <MenuItem value="Company">Company</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                    </Select>
                    {fieldErrors.employees_role && (
                      <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                        {fieldErrors.employees_role}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Qualification</InputLabel>
                    <Select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      label="Qualification"
                      sx={{ width: '200px' }}
                    >
                      <MenuItem value="">Select Qualification</MenuItem>
                      <MenuItem value="SSC">SSC</MenuItem>
                      <MenuItem value="HSC">HSC</MenuItem>
                      <MenuItem value="Diploma">Diploma</MenuItem>
                      <MenuItem value="BE">BE</MenuItem>
                      <MenuItem value="BSC">BSC</MenuItem>
                      <MenuItem value="BA">BA</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {professionalFields.slice(2).map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      fullWidth
                      type={field.type}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      variant="outlined"
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      label="Marital Status"
                      sx={{ width: '200px' }}
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {additionalFields.slice(0, 1).map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      fullWidth
                      type={field.type}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      variant="outlined"
                    />
                  </Grid>
                ))}

                {additionalFields.slice(2).map((field) => (
                  <Grid item xs={12} key={field.name}>
                    <TextField
                      fullWidth
                      type={field.type}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      multiline={field.multiline}
                      rows={field.rows}
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        );

      case 2: // Documents Upload
        return (
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <FolderOpen color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Document Upload
                </Typography>
              </Stack>
              <Divider sx={{ mb: 4 }} />

              <Stack spacing={4}>
                {Object.entries(documentCategories).map(([key, category]) => (
                  <Box key={key}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Chip
                        label={category.title}
                        sx={{
                          backgroundColor: category.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      {category.required && (
                        <Typography variant="caption" color="error">
                          (Required)
                        </Typography>
                      )}
                    </Stack>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>

                    {/* Document Gallery */}
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={1}>
                        {documents[key].map((file, index) => (
                          <Grid item key={index}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'action.hover' },
                              }}
                            >
                              <FileText size={16} style={{ marginRight: 8 }} />
                              <Typography
                                variant="body2"
                                onClick={() => openFile(file)}
                                sx={{
                                  mr: 1,
                                  maxWidth: 120,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {file.name}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => removeFile(key, index)}
                                color="error"
                              >
                                <X size={16} />
                              </IconButton>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Plus />}
                      sx={{
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        '&:hover': {
                          borderStyle: 'dashed',
                          borderWidth: 2,
                        },
                      }}
                    >
                      Add {category.title}
                      <input
                        type="file"
                        hidden
                        accept={category.accept}
                        multiple={category.multiple}
                        onChange={(e) => handleFileUpload(key, e.target.files)}
                      />
                    </Button>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        );

      case 3: // Review & Submit
        return (
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <CheckCircle color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Review Your Information
                </Typography>
              </Stack>
              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={4}>
                {/* Personal Info Review */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {formData.full_name || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1">{formData.dob || 'Not provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">{formData.phone || 'Not provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{formData.email || 'Not provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Aadhaar Number
                      </Typography>
                      <Typography variant="body1">
                        {formData.aadhaar_number || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1">{formData.gender || 'Not provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Emergency Contact Number
                      </Typography>
                      <Typography variant="body1">
                        {formData.emergency_contact_number || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Salary Account Number
                      </Typography>
                      <Typography variant="body1">
                        {formData.salary_account_number || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Professional Info Review */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Professional Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employee Role
                      </Typography>
                      <Typography variant="body1">
                        {formData.employees_role || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Qualification
                      </Typography>
                      <Typography variant="body1">
                        {formData.qualification || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {formData.experience ? `${formData.experience} years` : 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1">
                        {formData.department || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Designation
                      </Typography>
                      <Typography variant="body1">
                        {formData.designation || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography variant="body1">
                        {formData.marital_status || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Blood Group
                      </Typography>
                      <Typography variant="body1">
                        {formData.blood_group || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">{formData.address || 'Not provided'}</Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Documents Review */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Documents Uploaded
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(documentCategories).map(([key, category]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {category.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {documents[key].length} file(s) uploaded
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          p: 4,
          background: 'linear-gradient(135deg, #3A4B5E 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <User size={32} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Employee Onboarding
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Complete your profile to get started
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Status Messages */}
      {success && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, fontSize: '1rem' }}>
          Form submitted successfully! Welcome to the team.
        </Alert>
      )}
      {error && (
        <Alert severity="error" icon={<AlertCircle />} sx={{ mb: 3, fontSize: '1rem' }}>
          {error}
        </Alert>
      )}

      {/* Form Content */}
      {renderStepContent(activeStep)}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={handleBack} disabled={activeStep === 0} startIcon={<ChevronLeft />}>
          Back
        </Button>

        <Button
          onClick={handleNext}
          variant="contained"
          disabled={loading}
          endIcon={activeStep === steps.length - 1 ? null : <ChevronRight />}
          sx={{
            background: 'linear-gradient(135deg, #3A4B5E 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #2c3e50 0%, #5c2e91 100%)', // ✅ optional hover effect
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : activeStep === steps.length - 1 ? (
            'Submit'
          ) : (
            'Next'
          )}
        </Button>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md">
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img src={previewImage} alt="Preview" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OnboardingForm;
