import React, { useState } from 'react';
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
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import colors from '../../../utils/colors';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const MonthlyFgStock = () => {
  const [searchParams, setSearchParams] = useState({
    item_description: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1 // Current month (1-12)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState(null);
  console.log(monthlyData)
  const [hasSearched, setHasSearched] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Predefined item description options
  const itemDescriptionOptions = [
    'ALTROZ BRACKET-D RH',
    'ALTROZ BRACKET-D LH',
    'ALTROZ BRACKET-E LH',
    'ALTROZ BRACKET-E RH',
    'ALTROZ PES COVER A RH',
    'ALTROZ PES COVER A LH',
    'ALTROZ PES COVER B RH',
    'ALTROZ PES COVER B LH',
    'ALTROZ SHADE A MG RH',
    'ALTROZ SHADE A MG LH',
    'ALTROZ INNER LENS A RH',
    'ALTROZ INNER LENS A LH',
    'ALTROZ BACK COVER A RH',
    'ALTROZ BACK COVER A LH',
    'ALTROZ BACK COVER B RH',
    'ALTROZ BACK COVER B LH'
  ];

  // Generate days array (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Function to get daily data for specific month and day
  const getDailyData = (monthIndex, day) => {
    if (!monthlyData || !monthlyData.daily_records) return { schedule: '-', dispatched: '-' };
    
    // Check if this is the month we have data for (monthIndex is 0-based, monthlyData.month is 1-based)
    const dataMonth = monthlyData.month - 1; // Convert to 0-based
    if (monthIndex !== dataMonth) {
      return { schedule: '-', dispatched: '-' }; // No data for other months
    }
    
    const dateStr = `${monthlyData.year}-${monthlyData.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dailyRecord = monthlyData.daily_records.find(record => record.date === dateStr);
    return dailyRecord || { schedule: '-', dispatched: '-' };
  };

  // Function to get days in month
  const getDaysInMonth = (monthIndex) => {
    if (!monthlyData) return 31;
    return new Date(searchParams.year, monthIndex + 1, 0).getDate();
  };

  // Function to get monthly totals for specific month
  const getMonthlyTotals = (monthIndex) => {
    if (!monthlyData) return { schedule: 0, dispatched: 0 };
    
    // Check if this is the month we have data for
    const dataMonth = monthlyData.month - 1; // Convert to 0-based
    if (monthIndex !== dataMonth) {
      return { schedule: 0, dispatched: 0 }; // No totals for other months
    }
    
    return {
      schedule: monthlyData.monthly_schedule || 0,
      dispatched: monthlyData.monthly_dispatched || 0
    };
  };

  // Submit search request to backend
  const handleSubmit = async () => {
    if (!searchParams.item_description.trim()) {
      enqueueSnackbar('Please enter item description', { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        // `${BACKEND_API}/get_fgstock_summary_by_item_description_and_month?item_description`,
        `${BACKEND_API}/get_fgstock_summary_by_item_description_and_month`,
        {
          params: {
            item_description: searchParams.item_description,
            year: searchParams.year,
            month: searchParams.month
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setMonthlyData(response.data);
      setHasSearched(true);
      enqueueSnackbar('Data loaded successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch data', { variant: 'error' });
      setMonthlyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '1rem' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        bgcolor: 'white',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
      }}>
        <IconButton
          onClick={() => navigate('/fg-stock')}
          sx={{
            color: colors.primary,
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h4" sx={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          MONTHLY FG STOCK REPORT
        </Typography>
        
        <Box sx={{ width: '48px' }}></Box> {/* Spacer to center the title */}
      </Box>

      {/* Search Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        mb: 3,
        bgcolor: 'white',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Search
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Item Description"
            value={searchParams.item_description}
            onChange={(e) => setSearchParams({ ...searchParams, item_description: e.target.value })}
            size="small"
            sx={{ flex: 1 }}
            select
          >
            {itemDescriptionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
            select
            value={searchParams.month}
            onChange={(e) => setSearchParams({ ...searchParams, month: Number(e.target.value) })}
            size="small"
            sx={{ width: '120px' }}
          >
            {months.map((month, index) => (
              <MenuItem key={month} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            sx={{ bgcolor: colors.primary }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>
        
        {/* Alert for no data found */}
        {hasSearched && monthlyData && monthlyData.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No data found for the given criteria.
          </Alert>
        )}
      </Box>

      {/* Monthly Table */}
      {monthlyData && (
        <Paper sx={{ width: '100%', overflow: 'hidden', border: '2px solid #333' }}>
          <TableContainer sx={{ maxHeight: '80vh', overflowX: 'auto' }}>
            <Table stickyHeader aria-label="monthly fg stock table" >
              {/* Table Header */}
              <TableHead>
                {/* Main Header Row */}
                <TableRow>
                  {/* Day Column */}
                  <TableCell 
                    rowSpan={2}
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      minWidth: '60px',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      border: '1px solid #333',
                      textAlign: 'center'
                    }}
                  >
                    Day
                  </TableCell>
                  
                  {/* Month Columns */}
                  {months.map((month, index) => (
                    <TableCell
                      key={month}
                      colSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        minWidth: '140px',
                        padding: '12px',
                        border: '2px solid #333'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {month} {searchParams.year}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Sub Header Row */}
                <TableRow>
                  {months.map((month, index) => (
                    <React.Fragment key={`${month}-subheader`}>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          minWidth: '70px',
                          padding: '8px',
                          border: '1px solid #333',
                          color: '#1976d2'
                        }}
                      >
                        Schedule
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: '#ffebee',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          minWidth: '70px',
                          padding: '8px',
                          border: '1px solid #333',
                          color: '#d32f2f'
                        }}
                      >
                        Dispatched
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day} hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    {/* Day Cell */}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#fafafa',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        border: '1px solid #333',
                        textAlign: 'center',
                        minWidth: '60px'
                      }}
                    >
                      {day}
                    </TableCell>
                    
                    {/* Monthly Data Cells */}
                    {months.map((month, monthIndex) => {
                      const daysInMonth = getDaysInMonth(monthIndex);
                      const isValidDay = day <= daysInMonth;
                      const dailyData = isValidDay ? getDailyData(monthIndex, day) : { schedule: '', dispatched: '' };
                      
                      return (
                        <React.Fragment key={`${month}-${day}`}>
                          {/* Schedule Cell */}
                          <TableCell
                            align="center"
                            sx={{
                              padding: '8px',
                              backgroundColor: !isValidDay ? '#f0f0f0' : '#fafafa',
                              border: '1px solid #ddd',
                              minWidth: '70px'
                            }}
                          >
                            {isValidDay ? (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#1976d2',
                                  fontWeight: dailyData.schedule !== '-' ? 'bold' : 'normal',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {dailyData.schedule}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                          
                          {/* Dispatched Cell */}
                          <TableCell
                            align="center"
                            sx={{
                              padding: '8px',
                              backgroundColor: !isValidDay ? '#f0f0f0' : '#fafafa',
                              border: '1px solid #ddd',
                              minWidth: '70px'
                            }}
                          >
                            {isValidDay ? (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#d32f2f',
                                  fontWeight: dailyData.dispatched !== '-' ? 'bold' : 'normal',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {dailyData.dispatched}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))}
                
                {/* Monthly Totals Row */}
                <TableRow sx={{ backgroundColor: '#e8f5e8', borderTop: '3px solid #333' }}>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#c8e6c9',
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      border: '2px solid #333',
                      textAlign: 'center',
                      fontSize: '1rem'
                    }}
                  >
                    TOTAL
                  </TableCell>
                  
                  {months.map((month, monthIndex) => (
                    <React.Fragment key={`total-${month}`}>
                      {/* Schedule Total */}
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          fontWeight: 'bold',
                          border: '1px solid #333',
                          color: '#1976d2',
                          fontSize: '1rem'
                        }}
                      >
                        {getMonthlyTotals(monthIndex).schedule}
                      </TableCell>
                      
                      {/* Dispatched Total */}
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: '#ffebee',
                          fontWeight: 'bold',
                          border: '1px solid #333',
                          color: '#d32f2f',
                          fontSize: '1rem'
                        }}
                      >
                        {getMonthlyTotals(monthIndex).dispatched}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Legend */}
      <Box sx={{ 
        mt: 2, 
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
            backgroundColor: '#1976d2', 
            borderRadius: '50%' 
          }} />
          <Typography variant="body2">Schedule</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: '#d32f2f', 
            borderRadius: '50%' 
          }} />
          <Typography variant="body2">Dispatched</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MonthlyFgStock;