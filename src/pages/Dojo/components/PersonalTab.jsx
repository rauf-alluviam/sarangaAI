import React from 'react';
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const PersonalTab = ({ employee }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Personal Data</Typography>
      </Box>
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
      {/* Show photo if available */}
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
    </Paper>
  );
};

export default PersonalTab;
