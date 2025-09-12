import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addComplaint } from '../../../Redux/Actions/complaintAction';
import { enqueueSnackbar } from 'notistack';
import colors from '../../../utils/colors';

const AddComplaint = ({ setIsOpen }) => {
  const { complaintsLoading } = useSelector((state) => state.complaint);
  const dispatch = useDispatch();

  // Form state - organized by mandatory/optional
  const [formData, setFormData] = useState({
    // Mandatory fields
    customer: '',
    partName: '',
    complaint: '',
    complaintDate: '',
    problemDescription: '',
    quantity: '',
    lineName: '',
    traceability: '',
    firstRepeat: '',
    supplier: '',
    process: '',
    temporaryAction: '',
    temporaryTargetDate: '',
    rootCause: '',
    permanentAction: '',
    permanentTargetDate: '',
    responsibility: '',

    // Optional fields
    status: '',
    standardization: '',
    horizontalDeployment: '',
    partReceivedDate: '',
  });

  const [errors, setErrors] = useState({});

  // Mandatory fields list
  const mandatoryFields = [
    'customer',
    'partName',
    'complaint',
    'complaintDate',
    'problemDescription',
    'quantity',
    'lineName',
    'traceability',
    'firstRepeat',
    'supplier',
    'process',
    'temporaryAction',
    'temporaryTargetDate',
    'rootCause',
    'permanentAction',
    'permanentTargetDate',
    'responsibility',
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    mandatoryFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Additional validation
    if (formData.quantity && formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      enqueueSnackbar('Please fill all mandatory fields', { variant: 'error' });
      return;
    }

    const submitData = {
      customer: formData.customer,
      part_name: formData.partName,
      complaint: formData.complaint,
      complaint_date: formData.complaintDate,
      part_received_date: formData.partReceivedDate || null,
      problem_description: formData.problemDescription,
      quantity: parseInt(formData.quantity),
      line_name: formData.lineName,
      tracebility: formData.traceability,
      first_repeat: formData.firstRepeat,
      supplier: formData.supplier,
      process: formData.process,
      temporary_action: formData.temporaryAction,
      temporary_target_date: formData.temporaryTargetDate,
      root_cause: formData.rootCause,
      permanent_action: formData.permanentAction,
      permanent_target_date: formData.permanentTargetDate,
      responsibility: formData.responsibility,
      resp_person: formData.responsibility,
      status: formData.status || '',
      standerdization: formData.standardization || '',
      horizental_deployment: formData.horizontalDeployment || '',
      timestamp: new Date().toISOString().split('T')[0],
    };

    dispatch(
      addComplaint(
        submitData,
        (successMsg) => {
          setIsOpen(false);
          enqueueSnackbar(successMsg, { variant: 'success' });
        },
        (errorMsg) => enqueueSnackbar(errorMsg, { variant: 'error' })
      )
    );
  };

  // Render input field with validation
  const renderTextField = (field, label, type = 'text', isOptional = false) => (
    <TextField
      fullWidth
      label={`${label}${isOptional ? ' (Optional)' : ' *'}`}
      type={type}
      value={formData[field]}
      onChange={(e) => handleInputChange(field, e.target.value)}
      error={!!errors[field]}
      helperText={errors[field]}
      sx={{ mb: 2 }}
      size="small"
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
    />
  );

  // Render select field with validation
  const renderSelectField = (field, label, options, isOptional = false) => (
    <FormControl fullWidth sx={{ mb: 2 }} size="small" error={!!errors[field]}>
      <InputLabel>{`${label}${isOptional ? ' (Optional)' : ' *'}`}</InputLabel>
      <Select
        value={formData[field]}
        label={`${label}${isOptional ? ' (Optional)' : ' *'}`}
        onChange={(e) => handleInputChange(field, e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[field] && (
        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
          {errors[field]}
        </Typography>
      )}
    </FormControl>
  );

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      borderRadius="8px"
      width="70rem"
      maxWidth="95vw"
      bgcolor="white"
      p={3}
      maxHeight="90vh"
      overflow="auto"
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        Add Complaint
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {renderTextField('customer', 'Customer Name')}
            {renderTextField('partName', 'Part Name')}
            {renderTextField('complaint', 'Complaint')}
            {renderTextField('complaintDate', 'Complaint Date', 'date')}
            {renderTextField('problemDescription', 'Problem Description')}
            {renderTextField('quantity', 'Quantity', 'number')}
            {renderTextField('lineName', 'Line Name')}
            {renderTextField('traceability', 'Traceability')}

            {renderSelectField('firstRepeat', 'First / Repeat', [
              { value: 'first', label: 'First' },
              { value: 'repeat', label: 'Repeat' },
            ])}

            {renderTextField('supplier', 'Supplier')}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {renderTextField('process', 'Process')}
            {renderTextField('temporaryAction', 'Temporary Action')}
            {renderTextField('temporaryTargetDate', 'Temporary Target Date', 'date')}
            {renderTextField('rootCause', 'Root Cause')}
            {renderTextField('permanentAction', 'Permanent Action')}
            {renderTextField('permanentTargetDate', 'Permanent Target Date', 'date')}
            {renderTextField('responsibility', 'Responsibility')}

            {/* Optional Fields */}
            {renderSelectField(
              'status',
              'Status',
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
              true
            )}

            {renderSelectField(
              'standardization',
              'Standardization',
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
              true
            )}

            {renderSelectField(
              'horizontalDeployment',
              'Horizontal Deployment',
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
              true
            )}

            {renderTextField('partReceivedDate', 'Part Received Date', 'date', true)}
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => setIsOpen(false)} disabled={complaintsLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: colors.primary }}
            disabled={complaintsLoading}
          >
            {complaintsLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddComplaint;
