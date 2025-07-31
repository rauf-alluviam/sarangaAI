import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Checkbox,
  Dialog,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Badge as BadgeIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  VideoLibrary as VideoLibraryIcon,
  CheckBox,
} from '@mui/icons-material';

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_trainee_info`;

const EmployeeDetails = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  // For showing uploaded images
  const [uploadedImageDialogOpen, setUploadedImageDialogOpen] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  // Dialog to show uploaded images
  function UploadedImagesDialog({ open, onClose, imageUrls }) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Uploaded Images
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {imageUrls && imageUrls.length > 0 ? (
              imageUrls.map((url, idx) => (
                <Box key={idx} sx={{ p: 1, border: '1px solid #eee', borderRadius: 2 }}>
                  <img
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    style={{ maxWidth: 250, maxHeight: 250, borderRadius: 8 }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, wordBreak: 'break-all' }}
                  >
                    {url}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No images found.</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // File upload handler
  const handleFileUpload = async (event) => {
    setUploadError(null);
    setUploadSuccess(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      // Backend expects 'upload_file' as the field name
      formData.append('upload_file', file);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/upload_induction_form?user_id=${userId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();
      setUploadSuccess(data.message || 'File uploaded successfully!');
      if (
        data.static_file_urls &&
        Array.isArray(data.static_file_urls) &&
        data.static_file_urls.length > 0
      ) {
        setUploadedImageUrls(data.static_file_urls);
        setUploadedImageDialogOpen(true);
      }
    } catch (err) {
      // Try to extract backend error message if available
      if (err.response) {
        try {
          const errorData = await err.response.json();
          setUploadError(errorData.message || err.message || 'Upload failed');
        } catch {
          setUploadError(err.message || 'Upload failed');
        }
      } else if (err instanceof Response) {
        try {
          const errorData = await err.json();
          setUploadError(errorData.message || err.statusText || 'Upload failed');
        } catch {
          setUploadError(err.statusText || 'Upload failed');
        }
      } else {
        setUploadError(err.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  // Dialog for confirmation before marking video as watched
  // const handleDialogClose = async (confirmed) => {
  //   setDialogOpen(false);
  //   if (confirmed && dialogVideo) {
  //     setMarkingVideo(dialogVideo.title);
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_BACKEND_API}/mark_video_watched`,
  //         {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             user_id: employee.user_id,
  //             video_title: dialogVideo.title,
  //           }),
  //         }
  //       );
  //       if (!response.ok)
  //         throw new Error('Failed to mark video as watched');
  //       setEmployee((prev) => {
  //         if (!prev?.induction?.videos) return prev;
  //         return {
  //           ...prev,
  //           induction: {
  //             ...prev.induction,
  //             videos: prev.induction.videos.map((v) =>
  //               v.title === dialogVideo.title
  //                 ? {
  //                     ...v,
  //                     status: 'Watched',
  //                     watched_at: new Date().toISOString(),
  //                   }
  //                 : v
  //             ),
  //           },
  //         };
  //       });
  //     } catch (err) {
  //       setUploadError(err.message || 'Failed to mark video as watched');
  //     } finally {
  //       setMarkingVideo(null);
  //       setDialogVideo(null);
  //     }
  //   } else {
  //     setDialogVideo(null);
  //   }
  // };

  // SimpleDialog component for confirmation
  function SimpleDialog({ open, onClose, video }) {
    return (
      <Dialog open={open} onClose={() => onClose(false)}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Mark video as watched?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to mark <b>{video?.title}</b> as watched?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => onClose(false)} color="inherit" variant="outlined">
              No
            </Button>
            <Button onClick={() => onClose(true)} color="primary" variant="contained">
              Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(employee);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`${API_URL}?user_id=${userId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch employee details');

        const data = await response.json();

        // The API returns a single trainee object
        const trainee = data.trainee || data;
        if (!trainee || !trainee.user_id) throw new Error('Employee not found');

        // Process avatar URL
        let avatar = '';
        const documents = trainee.user_info?.user_documents || {};

        if (documents.avatar && documents.avatar.length > 0) {
          // Find an actual image file if available
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [userId, token]);

  const renderDocumentsSection = () => {
    if (!employee.user_info?.user_documents) return null;

    const documents = employee.user_info.user_documents;
    const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isDocument = (url) => /\.(docx?|pdf|txt)$/i.test(url);

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BadgeIcon sx={{ mr: 1 }} /> ID Proof Documents
            </Typography>

            {documents.id_proof &&
              Object.entries(documents.id_proof).map(([type, urls]) => (
                <Box key={type} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  >
                    {type.replace(/_/g, ' ')}:
                  </Typography>
                  <List dense>
                    {urls.map((url, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DescriptionIcon color="primary" />
                        </ListItemIcon>
                        {isImage(url) ? (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Box sx={{ p: 1 }}>
                              <img
                                src={url}
                                alt={`Document ${index + 1}`}
                                style={{
                                  maxWidth: '180px',
                                  maxHeight: '180px',
                                  borderRadius: 8,
                                  border: '1px solid #eee',
                                  cursor: 'pointer',
                                }}
                              />
                            </Box>
                          </Link>
                        ) : (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            {isDocument(url)
                              ? `${type.replace(/_/g, ' ')} document ${index + 1}`
                              : 'View Document'}
                          </Link>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} /> Education Certificates
            </Typography>

            {documents.education_certificates &&
              Object.entries(documents.education_certificates).map(([level, urls]) => (
                <Box key={level} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  >
                    {level}:
                  </Typography>
                  <List dense>
                    {urls.map((url, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DescriptionIcon color="primary" />
                        </ListItemIcon>
                        {isImage(url) ? (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Box sx={{ p: 1 }}>
                              <img
                                src={url}
                                alt={`Certificate ${index + 1}`}
                                style={{
                                  maxWidth: '180px',
                                  maxHeight: '180px',
                                  borderRadius: 8,
                                  border: '1px solid #eee',
                                  cursor: 'pointer',
                                }}
                              />
                            </Box>
                          </Link>
                        ) : (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            {isDocument(url)
                              ? `${level} certificate ${index + 1}`
                              : 'View Certificate'}
                          </Link>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1 }} /> Other Documents
            </Typography>

            {documents.other_documents &&
              Object.entries(documents.other_documents).map(([type, urls]) => (
                <Box key={type} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  >
                    {type.replace(/_/g, ' ')}:
                  </Typography>
                  <List dense>
                    {urls.map((url, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DescriptionIcon color="primary" />
                        </ListItemIcon>
                        {isImage(url) ? (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Box sx={{ p: 1 }}>
                              <img
                                src={url}
                                alt={`Other Document ${index + 1}`}
                                style={{
                                  maxWidth: '180px',
                                  maxHeight: '180px',
                                  borderRadius: 8,
                                  border: '1px solid #eee',
                                  cursor: 'pointer',
                                }}
                              />
                            </Box>
                          </Link>
                        ) : (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            {isDocument(url)
                              ? `${type.replace(/_/g, ' ')} document ${index + 1}`
                              : 'View Document'}
                          </Link>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const [inductionLoading, setInductionLoading] = useState(false);
  const [inductionError, setInductionError] = useState(null);
  // For marking video as watched
  const [markingVideo, setMarkingVideo] = useState(null);
  // For confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVideo, setDialogVideo] = useState(null);

  // Handle dialog close and mark as watched if confirmed
  const handleDialogClose = async (confirmed) => {
    setDialogOpen(false);
    if (confirmed && dialogVideo) {
      setMarkingVideo(dialogVideo.title);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/mark_video_watched`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: employee.user_id,
            video_title: dialogVideo.title,
          }),
        });
        if (!response.ok) throw new Error('Failed to mark video as watched');
        setEmployee((prev) => {
          if (!prev?.induction?.videos) return prev;
          return {
            ...prev,
            induction: {
              ...prev.induction,
              videos: prev.induction.videos.map((v) =>
                v.title === dialogVideo.title
                  ? {
                      ...v,
                      status: 'Watched',
                      watched_at: new Date().toISOString(),
                    }
                  : v
              ),
            },
          };
        });
      } catch (err) {
        setUploadError(err.message || 'Failed to mark video as watched');
      } finally {
        setMarkingVideo(null);
        setDialogVideo(null);
      }
    } else {
      setDialogVideo(null);
    }
  };

  const initializeInduction = async () => {
    setInductionLoading(true);
    setInductionError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/initialize_induction?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to initialize induction');
      // Optionally show a message here
      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const data = await refreshed.json();
      const trainee = data.trainee || data;
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
      setInductionError(err.message);
    } finally {
      setInductionLoading(false);
    }
  };

  const renderInductionSection = () => {
    if (!employee.induction) {
      return (
        <Box sx={{ mt: 3, mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Induction program not initialized for this employee.
          </Alert>
          {inductionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {inductionError}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={initializeInduction}
            disabled={inductionLoading}
          >
            {inductionLoading ? 'Initializing...' : 'Initialize Induction'}
          </Button>
        </Box>
      );
    }

    const { induction } = employee;

    // Check if all videos are watched
    const allVideosWatched =
      induction.videos &&
      induction.videos.length > 0 &&
      induction.videos.every((v) => v.status === 'Watched');
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon
              sx={{ mr: 1, color: induction.completed ? 'success.main' : 'warning.main' }}
            />
            Induction Program
          </Typography>
          <Chip
            label={induction.completed ? 'Completed' : 'In Progress'}
            color={induction.completed ? 'success' : 'warning'}
            variant="outlined"
          />
        </Box>

        {/* Show completed_at at the top if all videos are watched and completed_at exists */}
        {allVideosWatched && induction.completed_at && (
          <Alert severity="success" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
            All videos completed! Induction completed at:{' '}
            {new Date(induction.completed_at).toLocaleString()}
          </Alert>
        )}

        {induction.videos && induction.videos.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
              <VideoLibraryIcon sx={{ mr: 1 }} /> Training Videos
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Watched At</TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {induction.videos.map((video, index) => (
                    <TableRow key={index}>
                      <TableCell>{video.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={video.status}
                          size="small"
                          color={video.status === 'Watched' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {video.watched_at
                          ? new Date(video.watched_at).toLocaleString()
                          : 'Not watched'}
                      </TableCell>
                      <TableCell>
                        <Link href={video.link} target="_blank" rel="noopener">
                          Watch Video
                        </Link>
                      </TableCell>
                      <TableCell colSpan={4} align="center">
                        <Checkbox
                          checked={video.status === 'Watched'}
                          sx={{ margin: 'auto' }}
                          disabled={video.status === 'Watched' || markingVideo === video.title}
                          onChange={(e) => {
                            if (video.status === 'Not Watched' && e.target.checked) {
                              setDialogVideo(video);
                              setDialogOpen(true);
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* File upload row */}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          bgcolor: '#f5faff',
                          border: '2px solid #1976d2',
                          borderRadius: 2,
                          p: 2,
                          mb: 1,
                          boxShadow: 1,
                        }}
                      >
                        {uploadError && (
                          <Alert severity="error" sx={{ mb: 1, width: '100%' }}>
                            {uploadError}
                          </Alert>
                        )}
                        {uploadSuccess && (
                          <Alert severity="success" sx={{ mb: 1, width: '100%' }}>
                            {uploadSuccess}
                          </Alert>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            bgcolor: '#e3f2fd',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                          }}
                        >
                          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                          <Typography
                            sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1.1rem' }}
                          >
                            Hr Induction (L1) Evaluation Test
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                            bgcolor: '#1976d2',
                            color: '#fff',
                            '&:hover': { bgcolor: '#115293' },
                          }}
                          disabled={uploading}
                          startIcon={<DescriptionIcon />}
                        >
                          {uploading ? 'Uploading...' : 'Upload File'}
                          <input
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                          />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {induction.form_files && induction.form_files.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1 }} /> Submitted Forms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {induction.form_files.map((file, index) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                return (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      border: '1px solid #eee',
                      borderRadius: 2,
                      cursor: 'pointer',
                      width: 180,
                      textAlign: 'center',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: 3, borderColor: '#1976d2' },
                    }}
                    onClick={() => window.open(file, '_blank', 'noopener')}
                  >
                    {isImage ? (
                      <img
                        src={file}
                        alt={`Form ${index + 1}`}
                        style={{ maxWidth: 150, maxHeight: 150, borderRadius: 8, marginBottom: 8 }}
                      />
                    ) : (
                      <DescriptionIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
                    )}
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      Form {index + 1}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Paper>
    );
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress size={80} />
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Employee List
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            {employee?.avatar ? (
              /\.(jpg|jpeg|png|gif|webp)$/i.test(employee.avatar) ? (
                <Link href={employee.avatar} target="_blank" rel="noopener noreferrer">
                  <Avatar
                    src={employee.avatar}
                    sx={{ width: 200, height: 200, border: '3px solid #1976d2', cursor: 'pointer' }}
                  />
                </Link>
              ) : (
                <Link href={employee.avatar} target="_blank" rel="noopener noreferrer">
                  <Avatar
                    sx={{
                      width: 200,
                      height: 200,
                      bgcolor: 'primary.main',
                      fontSize: '4rem',
                      border: '3px solid #1976d2',
                      cursor: 'pointer',
                    }}
                  >
                    {employee?.fullName?.charAt(0) ?? ''}
                  </Avatar>
                </Link>
              )
            ) : (
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: 'primary.main',
                  fontSize: '4rem',
                  border: '3px solid #1976d2',
                }}
              >
                {employee?.fullName?.charAt(0) ?? ''}
              </Avatar>
            )}
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {employee?.fullName ?? ''}
            </Typography>

            <Chip
              label={employee?.designation ?? ''}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '1rem', mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Employee ID"
                      secondary={employee?.user_id ?? ''}
                      secondaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Date of Birth" secondary={employee?.dob ?? ''} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Department" secondary={employee?.department ?? ''} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Aadhar Number" secondary={employee?.adhar ?? ''} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={employee?.phone ?? ''} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={employee?.email || 'N/A'} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Gender" secondary={employee?.gender || 'N/A'} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Experience" secondary={employee?.experience || 'N/A'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Documents
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {renderDocumentsSection()}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Induction Program
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {renderInductionSection()}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Created: {employee?.created_at ? new Date(employee.created_at).toLocaleString() : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Updated: {employee?.updated_at ? new Date(employee.updated_at).toLocaleString() : ''}
        </Typography>
      </Box>
      {/* Confirmation Dialog for marking video as watched */}
      <SimpleDialog open={dialogOpen} onClose={handleDialogClose} video={dialogVideo} />
      {/* Uploaded Images Dialog after file upload */}
      <UploadedImagesDialog
        open={uploadedImageDialogOpen}
        onClose={() => setUploadedImageDialogOpen(false)}
        imageUrls={uploadedImageUrls}
      />
    </Container>
  );
};

export default EmployeeDetails;
