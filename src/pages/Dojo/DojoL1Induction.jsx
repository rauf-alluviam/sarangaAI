import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Alert,
  Button,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const dummyInduction = {
  completed: false,
  completed_at: null,
  videos: [
    {
      title: 'Welcome to Dojo L1',
      status: 'Not Watched',
      watched_at: null,
      link: '#',
    },
    {
      title: 'Safety Training',
      status: 'Not Watched',
      watched_at: null,
      link: '#',
    },
    {
      title: 'HR Induction',
      status: 'Not Watched',
      watched_at: null,
      link: '#',
    },
  ],
  form_files: [],
};

const DojoL1Induction = () => {
  const [expandInduction, setExpandInduction] = useState(true);
  const [induction, setInduction] = useState(dummyInduction);
  const [markingVideo, setMarkingVideo] = useState(null);

  // Dummy handler for marking video as watched
  const handleMarkWatched = (index) => {
    setMarkingVideo(induction.videos[index].title);
    setTimeout(() => {
      setInduction((prev) => {
        const videos = prev.videos.map((v, i) =>
          i === index
            ? {
                ...v,
                status: 'Watched',
                watched_at: new Date().toISOString(),
              }
            : v
        );
        return { ...prev, videos };
      });
      setMarkingVideo(null);
    }, 500);
  };

  const allVideosWatched =
    induction.videos &&
    induction.videos.length > 0 &&
    induction.videos.every((v) => v.status === 'Watched');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          mt: 4,
          mb: expandInduction ? 2 : 0,
        }}
        onClick={() => setExpandInduction(!expandInduction)}
      >
        <Typography variant="h5">Induction Program</Typography>
        {expandInduction ? <ExpandLessIcon sx={{ ml: 1 }} /> : <ExpandMoreIcon sx={{ ml: 1 }} />}
      </Box>
      {expandInduction && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
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
            {allVideosWatched && (
              <Alert severity="success" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
                All videos completed! Induction completed at: {new Date().toLocaleString()}
              </Alert>
            )}
            {induction.videos && induction.videos.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}
                >
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
                            <Button
                              href={video.link}
                              target="_blank"
                              rel="noopener"
                              variant="outlined"
                              size="small"
                            >
                              Watch Video
                            </Button>
                          </TableCell>
                          <TableCell colSpan={4} align="center">
                            <Checkbox
                              checked={video.status === 'Watched'}
                              sx={{ margin: 'auto' }}
                              disabled={video.status === 'Watched' || markingVideo === video.title}
                              onChange={(e) => {
                                if (video.status === 'Not Watched' && e.target.checked) {
                                  handleMarkWatched(index);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default DojoL1Induction;
