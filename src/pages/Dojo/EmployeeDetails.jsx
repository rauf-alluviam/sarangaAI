import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { keyframes } from '@mui/system';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
  Grid,
  List,
  ListItem,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  EmojiEvents as AwardIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccountTree as DepartmentIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

import Swal from 'sweetalert2';

// Import the new components
import PersonalTab from './components/PersonalTab';
import DocumentsTab from './components/DocumentsTab';
import InductionTab from './components/InductionTab';
import Level1Tab from './components/Level1Tab';
import Level2Tab from './components/Level2Tab';
import Level3Tab from './components/Level3Tab.jsx';
import Level4Tab from './components/Level4Tab.jsx';
import EmployeeStars from './components/EmployeeStars'; // Import the new EmployeeStars component

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_trainee_info`;
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const EmployeeDetails = () => {
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State
  const [employee, setEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // File Upload and Misc Actions
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // HR Induction Actions
  const [inductionLoading, setInductionLoading] = useState(false);

  // Level-2 Actions
  const [level2Loading, setLevel2Loading] = useState(false);
  const [level2Error, setLevel2Error] = useState(null);
  const [level2Success, setLevel2Success] = useState(null);

  // Level-3 Actions
  const [level3Loading, setLevel3Loading] = useState(false);
  const [level3Error, setLevel3Error] = useState(null);
  const [level3Success, setLevel3Success] = useState(null);

  // Level-4 Actions
  const [level4Loading, setLevel4Loading] = useState(false);
  const [level4Error, setLevel4Error] = useState(null);
  const [level4Success, setLevel4Success] = useState(null);

  // Tabs Data
  const tabs = [
    { label: 'Personal', icon: <PersonIcon /> },
    { label: 'Documents', icon: <ArticleIcon /> },
    { label: 'Induction', icon: <VideoIcon /> },
    { label: 'Level 1', icon: <AwardIcon /> },
    { label: 'Level 2', icon: <AwardIcon /> },
    { label: 'Level 3', icon: <AwardIcon /> },
    { label: 'Level 4', icon: <AwardIcon /> },
  ];

  // Level 1 Actions
  const [level1Loading, setLevel1Loading] = useState(false);
  const [level1Error, setLevel1Error] = useState(null);

  // Function to handle silver star assignment with month/year input
  // Function to handle silver star assignment with month/year input (defaults to current)
  const handleAssignSilverStar = async (userId) => {
    try {
      // Get current month and year as defaults
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Ask user for month and year with current values as default
      const { value: formValues } = await Swal.fire({
        title: 'Assign Silver Star',
        html: `
        <div style="text-align: left; margin: 20px 0;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Month:</label>
          <select id="swal-input1" class="swal2-input" style="margin-bottom: 15px;">
            <option value="1" ${currentMonth === 1 ? 'selected' : ''}>January</option>
            <option value="2" ${currentMonth === 2 ? 'selected' : ''}>February</option>
            <option value="3" ${currentMonth === 3 ? 'selected' : ''}>March</option>
            <option value="4" ${currentMonth === 4 ? 'selected' : ''}>April</option>
            <option value="5" ${currentMonth === 5 ? 'selected' : ''}>May</option>
            <option value="6" ${currentMonth === 6 ? 'selected' : ''}>June</option>
            <option value="7" ${currentMonth === 7 ? 'selected' : ''}>July</option>
            <option value="8" ${currentMonth === 8 ? 'selected' : ''}>August</option>
            <option value="9" ${currentMonth === 9 ? 'selected' : ''}>September</option>
            <option value="10" ${currentMonth === 10 ? 'selected' : ''}>October</option>
            <option value="11" ${currentMonth === 11 ? 'selected' : ''}>November</option>
            <option value="12" ${currentMonth === 12 ? 'selected' : ''}>December</option>
          </select>
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Year:</label>
          <input id="swal-input2" class="swal2-input" type="number" min="2000" max="2100" value="${currentYear}" placeholder="Enter year">
        </div>
      `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Assign Star',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const month = document.getElementById('swal-input1').value;
          const year = document.getElementById('swal-input2').value;

          if (!month) {
            Swal.showValidationMessage('Please select a month');
            return false;
          }
          if (!year || year < 2000 || year > 2100) {
            Swal.showValidationMessage('Please enter a valid year (2000-2100)');
            return false;
          }

          return { month: parseInt(month), year: parseInt(year) };
        },
      });

      if (formValues) {
        const { month, year } = formValues;

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API
          }/assign_employee_star?user_id=${userId}&star_type=silver&year=${year}&month=${month}`,
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            text: `Silver star has been assigned successfully for ${month}/${year}.`,
            confirmButtonText: 'Great!',
            timer: 3000,
          });

          // Call the API to refresh employee data
          await fetchEmployee();
        } else {
          const error = await response.json();
          await Swal.fire({
            icon: 'warning',
            text: error.detail || 'Silver star has already been assigned for this month.',
            confirmButtonText: 'OK',
          });
        }
      }
    } catch (error) {
      console.error('Error assigning silver star:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'Failed to assign silver star. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleInitializeLevel1 = async () => {
    setLevel1Loading(true);
    setLevel1Error(null);
    try {
      const res = await fetch(
        `${BACKEND_API}/initialize_level_1_training?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize Level 1');
      await fetchEmployee();
    } catch (err) {
      setLevel1Error(err.message || 'Failed');
      throw err; // Re-throw to be caught by the component
    } finally {
      setLevel1Loading(false);
    }
  };

  // Fetch employee
  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}?user_id=${userId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch employee details');
      const data = await res.json();
      const trainee = data.trainee || data;
      if (!trainee || !trainee.user_id) throw new Error('Employee not found');
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchEmployee();
    }
    // eslint-disable-next-line
  }, [userId, token]);

  // --- HANDLERS ---

  // Handle tab switch
  const handleTabChange = (event, idx) => setTabIndex(idx);

  // Induction Initialization
  const handleInitializeInduction = async () => {
    setInductionLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/initialize_induction?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize induction');
      await fetchEmployee();
    } catch (err) {
      console.error('Induction initialization failed:', err);
      throw err; // Re-throw to be caught by the component
    } finally {
      setInductionLoading(false);
    }
  };

  // L2 Initialization (updated API and error handling)
  const handleInitializeLevel2 = async () => {
    setLevel2Loading(true);
    setLevel2Error(null);
    try {
      const res = await fetch(
        `${BACKEND_API}/initialize_level_2_training?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize Level 2');
      const data = await res.json();
      setLevel2Success(data.message || 'Level 2 initialized!');
      await fetchEmployee();
    } catch (err) {
      setLevel2Error(err.message || 'Failed');
      throw err; // Re-throw to be caught by the component
    } finally {
      setLevel2Loading(false);
    }
  };

  // Level 3 Initialization
  const handleInitializeLevel3 = async () => {
    setLevel3Loading(true);
    setLevel3Error(null);
    try {
      const res = await fetch(
        `${BACKEND_API}/initialize_level_3_training?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize Level 3');
      const data = await res.json();
      setLevel3Success(data.message || 'Level 3 initialized!');
      await fetchEmployee();
    } catch (err) {
      setLevel3Error(err.message || 'Failed');
      throw err; // Re-throw to be caught by the component
    } finally {
      setLevel3Loading(false);
    }
  };

  // Level 4 Initialization
  const handleInitializeLevel4 = async () => {
    setLevel4Loading(true);
    setLevel4Error(null);
    try {
      const res = await fetch(
        `${BACKEND_API}/initialize_level_4_training?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize Level 4');
      const data = await res.json();
      setLevel4Success(data.message || 'Level 4 initialized!');
      await fetchEmployee();
    } catch (err) {
      setLevel4Error(err.message || 'Failed');
      throw err; // Re-throw to be caught by the component
    } finally {
      setLevel4Loading(false);
    }
  };

  // Handle file upload (Induction or Level 2)
  const handleFileUpload = async (event, isL2 = false) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    const endpoint = isL2 ? '/upload_multilevel_l2_form' : '/upload_induction_form';
    try {
      const formData = new FormData();
      formData.append('upload_file', file);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}${endpoint}?user_id=${employee.user_id}`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData }
      );
      if (!res.ok) throw new Error('Failed to upload file');
      const data = await res.json();
      setUploadSuccess(data.message || 'File uploaded!');
      await fetchEmployee();
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      throw err; // Re-throw to be caught by the component
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // Mark video as watched actions (Induction or Level 2)
  const handleMarkVideoWatched = async (video, isL2 = false) => {
    try {
      const url = isL2 ? '/mark_multilevel_l2_video_watched' : '/mark_video_watched';
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: employee.user_id, video_title: video.title }),
      });
      if (!res.ok) throw new Error('Marking failed');
      await fetchEmployee();
    } catch (err) {
      setUploadError(err.message || 'Failed');
      throw err; // Re-throw to be caught by the component
    }
  };

  // --- Renders ---

  // Personal Tab
  function renderPersonalTab() {
    return <PersonalTab employee={employee} token={token} onFetchEmployee={fetchEmployee} />;
  }

  // Level 1 Tab
  function renderLevel1Tab() {
    return (
      <Level1Tab
        employee={employee}
        token={token}
        level1Loading={level1Loading}
        level1Error={level1Error}
        onInitializeLevel1={handleInitializeLevel1}
        onFetchEmployee={fetchEmployee}
      />
    );
  }

  // Documents Tab
  function renderDocumentsTab() {
    return <DocumentsTab employee={employee} />;
  }

  // Induction Tab
  function renderInductionTab() {
    return (
      <InductionTab
        employee={employee}
        token={token}
        uploading={uploading}
        uploadError={uploadError}
        uploadSuccess={uploadSuccess}
        inductionLoading={inductionLoading}
        onInitializeInduction={handleInitializeInduction}
        onFileUpload={handleFileUpload}
        onMarkVideoWatched={handleMarkVideoWatched}
        onFetchEmployee={fetchEmployee}
      />
    );
  }

  // Level 2 Tab
  function renderLevel2Tab() {
    return (
      <Level2Tab
        employee={employee}
        token={token}
        level2Loading={level2Loading}
        level2Error={level2Error}
        level2Success={level2Success}
        onInitializeLevel2={handleInitializeLevel2}
        onFetchEmployee={fetchEmployee}
      />
    );
  }

  // Level 3 Tab
  function renderLevel3Tab() {
    return (
      <Level3Tab
        employee={employee}
        token={token}
        level3Loading={level3Loading}
        level3Error={level3Error}
        level3Success={level3Success}
        onInitializeLevel3={handleInitializeLevel3}
        onFetchEmployee={fetchEmployee}
      />
    );
  }

  // Level 4 Tab
  function renderLevel4Tab() {
    return (
      <Level4Tab
        employee={employee}
        token={token}
        level4Loading={level4Loading}
        level4Error={level4Error}
        level4Success={level4Success}
        onInitializeLevel4={handleInitializeLevel4}
        onFetchEmployee={fetchEmployee}
      />
    );
  }

  // ...existing code...

  // Main Loading/Error
  if (loading)
    return (
      <Container
        sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* <Box width="100%">
          <LinearProgress />
        </Box> */}
      </Container>
    );
  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error,
      confirmButtonText: 'Go Back',
      showCancelButton: false,
    }).then(() => {
      navigate(-1);
    });
    return null;
  }
  if (!employee) return null;

  function renderSidebar() {
    return (
      <Paper sx={{ p: 3, position: { lg: 'sticky' }, top: { lg: 24 }, mb: { xs: 2, lg: 0 } }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={employee.avatar || ''}
            alt={employee.fullName}
            sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: 32 }}
          >
            {employee.fullName?.charAt(0) || ''}
          </Avatar>

          <Typography variant="h6" fontWeight={500}>
            {employee?.fullName}
          </Typography>
          <Typography color="primary" fontWeight={500} mb={1}>
            {employee?.designation}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ID: {employee?.user_id}
          </Typography>
          {/* Enhanced Stars with Assignment Button */}
          {employee?.employee_stars && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2.5,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <EmployeeStars
                silver={employee.employee_stars.silver_count || 0}
                gold={employee.employee_stars.gold_count || 0}
                platinum={employee.employee_stars.platinum_count || 0}
              />

              {/* Star Assignment Button */}
              <Fab
                size="small"
                color="primary"
                onClick={() => handleAssignSilverStar(employee.user_id)}
                sx={{
                  width: 32,
                  height: 32,
                  ml: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <StarIcon sx={{ fontSize: 16, color: '#C0C0C0' }} />
              </Fab>
            </Box>
          )}

          {/* Single Silver Star Assignment - No Menu */}
        </Box>
        <Divider sx={{ my: 2 }} />
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={employee?.phone} secondary="Phone" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={employee?.email} secondary="Email" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DepartmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={employee?.department} secondary="Department" />
          </ListItem>
        </List>
      </Paper>
    );
  }

  // Layout
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        variant="text"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Employee List
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          {renderSidebar()}
        </Grid>
        <Grid item xs={12} lg={9}>
          <Paper
            sx={{
              mb: 2,
              top: { lg: 24 },
              px: 1,
              position: 'sticky', // Makes the header stick
              zIndex: 1000, // Ensures it stays above other content
              // backgroundColor: 'background.paper', // Optional: match theme
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, idx) => (
                <Tab key={tab.label} icon={tab.icon} label={tab.label} value={idx} />
              ))}
            </Tabs>
          </Paper>
          <Box>
            {
              [
                renderPersonalTab(),
                renderDocumentsTab(),
                renderInductionTab(),
                renderLevel1Tab(),
                renderLevel2Tab(),
                renderLevel3Tab(),
                renderLevel4Tab(),
              ][tabIndex]
            }
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDetails;
