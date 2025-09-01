import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

const MonthlyStoreStockNew = () => {
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
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [year]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_API}/get_store_stock_yearly_summary?year=${debouncedYear}`,
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

  // (removed unused getStockForMonth)

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', p: 3 }}>
      {/* Header Row */}
      <Box mb={2} display="flex" alignItems="center">
        <Box mr={2}>
          <button
            onClick={() => navigate('/store-stock')}
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
          Monthly RM Usage Report (kg)
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
                component={Paper}
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  maxHeight: '77vh', // enables vertical scroll
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px', // enables horizontal scroll
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
                <Table stickyHeader sx={{ minWidth: 1400, borderCollapse: 'collapse' }}>
                  <TableHead>
                    {/* First header row */}
                    <TableRow>
                      <TableCell
                        rowSpan={2}
                        sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 3,
                          backgroundColor: '#ffffff',
                          minWidth: 220,
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        Item Description
                      </TableCell>
                      {monthNames.map((month, idx) => (
                        <TableCell
                          key={month}
                          colSpan={3}
                          align="center"
                          sx={{
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            minWidth: 240,
                            borderRight:
                              idx !== monthNames.length - 1 ? '2.5px solid #bdbdbd' : undefined,
                            boxShadow:
                              idx !== monthNames.length - 1 ? '2px 0 0 #bdbdbd' : undefined,
                          }}
                        >
                          {month}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Second header row */}
                    <TableRow>
                      {monthNames.map((_, idx) => (
                        <React.Fragment key={idx}>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                              position: 'sticky',
                              top: 41,
                              zIndex: 2,
                              minWidth: 80,
                            }}
                          >
                            Current Stock
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                              position: 'sticky',
                              top: 41,
                              zIndex: 2,
                              minWidth: 80,
                            }}
                          >
                            Schedule
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                              position: 'sticky',
                              top: 41,
                              zIndex: 2,
                              minWidth: 80,
                              borderRight:
                                idx !== monthNames.length - 1 ? '2.5px solid #bdbdbd' : undefined,
                            }}
                          >
                            Actual
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
                          const monthData = row.monthly_data.find((m) => m.month === idx + 1) || {};
                          return (
                            <React.Fragment key={idx}>
                              <TableCell align="center">
                                <Box bgcolor="#e3f2fd" px={1} borderRadius={1}>
                                  {typeof monthData.total_current_stock === 'number'
                                    ? monthData.total_current_stock
                                    : '-'}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box bgcolor="#fffde7" px={1} borderRadius={1}>
                                  {typeof monthData.total_plan === 'number'
                                    ? monthData.total_plan
                                    : '-'}
                                </Box>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  borderRight:
                                    idx !== monthNames.length - 1
                                      ? '2.5px solid #bdbdbd'
                                      : undefined,
                                }}
                              >
                                <Box bgcolor="#e8f5e9" px={1} borderRadius={1}>
                                  {typeof monthData.total_actual === 'number'
                                    ? monthData.total_actual
                                    : '-'}
                                </Box>
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MonthlyStoreStockNew;
