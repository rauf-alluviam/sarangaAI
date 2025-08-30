import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import colors from '../../../utils/colors';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const SetMonthlySchedule = ({ open, onClose, selectedDate, fetchData }) => {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    item_description: '',
    schedule: 0,
    resp_person: '',
    timestamp: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with selected date when modal opens
  React.useEffect(() => {
    if (open && selectedDate) {
      const [year, month] = selectedDate.split('-');
      setFormData((prev) => ({
        ...prev,
        year: parseInt(year),
        month: parseInt(month),
      }));
    }
  }, [open, selectedDate]);

  const handleSubmit = async () => {
    if (!formData.item_description || formData.schedule === undefined) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BACKEND_API}/set_monthly_schedule_in_production_plan_sheet`,
        {
          month: formData.month.toString(),
          year: formData.year.toString(),
          item_description: formData.item_description,
          schedule: formData.schedule.toString(),
          resp_person: formData.resp_person,
          timestamp: formData.timestamp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      enqueueSnackbar('Monthly schedule set successfully', { variant: 'success' });
      onClose();
      if (fetchData) fetchData(); // Refresh the data if callback provided
    } catch (error) {
      console.error('Error setting monthly schedule:', error);
      enqueueSnackbar('Error setting monthly schedule', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
          Set Monthly Schedule
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  handleChange('year', parseInt(e.target.value) || new Date().getFullYear())
                }
                variant="outlined"
                inputProps={{
                  min: 2020,
                  max: new Date().getFullYear() + 5,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Month"
                type="number"
                value={formData.month}
                onChange={(e) =>
                  handleChange('month', parseInt(e.target.value) || new Date().getMonth() + 1)
                }
                variant="outlined"
                inputProps={{
                  min: 1,
                  max: 12,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={[
                  'ALTROZ BRACKET-D',
                  'ALTROZ BRACKET-E',
                  'ALTROZ PES COVER A',
                  'ALTROZ PES COVER B',
                  'ALTROZ INNER LENS A',
                  'ALTROZ SHADE A MG',
                ]}
                value={formData.item_description}
                onChange={(event, newValue) => handleChange('item_description', newValue || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Item Description *" variant="outlined" required />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Schedule *"
                type="number"
                value={formData.schedule}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange('schedule', value === '' ? '' : Number(value));
                }}
                variant="outlined"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Responsible Person"
                value={formData.resp_person}
                onChange={(e) => handleChange('resp_person', e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Timestamp (Local Time)"
                type="datetime-local"
                value={
                  formData.timestamp ? new Date(formData.timestamp).toISOString().slice(0, 16) : ''
                }
                onChange={(e) => handleChange('timestamp', new Date(e.target.value).toISOString())}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Will be converted to IST automatically"
              />
            </Grid> */}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          sx={{ minWidth: 100 }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{ minWidth: 100 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={20} /> : 'Set Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetMonthlySchedule;
