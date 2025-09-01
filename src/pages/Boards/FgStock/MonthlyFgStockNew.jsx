import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MonthlyFgStockNew = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [year, setYear] = useState(new Date().getFullYear());
  const [debouncedYear, setDebouncedYear] = useState(year);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce year input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedYear(year);
    }, 300); // 300ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [year]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_API}/get_fgstock_summary_by_year?year=${debouncedYear}`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        setData(result);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedYear, token, BACKEND_API]);

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', p: 3 }}>
      {/* Header Row */}
      <Box mb={2} display="flex" alignItems="center">
        <Box mr={2}>
          <button
            onClick={() => navigate('/fg-stock')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
            aria-label="Back"
          >
            <ArrowBackIcon fontSize="large" />
          </button>
        </Box>
        <Typography variant="h4" mb={0} textAlign="center" flex={1}>
          Monthly FG Stock Summary
        </Typography>
      </Box>
      {/* Main Content */}
      <Box>
        <Box mb={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ width: 120 }}
          />
          <Box ml={4} px={2} py={1} bgcolor="#fffde7" borderRadius={2} boxShadow={1} minWidth={220}>
            <Typography variant="body2" color="textSecondary" fontWeight="bold" mb={0.5}>
              <u>Dispatched % Color Code:</u>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <span style={{ background: '#ff00269d', borderRadius: '3px', padding: '0 4px' }}>
                Less than 80%
              </span>
              : light red
              <br />
              <span style={{ background: '#c78212a9', borderRadius: '3px', padding: '0 4px' }}>
                80% to 90%
              </span>
              : light orange
              <br />
              <span style={{ background: '#15881f7c', borderRadius: '3px', padding: '0 4px' }}>
                Greater than 90%
              </span>
              : light green
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '76vh',
            }}
          >
            <Paper
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <TableContainer
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  maxHeight: '76vh', // 🔑 ensures vertical scrolling
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '20px',
                    height: '20px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                  },
                }}
              >
                <Table stickyHeader sx={{ minWidth: 'max-content' }}>
                  <TableHead>
                    {/* First row */}
                    <TableRow>
                      <TableCell
                        sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 3,
                          backgroundColor: '#ffffff',
                          minWidth: '220px',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        Item Description
                      </TableCell>
                      {monthNames.map((month) => (
                        <TableCell
                          key={month}
                          colSpan={2}
                          align="center"
                          sx={{
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                          }}
                        >
                          {month}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Second row */}
                    <TableRow>
                      <TableCell
                        sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 3,
                          backgroundColor: '#ffffff',
                          minWidth: '220px',
                          boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                        }}
                      />
                      {monthNames.map((month) => (
                        <React.Fragment key={month}>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              position: 'sticky',
                              top: 41,
                              zIndex: 2,
                            }}
                          >
                            Schedule
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              position: 'sticky',
                              top: 41,
                              zIndex: 2,
                            }}
                          >
                            Dispatched
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow
                        key={row._id || index}
                        sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                      >
                        <TableCell
                          sx={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 1,
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {row.item_description}
                        </TableCell>

                        {monthNames.map((_, idx) => {
                          const schedule = Number(row.monthly_data[idx]?.monthly_schedule) || 0;
                          const dispatched = Number(row.monthly_data[idx]?.monthly_dispatched) || 0;
                          const percent = schedule > 0 ? (dispatched / schedule) * 100 : null;

                          let bgColor = '#f1f8e9';
                          if (percent !== null) {
                            if (percent < 80) bgColor = '#ff00269d';
                            else if (percent >= 80 && percent <= 90) bgColor = '#c78212a9';
                            else if (percent > 90) bgColor = '#15881f7c';
                          }

                          return (
                            <React.Fragment key={idx}>
                              <TableCell align="center">
                                <Box bgcolor={'#e3f2fd'} px={1} borderRadius={1}>
                                  {schedule || '-'}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box bgcolor={bgColor} px={1} borderRadius={1}>
                                  {dispatched || '-'}
                                  {percent !== null && schedule > 0 && (
                                    <Typography variant="caption" ml={1}>
                                      ({percent.toFixed(0)}%)
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* No Data */}
              {data.length === 0 && !loading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No data available for {year}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MonthlyFgStockNew;
