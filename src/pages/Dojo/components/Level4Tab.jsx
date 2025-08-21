import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Check as CheckIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const ConfirmationDialog = ({ open, onClose, title, text }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={() => onClose(true)} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Level4Tab = ({
  employee,
  token,
  level4Loading,
  level4Error,
  level4FormUploading,
  level4FormUploadError,
  level4FormUploadSuccess,
  onInitializeLevel4,
  onFetchEmployee,
}) => {
  // Local state for managing UI interactions
  const [settingResult, setSettingResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reassignResult, setReassignResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resultStatus, setResultStatus] = useState(
    employee?.Level_4?.pass_fail_status === true
      ? 'passed'
      : employee?.Level_4?.pass_fail_status === false
      ? 'failed'
      : 'not_set'
  );

  // State for confirmation dialogs
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoDialogSection, setVideoDialogSection] = useState(null);
  const [videoDialogVideo, setVideoDialogVideo] = useState(null);

  const [ojtDialogOpen, setOjtDialogOpen] = useState(false);
  const [ojtDialogSection, setOjtDialogSection] = useState(null);
  const [ojtDialogTask, setOjtDialogTask] = useState(null);

  // Update result status when employee data changes
  useEffect(() => {
    if (employee?.Level_4) {
      const level4 = employee.Level_4;
      if (level4.pass_fail_status === true) {
        setResultStatus('passed');
      } else if (level4.pass_fail_status === false) {
        setResultStatus('failed');
      } else {
        setResultStatus('not_set');
      }
    }
  }, [employee]);

  // API endpoints mapping
  const endpoints = {
    horizontal_injection_molding: {
      video: `${BACKEND_API}/mark_level_4_horizontal_injection_molding_video_watched`,
      ojt: `${BACKEND_API}/mark_level_4_horizontal_injection_molding_OJT_task_completed`,
    },
    final_inspection_packaging: {
      video: `${BACKEND_API}/mark_level_4_final_inspection_packaging_video_watched`,
      ojt: `${BACKEND_API}/mark_level_4_final_inspection_packaging_OJT_completed`,
    },
  };

  // Error boundary helper
  const handleAsyncError = async (asyncFn, errorMessage = 'An error occurred') => {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(errorMessage, error);

      // Extract meaningful error message
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        errorMessage;

      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: message,
        timer: 3000,
        showConfirmButton: false,
      });

      throw error; // Re-throw for caller handling if needed
    }
  };

  // API request helper with consistent error handling
  const makeApiRequest = async (url, options = {}) => {
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    if (!employee?.user_id) {
      throw new Error('Employee user ID is missing');
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.detail ||
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response;
  };

  // Mark video as watched
  const markVideoWatched = async (section, video) => {
    if (!video?.title) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Video title is missing',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    await handleAsyncError(async () => {
      const url = endpoints[section]?.video;
      if (!url) {
        throw new Error(`No video endpoint found for section: ${section}`);
      }

      await makeApiRequest(url, {
        method: 'PUT',
        body: JSON.stringify({
          user_id: employee.user_id,
          video_title: video.title,
        }),
      });

      if (onFetchEmployee) {
        await onFetchEmployee();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Video "${video.title}" marked as watched!`,
        timer: 3000,
        showConfirmButton: false,
      });
    }, `Failed to mark video "${video.title}" as watched`);
  };

  // Mark OJT task as completed
  const markOjtCompleted = async (section, task) => {
    if (!task?.title) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Task title is missing',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    await handleAsyncError(async () => {
      const url = endpoints[section]?.ojt;
      if (!url) {
        throw new Error(`No OJT endpoint found for section: ${section}`);
      }

      await makeApiRequest(url, {
        method: 'PUT',
        body: JSON.stringify({
          user_id: employee.user_id,
          title: task.title,
        }),
      });

      if (onFetchEmployee) {
        await onFetchEmployee();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `OJT task "${task.title}" marked as completed!`,
        timer: 3000,
        showConfirmButton: false,
      });
    }, `Failed to mark OJT task "${task.title}" as completed`);
  };

  // Render table for a section
  function renderSection(sectionName, sectionData) {
    if (!sectionData) {
      return (
        <Box key={sectionName} mb={4}>
          <Typography variant="subtitle1" mb={1} fontWeight={600}>
            {sectionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">No data available</Typography>
          </Paper>
        </Box>
      );
    }

    return (
      <Box key={sectionName} mb={4}>
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          {sectionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Watched At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Videos */}
              {Array.isArray(sectionData.videos) &&
                sectionData.videos.map((video, idx) => (
                  <TableRow key={`video-${idx}`}>
                    <TableCell>
                      {video.link ? (
                        <a href={video.link} target="_blank" rel="noopener noreferrer">
                          {video.title || 'Untitled Video'}
                        </a>
                      ) : (
                        video.title || 'Untitled Video'
                      )}
                    </TableCell>
                    <TableCell>CRT</TableCell>
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
                            setVideoDialogSection(sectionName);
                            setVideoDialogVideo(video);
                            setVideoDialogOpen(true);
                          }}
                          startIcon={<VisibilityIcon />}
                          disabled={!video.title}
                        >
                          Mark as Watched
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{video?.watched_at ? video?.watched_at : 'Not watched'}</TableCell>
                  </TableRow>
                ))}
              {/* OJT Tasks */}
              {Array.isArray(sectionData.ojt_tasks) &&
                sectionData.ojt_tasks.map((task, idx) => (
                  <TableRow key={`ojt-${idx}`}>
                    <TableCell>{task.title || 'Untitled Task'}</TableCell>
                    <TableCell>OJT</TableCell>
                    <TableCell>
                      {task.completed ? (
                        <Box display="flex" alignItems="center" color="success.main">
                          <CheckIcon fontSize="small" sx={{ mr: 1 }} /> Completed
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setOjtDialogSection(sectionName);
                            setOjtDialogTask(task);
                            setOjtDialogOpen(true);
                          }}
                          startIcon={<CheckIcon />}
                          disabled={!task.title}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {task?.completed_at ? task?.completed_at : 'Not completed'}
                    </TableCell>
                  </TableRow>
                ))}
              {/* Show message if no videos or tasks */}
              {(!sectionData.videos || sectionData.videos.length === 0) &&
                (!sectionData.ojt_tasks || sectionData.ojt_tasks.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="textSecondary">No training items available</Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // Level 4  Evaluation Form upload handler
  const handleLevel4FormUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const file = event.target.files[0];

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: `Please upload a file with one of these extensions: ${allowedTypes.join(', ')}`,
        timer: 3000,
        showConfirmButton: false,
      });
      event.target.value = '';
      return;
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      await Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 10MB',
        timer: 3000,
        showConfirmButton: false,
      });
      event.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await handleAsyncError(async () => {
        const formData = new FormData();
        formData.append('upload_file', file);

        const response = await fetch(
          `${BACKEND_API}/upload_level_4_form?user_id=${employee.user_id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          let errorMessage;
          try {
            const data = await response.json();
            errorMessage =
              data.detail || data.message || `Upload failed with status ${response.status}`;
          } catch {
            errorMessage = `Upload failed with status ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        if (onFetchEmployee) {
          await onFetchEmployee();
        }

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Level 4  evaluation form uploaded successfully!',
          timer: 3000,
          showConfirmButton: false,
        });
      }, 'Failed to upload Level 4  evaluation form');
    } finally {
      setUploading(false);
      event.target.value = ''; // Clear input
    }
  };

  const handleSetInductionResult = async (status) => {
    if (!status || status === 'not_set') {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Selection',
        text: 'Please select a valid result (Passed or Failed)',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setSettingResult(true);
    setError(null);

    try {
      await handleAsyncError(async () => {
        // Map status to boolean value for API
        const passed = status === 'passed';

        const response = await makeApiRequest(
          `${BACKEND_API}/set_level_4_training_result_as_passed_or_failed?user_id=${employee.user_id}&passed=${passed}`,
          {
            method: 'PUT',
          }
        );

        const data = await response.json();

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message || 'Level 4  training result updated successfully!',
          timer: 3000,
          showConfirmButton: false,
        });

        // Update local state immediately for better UX
        setResultStatus(status);

        // Refresh employee data
        if (onFetchEmployee) {
          await onFetchEmployee();
        }
      }, 'Failed to set Level 4  training result');
    } catch (error) {
      // Revert to previous status on error
      if (employee?.Level_4) {
        const level4 = employee.Level_4;
        if (level4.pass_fail_status === true) {
          setResultStatus('passed');
        } else if (level4.pass_fail_status === false) {
          setResultStatus('failed');
        } else {
          setResultStatus('not_set');
        }
      }
    } finally {
      setSettingResult(false);
    }
  };

  const handleReassign = async () => {
    setLoading(true);
    setError(null);
    setReassignResult(null);

    try {
      await handleAsyncError(async () => {
        const response = await makeApiRequest(
          `${BACKEND_API}/reassign_level_4_training?user_id=${employee.user_id}`,
          {
            method: 'POST',
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data?.message || 'Level 4  training reassigned successfully',
          timer: 3000,
          showConfirmButton: false,
        });

        setReassignResult(data);

        // Refresh employee data so UI updates
        if (onFetchEmployee) {
          await onFetchEmployee();
        }
      }, 'Failed to reassign Level 4  training');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeLevel4 = async () => {
    if (!onInitializeLevel4) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Initialize function is not available',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    await handleAsyncError(async () => {
      await onInitializeLevel4();
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Level 4  training initialized successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
    }, 'Failed to initialize Level 4  training');
  };

  // Validation helpers
  const isValidEmployee = employee && employee.user_id;
  const level4 = employee?.Level_4;
  const formUploaded = level4?.form_uploaded;
  const horizontal = level4?.['horizontal_injection_molding'] || {};
  const finalInspection = level4?.['final_inspection_packaging'] || {};

  // Early return for missing employee data
  if (!isValidEmployee) {
    return (
      <Paper sx={{ p: 3, minHeight: 320 }}>
        <Typography variant="h6" color="error" mb={2}>
          Employee Data Missing
        </Typography>
        <Typography color="textSecondary">
          Unable to load Level 4 training data. Please ensure employee information is available.
        </Typography>
      </Paper>
    );
  }

  // Early return for uninitialized Level 4
  if (!level4) {
    return (
      <Paper sx={{ p: 3, minHeight: 320 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Level 4 Training</Typography>
          <Typography color="warning.main" variant="subtitle2">
            Not Started
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleInitializeLevel4}
          disabled={level4Loading}
          // startIcon={level4Loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {level4Loading ? 'Initializing...' : 'Initialize Level 4 '}
        </Button>
        {level4Error && (
          <Typography color="error" variant="body2" mt={2}>
            Error: {level4Error}
          </Typography>
        )}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Confirmation dialogs */}
      <ConfirmationDialog
        open={videoDialogOpen}
        onClose={async (confirmed) => {
          setVideoDialogOpen(false);
          if (confirmed && videoDialogVideo && videoDialogSection) {
            try {
              await markVideoWatched(videoDialogSection, videoDialogVideo);
            } catch (error) {
              // Error is already handled by handleAsyncError
            }
          }
          setVideoDialogSection(null);
          setVideoDialogVideo(null);
        }}
        title="Mark video as watched?"
        text={
          videoDialogVideo
            ? `Are you sure you want to mark "${videoDialogVideo.title}" as watched?`
            : ''
        }
      />

      <ConfirmationDialog
        open={ojtDialogOpen}
        onClose={async (confirmed) => {
          setOjtDialogOpen(false);
          if (confirmed && ojtDialogTask && ojtDialogSection) {
            try {
              await markOjtCompleted(ojtDialogSection, ojtDialogTask);
            } catch (error) {
              // Error is already handled by handleAsyncError
            }
          }
          setOjtDialogSection(null);
          setOjtDialogTask(null);
        }}
        title="Mark OJT task as completed?"
        text={
          ojtDialogTask
            ? `Are you sure you want to mark "${ojtDialogTask.title}" as completed?`
            : ''
        }
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="h6">Level 4 Training Modules</Typography>
        <Box textAlign="right">
          {formUploaded?.completed_at && (
            <Typography variant="body2" color="textSecondary">
              {new Date(formUploaded.completed_at).toLocaleString()}
            </Typography>
          )}
          <Typography color={formUploaded?.completed ? 'success.main' : 'warning.main'}>
            {formUploaded?.completed ? 'Completed' : 'In Progress'}
          </Typography>
        </Box>
      </Box>

      {/* Training Sections */}
      {renderSection('horizontal_injection_molding', horizontal)}
      {renderSection('final_inspection_packaging', finalInspection)}

      {/* Evaluation Form and Result Section */}
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* Level 4  Result - Always shown first */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={2}>
                Level 4 Result
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
                    label={`Retrain Count: ${level4?.retrain_count || 0}`}
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
                  // startIcon={settingResult ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {settingResult ? 'Saving...' : 'Save Result'}
                </Button>
              </Box>

              {/* Reassign Training Section - Only show if failed */}
              {level4?.pass_fail_status === false && (
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
                    // startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {loading ? 'Reassigning...' : 'Reassign Level 4  Training'}
                  </Button>
                </Box>
              )}
              {/* Level 4  Evaluation Form - Only shown when status is Passed */}
              {employee?.Level_4?.pass_fail_status === true && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                      Level 4 Evaluation Form
                    </Typography>

                    <Box mb={3}>
                      <label htmlFor="file-upload-level4">
                        <input
                          id="file-upload-level4"
                          type="file"
                          onChange={handleLevel4FormUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                          hidden
                          disabled={uploading}
                        />
                        <Button
                          variant="contained"
                          // startIcon={
                          //   uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />
                          // }
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

                    <Typography variant="subtitle1" mb={2}>
                      Uploaded Level 4 Evaluation Forms
                    </Typography>
                    {Array.isArray(formUploaded?.form_files) &&
                    formUploaded.form_files.length > 0 ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 1, maxHeight: 250, overflow: 'auto', bgcolor: 'grey.50' }}
                      >
                        <List dense>
                          {formUploaded.form_files.map((file, idx) => (
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
                                primary={file.split('/').pop() || 'Unknown file'}
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

              {Array.isArray(level4?.retrain_history) && level4.retrain_history.length > 0 && (
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
                        {level4?.retrain_history?.map((datetimeStr, index) => {
                          let date;
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
                          } catch (error) {
                            console.error('Invalid retrain_history entry:', datetimeStr, error);
                            date = new Date(); // Fallback to current date
                          }

                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {date.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </TableCell>
                              <TableCell>
                                {date.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              {/* Display any errors */}
              {error && (
                <Box mt={2}>
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Level4Tab;
