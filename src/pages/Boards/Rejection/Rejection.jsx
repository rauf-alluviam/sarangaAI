import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import colors from '../../../utils/colors';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Rejection = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Generate days array (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Get month name
  const getMonthName = (monthNum) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNum - 1];
  };

  // Process records to organize by part and date
  const processData = (records) => {
    const partMap = new Map();
    
    records.forEach(record => {
      const { part_description, rm, timestamp } = record;
      const date = new Date(timestamp);
      const day = date.getDate();
      
      const partKey = `${part_description}-${rm}`;
      
      if (!partMap.has(partKey)) {
        partMap.set(partKey, {
          part_description,
          rm,
          dailyData: new Map(),
          total: { ok_parts: 0, rejections: 0, lumps: 0, runner: 0, isssued: 0 }
        });
      }
      
      const partData = partMap.get(partKey);
      
      if (!partData.dailyData.has(day)) {
        partData.dailyData.set(day, {
          ok_parts: record.ok_parts || 0,
          rejections: record.rejections || 0,
          lumps: record.lumps || 0,
          runner: record.runner || 0,
          isssued: record.isssued || 0
        });
        
        // Add to totals
        partData.total.ok_parts += record.ok_parts || 0;
        partData.total.rejections += record.rejections || 0;
        partData.total.lumps += record.lumps || 0;
        partData.total.runner += record.runner || 0;
        partData.total.isssued += record.isssued || 0;
      }
    });
    
    return Array.from(partMap.values());
  };

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_API}/api/rejection-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          year: searchParams.year,
          month: searchParams.month
        }
      });
      
      setData(response.data);
      enqueueSnackbar('Data fetched successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Error fetching data', { variant: 'error' });
      
      // Using the sample data you provided for demonstration
      const sampleData = {
        message: "Entries fetched from MongoDB",
        year: 2025,
        month: 7,
        monthly_ok_parts: 354,
        monthly_rejection: 0.5,
        monthly_lumps: 1,
        monthly_runner: 2.3,
        monthly_issued: 0,
        monthly_rej_lump_runner: 3.8,
        records: [
          {
            part_description: "BRACKET-D",
            rm: "PP TF 30% Black",
            ok_parts: null,
            rejections: null,
            lumps: null,
            runner: null,
            isssued: null,
            machine: "120T",
            resp_person: "",
            timestamp: "2025-07-04T06:02:40.790000",
            id: "68676e8026d2ec972f2005c1"
          },
          {
            part_description: "BRACKET-D",
            rm: "PP 30%",
            ok_parts: 354,
            rejections: 0.5,
            lumps: 1,
            runner: 2.3,
            isssued: 1.3,
            resp_person: "SHRIKANT",
            timestamp: "2025-07-04T06:04:30.811000",
            id: "68676f279b22a69a475dc129"
          },
          {
            part_description: "BRACKET-E",
            rm: "PP TF 30% Black",
            ok_parts: null,
            rejections: null,
            lumps: null,
            runner: null,
            isssued: null,
            machine: "120T",
            resp_person: "",
            timestamp: "2025-07-04T06:02:40.840000",
            id: "68676e8026d2ec972f2005c2"
          },
          {
            part_description: "PES COVER-A",
            rm: "PC G BLACK",
            ok_parts: null,
            rejections: null,
            lumps: null,
            runner: null,
            isssued: null,
            machine: "250T",
            resp_person: "",
            timestamp: "2025-07-04T06:02:40.869000",
            id: "68676e8026d2ec972f2005c3"
          }
        ]
      };
      setData(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, [token, searchParams.year, searchParams.month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processedData = data ? processData(data.records) : [];

  const renderPartsSection = (partData, dayData, showStaticText = false) => {
    const parts = ['OK Parts', 'Rejection', 'Lumps', 'Runner', 'Issued'];
    const values = [
      dayData?.ok_parts || '-',
      dayData?.rejections || '-',
      dayData?.lumps || '-',
      dayData?.runner || '-',
      dayData?.isssued || '-'
    ];

    return (
      <Box sx={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {parts.map((part, index) => (
          <Box key={part} sx={{ 
            fontSize: '0.7rem', 
            padding: '3px 6px',
            backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: showStaticText ? 'space-between' : 'center',
            alignItems: 'center',
            minHeight: '20px'
          }}>
            {showStaticText ? (
              <>
                <Typography variant="caption" sx={{ fontWeight: 500, color: '#666', fontSize: '0.65rem' }}>
                  {part}:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                  {values[index]}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                {values[index]}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderTotalSection = (partData) => {
    const parts = ['OK Parts', 'Rejection', 'Lumps', 'Runner', 'Issued'];
    const totals = [
      partData.total.ok_parts || 0,
      partData.total.rejections || 0,
      partData.total.lumps || 0,
      partData.total.runner || 0,
      partData.total.isssued || 0
    ];

    return (
      <Box sx={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {parts.map((part, index) => (
          <Box key={part} sx={{ 
            fontSize: '0.7rem', 
            padding: '3px 6px',
            backgroundColor: index % 2 === 0 ? '#fff5f5' : '#ffebee',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '20px'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: '#666', fontSize: '0.65rem' }}>
              {part}:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#d32f2f' }}>
              {totals[index]}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const calculateTotalKgs = (totalData) => {
    return (totalData.rejections + totalData.lumps + totalData.runner).toFixed(2);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 'bold',
          color: colors.primary,
          borderBottom: `3px solid ${colors.primary}`,
          pb: 2
        }}
      >
        REJECTION MONITORING SHEET
      </Typography>

      {/* Search Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Year"
              type="number"
              value={searchParams.year}
              onChange={(e) => setSearchParams({ ...searchParams, year: Number(e.target.value) })}
              size="small"
              sx={{ width: '120px' }}
            />
            <TextField
              label="Month"
              type="number"
              value={searchParams.month}
              onChange={(e) => setSearchParams({ ...searchParams, month: Number(e.target.value) })}
              size="small"
              inputProps={{ min: 1, max: 12 }}
              sx={{ width: '120px' }}
            />
            <Button
              variant="contained"
              onClick={fetchData}
              disabled={isLoading}
              sx={{ bgcolor: colors.primary }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Fetch Data'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      {data && (
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
      )}

      {/* Main Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={50} />
        </Box>
      ) : processedData.length > 0 ? (
        <Paper sx={{ overflow: 'hidden', border: `1px solid #e0e0e0`, boxShadow: 3 }}>
          <TableContainer sx={{ maxHeight: '70vh', overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {/* Fixed Columns */}
                  <TableCell
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      minWidth: '150px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`
                    }}
                  >
                    Part Description
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 150,
                      zIndex: 3,
                      minWidth: '120px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`
                    }}
                  >
                    RM
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#2c3e50',
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 270,
                      zIndex: 3,
                      minWidth: '100px',
                      borderRight: `1px solid #e0e0e0`,
                      border: `1px solid #e0e0e0`
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
                        backgroundColor: '#f8f9fa',
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        minWidth: '80px',
                        fontSize: '0.875rem',
                        border: `1px solid #e0e0e0`
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
                      right: 0,
                      zIndex: 3,
                      border: `1px solid #e0e0e0`
                    }}
                  >
                    Total (kgs)
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {processedData.map((partData) => (
                  <TableRow key={`${partData.part_description}-${partData.rm}`} hover>
                    {/* Part Description */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
                        border: `1px solid #e0e0e0`
                      }}
                    >
                      {partData.part_description}
                    </TableCell>

                    {/* RM */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 150,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
                        border: `1px solid #e0e0e0`
                      }}
                    >
                      {partData.rm}
                    </TableCell>

                    {/* Parts Column */}
                    <TableCell
                      sx={{
                        backgroundColor: '#fff',
                        position: 'sticky',
                        left: 270,
                        zIndex: 2,
                        borderRight: `1px solid #e0e0e0`,
                        padding: '4px',
                        border: `1px solid #e0e0e0`
                      }}
                    >
                      {renderPartsSection(partData, partData.total, true)}
                    </TableCell>

                    {/* Date Columns */}
                    {days.map((day) => {
                      const dayData = partData.dailyData.get(day);
                      return (
                        <TableCell
                          key={day}
                          sx={{
                            padding: '4px',
                            borderRight: `1px solid #e0e0e0`,
                            backgroundColor: dayData ? '#f0f8f0' : 'white',
                            border: `1px solid #e0e0e0`
                          }}
                        >
                          {dayData ? renderPartsSection(partData, dayData) : '-'}
                        </TableCell>
                      );
                    })}

                    {/* Total Column */}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#fff5f5',
                        position: 'sticky',
                        right: 0,
                        zIndex: 2,
                        border: `1px solid #e0e0e0`,
                        padding: '4px'
                      }}
                    >
                      {renderTotalSection(partData)}
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
      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 4,
        bgcolor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: '#e8f5e8', 
            border: '1px solid #4caf50' 
          }} />
          <Typography variant="body2">Data Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: 'white', 
            border: '1px solid #e0e0e0' 
          }} />
          <Typography variant="body2">No Data</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Rejection;