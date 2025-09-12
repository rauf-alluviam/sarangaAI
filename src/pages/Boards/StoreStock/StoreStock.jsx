import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import colors from '../../../utils/colors';
import { useDispatch, useSelector } from 'react-redux';
import { MdDone } from 'react-icons/md';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddStoreStock from './AddStoreStock';
import { fetchStoreStock, updateStoreStock } from '../../../store/actions/storeStockAction';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from 'react-icons/io5';
import { LuMoveLeft } from 'react-icons/lu';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const StoreStock = () => {
  const { storeStockArr } = useSelector((state) => state.storeStock);
  const { token, userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState({});
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    status: '',
    color: '',
    message: '',
  });
  const [fetched, setFetched] = useState({ p1: false, p2: false, p3: false });

  // Monthly Scheduling Modal States
  const [isMonthlySchedulingOpen, setIsMonthlySchedulingOpen] = useState(false);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [monthlyScheduleData, setMonthlyScheduleData] = useState({
    item_description: '',
    schedule: '',
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear(), // Current year
  });
  console.log(userData.sub);
  // Item descriptions for dropdown (you can modify this list based on your needs)
  const itemDescriptions = [
    'PC GRANITE-BLACK',
    'PP - 30% TF',
    'PC - WHITE',
    'PC - 10% DIFFUSION WHITE(CLEAR)',
    'PP - WHITE',
    'PC',
    'HDPE',

    // Add more item descriptions as needed
  ];

  // Function to refresh store stock data
  const refreshStoreStock = () => {
    const [year, month, day] = date.split('-');
    dispatch(fetchStoreStock(year, month, day, token));
  };

  useEffect(() => {
    refreshStoreStock();
  }, [date, isOpen, dispatch, token]);

  // Validation function for location fields
  const validateAllLocationFields = (locationObj) => {
    const validateLocationField = (value) => {
      if (!value) return { isValid: true, error: '' };

      const trimmedValue = value.trim();

      if (value !== trimmedValue || value.includes(' ')) {
        return { isValid: false, error: 'No spaces allowed' };
      }

      if (!/^[a-zA-Z0-9.]*$/.test(value)) {
        return { isValid: false, error: 'No special characters allowed' };
      }

      if (value.length > 10) {
        return { isValid: false, error: 'Maximum 10 characters allowed' };
      }

      const isStartsWithNumber = /^[0-9]/.test(value);
      if (isStartsWithNumber) {
        const isNumeric = /^[0-9.]+$/.test(value);
        if (isNumeric) {
          const numericPart = value.replace(/\./g, '');
          if (numericPart.length > 7) {
            return { isValid: false, error: 'Max 7 numeric digits allowed' };
          }
          const decimalCount = (value.match(/\./g) || []).length;
          if (decimalCount > 1) {
            return { isValid: false, error: 'Only one decimal point allowed' };
          }
          return { isValid: true, error: '' };
        }
        return { isValid: false, error: 'If starting with number, use numbers only' };
      }

      const isStartsWithLetter = /^[a-zA-Z]/.test(value);
      if (isStartsWithLetter) {
        const isOnlyLetters = /^[a-zA-Z]+$/.test(value);
        if (isOnlyLetters) {
          if (value.length > 3) {
            return { isValid: false, error: 'Max 3 letters allowed' };
          }
          return { isValid: true, error: '' };
        }

        const alphanumericMatch = value.match(/^([a-zA-Z]+)([0-9.]+)$/);
        if (alphanumericMatch) {
          const [, letters, numbers] = alphanumericMatch;

          if (letters.length > 3) {
            return { isValid: false, error: 'Max 3 letters allowed' };
          }

          const numericPart = numbers.replace(/\./g, '');
          if (numericPart.length > 7) {
            return { isValid: false, error: 'Max 7 numeric digits allowed' };
          }

          const decimalCount = (numbers.match(/\./g) || []).length;
          if (decimalCount > 1) {
            return { isValid: false, error: 'Only one decimal point allowed' };
          }

          return { isValid: true, error: '' };
        }

        return { isValid: false, error: 'Format: letters + numbers (e.g., A123, AB12.34)' };
      }

      return { isValid: false, error: 'Start with letters or numbers only' };
    };

    const results = {};
    ['p1', 'p2', 'p3'].forEach((key) => {
      const value = locationObj[key] || '';
      results[key] = validateLocationField(value);
    });

    return results;
  };

  const handleSubmit = async () => {
    if (edit.location) {
      const validationResults = validateAllLocationFields(edit.location);
      const hasValidationErrors = Object.values(validationResults).some(
        (result) => !result.isValid
      );

      if (hasValidationErrors) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fix the location field errors before saving.',
          timer: 3000,
          showConfirmButton: true,
        });
        return;
      }
    }

    const currentStock = Number(edit.current) || 0;
    let status = '';
    let color = '';
    let message = '';

    if (currentStock < 200) {
      status = 'Critical';
      color = 'red';
      message = 'Current stock is below 200 - Critical level!';
    } else if (currentStock >= 200 && currentStock <= 400) {
      status = 'Alert';
      color = 'orange';
      message = 'Current stock is between 200-400 - Alert level!';
    } else if (currentStock > 400) {
      status = 'Sufficient';
      color = 'green';
      message = 'Current stock is above 400 - Sufficient level!';
    }

    setUpdateStatus({ status, color, message });
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = () => {
    if (edit.location) {
      const validationResults = validateAllLocationFields(edit.location);
      const hasValidationErrors = Object.values(validationResults).some(
        (result) => !result.isValid
      );

      if (hasValidationErrors) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Cannot save data with invalid location fields.',
          timer: 3000,
          showConfirmButton: true,
        });
        setUpdateDialogOpen(false);
        return;
      }
    }

    dispatch(
      updateStoreStock(
        edit,
        token,
        date,
        (successMessage) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: successMessage,
            timer: 2000,
            showConfirmButton: false,
          });
          setEdit({});
          setUpdateDialogOpen(false);
          setFetched({ p1: false, p2: false, p3: false });
        },
        (errorMessage) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            timer: 2000,
            showConfirmButton: false,
          });
          setUpdateDialogOpen(false);
        }
      )
    );
  };

  // Monthly Scheduling Functions
  const handleMonthlySchedulingSubmit = async (e) => {
    e.preventDefault();

    if (!monthlyScheduleData.item_description || !monthlyScheduleData.schedule) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }

    setIsSubmittingSchedule(true);

    try {
      const payload = {
        month: monthlyScheduleData.month.toString(),
        year: monthlyScheduleData.year.toString(),
        item_description: monthlyScheduleData.item_description,
        schedule: Number(monthlyScheduleData.schedule),
      };

      const response = await axios.post(
        `${BACKEND_API}/set_monthly_schedule_quantity_in_store_stock`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response?.data?.message || 'Monthly schedule updated successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      setIsMonthlySchedulingOpen(false);
      setMonthlyScheduleData({
        item_description: '',
        schedule: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      // **IMMEDIATELY REFRESH STORE STOCK DATA AFTER SUCCESS**
      const [year, month, day] = date.split('-');
      dispatch(fetchStoreStock(year, month, day, token));
    } catch (error) {
      console.error('Error updating monthly schedule:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update monthly schedule',
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '88vh',
          position: 'relative',
          padding: '1rem',
        }}
      >
        {/* Top Bar */}
        <Typography
          sx={{
            fontSize: '2rem',
            textAlign: 'center',
            width: '100%',
            mr: 'auto',
            marginBottom: '2rem',
            padding: '1rem 0rem',
            bgcolor: 'white',
            borderRadius: '12px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          STORE STOCK MONITORING BOARD
        </Typography>

        <Box display={'flex'} justifyContent={'space-between'} mb={'1rem'}>
          {/* Responsible Person Section */}
          <Box
            display={'flex'}
            alignItems={'center'}
            border={'1px solid #ddd'}
            borderRadius={'4px'}
            p={1}
          >
            <IoPersonSharp
              style={{ color: '#282828', fontSize: '1.5rem', marginRight: '0.5rem' }}
            />
            <Typography>Responsible Person-</Typography>
            {storeStockArr.length > 0 ? (
              edit._id === storeStockArr[0]._id ? (
                <>
                  <TextField
                    type="text"
                    defaultValue={storeStockArr[0]?.resp_person}
                    onChange={(e) => setEdit({ ...edit, resp_person: e.target.value })}
                    sx={{ width: '7rem', ml: 1 }}
                    size="small"
                  />
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    <IconButton onClick={() => setEdit({})}>
                      <CloseIcon style={{ color: '#CC7C7C' }} />
                    </IconButton>
                    <IconButton onClick={handleSubmit} style={{ color: 'green' }}>
                      <MdDone />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#FFCDD2',
                    height: '2rem',
                    borderRadius: '4px',
                    padding: '0 0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.5rem',
                    color: '#282828',
                    boxShadow: 'rgba(0, 0, 0, 0.17) 0px 3px 8px',
                  }}
                >
                  {storeStockArr[0]?.resp_person || 'Not mentioned'}
                </Box>
              )
            ) : (
              <Typography sx={{ ml: 1, color: '#888', fontStyle: 'italic' }}>
                No data available
              </Typography>
            )}

            {storeStockArr.length > 0 && edit._id !== storeStockArr[0]?._id && (
              <IconButton
                onClick={() => setEdit(storeStockArr[0])}
                style={{ color: 'grey', marginLeft: '0.5rem' }}
              >
                <EditIcon style={{ color: 'rgb(201, 162, 56)' }} />
              </IconButton>
            )}
          </Box>

          {/* Action Buttons */}
          <Box display={'flex'} gap={1}>
            {userData.sub === 'ajith@rabs.co.in' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsMonthlySchedulingOpen(true)}
                sx={{
                  bgcolor: colors.secondary,
                  '&:hover': {
                    bgcolor: colors.secondary,
                    opacity: 0.9,
                  },
                }}
              >
                Monthly Scheduling
              </Button>
            )}

            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary }}
              onClick={() => navigate('/monthly-store-stock')}
            >
              Monthly Sheet
            </Button>

            <TextField
              size="small"
              label="Select Date"
              sx={{ width: '15rem' }}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </Box>

        {/* Main Table */}
        <Box
          position={'relative'}
          mr={'1rem'}
          p={'0.7rem'}
          borderRadius={'6px'}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          sx={{
            minHeight: '64vh',
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
          <Paper sx={{ maxHeight: '100%', overflow: 'hidden', mr: 'auto', width: '100%' }}>
            <TableContainer
              sx={{
                maxHeight: '60vh',
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
              <Table stickyHeader aria-label="sticky table" border={1}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#f5f5f5 !important',
                      borderBottom: '1px solid #ddd',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <TableCell rowSpan={2} colSpan={1}>
                      Sr No
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Item Description
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Minimum
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Maximum
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Current Stock
                    </TableCell>
                    <TableCell align="center" rowSpan={1} colSpan={3}>
                      <Typography fontWeight="bold">Location</Typography>
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Status
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Schedule
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Actual
                    </TableCell>
                    <TableCell align="center" rowSpan={2} colSpan={1}>
                      Edit
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      bgcolor: '#f5f5f5 !important',
                      borderBottom: '1px solid #ddd',
                      position: 'sticky',
                      top: 56,
                      zIndex: 2,
                    }}
                  >
                    <TableCell
                      align="center"
                      colSpan={1}
                      sx={{
                        position: 'sticky',
                        top: 56,
                        zIndex: 2,
                        bgcolor: '#f5f5f5 !important',
                        fontWeight: 'bold',
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                      }}
                    >
                      Use me First <br />
                      <b>P1</b>
                    </TableCell>
                    <TableCell
                      align="center"
                      colSpan={1}
                      sx={{
                        position: 'sticky',
                        top: 56,
                        zIndex: 2,
                        bgcolor: '#f5f5f5 !important',
                        fontWeight: 'bold',
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                      }}
                    >
                      <LuMoveLeft style={{ fontSize: '1.3rem' }} />
                      <br />
                      <b>P2</b>
                    </TableCell>
                    <TableCell
                      align="center"
                      colSpan={1}
                      sx={{
                        position: 'sticky',
                        top: 56,
                        zIndex: 2,
                        bgcolor: '#f5f5f5 !important',
                        fontWeight: 'bold',
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                      }}
                    >
                      <LuMoveLeft style={{ fontSize: '1.3rem' }} />
                      <br />
                      <b>P3</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {storeStockArr.length > 0 ? (
                    storeStockArr.map((elem, index) => (
                      <TableRow key={elem.id || index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell sx={{ width: '20rem', maxWidth: '20rem' }} align="center">
                          {elem.item_description}
                        </TableCell>
                        <TableCell sx={{ width: '6rem' }} align="center">
                          {elem.minimum}
                        </TableCell>
                        <TableCell sx={{ width: '6rem' }} align="center">
                          {elem.maximum}
                        </TableCell>
                        <TableCell sx={{ width: '6rem' }} align="center">
                          {elem.current}
                        </TableCell>

                        {/* Location cells - keeping original complex logic */}
                        {edit._id == elem._id ? (
                          (() => {
                            let locObj;
                            if (typeof elem.location === 'object' && elem.location !== null) {
                              locObj = edit.location || elem.location;
                            } else {
                              locObj = edit.location || { p1: elem.location || '', p2: '', p3: '' };
                            }

                            const isFilled = (val) => val && val.trim() !== '';

                            const validateLocationField = (value) => {
                              if (!value) return { isValid: true, error: '' };
                              // Using the same validation logic as before
                              const trimmedValue = value.trim();
                              if (value !== trimmedValue || value.includes(' ')) {
                                return { isValid: false, error: 'No spaces allowed' };
                              }
                              if (!/^[a-zA-Z0-9.]*$/.test(value)) {
                                return { isValid: false, error: 'No special characters allowed' };
                              }
                              if (value.length > 10) {
                                return { isValid: false, error: 'Maximum 10 characters allowed' };
                              }
                              return { isValid: true, error: '' };
                            };

                            const handleLocationChange = (key, value) => {
                              const trimmedValue = value.trim();
                              let restrictedValue = trimmedValue;

                              if (/^[0-9]/.test(trimmedValue)) {
                                const isNumeric = /^[0-9.]+$/.test(trimmedValue);
                                if (isNumeric) {
                                  const numericPart = trimmedValue.replace(/\./g, '');
                                  if (numericPart.length > 7) {
                                    return;
                                  }
                                }
                              }

                              if (/^[a-zA-Z]/.test(trimmedValue) && trimmedValue.length > 10) {
                                return;
                              }

                              if (trimmedValue.length > 10) {
                                return;
                              }

                              setEdit((prev) => ({
                                ...prev,
                                location: {
                                  ...locObj,
                                  [key]: restrictedValue,
                                },
                              }));

                              const validation = validateLocationField(restrictedValue);
                              if (validation.isValid && isFilled(restrictedValue)) {
                                if (key === 'p1' && !fetched.p1) {
                                  setFetched((prev) => ({ ...prev, p1: true }));
                                  refreshStoreStock();
                                }
                                if (key === 'p2' && !fetched.p2) {
                                  setFetched((prev) => ({ ...prev, p2: true }));
                                  refreshStoreStock();
                                }
                              }
                            };

                            return ['p1', 'p2', 'p3'].map((key) => {
                              const val = locObj[key] || '';
                              const validation = validateLocationField(val);

                              let disabled = false;
                              if (key === 'p2' && !isFilled(locObj.p1)) disabled = true;
                              if (key === 'p3' && !isFilled(locObj.p2)) disabled = true;

                              return (
                                <TableCell align="center" key={key}>
                                  <Box>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={val}
                                      onChange={(e) => handleLocationChange(key, e.target.value)}
                                      sx={{
                                        background: '#fff',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                          '& fieldset': {
                                            borderColor:
                                              !validation.isValid && val ? '#d32f2f' : undefined,
                                          },
                                        },
                                      }}
                                      placeholder={key.toUpperCase()}
                                      disabled={disabled}
                                      error={!validation.isValid && val !== ''}
                                    />
                                    {!validation.isValid && val && (
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{
                                          display: 'block',
                                          mt: 0.5,
                                          fontSize: '0.70rem',
                                          lineHeight: 1.2,
                                          textAlign: 'left',
                                        }}
                                      >
                                        {validation.error}
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                              );
                            });
                          })()
                        ) : typeof elem.location === 'object' && elem.location !== null ? (
                          ['p1', 'p2', 'p3'].map((key) => {
                            const val = elem.location[key] || '';
                            const match =
                              typeof val === 'string'
                                ? val.match(/^([a-zA-Z]+)\s*([\d.]+)$/)
                                : null;

                            return (
                              <TableCell align="center" key={key}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  sx={{
                                    border: '2px solid #1976d2',
                                    borderRadius: 2,
                                    padding: '8px 16px',
                                    minWidth: 60,
                                    background: '#f5faff',
                                  }}
                                >
                                  {match ? (
                                    <>
                                      <Typography fontWeight="bold" color="#1976d2" mr={1}>
                                        {match[1]}
                                      </Typography>
                                      <Box
                                        sx={{ borderLeft: '2px solid #1976d2', height: 24, mx: 1 }}
                                      />
                                      <Typography fontWeight="bold" color="#388e3c">
                                        {match[2]}
                                      </Typography>
                                    </>
                                  ) : (
                                    <Typography fontWeight="bold">{val}</Typography>
                                  )}
                                </Box>
                              </TableCell>
                            );
                          })
                        ) : (
                          <TableCell align="center" colSpan={3}>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                border: '2px solid #1976d2',
                                borderRadius: 2,
                                padding: '8px 16px',
                                minWidth: 120,
                                background: '#f5faff',
                              }}
                            >
                              <Typography fontWeight="bold">{elem.location || ''}</Typography>
                            </Box>
                          </TableCell>
                        )}

                        {/* Status column */}
                        <TableCell sx={{ width: '7rem', padding: 0 }} align="center">
                          {Number(elem.current) < elem.minimum && (
                            <Box
                              width={'25px'}
                              height={'25px'}
                              bgcolor={'red'}
                              borderRadius={'50%'}
                              margin={'auto'}
                            />
                          )}
                          {Number(elem.current) >= elem.minimum && Number(elem.current) < 400 && (
                            <Box
                              width={'25px'}
                              height={'25px'}
                              bgcolor={'orange'}
                              borderRadius={'50%'}
                              margin={'auto'}
                            />
                          )}
                          {Number(elem.current) >= 400 && (
                            <Box
                              width={'25px'}
                              height={'25px'}
                              bgcolor={'green'}
                              borderRadius={'50%'}
                              margin={'auto'}
                            />
                          )}
                        </TableCell>

                        {/* Schedule column */}
                        <TableCell sx={{ width: '9rem' }} align="center">
                          {edit._id === elem._id ? (
                            <TextField
                              fullWidth
                              type="text"
                              defaultValue={elem.plan}
                              onChange={(e) => setEdit({ ...edit, plan: e.target.value })}
                              sx={{ width: '100%' }}
                              size="small"
                            />
                          ) : (
                            elem.plan
                          )}
                        </TableCell>

                        {/* Actual column */}
                        <TableCell sx={{ width: '14rem' }} align="center">
                          {edit._id === elem._id ? (
                            <TextField
                              fullWidth
                              type="text"
                              defaultValue={elem.actual}
                              onChange={(e) => setEdit({ ...edit, actual: e.target.value })}
                              sx={{ width: '100%' }}
                              size="small"
                            />
                          ) : (
                            elem.actual
                          )}
                        </TableCell>

                        {/* Edit column */}
                        <TableCell sx={{ width: '6rem' }} align="center">
                          {edit._id === elem._id ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton onClick={() => setEdit({})}>
                                <CloseIcon style={{ color: 'red' }} />
                              </IconButton>
                              <IconButton onClick={handleSubmit} style={{ color: 'green' }}>
                                <MdDone />
                              </IconButton>
                            </Box>
                          ) : (
                            <IconButton onClick={() => setEdit(elem)}>
                              <EditIcon style={{ color: 'rgb(201, 162, 56)' }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} align="center">
                        <Typography p={'1rem'}>No Result found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Footer */}
        <Table sx={{ width: '100%', bgcolor: 'rgba(0, 55, 173, 0.04)', mt: 'auto' }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: '1px solid rgba(1, 27, 83, 0.55)' }}>
                <Box display={'flex'} flexDirection={'column'}>
                  <Typography fontSize={'1.1rem'}>Days Require For Purchase Materials</Typography>
                  <Box
                    width={'100%'}
                    fontSize={'1.1rem'}
                    display={'flex'}
                    justifyContent={'space-between'}
                  >
                    <span>Local : Min- 1</span> <span>Max- 10</span>
                  </Box>
                  <Box
                    width={'100%'}
                    fontSize={'1.1rem'}
                    display={'flex'}
                    justifyContent={'space-between'}
                  >
                    <span>Import : Min- 0</span> <span>Max- 0</span>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ border: '1px solid rgba(1, 27, 83, 0.55)' }}>
                <Box display={'flex'} alignItems={'center'}>
                  <Box bgcolor={'red'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box>
                  <Typography fontSize={'1.1rem'}>Critical ({'<'}MIN)</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ border: '1px solid rgba(1, 27, 83, 0.55)' }}>
                <Box display={'flex'} alignItems={'center'}>
                  <Box bgcolor={'orange'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box>
                  <Typography fontSize={'1.1rem'}>Normal (200 To 400)</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ border: '1px solid rgba(1, 27, 83, 0.55)' }}>
                <Box display={'flex'} alignItems={'center'}>
                  <Box bgcolor={'green'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box>
                  <Typography fontSize={'1.1rem'}>Ok ({'≥'}400)</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Add Stock Modal */}
      {isOpen && (
        <Box
          bgcolor={'rgba(0, 0, 0, 0.6)'}
          position={'fixed'}
          top={0}
          left={0}
          height={'100vh'}
          width={'100vw'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          zIndex={9}
          onClick={() => setIsOpen(false)}
        >
          <AddStoreStock setIsOpen={setIsOpen} />
        </Box>
      )}

      {/* Monthly Scheduling Dialog */}
      <Dialog
        open={isMonthlySchedulingOpen}
        onClose={() => !isSubmittingSchedule && setIsMonthlySchedulingOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography fontSize="1.8rem" fontWeight="bold">
            Set Monthly Schedule
          </Typography>
        </DialogTitle>
        <form onSubmit={handleMonthlySchedulingSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                fullWidth
                label="Item Description *"
                select
                value={monthlyScheduleData.item_description}
                onChange={(e) =>
                  setMonthlyScheduleData({
                    ...monthlyScheduleData,
                    item_description: e.target.value,
                  })
                }
                required
              >
                {itemDescriptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              <Box display="flex" gap={2}>
                <TextField
                  label="Month"
                  type="number"
                  value={monthlyScheduleData.month}
                  onChange={(e) =>
                    setMonthlyScheduleData({
                      ...monthlyScheduleData,
                      month: Number(e.target.value),
                    })
                  }
                  inputProps={{ min: 1, max: 12 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Year"
                  type="number"
                  value={monthlyScheduleData.year}
                  onChange={(e) =>
                    setMonthlyScheduleData({
                      ...monthlyScheduleData,
                      year: Number(e.target.value),
                    })
                  }
                  inputProps={{ min: 2020, max: 2030 }}
                  sx={{ flex: 1 }}
                />
              </Box>

              <TextField
                fullWidth
                label="Schedule Quantity *"
                type="number"
                value={monthlyScheduleData.schedule}
                onChange={(e) =>
                  setMonthlyScheduleData({
                    ...monthlyScheduleData,
                    schedule: e.target.value,
                  })
                }
                inputProps={{ min: 1 }}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsMonthlySchedulingOpen(false);
                setMonthlyScheduleData({
                  item_description: '',
                  schedule: '',
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                });
              }}
              disabled={isSubmittingSchedule}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmittingSchedule}
              sx={{
                bgcolor: colors.primary,
                '&:hover': {
                  bgcolor: colors.buttonHover || colors.primary,
                },
              }}
              startIcon={
                isSubmittingSchedule ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {isSubmittingSchedule ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Status Dialog */}
      {updateDialogOpen && (
        <Box
          bgcolor={'rgba(0, 0, 0, 0.6)'}
          position={'fixed'}
          top={0}
          left={0}
          height={'100vh'}
          width={'100vw'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          zIndex={10}
          onClick={() => setUpdateDialogOpen(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            height={'auto'}
            borderRadius={'8px'}
            width={'33rem'}
            bgcolor={'white'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            p={'2rem'}
          >
            <Typography fontSize={'1.5rem'} textAlign={'center'} mb={2}>
              Stock Status Update
            </Typography>

            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mb={2}>
              <Box
                width={'25px'}
                height={'25px'}
                bgcolor={updateStatus.color}
                borderRadius={'50%'}
                mr={1}
              />
              <Typography fontSize={'1.2rem'} fontWeight={'bold'}>
                {updateStatus.status}
              </Typography>
            </Box>

            <Typography fontSize={'1rem'} textAlign={'center'} color={'textSecondary'} mb={3}>
              {updateStatus.message}
            </Typography>

            <Typography fontSize={'0.9rem'} textAlign={'center'} mb={3}>
              Current Stock: <strong>{edit.current || 0}</strong>
            </Typography>

            <Box display="flex" gap={2} width="100%">
              <Button
                variant="outlined"
                onClick={() => {
                  setUpdateDialogOpen(false);
                  setEdit({});
                }}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={confirmUpdate}
                sx={{
                  bgcolor: colors.primary,
                  flex: 1,
                  '&:hover': {
                    bgcolor: colors.buttonHover || colors.primary,
                  },
                }}
              >
                Confirm Update
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default StoreStock;
