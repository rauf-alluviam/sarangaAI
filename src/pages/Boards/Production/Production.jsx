import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import colors from '../../../utils/colors';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddProduction from './AddProduction';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Production = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7));
  const [hasInitialized, setHasInitialized] = useState(false);
  const [edit, setEdit] = useState({});
  const [addData, setAddData] = useState({});

  // Generate Production Plan states
  const [generateModal, setGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    shift_hours: 8,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Generate days array (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Get month name
  const getMonthName = (monthNum) => {
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
    return monthNames[monthNum - 1];
  };

  // Validation function
  const validateGenerateData = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!data.year || data.year < 2020 || data.year > currentYear + 5) {
      errors.year = `Year must be between 2020 and ${currentYear + 5}`;
    }

    if (!data.month || data.month < 1 || data.month > 12) {
      errors.month = 'Month must be between 1 and 12';
    }

    if (!data.shift_hours || data.shift_hours < 1 || data.shift_hours > 24) {
      errors.shift_hours = 'Shift hours must be between 1 and 24';
    }

    return errors;
  };

  // Input handlers with validation
  const handleYearChange = (e) => {
    const value = parseInt(e.target.value) || '';
    setGenerateData((prev) => ({ ...prev, year: value }));

    if (validationErrors.year) {
      setValidationErrors((prev) => ({ ...prev, year: undefined }));
    }
  };

  const handleMonthChange = (e) => {
    const value = parseInt(e.target.value) || '';
    if (value === '' || (value >= 1 && value <= 12)) {
      setGenerateData((prev) => ({ ...prev, month: value }));
    }

    if (validationErrors.month) {
      setValidationErrors((prev) => ({ ...prev, month: undefined }));
    }
  };

  const handleShiftHoursChange = (e) => {
    const value = parseInt(e.target.value) || '';
    if (value === '' || (value >= 1 && value <= 24)) {
      setGenerateData((prev) => ({ ...prev, shift_hours: value }));
    }

    if (validationErrors.shift_hours) {
      setValidationErrors((prev) => ({ ...prev, shift_hours: undefined }));
    }
  };

  // Generate Production Plan API Call
  const handleGenerateProductionPlan = async () => {
    if (!token) return;

    const errors = validateGenerateData(generateData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      enqueueSnackbar('Please fix validation errors', { variant: 'error' });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post(
        `${BACKEND_API}/generate_and_save_production_plan`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            year: generateData.year,
            month: generateData.month,
            shift_hours: generateData.shift_hours,
          },
        }
      );

      enqueueSnackbar('Production plan generated successfully', { variant: 'success' });
      setGenerateModal(false);
      setValidationErrors({});

      const monthStr = generateData.month.toString().padStart(2, '0');
      setSelectedDate(`${generateData.year}-${monthStr}`);

      fetchData();
    } catch (error) {
      console.error('Error generating production plan:', error);

      if (error.response?.status === 400) {
        enqueueSnackbar(
          error.response.data.detail || 'Production plan already exists for this period',
          { variant: 'warning' }
        );
      } else {
        enqueueSnackbar('Error generating production plan', { variant: 'error' });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Process records to organize by part and date
  const processData = useCallback((records) => {
    const partMap = new Map();

    records.forEach((record) => {
      const {
        part_description,
        machine,
        schedule,
        plan,
        actual_RH,
        actual_LH,
        resp_person,
        timestamp,
        id,
      } = record;
      const [datePart] = timestamp.split('T');
      const [yearStr, monthStr, dayStr] = datePart.split('-');
      const day = parseInt(dayStr, 10);
      const partKey = part_description;

      if (!partMap.has(partKey)) {
        partMap.set(partKey, {
          part_description,
          machine: machine,
          schedule: null,
          dailyData: new Map(),
          totalPlan: 0,
          totalactual_RH: 0,
          totalactual_LH: 0,
          recordIds: [],
          recordsByDay: new Map(),
        });
      }

      const partData = partMap.get(partKey);
      partData.recordIds.push(id);

      if (!partData.recordsByDay.has(day)) {
        partData.recordsByDay.set(day, []);
      }
      partData.recordsByDay.get(day).push(id);

      if (partData.dailyData.has(day)) {
        const existingData = partData.dailyData.get(day);
        partData.dailyData.set(day, {
          plan: (existingData.plan || 0) + (parseFloat(plan) || 0),
          actual_RH: (existingData.actual_RH || 0) + (parseFloat(actual_RH) || 0),
          actual_LH: (existingData.actual_LH || 0) + (parseFloat(actual_LH) || 0),
          resp_person: resp_person || existingData.resp_person,
          recordIds: [...(existingData.recordIds || []), id],
          records: [...(existingData.records || []), record],
        });
      } else {
        partData.dailyData.set(day, {
          plan: parseFloat(plan) || 0,
          actual_RH: parseFloat(actual_RH) || 0,
          actual_LH: parseFloat(actual_LH) || 0,
          resp_person: resp_person || '',
          recordIds: [id],
          records: [record],
        });
      }

      partData.totalPlan += parseFloat(plan) || 0;
      partData.totalactual_RH += parseFloat(actual_RH) || 0;
      partData.totalactual_LH += parseFloat(actual_LH) || 0;
    });

    // Set schedule from first available day's entry for each part
    partMap.forEach((partData) => {
      const sortedDays = Array.from(partData.dailyData.keys()).sort((a, b) => a - b);

      for (const day of sortedDays) {
        const dayData = partData.dailyData.get(day);
        if (dayData && dayData.records && dayData.records.length > 0) {
          const firstRecord = dayData.records[0];
          if (
            firstRecord.schedule &&
            firstRecord.schedule !== null &&
            firstRecord.schedule !== ''
          ) {
            partData.schedule = parseFloat(firstRecord.schedule) || 0;
            break;
          }
        }
      }

      if (partData.schedule === null) {
        partData.schedule = 0;
      }
    });

    return Array.from(partMap.values());
  }, []);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    if (!token) return;

    const [year, month] = selectedDate.split('-');
    setIsLoading(true);

    try {
      const response = await axios.get(`${BACKEND_API}/get_production_plan_details_by_month`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          year: parseInt(year),
          month: parseInt(month),
        },
      });

      setData(response.data);
      enqueueSnackbar('Data fetched successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Error fetching data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedDate]);

  const initialCallMade = useRef(false);

  useEffect(() => {
    if (!hasInitialized && token) {
      setHasInitialized(true);
      if (!initialCallMade.current) {
        initialCallMade.current = true;
        fetchData();
      }
    }
  }, [token, hasInitialized, fetchData]);

  useEffect(() => {
    if (hasInitialized && token) {
      fetchData();
    }
  }, [selectedDate, hasInitialized, token, fetchData]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const processedData = data ? processData(data.records) : [];

  // Common cell styling
  const cellStyle = {
    fontSize: '0.7rem',
    padding: '4px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '25px',
  };

  const renderPlanactual_RHRows = (dayData) => {
    return (
      <Box
        sx={{
          minHeight: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ ...cellStyle, backgroundColor: '#f0f8ff', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}>
            {dayData?.plan || '-'}
          </Typography>
        </Box>
        <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}>
            {dayData?.actual_RH || '-'}
          </Typography>
        </Box>
        <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}>
            {dayData?.actual_LH || '-'}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPlanactual_RHLabels = () => {
    return (
      <Box
        sx={{
          minHeight: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            ...cellStyle,
            backgroundColor: '#f0f8ff',
            borderBottom: '1px solid #e0e0e0',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#1976d2' }}
          >
            Plan
          </Typography>
        </Box>
        <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa', justifyContent: 'flex-start' }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#d32f2f' }}
          >
            Actual RH
          </Typography>
        </Box>
        <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa', justifyContent: 'flex-start' }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#d32f2f' }}
          >
            Actual LH
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = {
        part_description: edit.part_description,
        schedule: edit.schedule?.toString() || '0',
        plan: edit.plan?.toString() || '0',
        actual_RH: edit.actual_RH?.toString() || '0',
        actual_LH: edit.actual_LH?.toString() || '0',
        resp_person: edit.resp_person || '',
        timestamp: edit.timestamp,
      };

      await axios.put(`${BACKEND_API}/update_production_plan_detail/${edit._id}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      enqueueSnackbar('Record updated successfully', { variant: 'success' });
      setEdit({});
      fetchData();
    } catch (error) {
      console.error('Error updating record:', error);
      enqueueSnackbar('Error updating record', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          mb: 2,
          fontWeight: 'bold',
          color: colors.primary,
          borderBottom: `3px solid ${colors.primary}`,
        }}
      >
        PRODUCTION BOARD
      </Typography>

      {/* Search Controls */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2 }}>
            {/* Generate Production Plan Button */}
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => {
                const [year, month] = selectedDate.split('-');
                setGenerateData({
                  year: parseInt(year),
                  month: parseInt(month),
                  shift_hours: 8,
                });
                setGenerateModal(true);
              }}
              sx={{
                bgcolor: colors.primary,
                '&:hover': {
                  bgcolor: colors.primary,
                  opacity: 0.9,
                },
              }}
            >
              Generate Production Plan
            </Button>

            {/* Month/Year Selector */}
            <TextField
              label="Select Month & Year"
              type="month"
              value={selectedDate}
              onChange={handleDateChange}
              size="small"
              sx={{ width: '200px' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Main Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={50} />
        </Box>
      ) : processedData.length > 0 ? (
       <Paper sx={{ overflow: 'hidden', border: `1px solid #e0e0e0`, boxShadow: 3 }}>
                 <TableContainer
                   sx={{
             maxHeight: "73vh",   // limits height so vertical scrollbar appears
             overflow: "auto",    // allow both scrollbars
             scrollbarWidth: "thin",
             "&::-webkit-scrollbar": {
               width: "8px",
               height: "8px",
             },
             "&::-webkit-scrollbar-thumb": {
               backgroundColor: "#888",
               borderRadius: "4px",
             },
             "&::-webkit-scrollbar-thumb:hover": {
               backgroundColor: "#555",
             },
           }}
                 >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5 !important' }}>
                  {/* Serial Number */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      minWidth: '60px',
                      border: `1px solid #e0e0e0`,
                      textAlign: 'center',
                    }}
                  >
                    Sr. No.
                  </TableCell>

                  {/* Part Description */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 60,
                      zIndex: 3,
                      minWidth: '150px',
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Part Description
                  </TableCell>

                  {/* Schedule */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 210,
                      zIndex: 3,
                      minWidth: '100px',
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Schedule
                  </TableCell>

                  {/* Plan/Actual */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 310,
                      zIndex: 3,
                      minWidth: '80px',
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Plan/Actual
                  </TableCell>

                  {/* Date Columns (1-31) */}
                  {days.map((day) => (
                    <TableCell
                      key={day}
                      align="center"
                      sx={{
                        backgroundColor: 'inherit',
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        minWidth: '60px',
                        border: `1px solid #e0e0e0`,
                        width: '60px',
                      }}
                    >
                      {day}
                    </TableCell>
                  ))}

                  {/* Production & Balance */}
                  <TableCell
                    sx={{
                      backgroundColor: '#f3e5f5',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      minWidth: '180px',
                      maxWidth: '180px',
                      width: '180px',
                      position: 'sticky',
                      right: 0,
                      zIndex: 3,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
                      <Typography mr={'0.4rem'} fontSize={'0.9rem'}>
                        Production
                      </Typography>
                      <Typography fontSize={'0.9rem'}>Balance</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {processedData.map((partData, index) => (
                  <TableRow key={partData.part_description} hover>
                    {/* Serial Number */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        textAlign: 'center',
                      }}
                    >
                      {index + 1}
                    </TableCell>

                    {/* Part Description */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 60,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                      }}
                    >
                      {partData.part_description}
                    </TableCell>

                    {/* Schedule */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 210,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {partData.schedule || '-'}
                      </Typography>
                    </TableCell>

                    {/* Plan/Actual Labels */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 310,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        padding: '4px',
                      }}
                    >
                      {renderPlanactual_RHLabels()}
                    </TableCell>

                    {/* Date Columns */}
                    {days.map((day) => {
                      const dayData = partData.dailyData.get(day);
                      return (
                        <TableCell
                          key={day}
                          sx={{
                            padding: '4px',
                            border: `1px solid #e0e0e0`,
                            backgroundColor: dayData ? '#f0f8f0' : 'white',
                            position: 'relative',
                          }}
                          align="center"
                        >
                          {dayData ? (
                            <Box sx={{ position: 'relative' }}>
                              {renderPlanactual_RHRows(dayData)}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  display: 'flex',
                                  gap: 0.5,
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    setEdit({ ...dayData.records[0], day: day });
                                  }}
                                  size="small"
                                  sx={{
                                    color: 'rgb(57, 81, 160)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.99)',
                                    width: 16,
                                    height: 16,
                                    '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </Box>
                          ) : (
                            <IconButton
                              onClick={() => {
                                const [year, month] = selectedDate.split('-');
                                const dateString = `${year}-${month.padStart(2, '0')}-${day
                                  .toString()
                                  .padStart(2, '0')}`;

                                setAddData({
                                  part_description: partData.part_description,
                                  machine: partData.machine,
                                  schedule: partData.schedule,
                                  plan: 0,
                                  actual_RH: 0,
                                  actual_LH: 0,
                                  resp_person: '',
                                  timestamp: `${dateString}T${new Date()
                                    .toTimeString()
                                    .slice(0, 8)}.000Z`,
                                  day: day,
                                });
                              }}
                              size="small"
                              sx={{
                                color: 'rgb(214, 214, 214)',
                                margin: 'auto',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      );
                    })}

                    {/* Production & Balance Combined */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        border: `1px solid #e0e0e0`,
                        padding: '4px',
                        position: 'sticky',
                        right: 0,
                        zIndex: 2,
                        minWidth: '160px',
                        maxWidth: '160px',
                        width: '160px',
                      }}
                    >
                      <Box sx={{ display: 'flex', minHeight: '50px' }}>
                        {/* Production Column */}
                        <Box
                          sx={{
                            width: '80px',
                            minWidth: '80px',
                            maxWidth: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRight: '1px solid #e0e0e0',
                          }}
                        >
                          <Box
                            sx={{
                              ...cellStyle,
                              backgroundColor: '#f8f9fa',
                              borderBottom: '1px solid #e0e0e0',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {partData.totalPlan}
                            </Typography>
                          </Box>
                          <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {partData.totalactual_RH}
                            </Typography>
                          </Box>
                          <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {partData.totalactual_LH}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Balance Column */}
                        <Box
                          sx={{
                            width: '80px',
                            minWidth: '80px',
                            maxWidth: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Box
                            sx={{
                              ...cellStyle,
                              backgroundColor: '#f8f9fa',
                              borderBottom: '1px solid #e0e0e0',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {(partData.schedule || 0) - partData.totalPlan}
                            </Typography>
                          </Box>
                          <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {(partData.schedule || 0) - partData.totalactual_RH}
                            </Typography>
                          </Box>
                          <Box sx={{ ...cellStyle, backgroundColor: '#f8f9fa' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {(partData.schedule || 0) - partData.totalactual_LH}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          No data available for the selected month and year.
        </Alert>
      )}

      {/* Legend */}
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          bgcolor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{ width: 16, height: 16, backgroundColor: '#f0f8ff', border: '1px solid #1976d2' }}
          />
          <Typography variant="body2">Plan</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{ width: 16, height: 16, backgroundColor: '#f8f9fa', border: '1px solid #d32f2f' }}
          />
          <Typography variant="body2">Actual RH</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{ width: 16, height: 16, backgroundColor: '#f8f9fa', border: '1px solid #d32f2f' }}
          />
          <Typography variant="body2">Actual LH</Typography>
        </Box>
      </Box>

      {/* Generate Production Plan Modal */}
      <Dialog
        open={generateModal}
        onClose={() => {
          setGenerateModal(false);
          setValidationErrors({});
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
            Generate Production Plan
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={generateData.year}
                  onChange={handleYearChange}
                  variant="outlined"
                  error={!!validationErrors.year}
                  helperText={validationErrors.year}
                  inputProps={{
                    min: 2020,
                    max: new Date().getFullYear() + 5,
                    step: 1,
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'Tab',
                        'Escape',
                        'Enter',
                        'ArrowLeft',
                        'ArrowRight',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Month"
                  type="number"
                  value={generateData.month}
                  onChange={handleMonthChange}
                  variant="outlined"
                  error={!!validationErrors.month}
                  helperText={validationErrors.month}
                  inputProps={{
                    min: 1,
                    max: 12,
                    step: 1,
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'Tab',
                        'Escape',
                        'Enter',
                        'ArrowLeft',
                        'ArrowRight',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Shift Hours"
                  type="number"
                  value={generateData.shift_hours}
                  onChange={handleShiftHoursChange}
                  variant="outlined"
                  error={!!validationErrors.shift_hours}
                  helperText={validationErrors.shift_hours}
                  inputProps={{
                    min: 1,
                    max: 24,
                    step: 1,
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'Tab',
                        'Escape',
                        'Enter',
                        'ArrowLeft',
                        'ArrowRight',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Alert
              severity={Object.keys(validationErrors).length > 0 ? 'error' : 'info'}
              sx={{ mt: 2 }}
            >
              {Object.keys(validationErrors).length > 0 ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Please fix the following errors:
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {Object.values(validationErrors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Box>
              ) : (
                <>
                  This will generate a production plan for{' '}
                  <strong>
                    {getMonthName(generateData.month)} {generateData.year}
                  </strong>{' '}
                  with <strong>{generateData.shift_hours} hours</strong> shift duration.
                </>
              )}
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setGenerateModal(false);
              setValidationErrors({});
            }}
            color="error"
            variant="outlined"
            sx={{ minWidth: 100 }}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateProductionPlan}
            color="primary"
            variant="contained"
            sx={{ minWidth: 100 }}
            disabled={isGenerating || Object.keys(validationErrors).length > 0}
          >
            {isGenerating ? <CircularProgress size={20} /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Production Modal */}
      <AddProduction addData={addData} setAddData={setAddData} fetchData={fetchData} />

      {/* Update Modal */}
      <Dialog
        open={Object.keys(edit).length > 0}
        onClose={() => setEdit({})}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
            Edit Production Data
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Part Description"
                  value={edit.part_description || ''}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Machine"
                  value={edit.machine || ''}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                    },
                  }}
                />
              </Grid>

              {edit.day === 1 && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Schedule"
                    type="number"
                    value={edit.schedule || ''}
                    onChange={(e) =>
                      setEdit((prev) => ({ ...prev, schedule: parseInt(e.target.value) || 0 }))
                    }
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Plan"
                  type="number"
                  value={edit.plan || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, plan: parseInt(e.target.value) || 0 }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Actual RH"
                  type="number"
                  value={edit.actual_RH || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, actual_RH: parseInt(e.target.value) || 0 }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Actual LH"
                  type="number"
                  value={edit.actual_LH || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, actual_LH: parseInt(e.target.value) || 0 }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Responsible Person"
                  value={edit.resp_person || ''}
                  onChange={(e) => setEdit((prev) => ({ ...prev, resp_person: e.target.value }))}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setEdit({})}
            color="error"
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained" sx={{ minWidth: 100 }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Production;
