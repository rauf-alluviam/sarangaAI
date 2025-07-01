import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Avatar,
  Paper,
  Grid
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { validatePassword } from '../../utils/passwordValidation'; // Adjust the import path as necessary
import axios from 'axios';
import { useSelector } from 'react-redux';

const BACKEND_API= import.meta.env.VITE_BACKEND_API;


const PasswordReset = ({ user }) => {
  const {token}= useSelector((state)=> state.auth);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Password reset form submitted for user:', user._id);
    
    setError('');
    setSuccess(false);

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordErrors.length > 0) {
      setError('Please fix password complexity issues');
      return;
    }

    setIsLoading(true);

    try {
      const response= await axios.post(`${BACKEND_API}/change-temp-password`,
        {
          email: user.email,
          temp_password: formData.oldPassword,
          new_password: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Password reset response:', response.data);
         setSuccess(true);

      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors([]);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to update password. Please try again.');
    }finally {
        setIsLoading(false);
      }

    // try {
    //   // Simulated API call - replace this with your actual logic
    //   await new Promise(resolve => setTimeout(resolve, 2000));

    //   console.log('Password reset successful for user:', userId);
    //   setSuccess(true);

    //   setFormData({
    //     oldPassword: '',
    //     newPassword: '',
    //     confirmPassword: ''
    //   });
    //   setPasswordErrors([]);
    // } catch (error) {
    //   console.error('Password reset error:', error);
    //   setError('Failed to update password. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3}}>
        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
          <LockIcon />
        </Avatar>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Change Password
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update your password to keep your account secure
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password updated successfully. You will receive a confirmation email.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              required
              variant="outlined"
              error={passwordErrors.length > 0}
            />
            {passwordErrors.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {passwordErrors.map((error, index) => (
                  <Typography key={index} variant="caption" color="error" display="block">
                    • {error}
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              variant="outlined"
              error={formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword}
            />
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                Passwords do not match
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
              <Typography variant="h6" fontWeight="bold" color="info.main" sx={{ mb: 1 }}>
                Password Requirements:
              </Typography>
              <Typography variant="body2" color="info.dark">
                • Minimum 8 characters<br />
                • At least one number<br />
                • At least one special character<br />
                • Mix of uppercase and lowercase letters
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || passwordErrors.length > 0}
              sx={{
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
                py: 1.5
              }}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PasswordReset;
