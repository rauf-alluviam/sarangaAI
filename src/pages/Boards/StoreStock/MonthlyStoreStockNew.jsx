import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';
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
              minHeight: '77vh',
              width: '100%',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
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
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '1400px',
              }}
            >
              {/* Enhanced Table Header with subcolumns */}
              <thead>
                <tr>
                  <th
                    style={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      backgroundColor: '#ffffff',
                      minWidth: '220px',
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom: '1px solid #e0e0e0',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                    }}
                    rowSpan={2}
                  >
                    Item Description
                  </th>
                  {monthNames.map((month, idx) => (
                    <th
                      key={month}
                      colSpan={3}
                      style={{
                        backgroundColor: '#f5f5f5',
                        textAlign: 'center',
                        padding: '8px',
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        minWidth: '240px',
                        borderRight:
                          idx !== monthNames.length - 1 ? '2.5px solid #bdbdbd' : undefined,
                        boxShadow: idx !== monthNames.length - 1 ? '2px 0 0 #bdbdbd' : undefined,
                      }}
                    >
                      {month}
                    </th>
                  ))}
                </tr>
                <tr>
                  {monthNames.map((_, idx) => [
                    <th
                      key={`current-${idx}`}
                      style={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        borderBottom: '1px solid #e0e0e0',
                        minWidth: '80px',
                      }}
                    >
                      Current Stock
                    </th>,
                    <th
                      key={`plan-${idx}`}
                      style={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        borderBottom: '1px solid #e0e0e0',
                        minWidth: '80px',
                      }}
                    >
                      Schedule
                    </th>,
                    <th
                      key={`actual-${idx}`}
                      style={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        borderBottom: '1px solid #e0e0e0',
                        minWidth: '80px',
                        borderRight:
                          idx !== monthNames.length - 1 ? '2.5px solid #bdbdbd' : undefined,
                      }}
                    >
                      Actual
                    </th>,
                  ])}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={row._id || index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    }}
                  >
                    <td
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e0e0e0',
                        boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {row.item_description}
                    </td>
                    {monthNames.map((_, idx) => {
                      const monthData = row.monthly_data.find((m) => m.month === idx + 1) || {};
                      return [
                        <td
                          key={`current-${idx}`}
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '1px solid #e0e0e0',
                          }}
                        >
                          <Box bgcolor={'#e3f2fd'} px={1} borderRadius={1}>
                            {typeof monthData.total_current_stock === 'number'
                              ? monthData.total_current_stock
                              : '-'}
                          </Box>
                        </td>,
                        <td
                          key={`plan-${idx}`}
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '1px solid #e0e0e0',
                          }}
                        >
                          <Box bgcolor={'#fffde7'} px={1} borderRadius={1}>
                            {typeof monthData.total_plan === 'number' ? monthData.total_plan : '-'}
                          </Box>
                        </td>,
                        <td
                          key={`actual-${idx}`}
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '1px solid #e0e0e0',
                            borderRight:
                              idx !== monthNames.length - 1 ? '2.5px solid #bdbdbd' : undefined,
                          }}
                        >
                          <Box bgcolor={'#e8f5e9'} px={1} borderRadius={1}>
                            {typeof monthData.total_actual === 'number'
                              ? monthData.total_actual
                              : '-'}
                          </Box>
                        </td>,
                      ];
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MonthlyStoreStockNew;
