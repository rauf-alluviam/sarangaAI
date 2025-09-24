import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import colors from '../../../utils/colors';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddRejection = ({ addData, setAddData, fetchData }) => {
  const { token } = useSelector((state) => state.auth);

  const handleAddSubmit = async () => {
    try {
      // Prepare add payload
      const addPayload = {
        part_description: addData.part_description,
        rm: addData.rm,
        ok_parts: addData.ok_parts || 0,
        rejections: addData.rejections || 0,
        lumps: addData.lumps || 0,
        runner: addData.runner || 0,
        isssued: addData.isssued || 0,
        resp_person: addData.resp_person || '',
        timestamp: addData.timestamp,
      };

      console.log('Add payload:', addPayload);

      // API call to add new entry
      const response = await axios.post(
        `${BACKEND_API}/save_rejection_detail?day=${addData.day}`,
        addPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      enqueueSnackbar('New record added successfully', { variant: 'success' });
      setAddData({});
      // Refresh data after adding
      fetchData();
    } catch (error) {
      console.error('Error adding record:', error);
      enqueueSnackbar('Error adding record', { variant: 'error' });
    }
  };

  return (
    <Dialog
      open={Object.keys(addData).length > 0}
      onClose={() => setAddData({})}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
          Add New Rejection Data
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Read-only fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Part Description"
                value={addData.part_description || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
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
                label="RM (Raw Material)"
                value={addData.rm || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
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
                label="Date"
                value={addData.timestamp ? addData.timestamp.split('T')[0] : ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
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
                label="Day"
                value={addData.day || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
            </Grid>

            {/* Editable fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="OK Parts"
                type="number"
                value={addData.ok_parts || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, ok_parts: parseFloat(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rejections (kg)"
                type="number"
                value={addData.rejections || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, rejections: parseFloat(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lumps (kg)"
                type="number"
                value={addData.lumps || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, lumps: parseFloat(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Runner (kg)"
                type="number"
                value={addData.runner || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, runner: parseFloat(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issued (kg)"
                type="number"
                value={addData.isssued || ''}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, isssued: parseFloat(e.target.value) || 0 }))
                }
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
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
                  Total Scrap:{' '}
                  {(
                    (addData.rejections || 0) +
                    (addData.lumps || 0) +
                    (addData.runner || 0)
                  ).toFixed(2)}{' '}
                  kg
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={() => setAddData({})}
          color="error"
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddSubmit}
          color="primary"
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Add Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRejection;
