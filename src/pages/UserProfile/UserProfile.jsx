// components/UserProfile.jsx
import React, { useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Lock as LockIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format } from 'date-fns-tz';


const UserProfile = ({ user }) => {
    const {token}= useSelector((state)=> state.auth);
  // Dummy user details for fallback
  const dummyUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    force_password_change: false,
    password_last_changed: "2023-06-01T12:00:00Z",
    _id: "1234567890abcdef",
  };

  // Use the passed user prop or fallback to dummy user
  const currentUser = user || dummyUser;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h5" component="h2" fontWeight="bold">
          User Profile
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View your account information and security status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {currentUser.name}
              </Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {currentUser.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
              </Box>
              <Typography variant="h8" fontWeight="bold">
               admin
              </Typography>
              {/* <Chip 
                label={currentUser.force_password_change ? "Change Required" : "Current"}
                color={currentUser.force_password_change ? "error" : "success"}
                variant="filled"
              /> */}
            </CardContent>
          </Card>

          {/* <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Last Password Change
              </Typography>
             
            <Typography fontWeight="bold">
  {currentUser?.password_last_changed
    ? format(new Date(currentUser.password_last_changed), 'MMMM dd, yyyy, hh:mm:ss a', {
        timeZone: 'Asia/Kolkata',
      })
    : "Never Changed"}
</Typography>
            </CardContent>
          </Card> */}
        </Grid>
      </Grid>

      <Paper 
        variant="outlined" 
        sx={{ 
          mt: 3, 
          p: 3, 
          bgcolor: 'primary.50',
          border: '1px solid',
          borderColor: 'primary.200'
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
          User ID
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.dark' }}>
          {currentUser._id}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserProfile;



// import { Box, Typography } from '@mui/material'
// import React from 'react'

// const UserProfile = () => {
//   return (
//     <Box>
//         <Typography fontSize={'1.4rem'}>User Profile:-</Typography>
//         <Box width={'50%'}>
//         <Box display={'flex'} bgcolor={'lightgrey'} alignItems={'center'}>
//             <Box bgcolor={'black'} height={'4rem'} width={'4rem'} borderRadius={'50%'}>1</Box>
//             <Box display={'flex'} flexDirection={'column'} gap={'0.5rem'} ml={'2rem'}>
//                 <Typography>Yash Gupta</Typography>
//                 <Typography>Yash@gmail.com</Typography>
//             </Box>
//         </Box>

//         <Box>
//             <Box display={'flex'} width={'100%'} justifyContent={'space-between'} bgcolor={'lightblue'}>
//                 <Typography>Name-</Typography>
//                 <Typography>yash Gupta</Typography>
//                 </Box>
//         </Box>
//         </Box>
//     </Box>  
//   )
// }

// export default UserProfile