import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
  ListItemIcon,
  ListItemText,
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
    // { label: 'Level 4', icon: <AwardIcon /> },
  ];

  // Level 1 Actions
  const [level1Loading, setLevel1Loading] = useState(false);
  const [level1Error, setLevel1Error] = useState(null);

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
    return <PersonalTab employee={employee} />;
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

  // Sidebar summary
  function renderSidebar() {
    return (
      <Paper
        sx={{
          p: 3,
          position: { lg: 'sticky' },
          top: { lg: 24 },
          mb: { xs: 2, lg: 0 },
        }}
      >
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
