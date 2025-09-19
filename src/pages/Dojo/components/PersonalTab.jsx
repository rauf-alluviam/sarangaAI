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
  Stack
} from '@mui/material';
import Swal from 'sweetalert2';
import StarIcon from '@mui/icons-material/Star';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

// === Star Summary Component ===
const starColors = {
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2'
};

const EmployeeStars = ({ silver = 0, gold = 0, platinum = 0 }) => (
  <Box sx={{
    p: 2, my: 2, borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper',
    display: 'inline-block', minWidth: 260
  }}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>Star Summary</Typography>
    <Stack direction="row" spacing={3} alignItems="center">
      <Box display="flex" alignItems="center">
        <StarIcon sx={{ color: starColors.silver, fontSize: 34, mr: 1 }} />
        <Typography variant="h6" sx={{ color: starColors.silver }}>{silver}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <StarIcon sx={{ color: starColors.gold, fontSize: 34, mr: 1 }} />
        <Typography variant="h6" sx={{ color: starColors.gold }}>{gold}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <StarIcon sx={{ color: starColors.platinum, fontSize: 34, mr: 1 }} />
        <Typography variant="h6" sx={{ color: starColors.platinum }}>{platinum}</Typography>
      </Box>
    </Stack>
  </Box>
);

// === Main Component ===
const PersonalTab = ({ employee, token, onFetchEmployee }) => {
  const [initializingWorkwear, setInitializingWorkwear] = useState(false);
  const [updatingWorkwear, setUpdatingWorkwear] = useState(false);

  // Initialize Workwear
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

  // Update Workwear Status
  const handleUpdateWorkwear = async (title, completed) => {
    if (!employee?.user_id) {
      Swal.fire('Error!', 'Employee user ID missing', 'error');
      return;
    }
    // 1️⃣ Ask for a date
    const todayISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { value: selectedDate } = await Swal.fire({
      title: 'Select Completion Date',
      input: 'date',
      inputLabel: 'Choose the date for marking this as completed',
      inputValue: todayISO, // Default today
      inputAttributes: { max: todayISO },
      showCancelButton: true,
      confirmButtonText: 'Next',
    });

    if (!selectedDate) return; // User cancelled

    // 2️⃣ Confirm final action
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark "${title}" as completed on ${selectedDate}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    });

    if (!confirm.isConfirmed) return;

    setUpdatingWorkwear(true);

    try {
      const url = `${BACKEND_API}/update_workwear_status?user_id=${
        employee.user_id
      }&title=${encodeURIComponent(title)}&completed=${completed}&date=${encodeURIComponent(
        selectedDate
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

  // Utility: format date to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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

      {/* Star Summary
      {employee?.employee_stars && (
        <EmployeeStars
          silver={employee.employee_stars.silver_count}
          gold={employee.employee_stars.gold_count}
          platinum={employee.employee_stars.platinum_count}
        />
      )} */}

      {/* Personal Details */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Full Name</Typography>
          <Typography>{employee?.fullName}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">DOB</Typography>
          <Typography>{employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</Typography>
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
            sx={{ width: 100, height: 100, border: '1px solid #ccc', mt: 1, borderRadius: 2 }}
          />
        </Box>
      )}

      {/* Workwear Section */}
      {employee?.workwear && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Work Wear
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>#</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(employee?.workwear?.items) &&
                  employee.workwear.items.map((item, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      sx={{
                        transition: 'background 0.2s',
                        '&:hover': { backgroundColor: '#f2faff' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              marginRight: 8,
                              background: item.completed ? '#22c55e' : '#ed6c02',
                            }}
                          />
                          {item.completed ? 'Completed' : 'Pending'}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>
                        {!item.completed ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateWorkwear(item.title, true)}
                            disabled={updatingWorkwear}
                            sx={{ textTransform: 'none', boxShadow: 1 }}
                          >
                            Mark as Completed
                          </Button>
                        ) : (
                          <Typography color="success.main" fontWeight={500}>
                            ✔ Done
                          </Typography>
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
