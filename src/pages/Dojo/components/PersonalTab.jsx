import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Swal from 'sweetalert2';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const PersonalTab = ({ employee, token, onFetchEmployee }) => {
  const [initializingWorkwear, setInitializingWorkwear] = useState(false);
  const [updatingWorkwear, setUpdatingWorkwear] = useState(false);

  // ✅ Initialize Workwear
  const handleInitializeWorkwear = async () => {
    if (!employee?.user_id) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Employee user ID is missing',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setInitializingWorkwear(true);

    try {
      const response = await fetch(
        `${BACKEND_API}/initialize_workwear?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message || 'Workwear initialized successfully',
        timer: 3000,
        showConfirmButton: false,
      });

      if (onFetchEmployee) {
        await onFetchEmployee();
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to initialize workwear.',
        timer: 5000,
        showConfirmButton: true,
      });
    } finally {
      setInitializingWorkwear(false);
    }
  };

  // ✅ Update Workwear Status
  const handleUpdateWorkwear = async (title, completed) => {
    if (!employee?.user_id) {
      Swal.fire('Error!', 'Employee user ID missing', 'error');
      return;
    }

    setUpdatingWorkwear(true);

    try {
      // Current date in DD/MM/YYYY
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB');

      const url = `${BACKEND_API}/update_workwear_status?user_id=${
        employee.user_id
      }&title=${encodeURIComponent(title)}&completed=${completed}&date=${encodeURIComponent(
        formattedDate
      )}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: data.message || 'Workwear status updated successfully',
        timer: 2500,
        showConfirmButton: false,
      });

      if (onFetchEmployee) {
        await onFetchEmployee();
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update workwear.',
        timer: 4000,
        showConfirmButton: true,
      });
    } finally {
      setUpdatingWorkwear(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Personal Data Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Personal Data</Typography>

        {!employee?.workwear && (
          <Button
            variant="contained"
            onClick={handleInitializeWorkwear}
            disabled={initializingWorkwear}
          >
            {initializingWorkwear ? 'Initializing...' : 'Initialize Workwear'}
          </Button>
        )}
      </Box>

      {/* Personal Details */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Full Name</Typography>
          <Typography>{employee?.fullName}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">DOB</Typography>
          <Typography>
            {employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Gender</Typography>
          <Typography>{employee?.gender || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Designation</Typography>
          <Typography>{employee?.designation}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Email</Typography>
          <Typography>{employee?.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Phone</Typography>
          <Typography>{employee?.phone}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Department</Typography>
          <Typography>{employee?.department}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Aadhar</Typography>
          <Typography>{employee?.adhar || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Experience</Typography>
          <Typography>{employee?.experience || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Created At</Typography>
          <Typography>
            {employee?.created_at ? new Date(employee.created_at).toLocaleString() : 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Updated At</Typography>
          <Typography>
            {employee?.updated_at ? new Date(employee.updated_at).toLocaleString() : 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      {/* Show Photo */}
      {employee?.user_info?.user_documents?.photo && (
        <Box mt={2}>
          <Typography variant="subtitle2">Photo</Typography>
          <Avatar
            src={employee.user_info.user_documents.photo}
            alt="Photo"
            sx={{ width: 100, height: 100, border: '1px solid #ccc', mt: 1 }}
          />
        </Box>
      )}

      {/* ✅ Workwear Section */}
      {employee?.workwear && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Work Wear
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(employee?.workwear?.items) &&
                  employee.workwear.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.completed ? 'Completed' : 'Pending'}</TableCell>
                      <TableCell>{item.date || 'N/A'}</TableCell>
                      <TableCell>
                        {!item.completed ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateWorkwear(item.title, true)}
                            disabled={updatingWorkwear}
                          >
                            Mark as Completed
                          </Button>
                        ) : (
                          <Typography color="success.main">✔ Done</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default PersonalTab;
