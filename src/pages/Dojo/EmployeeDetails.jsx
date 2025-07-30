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
} from '@mui/icons-material';

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_trainee_info`;

const EmployeeDetails = () => {
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        {induction.completed_at && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Completed at: {new Date(induction.completed_at).toLocaleString()}
          </Typography>
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
                    </TableRow>
                  ))}
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
            <List>
              {induction.form_files.map((file, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <Link href={file} target="_blank" rel="noopener">
                    Form {index + 1}
                  </Link>
                </ListItem>
              ))}
            </List>
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Employee List
        </Button>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Employee data not available
        </Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Employee List
        </Button>
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
            {employee.avatar ? (
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
                    {employee.fullName.charAt(0)}
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
                {employee.fullName.charAt(0)}
              </Avatar>
            )}
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {employee.fullName}
            </Typography>

            <Chip
              label={employee.designation}
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
                      secondary={employee.user_id}
                      secondaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Date of Birth" secondary={employee.dob} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Department" secondary={employee.department} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Aadhar Number" secondary={employee.adhar} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={employee.phone} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={employee.email || 'N/A'} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Gender" secondary={employee.gender || 'N/A'} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Experience" secondary={employee.experience || 'N/A'} />
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
          Created: {new Date(employee.created_at).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Updated: {new Date(employee.updated_at).toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default EmployeeDetails;
