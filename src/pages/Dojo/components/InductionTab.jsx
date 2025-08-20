import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Check as CheckIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import ConfirmationDialog from './ConfirmationDialog';
import Swal from 'sweetalert2';
import axios from 'axios';

const InductionTab = ({
  employee,
  token,
  uploading,
  inductionLoading,
  onInitializeInduction,
  onFileUpload,
  onMarkVideoWatched,
  onFetchEmployee,
}) => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoDialogVideo, setVideoDialogVideo] = useState(null);
  const [settingResult, setSettingResult] = useState(false);
  const [resultStatus, setResultStatus] = useState(
    employee?.induction?.pass_fail_status === true
      ? 'passed'
      : employee?.induction?.pass_fail_status === false
      ? 'failed'
      : 'not_set'
  );
  const [loading, setLoading] = useState(false);
  const [reassignResult, setReassignResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSetInductionResult = async (status) => {
    setSettingResult(true);
    try {
      // Map status to boolean value for API
      const passed = status === 'passed';

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/set_induction_result_as_passed_or_failed?user_id=${
          employee.user_id
        }&passed=${passed}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to set induction result: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      // Update local state immediately for better UX
      setResultStatus(status);

      // Refresh employee data
      if (onFetchEmployee) {
        await onFetchEmployee();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to set induction result',
        timer: 3000,
        showConfirmButton: false,
      });
      // Revert to previous status on error
      setResultStatus(
        employee?.induction?.passed === true
          ? 'passed'
          : employee?.induction?.passed === false
          ? 'failed'
          : 'not_set'
      );
    } finally {
      setSettingResult(false);
    }
  };

  const handleReassign = async () => {
    setLoading(true);
    setError(null);
    setReassignResult(null); // Clear previous result

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/reassign_induction_training?user_id=${
          employee.user_id
        }`,
        {}, // empty body
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success via SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data?.message || 'Induction training reassigned successfully',
        timer: 3000,
        showConfirmButton: false,
      });

      setReassignResult(response.data);

      // Refresh employee data so UI updates
      if (onFetchEmployee) {
        await onFetchEmployee();
      }
    } catch (err) {
      console.error('Reassign error:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail?.[0]?.msg ||
        err.message ||
        'Failed to reassign induction training';

      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!employee?.induction) {
    return (
      <Paper sx={{ p: 3, minHeight: 320 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">HR Induction Program </Typography>
          <Typography color="warning.main" variant="subtitle2">
            Not Started
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={async () => {
            try {
              await onInitializeInduction();
              await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Induction program initialized successfully!',
                timer: 3000,
                showConfirmButton: false,
              });
            } catch (error) {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to initialize induction program',
                timer: 3000,
                showConfirmButton: false,
              });
            }
          }}
          disabled={inductionLoading}
        >
          {inductionLoading ? 'Initializing...' : 'Initialize Induction'}
        </Button>
      </Paper>
    );
  }

  const induction = employee.induction;

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="h6">HR Induction Program</Typography>
        <Box textAlign="right">
          {induction?.completed_at && (
            <Typography variant="body2" color="textSecondary">
              {new Date(induction.completed_at).toLocaleString()}
            </Typography>
          )}
          <Typography color={induction?.completed ? 'success.main' : 'warning.main'}>
            {induction?.completed ? 'Completed' : 'In Progress'}
          </Typography>
        </Box>
      </Box>

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
                <TableCell>{video?.watched_at ? video.watched_at : 'Not watched'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* File upload and result sections */}
      {/* File upload and result sections - Restructured based on client requirements */}
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* Column 1: Induction Result - Always shown first */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={2}>
                Induction Result
              </Typography>

              {/* Current Status */}
              <Box mb={3}>
                <Typography variant="subtitle2" mb={1}>
                  Current Status
                </Typography>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  {resultStatus === 'passed' && (
                    <Chip label="Passed" color="success" size="medium" />
                  )}
                  {resultStatus === 'failed' && <Chip label="Failed" color="error" size="medium" />}
                  {resultStatus === 'not_set' && (
                    <Chip label="Not Set" color="warning" size="medium" />
                  )}
                  <Chip
                    label={`Retrain Count: ${employee?.induction?.retrain_count || 0}`}
                    color="info"
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>

              {/* Set Result Section */}
              <Box mb={3}>
                <Typography variant="subtitle2" mb={2}>
                  Set Result
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Select Result</InputLabel>
                  <Select
                    value={resultStatus}
                    onChange={(e) => setResultStatus(e.target.value)}
                    label="Select Result"
                    disabled={settingResult}
                  >
                    <MenuItem value="not_set">Not Set</MenuItem>
                    <MenuItem value="passed">Passed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSetInductionResult(resultStatus)}
                  disabled={settingResult || resultStatus === 'not_set'}
                  fullWidth
                  size="large"
                  startIcon={settingResult ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {settingResult ? 'Saving...' : 'Save Result'}
                </Button>
              </Box>

              {/* Reassign Training Section - Only show if failed */}
              {employee?.induction?.pass_fail_status === false && (
                <Box mb={3}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" mb={2}>
                    Reassign Training
                  </Typography>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleReassign}
                    disabled={loading}
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {loading ? 'Reassigning...' : 'Reassign Induction Training'}
                  </Button>
                </Box>
              )}

              {employee?.induction?.pass_fail_status === true && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                      HR Induction Evaluation Test
                    </Typography>

                    {/* Upload Section */}
                    <Box mb={3}>
                      <label htmlFor="file-upload-induction">
                        <input
                          id="file-upload-induction"
                          type="file"
                          onChange={async (e) => {
                            try {
                              await onFileUpload(e, false);
                              await Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'File uploaded successfully!',
                                timer: 3000,
                                showConfirmButton: false,
                              });
                            } catch (error) {
                              await Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: error.message || 'Failed to upload file',
                                timer: 3000,
                                showConfirmButton: false,
                              });
                            }
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                          hidden
                          disabled={uploading}
                        />
                        <Button
                          variant="contained"
                          startIcon={<UploadIcon />}
                          component="span"
                          disabled={uploading}
                          fullWidth
                          size="large"
                        >
                          {uploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                      </label>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Uploaded Files Section */}
                    <Typography variant="subtitle1" mb={2}>
                      Uploaded Induction Forms
                    </Typography>
                    {Array.isArray(induction.form_files) && induction.form_files.length > 0 ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 1, maxHeight: 250, overflow: 'auto', bgcolor: 'grey.50' }}
                      >
                        <List dense>
                          {induction.form_files.map((file, idx) => (
                            <ListItem
                              key={idx}
                              component="a"
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': { bgcolor: 'action.hover' },
                                textDecoration: 'none',
                                color: 'inherit',
                              }}
                            >
                              <ListItemIcon>
                                <FileIcon fontSize="small" color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={file.split('/').pop()}
                                primaryTypographyProps={{ noWrap: true }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          bgcolor: 'grey.50',
                          border: '2px dashed',
                          borderColor: 'grey.300',
                          borderRadius: 2,
                        }}
                      >
                        <FileIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          No files uploaded yet
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Retrain History */}
              {employee?.induction?.retrain_history &&
                employee.induction.retrain_history.length > 0 && (
                  <Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" mb={2}>
                      Retrain History
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small" aria-label="retrain history">
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employee.induction?.retrain_history?.map((datetimeStr, index) => {
                            try {
                              const [datePart, ...timeParts] = datetimeStr.split(' ');
                              const timePart = timeParts.join(' ');

                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{datePart}</TableCell>
                                  <TableCell>{timePart}</TableCell>
                                </TableRow>
                              );
                            } catch (err) {
                              console.error('Invalid retrain_history entry:', datetimeStr, err);
                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell colSpan={2} style={{ color: 'red' }}>
                                    Invalid entry: {datetimeStr}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Mark as watched dialog */}
      <ConfirmationDialog
        open={videoDialogOpen}
        onClose={async (confirmed) => {
          setVideoDialogOpen(false);
          if (confirmed && videoDialogVideo) {
            try {
              await onMarkVideoWatched(videoDialogVideo);
              await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Video "${videoDialogVideo.title}" marked as watched!`,
                timer: 3000,
                showConfirmButton: false,
              });
            } catch (error) {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to mark video as watched',
                timer: 3000,
                showConfirmButton: false,
              });
            }
          }
          setVideoDialogVideo(null); // Clear the video state
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
};

export default InductionTab;
