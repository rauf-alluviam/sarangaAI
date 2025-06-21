// pages/UserManagement.jsx
import React, { useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import UserProfile from './UserProfile';
import PasswordReset from './PasswordReset';
import TempPasswordGenerator from './TempPasswordGenerator';
import axios from 'axios';
import { useSelector } from 'react-redux';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserManagement = () => {
    const {token}= useSelector((state) => state.auth);
  const [userDetail, setUserDetail] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);

  // Sample user data - in real app this would come from API/props
//   const userData = {
//     _id: "68524d2914b22f840594eaa1",
//     name: "novusha",
//     email: "intern@novusha.com",
//     cameras: {},
//     force_password_change: false,
//     password_last_changed: "2025-06-18T05:42:57.261000"
//   };

useEffect(()=>{
    async function fetchUserData() {
        const response= await axios.get(`https://rabs.alvision.in/get_my_details`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
        )
        console.log(response.data.user);
        setUserDetail(response.data.user);
    }
     fetchUserData();
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            User Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your account settings and security
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 2}}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              }
            }}
          >
            <Tab label="Profile" />
            <Tab label="Change Password" />
            {/* <Tab label="Temporary Password" /> */}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <UserProfile user={userDetail} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PasswordReset user={userDetail} />
          </TabPanel>

          {/* <TabPanel value={tabValue} index={2}>
            <TempPasswordGenerator user={userDetail} />
          </TabPanel> */}
        </Paper>
      </Container>
    </Box>
  );
};

export default UserManagement;
