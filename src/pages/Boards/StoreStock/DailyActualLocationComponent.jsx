import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Collapse,
  IconButton,
} from '@mui/material';

const DailyActualLocationComponent = ({ colors }) => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedEntries, setExpandedEntries] = useState({});

  // Get token from Redux
  const { token, userData } = useSelector((state) => state.auth);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rabscpu.alvision.in/get_store_stock_audit/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAuditData(data.audit_logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [selectedMonth, selectedYear]);

  const toggleExpanded = (entryId) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  const groupedByDay = auditData.reduce((acc, entry) => {
    const day = new Date(entry.timestamp).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(entry);
    return acc;
  }, {});

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const renderLocationChange = (locationChange) => {
    if (!locationChange) return 'No location changes';

    const { old, new: newLoc } = locationChange;

    return (
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        {/* Old Location */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            Before
          </Typography>
          <Box display="flex" gap={0.5}>
            {['p1', 'p2', 'p3'].map((key) => (
              <Chip
                key={`old-${key}`}
                label={old[key] || 'Empty'}
                size="small"
                color={old[key] ? 'error' : 'default'}
                variant="outlined"
                sx={{ minWidth: '60px', fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mx: 1 }}>→</Typography>

        {/* New Location */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            After
          </Typography>
          <Box display="flex" gap={0.5}>
            {['p1', 'p2', 'p3'].map((key) => (
              <Chip
                key={`new-${key}`}
                label={newLoc[key] || 'Empty'}
                size="small"
                color={newLoc[key] ? 'success' : 'default'}
                variant="outlined"
                sx={{ minWidth: '60px', fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderActualChange = (actualChange) => {
    if (!actualChange) return null;

    const { old, new: newActual } = actualChange;

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Chip label={`${old}`} size="small" color="error" variant="outlined" />
        <Typography variant="h6">→</Typography>
        <Chip label={`${newActual}`} size="small" color="success" variant="outlined" />
      </Box>
    );
  };

  const renderChangesSummary = (changes) => {
    const changeTypes = [];
    if (changes.location) changeTypes.push('📍 Location');
    if (changes.actual) changeTypes.push('📦 Actual');

    return (
      <Box display="flex" gap={1} flexWrap="wrap">
        {changeTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            size="small"
            color="info"
            variant="outlined"
          />
        ))}
      </Box>
    );
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
      {/* Header Controls */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Store Stock Audit Trail
        </Typography>
        <Grid container spacing={2}>
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
      </Card>

      {/* Data Display */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
          {Object.keys(groupedByDay)
            .sort((a, b) => Number(b) - Number(a)) // Sort by day (newest first)
            .map((day) => (
              <Card key={day} sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: colors.primary }}>{day}</Avatar>
                    <Typography variant="h6" color={colors.primary}>
                      {monthNames[selectedMonth - 1]} {day}, {selectedYear}
                    </Typography>
                    <Chip
                      label={`${groupedByDay[day].length} changes`}
                      size="small"
                      color="secondary"
                    />
                  </Box>

                  <Stack spacing={2}>
                    {groupedByDay[day]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by time (newest first)
                      .map((entry, index) => {
                        const timeInfo = formatTimestamp(entry.timestamp);
                        const isExpanded = expandedEntries[entry._id] || index === 0;

                        return (
                          <Card key={entry._id} variant="outlined">
                            <CardContent sx={{ pb: 1 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => toggleExpanded(entry._id)}
                              >
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    ID: ...{entry.entry_id?.slice(-8)}
                                  </Typography>
                                  {renderChangesSummary(entry.changes)}
                                </Box>

                                <Box display="flex" alignItems="center" gap={2}>
                                  <Typography variant="caption" color="textSecondary">
                                    {timeInfo.time}
                                  </Typography>
                                  <Tooltip
                                    title={`${entry.updated_by.name} (${entry.updated_by.email})`}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: colors.secondary,
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      {entry.updated_by.name.charAt(0)}
                                    </Avatar>
                                  </Tooltip>
                                  <Typography variant="body2">
                                    {isExpanded ? '▼' : '▶'}
                                  </Typography>
                                </Box>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box mt={2}>
                                  <Divider sx={{ my: 1 }} />
                                  <Box display="flex" flexDirection="column" gap={2}>
                                    {/* Entry Details */}
                                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        🔍 Entry Details
                                      </Typography>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="caption" color="textSecondary">
                                            Entry ID
                                          </Typography>
                                          <Typography variant="body2" fontFamily="monospace">
                                            {entry.entry_id}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="caption" color="textSecondary">
                                            Audit ID
                                          </Typography>
                                          <Typography variant="body2" fontFamily="monospace">
                                            {entry._id}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Paper>

                                    {/* Changes Details */}
                                    {entry.changes.location && (
                                      <Paper sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          📍 Location Changes
                                        </Typography>
                                        {renderLocationChange(entry.changes.location)}
                                      </Paper>
                                    )}

                                    {entry.changes.actual && (
                                      <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          📦 Actual Quantity Changes
                                        </Typography>
                                        {renderActualChange(entry.changes.actual)}
                                      </Paper>
                                    )}

                                    {/* User Info */}
                                    <Paper sx={{ p: 2, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        👤 Modified By
                                      </Typography>
                                      <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: colors.secondary }}>
                                          👤
                                        </Avatar>
                                        <Box>
                                          <Typography variant="body2" fontWeight="medium">
                                            {entry.updated_by.name}
                                          </Typography>
                                          <Typography variant="caption" color="textSecondary">
                                            {entry.updated_by.email} • {entry.updated_by.role}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            display="block"
                                          >
                                            📅 {timeInfo.date} at 🕒 {timeInfo.time}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  </Box>
                                </Box>
                              </Collapse>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {auditData.length === 0 && !loading && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            📂 No Audit Data Found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No changes were made to store stock in {monthNames[selectedMonth - 1]} {selectedYear}
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default DailyActualLocationComponent;
