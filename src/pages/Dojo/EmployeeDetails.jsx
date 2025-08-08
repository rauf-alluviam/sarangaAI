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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  VideoLibrary as VideoIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  EmojiEvents as AwardIcon,
  Business as BuildingIcon,
  CalendarMonth as CalendarIcon,
  ManageAccounts as ManagerIcon,
  School as GraduationCapIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccountTree as DepartmentIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_trainee_info`;

function ConfirmationDialog({ open, onClose, title, text }) {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => onClose(true)} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
  const [inductionError, setInductionError] = useState(null);

  // Level-2 Actions
  const [level2Loading, setLevel2Loading] = useState(false);
  const [l2DialogOpen, setL2DialogOpen] = useState(false);
  const [l2DialogVideo, setL2DialogVideo] = useState(null);

  // Video marking
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoDialogVideo, setVideoDialogVideo] = useState(null);

  const [shopfloorLoading, setShopfloorLoading] = useState(false);
  const [shopfloorError, setShopfloorError] = useState(null);
  const [shopfloorSuccess, setShopfloorSuccess] = useState(null);

  // Tabs Data
  const tabs = [
    { label: 'Personal', icon: <PersonIcon /> },
    { label: 'Documents', icon: <ArticleIcon /> },
    { label: 'Induction (L1)', icon: <VideoIcon /> },
    { label: 'Level 2', icon: <AwardIcon /> },
  ];

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
    setInductionError(null);
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
      setInductionError(err.message || 'Failed');
    } finally {
      setInductionLoading(false);
    }
  };

  // L2 Initialization
  const handleInitializeLevel2 = async () => {
    setLevel2Loading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/initialize_multilevel_l2?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to initialize Level 2');
      await fetchEmployee();
    } catch (err) {
      setUploadError(err.message || 'Failed');
    } finally {
      setLevel2Loading(false);
    }
  };

  // Mark shopfloor complete
  const handleShopfloorComplete = async () => {
    setShopfloorLoading(true);
    setShopfloorError(null);
    setShopfloorSuccess(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/mark_shopfloor_training_completed?user_id=${
          employee.user_id
        }`,
        { method: 'PUT', headers: { accept: 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to mark shopfloor training as completed');
      await fetchEmployee();
      setShopfloorSuccess('Shopfloor training marked as completed');
    } catch (err) {
      setShopfloorError(err.message || 'Failed');
    } finally {
      setShopfloorLoading(false);
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
    }
  };

  // --- Renders ---

  // Personal Tab
  function renderPersonalTab() {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Personal Data</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption">Name</Typography>
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
  }

  // Documents Tab
  function renderDocumentsTab() {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          ID Proof Documents
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {['aadhaar', 'pan_card', 'voter_id'].map((key) => (
            <Grid item xs={12} sm={4} key={key}>
              <Typography variant="subtitle2" gutterBottom>
                {key.replace('_', ' ').toUpperCase()}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {(employee?.user_info?.user_documents?.id_proof?.[key] || []).map((url, idx) => (
                  <a href={url} key={idx} target="_blank" rel="noopener noreferrer">
                    <Avatar
                      src={url}
                      alt={`${key} ${idx + 1}`}
                      variant="rounded"
                      sx={{ width: 64, height: 48, border: '1px solid #ccc' }}
                    />
                  </a>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
          Education Certificates
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {employee?.user_info?.user_documents?.education_certificates &&
            Object.keys(employee.user_info.user_documents.education_certificates).map((key) => (
              <Grid item xs={12} sm={3} key={key}>
                <Typography variant="subtitle2" gutterBottom>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {(employee.user_info.user_documents.education_certificates[key] || []).map(
                    (url, idx) => (
                      <a href={url} key={idx} target="_blank" rel="noopener noreferrer">
                        <Avatar
                          src={url}
                          alt={`${key} ${idx + 1}`}
                          variant="rounded"
                          sx={{ width: 64, height: 48, border: '1px solid #ccc' }}
                        />
                      </a>
                    )
                  )}
                </Box>
              </Grid>
            ))}
        </Grid>
        {/* Experience Letters */}
        {employee?.user_info?.user_documents?.experience_letters &&
          employee.user_info.user_documents.experience_letters.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Experience Letters
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {employee.user_info.user_documents.experience_letters.map((url, idx) => (
                  <ListItem
                    key={idx}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ListItemIcon>
                      <FileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={url.split('/').pop()} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        {/* Other Documents */}
        {employee?.user_info?.user_documents?.other_documents && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Other Documents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.keys(employee.user_info.user_documents.other_documents).map((key) => (
              <Box key={key} mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {(employee.user_info.user_documents.other_documents[key] || []).map(
                    (url, idx) => (
                      <a href={url} key={idx} target="_blank" rel="noopener noreferrer">
                        <Avatar
                          src={url}
                          alt={`${key} ${idx + 1}`}
                          variant="rounded"
                          sx={{ width: 64, height: 48, border: '1px solid #ccc' }}
                        />
                      </a>
                    )
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    );
  }

  // Induction Tab
  function renderInductionTab() {
    if (!employee?.induction) {
      return (
        <Paper sx={{ p: 3, minHeight: 320 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">HR Induction Program (L1)</Typography>
            <Typography color="warning.main" variant="subtitle2">
              Not Started
            </Typography>
          </Box>
          {inductionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {inductionError}
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={handleInitializeInduction}
            disabled={inductionLoading}
          >
            {inductionLoading ? 'Initializing...' : 'Initialize Induction'}
          </Button>
        </Paper>
      );
    }

    const induction = employee.induction;
    const allVideosWatched =
      Array.isArray(induction.videos) && induction.videos.every((v) => v.status === 'Watched');

    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">HR Induction Program (L1)</Typography>
          <Typography color={induction.completed ? 'success.main' : 'warning.main'}>
            {induction.completed ? 'Completed' : 'In Progress'}
          </Typography>
        </Box>
        {allVideosWatched && induction.completed_at && (
          <Alert severity="success" sx={{ mb: 2 }}>
            All videos completed! Induction completed at:{' '}
            {new Date(induction.completed_at).toLocaleString()}
          </Alert>
        )}
        <Typography variant="subtitle1" mb={1}>
          Induction Videos
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Watched At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {induction.videos.map((video, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {video.link ? (
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        {video.title}
                      </a>
                    ) : (
                      video.title
                    )}
                  </TableCell>
                  <TableCell>
                    {video.status === 'Watched' ? (
                      <Box display="flex" alignItems="center" color="success.main">
                        <CheckIcon fontSize="small" sx={{ mr: 1 }} /> Watched
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setVideoDialogVideo(video);
                          setVideoDialogOpen(true);
                        }}
                        startIcon={<VisibilityIcon />}
                      >
                        Mark as Watched
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {video.watched_at
                      ? new Date(video.watched_at).toLocaleDateString()
                      : 'Not watched'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* File upload */}
        <Box>
          <Typography variant="subtitle2" mb={1}>
            HR Induction (L1) Evaluation Test
          </Typography>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {uploadError}
            </Alert>
          )}
          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {uploadSuccess}
            </Alert>
          )}
          <label htmlFor="file-upload-induction">
            <input
              id="file-upload-induction"
              type="file"
              onChange={(e) => handleFileUpload(e, false)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              hidden
              disabled={uploading}
            />
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              component="span"
              disabled={uploading}
              sx={{ mt: 1 }}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </label>
          {Array.isArray(induction.form_files) && induction.form_files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">Uploaded Induction Forms</Typography>
              <List dense>
                {induction.form_files.map((file, idx) => (
                  <ListItem
                    key={idx}
                    component="a"
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ListItemIcon>
                      <FileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={file.split('/').pop()} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        {/* Mark as watched dialog */}
        <ConfirmationDialog
          open={videoDialogOpen}
          onClose={(confirmed) => {
            setVideoDialogOpen(false);
            if (confirmed && videoDialogVideo) handleMarkVideoWatched(videoDialogVideo);
          }}
          title="Mark video as watched?"
          text={
            videoDialogVideo
              ? `Are you sure you want to mark "${videoDialogVideo.title}" as watched?`
              : ''
          }
        />
      </Paper>
    );
  }

  // Level 2 Tab
  function renderLevel2Tab() {
    const l2 = employee?.multilevel_l2;
    if (!l2) {
      return (
        <Paper sx={{ p: 3, minHeight: 240 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Level 2</Typography>
            <Typography color="warning.main" variant="subtitle2">
              Not Started
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleInitializeLevel2} disabled={level2Loading}>
            {level2Loading ? 'Initializing...' : 'Initialize Level 2'}
          </Button>
        </Paper>
      );
    }
    const allVideosWatched = l2.videos?.every((v) => v.status === 'Watched');
    const shopfloorCompleted = l2.shopfloor_training === true;
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Level 2</Typography>
          <Typography color={l2.completed ? 'success.main' : 'warning.main'}>
            {l2.completed ? 'Completed' : 'In Progress'}
          </Typography>
        </Box>
        {allVideosWatched && l2.completed_at && (
          <Alert severity="success" sx={{ mb: 2 }}>
            All videos completed! Level 2 completed at: {new Date(l2.completed_at).toLocaleString()}
          </Alert>
        )}

        <Typography variant="subtitle1" mb={1}>
          Training Videos
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Watched At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {l2.videos?.map((video, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {video.link ? (
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        {video.title}
                      </a>
                    ) : (
                      video.title
                    )}
                  </TableCell>
                  <TableCell>
                    {video.status === 'Watched' ? (
                      <Box display="flex" alignItems="center" color="success.main">
                        <CheckIcon fontSize="small" sx={{ mr: 1 }} /> Watched
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                          setL2DialogVideo(video);
                          setL2DialogOpen(true);
                        }}
                      >
                        Mark as Watched
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {video.watched_at
                      ? new Date(video.watched_at).toLocaleDateString()
                      : 'Not watched'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {allVideosWatched && (
          <>
            <Box mt={3}>
              <Typography variant="subtitle2" mb={1}>
                Shopfloor Training
              </Typography>
              {shopfloorError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {shopfloorError}
                </Alert>
              )}
              {shopfloorSuccess && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  {shopfloorSuccess}
                </Alert>
              )}
              {shopfloorCompleted ? (
                <Box color="success.main" fontWeight={500} mb={2}>
                  Shopfloor Training Completed
                </Box>
              ) : (
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleShopfloorComplete}
                  disabled={shopfloorLoading}
                  sx={{ mb: 2 }}
                >
                  {shopfloorLoading ? 'Marking...' : 'Mark Shopfloor Training as Completed'}
                </Button>
              )}
            </Box>
            {shopfloorCompleted && (
              <Box mt={2}>
                <Typography variant="subtitle2" mb={1}>
                  Shopfloor Training Form Upload
                </Typography>
                {uploadError && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {uploadError}
                  </Alert>
                )}
                {uploadSuccess && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    {uploadSuccess}
                  </Alert>
                )}
                <label htmlFor="file-upload-l2">
                  <input
                    id="file-upload-l2"
                    type="file"
                    onChange={(e) => handleFileUpload(e, true)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    hidden
                    disabled={uploading}
                  />
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    component="span"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </label>
                {Array.isArray(l2.form_files) && l2.form_files.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Uploaded Level 2 Forms</Typography>
                    <List dense>
                      {l2.form_files.map((file, idx) => (
                        <ListItem
                          key={idx}
                          component="a"
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ListItemIcon>
                            <FileIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={file.split('/').pop()} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}

        {/* Mark as watched dialog */}
        <ConfirmationDialog
          open={l2DialogOpen}
          onClose={(confirmed) => {
            setL2DialogOpen(false);
            if (confirmed && l2DialogVideo) handleMarkVideoWatched(l2DialogVideo, true);
          }}
          title="Mark video as watched?"
          text={
            l2DialogVideo
              ? `Are you sure you want to mark "${l2DialogVideo.title}" as watched?`
              : ''
          }
        />
      </Paper>
    );
  }

  // Main Loading/Error
  if (loading)
    return (
      <Container
        sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box width="100%">
          <LinearProgress />
        </Box>
      </Container>
    );
  if (error)
    return (
      <Container
        sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box textAlign="center">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
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
          <Paper sx={{ mb: 2, px: 1 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, idx) => (
                <Tab key={tab.label} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Paper>
          <Box>
            {
              [renderPersonalTab(), renderDocumentsTab(), renderInductionTab(), renderLevel2Tab()][
                tabIndex
              ]
            }
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDetails;
