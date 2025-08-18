import React from 'react';
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
} from '@mui/material';
import {
  Check as CheckIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const BACKEND_API= import.meta.env.VITE_BACKEND_API;

const Level2Tab = ({
  employee,
  token,
  level2Loading,
  level2Error,
  level2Success,
  level2FormUploading,
  level2FormUploadError,
  level2FormUploadSuccess,
  onInitializeLevel2,
  onFetchEmployee,
}) => {
  // Use Level_2 as per new API structure
  const l2 = employee?.Level_2;
  if (!l2) {
    return (
      <Paper sx={{ p: 3, minHeight: 240 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Level 2</Typography>
          <Typography color="warning.main" variant="subtitle2">
            Not Started
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await onInitializeLevel2();
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Level 2 training initialized successfully!',
                timer: 3000,
                showConfirmButton: false,
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to initialize Level 2 training',
                timer: 3000,
                showConfirmButton: false,
              });
            }
          }}
          disabled={level2Loading}
        >
          {level2Loading ? 'Initializing...' : 'Initialize Level 2'}
        </Button>
      </Paper>
    );
  }

  // Section keys
  const horizontal = l2['horizontal_injection_molding'] || {};
  const finalInspection = l2['final_inspection_packaging'] || {};
  const formUploaded = l2.form_uploaded || {};

  // Level 2 completion status
  const completed = l2.completed === true;
  const completedAt = l2.completed_at;

  // API endpoints for Level 2
  const endpoints = {
    horizontal_injection_molding: {
      video: `${BACKEND_API}/mark_level_2_horizontal_injection_molding_video_watched`,
      ojt: `${BACKEND_API}/mark_level_2_horizontal_injection_molding_OJT_task_completed`,
    },
    final_inspection_packaging: {
      video: `${BACKEND_API}/mark_level_2_final_inspection_packaging_video_watched`,
      ojt: `${BACKEND_API}/mark_level_2_final_inspection_packaging_OJT_completed`,
    },
  };

  // Helpers for marking video watched and OJT completed
  const markVideoWatched = async (section, video) => {
    try {
      const url = endpoints[section].video;
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
        body: JSON.stringify({ user_id: employee.user_id, video_title: video.title }),
      });
      await onFetchEmployee();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Video "${video.title}" marked as watched!`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to mark video as watched',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const markOjtCompleted = async (section, task) => {
    try {
      const url = endpoints[section].ojt;
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
        body: JSON.stringify({ user_id: employee.user_id, title: task.title }),
      });
      await onFetchEmployee();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `OJT task "${task.title}" marked as completed!`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to mark OJT task as completed',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Level 2 Evaluation Form upload handler
  const handleLevel2FormUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    try {
      const formData = new FormData();
      formData.append('upload_file', file);
      const res = await fetch(
        `${BACKEND_API}/upload_Level_2_form?user_id=${employee.user_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
          body: formData,
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Upload failed');
      }
      await onFetchEmployee();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Level 2 evaluation form uploaded successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.message || 'Failed to upload Level 2 evaluation form',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="h6">Level 2 Training Modules</Typography>
        <Box textAlign="right">
          {completedAt && (
            <Typography variant="body2" color="textSecondary">
              {new Date(completedAt).toLocaleString()}
            </Typography>
          )}
          <Typography color={completed ? 'success.main' : 'warning.main'}>
            {completed ? 'Completed' : 'In Progress'}
          </Typography>
        </Box>
      </Box>
      {/* Horizontal Injection Molding Section */}
      <Typography variant="subtitle1" mb={1}>
        Horizontal Injection Molding
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
            {(horizontal.videos || []).map((video, idx) => (
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
                <TableCell>{video.type}</TableCell>
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
                      onClick={() => markVideoWatched('horizontal_injection_molding', video)}
                    >
                      Mark as Watched
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {video.watched_at ? new Date(video.watched_at).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(horizontal.ojt_tasks || []).map((ojt, idx) => (
              <TableRow key={`ojt-${idx}`}>
                <TableCell>{ojt.title}</TableCell>
                <TableCell>{ojt.type}</TableCell>
                <TableCell>
                  {ojt.completed ? (
                    <Box display="flex" alignItems="center" color="success.main">
                      <CheckIcon fontSize="small" sx={{ mr: 1 }} /> Completed
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CheckIcon />}
                      onClick={() => markOjtCompleted('horizontal_injection_molding', ojt)}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {ojt.completed_at ? new Date(ojt.completed_at).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Final Inspection Packaging Section */}
      <Typography variant="subtitle1" mb={1}>
        Final Inspection Packaging
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
            {(finalInspection.videos || []).map((video, idx) => (
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
                <TableCell>{video.type}</TableCell>
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
                      onClick={() => markVideoWatched('final_inspection_packaging', video)}
                    >
                      Mark as Watched
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {video.watched_at ? new Date(video.watched_at).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(finalInspection.ojt_tasks || []).map((ojt, idx) => (
              <TableRow key={`ojt2-${idx}`}>
                <TableCell>{ojt.title}</TableCell>
                <TableCell>{ojt.type}</TableCell>
                <TableCell>
                  {ojt.completed ? (
                    <Box display="flex" alignItems="center" color="success.main">
                      <CheckIcon fontSize="small" sx={{ mr: 1 }} /> Completed
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CheckIcon />}
                      onClick={() => markOjtCompleted('final_inspection_packaging', ojt)}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {ojt.completed_at ? new Date(ojt.completed_at).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Level 2 Evaluation Form Upload Status */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">Level 2 Evaluation Form</Typography>
      </Box>
      <Box mb={2}>
        <label htmlFor="file-upload-level2-form">
          <input
            id="file-upload-level2-form"
            type="file"
            onChange={handleLevel2FormUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
            hidden
            disabled={level2FormUploading}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            component="span"
            disabled={level2FormUploading}
            sx={{ mt: 1 }}
          >
            {level2FormUploading ? 'Uploading...' : 'Upload Level 2 Evaluation Form'}
          </Button>
        </label>

        {/* Uploaded Level 2 Evaluation Forms */}
        {formUploaded.form_uploaded &&
          Array.isArray(formUploaded.form_files) &&
          formUploaded.form_files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">Uploaded Level 2 Evaluation Forms</Typography>
              <List dense>
                {formUploaded.form_files.map((file, idx) => (
                  <ListItem
                    key={idx}
                    component="a"
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    button
                  >
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText primary={file.split('/').pop()} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
      </Box>
    </Paper>
  );
};

export default Level2Tab;
