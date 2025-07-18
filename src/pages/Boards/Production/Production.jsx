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
  Chip,
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
import CloseIcon from '@mui/icons-material/Close';
import { MdDone } from 'react-icons/md';
import AddIcon from '@mui/icons-material/Add';
import AddProduction from './AddProduction';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Production = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // Format: YYYY-MM
  const [hasInitialized, setHasInitialized] = useState(false);
  const [edit, setEdit] = useState({});
  const [addData, setAddData] = useState({});
  console.log(data);
  console.log(edit);

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

  // Process records to organize by part and date
  const processData = (records) => {
    const partMap = new Map();

    records.forEach((record) => {
      const { part_description, machine, schedule, plan, actual, resp_person, timestamp, id } =
        record;
      const date = new Date(timestamp);
      const day = date.getDate();

      const partKey = part_description;

      if (!partMap.has(partKey)) {
        partMap.set(partKey, {
          part_description,
          machine: machine,
          schedule: null, // Will be set from first available day
          dailyData: new Map(),
          totalPlan: 0,
          totalActual: 0,
          recordIds: [],
          recordsByDay: new Map(),
        });
      }

      const partData = partMap.get(partKey);

      // Track the original record ID
      partData.recordIds.push(id);

      // Track which day this record belongs to
      if (!partData.recordsByDay.has(day)) {
        partData.recordsByDay.set(day, []);
      }
      partData.recordsByDay.get(day).push(id);

      // If this day already has data, accumulate the values
      if (partData.dailyData.has(day)) {
        const existingData = partData.dailyData.get(day);
        partData.dailyData.set(day, {
          plan: (existingData.plan || 0) + (parseFloat(plan) || 0),
          actual: (existingData.actual || 0) + (parseFloat(actual) || 0),
          resp_person: resp_person || existingData.resp_person,
          recordIds: [...(existingData.recordIds || []), id],
          records: [...(existingData.records || []), record],
        });
      } else {
        // Create new entry for this day
        partData.dailyData.set(day, {
          plan: parseFloat(plan) || 0,
          actual: parseFloat(actual) || 0,
          resp_person: resp_person || '',
          recordIds: [id],
          records: [record],
        });
      }

      // Add to totals
      partData.totalPlan += parseFloat(plan) || 0;
      partData.totalActual += parseFloat(actual) || 0;
    });

    // Set schedule from first available day's entry for each part
    partMap.forEach((partData, partKey) => {
      // Sort the days to find the earliest day with data
      const sortedDays = Array.from(partData.dailyData.keys()).sort((a, b) => a - b);

      // Find the first day that has a valid schedule
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
            break; // Found schedule, stop looking
          }
        }
      }

      // If still no schedule found, set to 0
      if (partData.schedule === null) {
        partData.schedule = 0;
      }
    });

    return Array.from(partMap.values());
  };

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    if (!token) return;

    const [year, month] = selectedDate.split('-');
    setIsLoading(true);

    try {
      // Updated API endpoint for production plan data
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
      setIsLoading(false);

      // Remove sample data fallback in production
      // const sampleData = {
      //   message: "Entries fetched from MongoDB",
      //   year: parseInt(year),
      //   month: parseInt(month),
      //   schedule: 7200,
      //   production_plan: 770,
      //   production_actual: 650,
      //   balance_plan: 6430,
      //   balance_actual: 6550,
      //   records: [
      //     {
      //       part_description: "BRACKET-E",
      //       machine: "120T",
      //       schedule: "7200",
      //       plan: "770",
      //       actual: "650",
      //       resp_person: "Shrikant",
      //       timestamp: "2025-07-01T15:38:19.746000",
      //       id: "6863c8b0ef2f5e276f759863"
      //     },
      //     {
      //       part_description: "BRACKET-D",
      //       machine: "120T",
      //       schedule: null,
      //       plan: "100",
      //       actual: "85",
      //       resp_person: "John",
      //       timestamp: "2025-07-01T11:38:24.164000",
      //       id: "6863c8b0ef2f5e276f759864"
      //     },
      //     {
      //       part_description: "PES COVER-B",
      //       machine: "250T",
      //       schedule: "5000",
      //       plan: "400",
      //       actual: "380",
      //       resp_person: "Mike",
      //       timestamp: "2025-07-01T11:38:24.180000",
      //       id: "6863c8b0ef2f5e276f759865"
      //     }
      //   ]
      // };
      // setData(sampleData);
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
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const processedData = data ? processData(data.records) : [];

  const renderPlanActualRows = (dayData) => {
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
            fontSize: '0.7rem',
            padding: '4px 8px',
            backgroundColor: '#f0f8ff',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '25px',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}>
            {dayData?.plan || '-'}
          </Typography>
        </Box>
        <Box
          sx={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '25px',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}>
            {dayData?.actual || '-'}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPlanActualLabels = () => {
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
            fontSize: '0.7rem',
            padding: '4px 8px',
            backgroundColor: '#f0f8ff',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '25px',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#1976d2' }}
          >
            Plan
          </Typography>
        </Box>
        <Box
          sx={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '25px',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#d32f2f' }}
          >
            Actual
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
        actual: edit.actual?.toString() || '0',
        resp_person: edit.resp_person || '',
        timestamp: edit.timestamp,
      };

      console.log('Update payload:', updatePayload);
      console.log('Document ID to update:', edit.id);

      const response = await axios.put(
        `${BACKEND_API}/update_production_plan_detail/${edit.id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Update response:', response.data);
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
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

      {/* Monthly Summary */}
      {/* {data && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Monthly Summary - {getMonthName(data.month)} {data.year}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`Total Schedule: ${data.schedule}`} color="primary" />
              <Chip label={`Total Plan: ${data.production_plan}`} color="success" />
              <Chip label={`Total Actual: ${data.production_actual}`} color="warning" />
              <Chip label={`Balance Plan: ${data.balance_plan}`} color="info" />
              <Chip label={`Balance Actual: ${data.balance_actual}`} color="secondary" />
            </Box>
          </CardContent>
        </Card>
      )} */}

      {/* Main Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={50} />
        </Box>
      ) : processedData.length > 0 ? (
        <Paper sx={{ overflow: 'hidden', border: `1px solid #e0e0e0`, boxShadow: 3 }}>
          <TableContainer
            sx={{
              maxHeight: '70vh',
              overflowX: 'auto',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                height: '12px',
                width: '12px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                },
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

                  {/* Production */}
                  {/* <TableCell
                    sx={{
                      backgroundColor: '#e8f5e8',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      minWidth: '80px',
                      maxWidth: '80px',
                      width: '80px',
                      border: `1px solid #e0e0e0`,
                      position: 'sticky',
                      right: 8,
                      zIndex: 3
                    }}
                  >
                    Production
                  </TableCell> */}

                  {/* Balance */}
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
                      {renderPlanActualLabels()}
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
                              {renderPlanActualRows(dayData)}
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
                                    console.log('=== EDIT ICON CLICKED ===');
                                    console.log('Part Description:', partData.part_description);
                                    console.log('Day:', day);
                                    console.log('Day Data:', dayData);
                                    console.log('Selected Record:', dayData.records[0]);
                                    console.log('All Records for this day:', dayData.records);
                                    console.log('Record IDs:', dayData.recordIds);
                                    console.log('========================');

                                    // Add day information to the edit state
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
                                  actual: 0,
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
                              fontSize: '0.7rem',
                              padding: '4px 8px',
                              backgroundColor: '#f8f9fa',
                              borderBottom: '1px solid #e0e0e0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {partData.totalPlan}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              fontSize: '0.7rem',
                              padding: '4px 8px',
                              backgroundColor: '#f8f9fa',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {partData.totalActual}
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
                              fontSize: '0.7rem',
                              padding: '4px 8px',
                              backgroundColor: '#f8f9fa',
                              borderBottom: '1px solid #e0e0e0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {(partData.schedule || 0) - partData.totalPlan}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              fontSize: '0.7rem',
                              padding: '4px 8px',
                              backgroundColor: '#f8f9fa',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#333' }}
                            >
                              {(partData.schedule || 0) - partData.totalActual}
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
          <Typography variant="body2">Actual</Typography>
        </Box>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: '#e8f5e8', border: '1px solid #2e7d32' }} />
          <Typography variant="body2">Production</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: '#f3e5f5', border: '1px solid #7b1fa2' }} />
          <Typography variant="body2">Balance</Typography>
        </Box> */}
      </Box>

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

              {/* Schedule field - only show for day 1 */}
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
                  label="Actual"
                  type="number"
                  value={edit.actual || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, actual: parseInt(e.target.value) || 0 }))
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
