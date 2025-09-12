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
import AddRejection from './AddRejection';
import { Navigate, useNavigate } from 'react-router-dom';
// import RejectionMonthly from '../Rejection/RejectionMonthly.jsx';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Rejection = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // Format: YYYY-MM
  const [hasInitialized, setHasInitialized] = useState(false); // Prevent double calls
  const [edit, setEdit] = useState({}); // Track which cell is being edited (format: {partKey: 'BRACKET-D', day: 4})
  const [addData, setAddData] = useState({}); // For add new entry dialog
  const navigate = useNavigate();
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

  // Process records to organize by part and date while preserving IDs
  const processData = (records) => {
    const partMap = new Map();

    records.forEach((record) => {
      const { part_description, rm, timestamp, id } = record;
      const date = new Date(timestamp);
      const day = date.getDate();

      // Use only part_description as key to consolidate entries with same part description
      const partKey = part_description;

      if (!partMap.has(partKey)) {
        partMap.set(partKey, {
          part_description,
          rm: rm, // Use the first RM found for this part
          dailyData: new Map(),
          total: {
            ok_parts: 0,
            rejections: 0,
            lumps: 0,
            runner: 0,
            isssued: 0,
          },
          recordIds: [], // Track all original record IDs
          recordsByDay: new Map(), // Track which record IDs belong to which day
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

      // If this day already has data, accumulate the values and merge IDs
      if (partData.dailyData.has(day)) {
        const existingData = partData.dailyData.get(day);
        partData.dailyData.set(day, {
          ok_parts: (existingData.ok_parts || 0) + (record.ok_parts || 0),
          rejections: (existingData.rejections || 0) + (record.rejections || 0),
          lumps: (existingData.lumps || 0) + (record.lumps || 0),
          runner: (existingData.runner || 0) + (record.runner || 0),
          isssued: (existingData.isssued || 0) + (record.isssued || 0),
          scrap_sum: (existingData.scrap_sum || 0) + (record.scrap_sum || 0),
          // Attach IDs to this specific date's data
          recordIds: [...(existingData.recordIds || []), id],
          // Store original records for reference
          records: [...(existingData.records || []), record],
        });
      } else {
        // Create new entry for this day with ID attached
        partData.dailyData.set(day, {
          ok_parts: record.ok_parts || 0,
          rejections: record.rejections || 0,
          lumps: record.lumps || 0,
          runner: record.runner || 0,
          isssued: record.isssued || 0,
          scrap_sum: record.scrap_sum || 0,
          // Attach ID to this specific date's data
          recordIds: [id],
          // Store original record for reference
          records: [record],
        });
      }

      // Add to totals (always accumulate)
      partData.total.ok_parts += record.ok_parts || 0;
      partData.total.rejections += record.rejections || 0;
      partData.total.lumps += record.lumps || 0;
      partData.total.runner += record.runner || 0;
      partData.total.isssued += record.isssued || 0;

      // Update RM if it's different (concatenate multiple RMs if needed)
      if (rm && rm !== partData.rm && !partData.rm.includes(rm)) {
        partData.rm = partData.rm + ', ' + rm;
      }
    });

    return Array.from(partMap.values());
  };

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    if (!token) return; // Don't fetch if no token

    const [year, month] = selectedDate.split('-');
    setIsLoading(true);

    console.log('API Call - Year:', year, 'Month:', month, 'Timestamp:', new Date().toISOString());

    try {
      const response = await axios.get(`${BACKEND_API}/get_rejection_details_by_month`, {
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
      // Using the sample data you provided for demonstration
      // const sampleData = {
      //   message: "Entries fetched from MongoDB",
      //   year: parseInt(year),
      //   month: parseInt(month),
      //   monthly_ok_parts: 354,
      //   monthly_rejection: 0.5,
      //   monthly_lumps: 1,
      //   monthly_runner: 2.3,
      //   monthly_issued: 0,
      //   monthly_rej_lump_runner: 3.8,
      //   records: [
      //     {
      //       part_description: "BRACKET-D",
      //       rm: "PP TF 30% Black",
      //       ok_parts: null,
      //       rejections: null,
      //       lumps: null,
      //       runner: null,
      //       isssued: null,
      //       machine: "120T",
      //       resp_person: "",
      //       timestamp: "2025-07-04T06:02:40.790000",
      //       id: "68676e8026d2ec972f2005c1"
      //     },
      //     {
      //       part_description: "BRACKET-D",
      //       rm: "PP 30%",
      //       ok_parts: 354,
      //       rejections: 0.5,
      //       lumps: 1,
      //       runner: 2.3,
      //       isssued: 1.3,
      //       resp_person: "SHRIKANT",
      //       timestamp: "2025-07-04T06:04:30.811000",
      //       id: "68676f279b22a69a475dc129"
      //     },
      //     {
      //       part_description: "BRACKET-E",
      //       rm: "PP TF 30% Black",
      //       ok_parts: null,
      //       rejections: null,
      //       lumps: null,
      //       runner: null,
      //       isssued: null,
      //       machine: "120T",
      //       resp_person: "",
      //       timestamp: "2025-07-04T06:02:40.840000",
      //       id: "68676e8026d2ec972f2005c2"
      //     },
      //     {
      //       part_description: "PES COVER-A",
      //       rm: "PC G BLACK",
      //       ok_parts: null,
      //       rejections: null,
      //       lumps: null,
      //       runner: null,
      //       isssued: null,
      //       machine: "250T",
      //       resp_person: "",
      //       timestamp: "2025-07-04T06:02:40.869000",
      //       id: "68676e8026d2ec972f2005c3"
      //     }
      //   ]
      // };
      // setData(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedDate]);

  // Use a ref to track if we've already made the initial call
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

  // Separate effect for date changes (after initialization)
  useEffect(() => {
    if (hasInitialized && token) {
      fetchData();
    }
  }, [selectedDate]); // Only depend on selectedDate for subsequent calls

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const processedData = data ? processData(data.records) : [];

  const renderPartsSection = (partData, dayData, showStaticText = false) => {
    const parts = ['OK Parts', 'Rejection', 'Lumps', 'Runner', 'Issued', 'Scrap Sum'];
    const values = [
      dayData?.ok_parts || '-',
      dayData?.rejections || '-',
      dayData?.lumps || '-',
      dayData?.runner || '-',
      dayData?.isssued || '-',
      dayData
        ? ((dayData.rejections || 0) + (dayData.lumps || 0) + (dayData.runner || 0)).toFixed(2)
        : '-',
    ];

    return (
      <Box
        sx={{
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {parts.map((part, index) => (
          <Box
            key={part}
            sx={{
              fontSize: '0.7rem',
              padding: '4px 8px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              borderBottom: index < parts.length - 1 ? '1px solid #e0e0e0' : 'none',
              display: 'flex',
              justifyContent: showStaticText ? 'flex-start' : 'center',
              alignItems: 'center',
              minHeight: '22px',
              // Clean styling for Scrap Sum row
              ...(part === 'Scrap Sum' && {
                border: '1px solid rgba(33, 149, 243, 0.19)',
                backgroundColor: '#e3f2fd',
                borderRadius: '3px',
                margin: '1px 0',
                fontWeight: 600,
              }),
            }}
          >
            {showStaticText ? (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: '#555',
                  fontSize: '0.7rem',
                  ...(part === 'Scrap Sum' && {
                    fontWeight: 600,
                    color: '#1976d2',
                  }),
                }}
              >
                {part}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  color: '#333',
                  ...(part === 'Scrap Sum' && {
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: '#1976d2',
                  }),
                }}
              >
                {values[index]}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderTotalSection = (partData) => {
    const totals = [
      partData.total.ok_parts || 0,
      partData.total.rejections || 0,
      partData.total.lumps || 0,
      partData.total.runner || 0,
      partData.total.isssued || 0,
      (
        (partData.total.rejections || 0) +
        (partData.total.lumps || 0) +
        (partData.total.runner || 0)
      ).toFixed(2),
    ];

    return (
      <Box
        sx={{
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {totals.map((total, index) => (
          <Box
            key={index}
            sx={{
              fontSize: '0.7rem',
              padding: '4px 8px',
              backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#f8f9fa',
              borderBottom: index < totals.length - 1 ? '1px solid #e0e0e0' : 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '22px',
              // Clean styling for Scrap Sum row (last item)
              ...(index === totals.length - 1 && {
                border: '1px solid #2196f3',
                backgroundColor: '#e3f2fd',
                borderRadius: '3px',
                margin: '1px 0',
                fontWeight: 600,
              }),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                color: '#333',
                ...(index === totals.length - 1 && {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#1976d2',
                }),
              }}
            >
              {typeof total === 'number' ? total.toFixed(2) : total}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderTotalPercentageSection = (partData) => {
    const issued = partData.total.isssued || 0;

    const getPercent = (value) => (issued ? ((value / issued) * 100).toFixed(2) + '%' : '0.00%');

    const totals = [
      getPercent(partData.total.ok_parts || 0), // OK %
      getPercent(partData.total.rejections || 0), // Rejection %
      getPercent(partData.total.lumps || 0), // Lumps %
      getPercent(partData.total.runner || 0), // Runner %
      issued ? '100.00%' : '0.00%', // Issued %
      getPercent(
        (partData.total.rejections || 0) +
          (partData.total.lumps || 0) +
          (partData.total.runner || 0)
      ), // Total Scrap %
    ];

    const labels = [
      'OK Parts %',
      'Rejections %',
      'Lumps %',
      'Runner %',
      'Issued %',
      'Total Scrap %',
    ];

    return (
      <Box
        sx={{
          minHeight: '170px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {totals.map((total, index) => (
          <Box
            key={index}
            sx={{
              fontSize: '0.7rem',
              padding: '4px 8px',
              backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#f8f9fa',
              borderBottom: index < totals.length - 1 ? '1px solid #e0e0e0' : 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '22px',
              ...(index === totals.length - 1 && {
                border: '1px solid #2196f3',
                backgroundColor: '#e3f2fd',
                borderRadius: '3px',
                margin: '1px 0',
                fontWeight: 600,
              }),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: index === totals.length - 1 ? 700 : 600,
                fontSize: index === totals.length - 1 ? '0.75rem' : '0.7rem',
                color: index === totals.length - 1 ? '#1976d2' : '#333',
              }}
            >
              {total}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const calculateTotalKgs = (totalData) => {
    return (totalData.rejections + totalData.lumps + totalData.runner).toFixed(2);
  };

  const handleUpdate = async () => {
    try {
      // Prepare update payload
      const updatePayload = {
        part_description: edit.part_description,
        rm: edit.rm,
        ok_parts: edit.ok_parts || 0,
        rejections: edit.rejections || 0,
        lumps: edit.lumps || 0,
        runner: edit.runner || 0,
        isssued: edit.isssued || 0,
        resp_person: edit.resp_person || '',
        timestamp: edit.timestamp,
      };

      console.log('Update payload:', updatePayload);
      console.log('Document ID to update:', edit.id);

      // Here you would make the API call to update
      const response = await axios.put(
        `${BACKEND_API}/update_rejection_detail/${edit.id}`,
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
      // Refresh data after update
      fetchData();
    } catch (error) {
      console.error('Error updating record:', error);
      enqueueSnackbar('Error updating record', { variant: 'error' });
    }
  };

  const handleAdd = async () => {
    try {
      // Prepare add payload
      const addPayload = {
        part_description: addData.part_description,
        rm: addData.rm,
        ok_parts: addData.ok_parts || 0,
        rejections: addData.rejections || 0,
        lumps: addData.lumps || 0,
        runner: addData.runner || 0,
        isssued: addData.isssued || 0,
        resp_person: addData.resp_person || '',
        timestamp: addData.timestamp,
      };

      // console.log('Add payload:', addPayload);

      // Here you would make the API call to add new entry
      const response = await axios.post(`${BACKEND_API}/save_rejection_detail`, addPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      enqueueSnackbar('New record added successfully', { variant: 'success' });
      setAddData({});
      // Refresh data after adding
      fetchData();
    } catch (error) {
      console.error('Error adding record:', error);
      enqueueSnackbar('Error adding record', { variant: 'error' });
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
          // pb: '0.6rem'
        }}
      >
        REJECTION DETAIL BOARD
      </Typography>

      {/* Search Controls */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              // onClick={() => setShowRejectionMonthly(true)}
              onClick={() => navigate('/monthly-rejection')}
              sx={{ minWidth: 180, bgcolor: colors.primary, mr: '1rem' }}
            >
              Rejection Monthly
            </Button>
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
              <Chip label={`OK Parts: ${data.monthly_ok_parts}`} color="success" />
              <Chip label={`Rejection: ${data.monthly_rejection} kg`} color="error" />
              <Chip label={`Lumps: ${data.monthly_lumps} kg`} color="warning" />
              <Chip label={`Runner: ${data.monthly_runner} kg`} color="info" />
              <Chip label={`Total Rejection: ${data.monthly_rej_lump_runner} kg`} color="secondary" />
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
              maxHeight: '73vh', // limits height so vertical scrollbar appears
              overflow: 'auto', // allow both scrollbars
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
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#f5f5f5 !important',
                    borderBottom: `1px solid #e0e0e0`,
                  }}
                >
                  {/* Serial Number Column */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      minWidth: '60px',
                      maxWidth: '60px',
                      width: '60px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`,
                      textAlign: 'center',
                    }}
                  >
                    Sr. No.
                  </TableCell>
                  {/* Fixed Columns */}
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 60,
                      zIndex: 3,
                      minWidth: '150px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Part Description
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 210,
                      zIndex: 3,
                      minWidth: '120px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    RM
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'inherit',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 330,
                      zIndex: 3,
                      minWidth: '100px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Parts
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
                        fontSize: '0.875rem',
                        border: `1px solid #e0e0e0`,
                        width: '60px',
                        padding: '12px 12px', // ⬅️ Add vertical + horizontal padding
                      }}
                    >
                      {day}
                    </TableCell>
                  ))}

                  {/* Total Column */}
                  <TableCell
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      minWidth: '100px',
                      position: 'sticky',
                      right: 100, // Sticky at right, but left of Total (%)
                      zIndex: 3,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Total (kgs)
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      minWidth: '100px',
                      position: 'sticky',
                      right: 0, // Rightmost sticky column
                      zIndex: 3,
                      border: `1px solid #e0e0e0`,
                    }}
                  >
                    Total (%)
                  </TableCell>

                  {/* Edit Column Header */}
                  {/* <TableCell
                    align="center"
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      right: 0,
                      zIndex: 3,
                      border: `1px solid #e0e0e0`,
                      width: '60px',
                      minWidth: '60px',
                      maxWidth: '60px'
                    }}
                  >
                    Edit
                  </TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {processedData.map((partData, index) => (
                  <TableRow key={`${partData.part_description}-${partData.rm}`} hover>
                    {/* Serial Number */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
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
                        borderRight: `1px solid #e0e0e0`,
                        border: `1px solid #e0e0e0`,
                      }}
                    >
                      {partData.part_description}
                    </TableCell>

                    {/* RM */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 210,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
                        border: `1px solid #e0e0e0`,
                      }}
                    >
                      {partData.rm}
                    </TableCell>

                    {/* Parts Column */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 330,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
                        padding: '4px',
                        border: `1px solid #e0e0e0`,
                      }}
                    >
                      {renderPartsSection(partData, partData.total, true)}
                    </TableCell>

                    {/* Date Columns */}
                    {days.map((day) => {
                      const dayData = partData.dailyData.get(day);
                      const editKey = `${partData.part_description}-${day}`;
                      const isEditing =
                        edit.part_description === partData.part_description && edit.day === day;

                      return (
                        <TableCell
                          key={day}
                          sx={{
                            padding: '4px',
                            borderRight: `1px solid #e0e0e0`,
                            backgroundColor: dayData ? '#f0f8f0' : 'white',
                            border: `1px solid #e0e0e0`,
                            position: 'relative',
                          }}
                          align="center"
                        >
                          {dayData ? (
                            <Box sx={{ position: 'relative' }}>
                              {renderPartsSection(partData, dayData)}
                              {/* Edit icon for this specific date */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  display: 'flex',
                                  gap: 0.5,
                                }}
                              >
                                {/* {edit.id== dayData.records[0].id ? (
                                  <>
                                    <IconButton
                                      onClick={() => setEdit({})}
                                      size="small"
                                      sx={{
                                        color: "#ef4444",
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        width: 16,
                                        height: 16,
                                        "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" }
                                      }}
                                    >
                                      <CloseIcon sx={{ fontSize: 12 }} />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        // Handle save functionality here for specific date
                                        console.log('Saving edit for:', partData.part_description, 'Day:', day);
                                        console.log('Complete documents for this date:', dayData.records);
                                        // Log each document individually for clarity
                                        dayData.records.forEach((record, index) => {
                                          console.log(`Document ${index + 1}:`, record);
                                        });
                                        setEdit({});
                                        enqueueSnackbar(`Changes saved for ${partData.part_description} on day ${day}`, { variant: 'success' });
                                      }}
                                      size="small"
                                      sx={{
                                        color: "#22c55e",
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        width: 16,
                                        height: 16,
                                        "&:hover": { backgroundColor: "rgba(34, 197, 94, 0.1)" }
                                      }}
                                    >
                                      <MdDone sx={{ fontSize: 12 }} />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton
                                    onClick={() => {
                                      setEdit(dayData.records[0])
                                      // Console log the complete documents when edit is clicked
                                      console.log(`Edit clicked for ${partData.part_description} on Day ${day}`);
                                      console.log('Complete documents for this date:', dayData.records[0]);
                                      // Log each document individually for clarity
                                      // dayData.records.forEach((record, index) => {
                                      //   console.log(`Document ${index + 1}:`, record);
                                      // });
                                      // setEdit({ part_description: partData.part_description, day: day, data: dayData });
                                    }}
                                    size="small"
                                    sx={{
                                      color: "#f59e0b",
                                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                                      width: 16,
                                      height: 16,
                                      "&:hover": { backgroundColor: "rgba(245, 158, 11, 0.1)" }
                                    }}
                                  >
                                    <EditIcon sx={{ fontSize: 12 }} />
                                  </IconButton>
                                )} */}
                                <IconButton
                                  onClick={() => {
                                    setEdit(dayData.records[0]);
                                    // Console log the complete documents when edit is clicked
                                    console.log(
                                      `Edit clicked for ${partData.part_description} on Day ${day}`
                                    );
                                    console.log(
                                      'Complete documents for this date:',
                                      dayData.records[0]
                                    );
                                    // Log each document individually for clarity
                                    // dayData.records.forEach((record, index) => {
                                    //   console.log(`Document ${index + 1}:`, record);
                                    // });
                                    // setEdit({ part_description: partData.part_description, day: day, data: dayData });
                                  }}
                                  size="small"
                                  sx={{
                                    color: 'rgb(57, 81, 160)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.99)',
                                    width: 16,
                                    height: 16,
                                    '&:hover': {
                                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                    },
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </Box>
                          ) : (
                            // -------------------add new item----------------
                            <IconButton
                              onClick={() => {
                                // Pre-fill the add dialog with part info and selected date
                                const [year, month] = selectedDate.split('-');
                                const dateString = `${year}-${month.padStart(2, '0')}-${day
                                  .toString()
                                  .padStart(2, '0')}`;

                                setAddData({
                                  part_description: partData.part_description,
                                  rm: partData.rm,
                                  ok_parts: 0,
                                  rejections: 0,
                                  lumps: 0,
                                  runner: 0,
                                  isssued: 0,
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
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      );
                    })}

                    {/* Total Column */}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#fff5f5',
                        position: 'sticky',
                        right: 100, // Sticky at right, but left of Total (%)
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        padding: '4px',
                      }}
                    >
                      {renderTotalSection(partData)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#fff5f5',
                        position: 'sticky',
                        right: 0, // Rightmost sticky column
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        padding: '4px',
                      }}
                    >
                      {renderTotalPercentageSection(partData)}
                    </TableCell>

                    {/* Edit Column */}
                    {/* <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#fff',
                        position: 'sticky',
                        right: 0,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        width: '60px',
                        minWidth: '60px',
                        maxWidth: '60px'
                      }}
                    >
                      {edit.part_description === partData.part_description ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1
                          }}
                        >
                          <IconButton 
                            onClick={() => setEdit({})}
                            size="small"
                            sx={{
                              color: "#ef4444",
                              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => {
                              // Handle save functionality here
                              console.log('Saving edit:', edit);
                              setEdit({});
                              enqueueSnackbar('Changes saved successfully', { variant: 'success' });
                            }}
                            size="small"
                            sx={{
                              color: "#22c55e",
                              "&:hover": { backgroundColor: "rgba(34, 197, 94, 0.1)" }
                            }}
                          >
                            <MdDone fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton
                          onClick={() => setEdit(partData)}
                          size="small"
                          sx={{ 
                            color: "#f59e0b",
                            "&:hover": { backgroundColor: "rgba(245, 158, 11, 0.1)" }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell> */}
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
            sx={{
              width: 16,
              height: 16,
              backgroundColor: '#e8f5e8',
              border: '1px solid #4caf50',
            }}
          />
          <Typography variant="body2">Data Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
            }}
          />
          <Typography variant="body2">No Data</Typography>
        </Box>
      </Box>

      {/* ---------------------Add New Entry Modal---------------------- */}
      <AddRejection addData={addData} setAddData={setAddData} fetchData={fetchData} />

      {/* ---------------------Update Modal---------------------- */}
      <Dialog
        open={Object.keys(edit).length > 0}
        onClose={() => setEdit({})}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
            Edit Rejection Data
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Read-only fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Part Description"
                  value={edit.part_description || ''}
                  InputProps={{
                    readOnly: true,
                  }}
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
                  label="RM (Raw Material)"
                  value={edit.rm || ''}
                  InputProps={{
                    readOnly: true,
                  }}
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
                  label="Date"
                  value={edit.timestamp ? edit.timestamp.split('T')[0] : ''}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                    },
                  }}
                />
              </Grid>

              {/* Editable fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="OK Parts"
                  type="number"
                  value={edit.ok_parts || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      ok_parts: parseFloat(e.target.value) || 0,
                    }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rejections (kg)"
                  type="number"
                  value={edit.rejections || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      rejections: parseFloat(e.target.value) || 0,
                    }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lumps (kg)"
                  type="number"
                  value={edit.lumps || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      lumps: parseFloat(e.target.value) || 0,
                    }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Runner (kg)"
                  type="number"
                  value={edit.runner || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      runner: parseFloat(e.target.value) || 0,
                    }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issued (kg)"
                  type="number"
                  value={edit.isssued || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      isssued: parseFloat(e.target.value) || 0,
                    }))
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Responsible Person"
                  value={edit.resp_person || ''}
                  onChange={(e) =>
                    setEdit((prev) => ({
                      ...prev,
                      resp_person: e.target.value,
                    }))
                  }
                  variant="outlined"
                />
              </Grid>

              {/* Summary display */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Summary:
                  </Typography>
                  <Typography variant="body2">
                    Total Scrap:{' '}
                    {((edit.rejections || 0) + (edit.lumps || 0) + (edit.runner || 0)).toFixed(2)}{' '}
                    kg
                  </Typography>
                  <Typography sx={{ color: 'grey', fontSize: '0.8rem', mt: '0.2rem' }}>
                    {'(Rejection + Lumps + Runner)'}
                  </Typography>
                </Box>
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

export default Rejection;
