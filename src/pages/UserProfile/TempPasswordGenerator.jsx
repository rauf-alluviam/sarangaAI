import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Avatar,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { 
  Key as KeyIcon, 
  Email as EmailIcon,
  Send as SendIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TempPasswordGenerator = ({ user }) => {
    const {token}= useSelector((state)=> state.auth);
  // Dummy user details for fallback
  const dummyUser = {
    _id: "1234567890abcdef",
    email: "johndoe@example.com",
    force_password_change: false,
  };

  // Use the passed user prop or fallback to dummy user
  const currentUser = user || dummyUser;

  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

//   const generateTempPassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
//     let password = '';
//     for (let i = 0; i < 12; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return password;
//   };

  const handleSendTempPassword = async () => {
    console.log('Generating temporary password for user:', currentUser._id);
    setIsGenerating(true);
    setError('');
    setSuccess(false);

    try {
        const response= await axios.post(`https://rabs.alvision.in/reset_password`, {},
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )
        setSuccess(true);
    
        console.log('Temporary password generation response:', response.data);
    } catch (error) {
        console.error('Error generating temporary password:', error);
        setError('Failed to send temporary password. Please try again.');
    }finally {
          setIsGenerating(false);
        }
    // try {
    //   const tempPassword = generateTempPassword();
    //   console.log('Generated temporary password:', tempPassword);
      
    //   // Simulate API call to send email - replace with actual backend integration
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
    //   // Simulate backend updating force_password_change flag
    //   console.log('Setting force_password_change to true for user:', currentUser._id);
      
    //   setSuccess(true);

    // } catch (error) {
    //   console.error('Error sending temporary password:', error);
    //   setError('Failed to send temporary password. Please try again.');
    // } finally {
    //   setIsGenerating(false);
    // }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
          <KeyIcon />
        </Avatar>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Temporary Password
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate and send a temporary password for emergency access
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          A temporary password has been sent to {currentUser.email}.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          ⚠️ Important Security Notice
        </Typography>
        <Typography variant="body2">
          • You will be required to change your password after login<br/>
          • Only use this feature if you've forgotten your current password<br/>
          • The temporary password will be sent to your registered email
        </Typography>
      </Alert>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Email Address
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {currentUser.email}
          </Typography>
        </CardContent>
      </Card>

      {currentUser.force_password_change && (
        <Alert severity="error" sx={{ mb: 3 }}>
          🔒 Password change is currently required for this account
        </Alert>
      )}

      <Button 
        onClick={handleSendTempPassword}
        disabled={isGenerating}
        fullWidth
        variant="contained"
        size="large"
        startIcon={<SendIcon />}
        sx={{ 
          bgcolor: 'warning.main',
          '&:hover': { bgcolor: 'warning.dark' },
          py: 1.5,
          mb: 2
        }}
      >
        {isGenerating ? "Generating & Sending..." : "Send Temporary Password"}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
        By clicking this button, a temporary password will be generated and sent to {currentUser.email}
      </Typography>
    </Box>
  );
};

export default TempPasswordGenerator;