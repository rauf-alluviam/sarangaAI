import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmployeeCard from './EmployeeCard';

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_all_trainees_information`;

const DojoEmployee = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useSelector((state) => state.auth);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 4 : 8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage,
        }).toString();

        const response = await fetch(`${API_URL}?${params}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch trainees data');

        const data = await response.json();

        // Process avatar URLs to find actual images
        const processedTrainees = (data.data || []).map((trainee) => {
          const documents = trainee.user_info?.user_documents || {};
          let avatar = '';

          // Search for image files in avatar array
          if (documents.avatar) {
            const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
            if (image) avatar = image;
          }

          // Fallback to first document if no image found
          if (!avatar && documents.avatar && documents.avatar.length > 0) {
            avatar = documents.avatar[0];
          }

          return {
            ...trainee,
            avatar,
            fullName: trainee.user_info?.full_name || 'No Name',
            phone: trainee.user_info?.phone || 'N/A',
            department: trainee.user_info?.department || 'N/A',
            designation: trainee.user_info?.designation || 'Trainee',
            userId: trainee.user_id,
            inductionCompleted: trainee.induction?.completed || false,
          };
        });

        setTrainees(processedTrainees);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, [token, searchTerm, currentPage, itemsPerPage]);

  const handleCardClick = (userId) => {
    navigate(`/employee/${userId}`);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Dojo Employee Portal
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth={isMobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 1 },
              }}
              sx={{
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'primary.light',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 120,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <InputLabel>Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Per Page"
                sx={{ borderRadius: 1 }}
                fullWidth={isMobile}
              >
                <MenuItem value={4}>4 per page</MenuItem>
                <MenuItem value={8}>8 per page</MenuItem>
                <MenuItem value={16}>16 per page</MenuItem>
                <MenuItem value={32}>32 per page</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300,
              mb: 2,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} employees
            </Typography>

            {trainees.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  {searchTerm ? 'No matching employees found' : 'No employees available'}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {trainees.map((trainee) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={trainee.userId}>
                    <EmployeeCard
                      employee={trainee}
                      onClick={() => handleCardClick(trainee.userId)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Paper>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            overflowX: 'auto',
            width: '100%',
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size={isMobile ? 'small' : 'large'}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '&.Mui-selected': {
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
                '&.MuiPaginationItem-ellipsis': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default DojoEmployee;
