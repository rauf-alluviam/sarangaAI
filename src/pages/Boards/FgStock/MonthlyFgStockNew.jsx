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

const MonthlyFgStockNew = () => {
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
      <Box>
        <Typography variant="h4" mb={2} textAlign="center">
          Monthly FG Stock Summary
        </Typography>
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
              <span style={{ background: '#ff00269d', borderRadius: '3px', padding: '0 4px' }}>Less than 80%</span>: light red<br/>
              <span style={{ background: '#c78212a9', borderRadius: '3px', padding: '0 4px' }}>80% to 90%</span>: light orange<br/>
              <span style={{ background: '#15881f7c', borderRadius: '3px', padding: '0 4px' }}>Greater than 90%</span>: light green
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
              minHeight: '77vh', // or a fixed height like "600px"
              width: '100%', // Make sure it's not constrained by parent
              //  bgcolor: 'lightblue',
              overflow: 'auto', // Enables both vertical & horizontal scroll
              scrollbarWidth: 'thin', // Firefox
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
                minWidth: '2000px',
              }}
            >
              {/* Table Header */}
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
                      colSpan={2}
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
                      }}
                    >
                      {month}
                    </th>
                  ))}
                </tr>
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
                      fontSize: '0.9rem',
                      boxShadow: '2px 0 3px rgba(0,0,0,0.1)',
                    }}
                  ></th>
                  {monthNames.map((month) => (
                    <React.Fragment key={month}>
                      <th
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px',
                          borderBottom: '1px solid #e0e0e0',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          position: 'sticky',
                          top: '41px',
                          zIndex: 2,
                        }}
                      >
                        Schedule
                      </th>
                      <th
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px',
                          borderBottom: '1px solid #e0e0e0',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          position: 'sticky',
                          top: '41px',
                          zIndex: 2,
                        }}
                      >
                        Dispatched
                      </th>
                    </React.Fragment>
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
                      <React.Fragment key={idx}>
                        <td
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '1px solid #e0e0e0',
                          }}
                        >
                          <Box bgcolor={'#e3f2fd'} px={1} borderRadius={1}>
                            {row.monthly_data[idx]?.monthly_schedule || '-'}
                          </Box>
                        </td>
                        {(() => {
                          const schedule = Number(row.monthly_data[idx]?.monthly_schedule) || 0;
                          const dispatched = Number(row.monthly_data[idx]?.monthly_dispatched) || 0;
                          let percent = schedule > 0 ? (dispatched / schedule) * 100 : null;
                          let bgColor = '#f1f8e9';
                          if (percent !== null) {
                            if (percent < 80) bgColor = '#ff00269d'; // light red
                            else if (percent >= 80 && percent <= 90) bgColor = '#c78212a9'; // light orange
                            else if (percent > 90) bgColor = '#15881f7c'; // light green
                          }
                          return (
                            <td
                              style={{
                                padding: '8px',
                                textAlign: 'center',
                                borderBottom: '1px solid #e0e0e0',
                              }}
                            >
                              <Box bgcolor={bgColor} px={1} borderRadius={1}>
                                {dispatched || '-'}
                                {percent !== null && schedule > 0 ? (
                                  <Typography variant="caption" fontSize={'0.9rem'} ml={1}>
                                    ({percent.toFixed(0)}%)
                                  </Typography>
                                ) : null}
                              </Box>
                            </td>
                          );
                        })()}
                      </React.Fragment>
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

export default MonthlyFgStockNew;
