import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';
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

  // Helper to get stock value for month
  const getStockForMonth = (item, monthIndex) => {
    const monthData = item.monthly_data.find((m) => m.month === monthIndex + 1);
    return monthData ? monthData.total_current_stock : '-';
  };

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', p: 3 }}>
      <Box>
        <Typography variant="h4" mb={2} textAlign="center">
          Monthly Store Stock Summary
        </Typography>
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
              {/* Simplified Table Header */}
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
                  >
                    Item Description
                  </th>
                  {monthNames.map((month) => (
                    <th
                      key={month}
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
                        minWidth: '80px',
                      }}
                    >
                      {month}
                    </th>
                  ))}
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
                    {monthNames.map((_, idx) => (
                      <td
                        key={idx}
                        style={{
                          padding: '8px',
                          textAlign: 'center',
                          borderBottom: '1px solid #e0e0e0',
                        }}
                      >
                        <Box bgcolor={'#e3f2fd'} px={1} borderRadius={1}>
                          {getStockForMonth(row, idx)}
                        </Box>
                      </td>
                    ))}
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
