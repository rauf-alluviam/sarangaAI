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
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import colors from '../../../utils/colors';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddProduction = ({ addData, setAddData, fetchData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setAddData({});
  };

  const handleSubmit = async () => {
    if (!addData.part_description || !addData.plan) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        part_description: addData.part_description,
        schedule: addData.schedule?.toString() || '0',
        plan: addData.plan?.toString() || '0',
        actual_RH: addData.actual_RH?.toString() || '0',
        actual_LH: addData.actual_LH?.toString() || '0',
        resp_person: addData.resp_person || '',
        timestamp: addData.timestamp,
      };

      const response = await axios.post(
        `${BACKEND_API}/save_production_plan_detail?day=${addData.day}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      enqueueSnackbar('Production data added successfully', { variant: 'success' });
      handleClose();
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error adding production data:', error);
      enqueueSnackbar('Error adding production data', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={Object.keys(addData).length > 0} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
            Add Production Data for Day {addData.day}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Part Description *"
                value={addData.part_description || ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                required
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Machine"
                value={addData.machine || ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
            </Grid>

            {/* Schedule field - only show for day 1 */}
            {addData.day === 1 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Schedule *"
                  type="number"
                  value={addData.schedule || ''}
                  onChange={(e) =>
                    setAddData((prev) => ({ ...prev, schedule: parseInt(e.target.value) || 0 }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plan *"
                type="number"
                value={addData.plan || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, plan: parseInt(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actual RH"
                type="number"
                value={addData.actual_RH || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, actual_RH: parseInt(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actual LH"
                type="number"
                value={addData.actual_LH || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, actual_LH: parseInt(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Responsible Person"
                value={addData.resp_person || ''}
                onChange={(e) => setAddData((prev) => ({ ...prev, resp_person: e.target.value }))}
                variant="outlined"
              />
            </Grid>

            {/* Summary display */}
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Summary:
                </Typography>
                <Typography variant="body2">
                  Balance (Plan): {(addData.schedule || 0) - (addData.plan || 0)}
                </Typography>
                <Typography variant="body2">
                  Balance (Actual RH): {(addData.schedule || 0) - (addData.actual_RH || 0)}
                </Typography>
                <Typography variant="body2">
                  Balance (Actual LH): {(addData.schedule || 0) - (addData.actual_LH || 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} color="error" variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{ minWidth: 100 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduction;
