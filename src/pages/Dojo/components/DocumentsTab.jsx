import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

const DocumentsTab = ({ employee }) => {
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
                {(employee.user_info.user_documents.other_documents[key] || []).map((url, idx) => (
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
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentsTab;
