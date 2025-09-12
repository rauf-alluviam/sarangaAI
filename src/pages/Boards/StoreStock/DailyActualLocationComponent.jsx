import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

const DailyActualLocationComponent = ({ colors }) => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDailyData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rabscpu.alvision.in/get_daily_actual_and_location/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwdW5pdEBhbGx1dml1bS5pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1NzY4ODU0M30.SnCdpe3_hO5CysEr-IDWoIkTm-iW4NgF_pZUK3jt-Vs',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDailyData(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching daily actual data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyData();
  }, [selectedMonth, selectedYear]);

  const groupedByDay = dailyData.reduce((acc, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    acc[entry.day].push(entry);
    return acc;
  }, {});

  const getLocationDisplay = (location) => {
    const locations = [location.p1, location.p2, location.p3].filter((p) => p && p.trim());
    return locations.length > 0 ? locations.join(', ') : 'No Location';
  };

  const getActualStatusChip = (actual) => {
    if (actual > 0) {
      return <Chip label={actual} color="success" size="small" sx={{ minWidth: '60px' }} />;
    }
    return <Chip label="0" color="default" size="small" sx={{ minWidth: '60px' }} />;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Box>
      {/* Month/Year Selectors */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <MenuItem key={2023 + i} value={2023 + i}>
                  {2023 + i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Data Display */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
          {Object.keys(groupedByDay)
            .sort((a, b) => Number(a) - Number(b))
            .map((day) => (
              <Card key={day} sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: colors.secondary }}>
                    Day {day} - {monthNames[selectedMonth - 1]} {day}, {selectedYear}
                  </Typography>

                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: colors.background || '#f5f5f5' }}>
                          <TableCell>
                            <strong>Item Description</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Actual</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Location</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedByDay[day].map((entry) => (
                          <TableRow
                            key={entry._id}
                            sx={{
                              '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {entry.item_description}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {getActualStatusChip(entry.actual)}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {getLocationDisplay(entry.location)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {dailyData.length === 0 && !loading && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          No data available for {monthNames[selectedMonth - 1]} {selectedYear}
        </Typography>
      )}
    </Box>
  );
};

export default DailyActualLocationComponent;
