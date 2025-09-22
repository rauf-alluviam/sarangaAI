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
  FormHelperText,
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
  Eye,
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
    other_qualification: '', // For "Other" qualification
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
  const [previewFile, setPreviewFile] = useState(null);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Experience options
  const experienceOptions = [
    { value: 'fresher', label: '0-1 (Fresher)' },
    { value: 'experience', label: '3-5 (Experience)' },
    { value: 'management', label: '6-10+ (Management)' },
  ];

  // File limits for each category
  const fileLimits = {
    avatar: 1,
    id_proof: 5,
    education_certificates: 5,
    experience_letters: 5,
    other_documents: 5,
  };

  // File validation
  const validateFile = (file, category) => {
    const { name, size } = file;
    const extension = name.split('.').pop().toLowerCase();

    // Size limits
    const sizeLimits = {
      avatar: 5 * 1024 * 1024, // 5MB
      id_proof: 5 * 1024 * 1024, // 5MB
      education_certificates: 10 * 1024 * 1024, // 10MB
      experience_letters: 10 * 1024 * 1024, // 10MB
      other_documents: 10 * 1024 * 1024, // 10MB
    };

    // Allowed extensions
    const allowedExtensions = {
      avatar: ['jpg', 'jpeg', 'png'],
      id_proof: ['jpg', 'jpeg', 'png'],
      education_certificates: ['pdf', 'doc', 'docx'],
      experience_letters: ['pdf', 'doc', 'docx'],
      other_documents: ['pdf', 'doc', 'docx'],
    };

    if (size > sizeLimits[category]) {
      const maxSizeMB = sizeLimits[category] / (1024 * 1024);
      return `File size should not exceed ${maxSizeMB}MB`;
    }

    if (!allowedExtensions[category].includes(extension)) {
      return `Only ${allowedExtensions[category].join(', ').toUpperCase()} files are allowed`;
    }

    return null;
  };

  // Validation rules
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'full_name':
        if (!value) error = 'Full name is required';
        else if (!/^[a-zA-Z\s]+$/.test(value))
          error = 'Full name should contain only letters and spaces';
        break;

      case 'dob':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();

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
        } else if (value === formData.emergency_contact_number) {
          error = 'Phone number and emergency contact cannot be the same';
        }
        break;

      case 'emergency_contact_number':
        if (!value) {
          error = 'Emergency contact is required';
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
        } else if (value === formData.phone) {
          error = 'Emergency contact and phone number cannot be the same';
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

      case 'salary_account_number':
        // Optional field - only validate if value exists
        if (value && !/^\d{9,18}$/.test(value)) {
          error = 'Please enter a valid salary account number (9–18 digits)';
        }
        break;

      case 'gender':
        if (!value) error = 'Gender is required';
        break;

      case 'employees_role':
        if (!value) error = 'Employee role is required';
        break;

      case 'other_qualification':
        if (formData.qualification === 'Other' && !value) {
          error = 'Please specify your qualification';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle next/back navigation
  const handleNext = () => {
    const errors = {};
    let hasErrors = false;

    if (activeStep === 0) {
      // Personal info validation - removed salary_account_number from required fields
      const personalFields = [
        'full_name',
        'dob',
        'phone',
        'aadhaar_number',
        'emergency_contact_number',
        'gender',
      ];

      personalFields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          hasErrors = true;
        }
      });

      // Cross-validation for phone numbers
      if (
        formData.phone &&
        formData.emergency_contact_number &&
        formData.phone === formData.emergency_contact_number
      ) {
        errors.phone = 'Phone number and emergency contact cannot be the same';
        errors.emergency_contact_number = 'Phone number and emergency contact cannot be the same';
        hasErrors = true;
      }

      // Avatar validation
      if (documents.avatar.length === 0) {
        setError('Please upload an avatar photo');
        hasErrors = true;
      }
    } else if (activeStep === 1) {
      // Professional info validation
      const requiredFields = ['employees_role'];

      requiredFields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          hasErrors = true;
        }
      });

      // Validate "Other" qualification
      if (formData.qualification === 'Other') {
        const error = validateField('other_qualification', formData.other_qualification);
        if (error) {
          errors.other_qualification = error;
          hasErrors = true;
        }
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

    // Apply input filters based on field type
    let filteredValue = value;
    if (name === 'full_name') {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (
      name === 'phone' ||
      name === 'emergency_contact_number' ||
      name === 'aadhaar_number'
    ) {
      filteredValue = value.replace(/[^0-9]/g, '');
      if (name === 'phone' || name === 'emergency_contact_number') {
        filteredValue = filteredValue.slice(0, 10); // Limit to 10 digits
      } else if (name === 'aadhaar_number') {
        filteredValue = filteredValue.slice(0, 12); // Limit to 12 digits
      }
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    // Validate field immediately
    const error = validateField(name, filteredValue);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));

    // Cross-validate phone numbers
    if (name === 'phone' || name === 'emergency_contact_number') {
      const otherField = name === 'phone' ? 'emergency_contact_number' : 'phone';
      if (formData[otherField] && filteredValue === formData[otherField]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Phone number and emergency contact cannot be the same',
          [otherField]: 'Phone number and emergency contact cannot be the same',
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          if (prev[otherField] && prev[otherField].includes('cannot be the same')) {
            delete newErrors[otherField];
          }
          return newErrors;
        });
      }
    }
  };

  // Handle file uploads with 5-file limit
  const handleFileUpload = (category, files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Check file limit
    const currentFileCount = documents[category].length;
    const maxFiles = fileLimits[category];
    const availableSlots = maxFiles - currentFileCount;

    if (newFiles.length > availableSlots) {
      Swal.fire({
        icon: 'warning',
        title: 'File Limit Exceeded',
        text: `You can only upload a maximum of ${maxFiles} files for ${documentCategories[category].title}. You have ${availableSlots} slots available.`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#f57c00',
      });
      return;
    }

    newFiles.forEach((file) => {
      const error = validateFile(file, category);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'File Upload Error',
        html: errors.join('<br>'),
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // For avatar, only keep one file
    if (category === 'avatar') {
      setDocuments((prev) => ({
        ...prev,
        [category]: validFiles.slice(0, 1),
      }));

      // Create preview for avatar
      if (validFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(validFiles[0]);
      }
    } else {
      setDocuments((prev) => ({
        ...prev,
        [category]: [...prev[category], ...validFiles],
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

  // Preview file in dialog
  const previewFileInDialog = (file) => {
    setPreviewFile(file);
    setFilePreviewOpen(true);
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
          reader.onload = () => resolve(reader.result.split(',')[1]);
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

      // Prepare form data with proper qualification handling
      const submissionData = { ...formData };
      if (formData.qualification === 'Other' && formData.other_qualification) {
        submissionData.qualification = `Other (${formData.other_qualification})`;
      }

      // Prepare the payload in the expected format
      const payload = {
        payload: submissionData,
        docs: docsPayload,
      };

      const response = await axios.post(`${API_URL}/submit_onboarding_with_documents`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        setFormData(initialFormData);
        setDocuments(initialDocuments);
        setPreviewImage(null);
        setTimeout(() => {
          navigate(0);
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data &&
        err.response.data.detail
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Error',
          text: err.response.data.detail,
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      } else {
        setError(
          'Failed to submit form. Please try again.' + (err?.message ? ` (${err.message})` : '')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Document categories with updated file restrictions and limits
  const documentCategories = {
    avatar: {
      title: 'Profile Photo',
      description: 'Upload your profile photo (Max 5MB, JPG/PNG only)',
      accept: '.jpg,.jpeg,.png',
      multiple: false,
      color: '#1976d2',
      required: true,
      maxFiles: 1,
    },
    id_proof: {
      title: 'Identity Proof',
      description: 'Aadhaar, PAN, Voter ID, etc. (Max 5MB, JPG/PNG only, Max 5 files)',
      accept: '.jpg,.jpeg,.png',
      multiple: true,
      color: '#f57c00',
      maxFiles: 5,
    },
    education_certificates: {
      title: 'Educational Certificates',
      description: 'Degree, Diploma, Marksheets, etc. (Max 10MB, PDF/Word only, Max 5 files)',
      accept: '.pdf,.doc,.docx',
      multiple: true,
      color: '#388e3c',
      maxFiles: 5,
    },
    experience_letters: {
      title: 'Experience Letters',
      description: 'Previous employment documents (Max 10MB, PDF/Word only, Max 5 files)',
      accept: '.pdf,.doc,.docx',
      multiple: true,
      color: '#d32f2f',
      maxFiles: 5,
    },
    other_documents: {
      title: 'Other Documents',
      description: 'Any other relevant documents (Max 10MB, PDF/Word only, Max 5 files)',
      accept: '.pdf,.doc,.docx',
      multiple: true,
      color: '#7b1fa2',
      maxFiles: 5,
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
                      Upload Photo *
                      <input
                        type="file"
                        hidden
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('avatar', e.target.files)}
                      />
                    </Button>
                    <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                      Required: JPG, PNG under 5MB
                    </Typography>
                  </Box>
                </Grid>

                {/* Personal Details */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        error={!!fieldErrors.full_name}
                        helperText={fieldErrors.full_name}
                        variant="outlined"
                        inputProps={{
                          pattern: '[a-zA-Z\\s]+',
                          title: 'Only letters and spaces allowed',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                        error={!!fieldErrors.dob}
                        helperText={fieldErrors.dob}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        error={!!fieldErrors.phone}
                        helperText={fieldErrors.phone}
                        variant="outlined"
                        inputProps={{
                          maxLength: 10,
                          pattern: '[0-9]{10}',
                          title: 'Enter 10-digit phone number',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Aadhaar Number"
                        name="aadhaar_number"
                        value={formData.aadhaar_number}
                        onChange={handleInputChange}
                        required
                        error={!!fieldErrors.aadhaar_number}
                        helperText={fieldErrors.aadhaar_number}
                        variant="outlined"
                        inputProps={{
                          maxLength: 12,
                          pattern: '[0-9]{12}',
                          title: 'Enter 12-digit Aadhaar number',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!fieldErrors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          label="Gender"
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {fieldErrors.gender && (
                          <FormHelperText>{fieldErrors.gender}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        name="emergency_contact_number"
                        value={formData.emergency_contact_number}
                        onChange={handleInputChange}
                        required
                        error={!!fieldErrors.emergency_contact_number}
                        helperText={fieldErrors.emergency_contact_number}
                        variant="outlined"
                        inputProps={{
                          maxLength: 10,
                          pattern: '[0-9]{10}',
                          title: 'Enter 10-digit phone number',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Salary Account Number (Optional)"
                        name="salary_account_number"
                        value={formData.salary_account_number}
                        onChange={handleInputChange}
                        error={!!fieldErrors.salary_account_number}
                        helperText={fieldErrors.salary_account_number}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Blood Group</InputLabel>
                        <Select
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleInputChange}
                          label="Blood Group"
                        >
                          <MenuItem value="">Select Blood Group</MenuItem>
                          {bloodGroups.map((group) => (
                            <MenuItem key={group} value={group}>
                              {group}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        variant="outlined"
                      />
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
                  <FormControl fullWidth required error={!!fieldErrors.employees_role}>
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
                      <FormHelperText>{fieldErrors.employees_role}</FormHelperText>
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

                {formData.qualification === 'Other' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Specify Qualification"
                      name="other_qualification"
                      value={formData.other_qualification}
                      onChange={handleInputChange}
                      required
                      error={!!fieldErrors.other_qualification}
                      helperText={fieldErrors.other_qualification}
                      variant="outlined"
                      placeholder="Enter your qualification"
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Experience</InputLabel>
                    <Select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      label="Experience"
                    >
                      <MenuItem value="">Select Experience</MenuItem>
                      {experienceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      label="Marital Status"
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
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
                      <Typography variant="caption" color="text.secondary">
                        ({documents[key].length}/{category.maxFiles} files)
                      </Typography>
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
                      disabled={documents[key].length >= category.maxFiles}
                      sx={{
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        '&:hover': {
                          borderStyle: 'dashed',
                          borderWidth: 2,
                        },
                      }}
                    >
                      {documents[key].length >= category.maxFiles
                        ? `Maximum ${category.maxFiles} files reached`
                        : `Add ${category.title}`}
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
                        {formData.qualification === 'Other'
                          ? `Other (${formData.other_qualification})`
                          : formData.qualification || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {experienceOptions.find((opt) => opt.value === formData.experience)
                          ?.label || 'Not provided'}
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
                  </Stack>
                </Grid>

                {/* Documents Review - Clickable */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Documents Uploaded
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(documentCategories).map(([key, category]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper sx={{ p: 2, minHeight: 120 }}>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {category.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {documents[key].length} file(s) uploaded
                          </Typography>

                          {/* Clickable file list */}
                          <Box sx={{ mt: 1 }}>
                            {documents[key].map((file, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  p: 0.5,
                                  borderRadius: 1,
                                  '&:hover': { backgroundColor: 'action.hover' },
                                }}
                                onClick={() => openFile(file)}
                              >
                                <FileText size={14} style={{ marginRight: 8 }} />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 150,
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {file.name}
                                </Typography>
                                <IconButton size="small" sx={{ ml: 0.5 }}>
                                  <Eye size={12} />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
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
      {/* Sticky Container for Header + Stepper */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'background.default',
          pb: 2,
        }}
      >
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            mb: 2,
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
        <Paper
          elevation={2}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Stepper activeStep={activeStep} sx={{ minWidth: '600px' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>

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
              background: 'linear-gradient(135deg, #2c3e50 0%, #5c2e91 100%)',
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

      {/* File Preview Dialog */}
      <Dialog open={filePreviewOpen} onClose={() => setFilePreviewOpen(false)} maxWidth="md">
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {previewFile && <Typography variant="body1">File: {previewFile.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilePreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OnboardingForm;
