import {
  Box,
  Button,
  IconButton,
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

const StoreStock = () => {
  const { storeStockArr } = useSelector((state) => state.storeStock);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);
  const [edit, setEdit] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    status: '',
    color: '',
    message: '',
  });
  // Track if GET request is already triggered for each field (P1, P2, P3)
  const [fetched, setFetched] = useState({ p1: false, p2: false, p3: false });

  // Function to refresh store stock data
  const refreshStoreStock = () => {
    const [year, month, day] = date.split('-');
    dispatch(fetchStoreStock(year, month, day, token));
  };

  useEffect(() => {
    refreshStoreStock();
  }, [date, isOpen, dispatch, token]);

  const handleSubmit = async () => {
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
          // Refresh data after successful update
          // refreshStoreStock();
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

          <Box display={'flex'}>
            <Button
              variant="contained"
              sx={{ mr: '0.8rem', bgcolor: colors.primary }}
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

                        {/* Location cells */}
                        {edit._id == elem._id ? (
                          (() => {
                            let locObj;
                            if (typeof elem.location === 'object' && elem.location !== null) {
                              locObj = edit.location || elem.location;
                            } else {
                              locObj = edit.location || { p1: elem.location || '', p2: '', p3: '' };
                            }
                            // Helper to check if a field is filled
                            const isFilled = (val) => val && val.trim() !== '';

                            // Handler for onChange with GET request trigger
                            const handleLocationChange = (key, value) => {
                              setEdit((prev) => ({
                                ...prev,
                                location: {
                                  ...locObj,
                                  [key]: value,
                                },
                              }));
                              // Only trigger GET if just filled and not already fetched
                              if (key === 'p1' && isFilled(value) && !fetched.p1) {
                                setFetched((prev) => ({ ...prev, p1: true }));
                                refreshStoreStock();
                              }
                              if (key === 'p2' && isFilled(value) && !fetched.p2) {
                                setFetched((prev) => ({ ...prev, p2: true }));
                                refreshStoreStock();
                              }
                            };

                            return ['p1', 'p2', 'p3'].map((key) => {
                              const val = locObj[key] || '';
                              // Disable logic: P2 disabled if P1 not filled, P3 disabled if P2 not filled
                              let disabled = false;
                              if (key === 'p2' && !isFilled(locObj.p1)) disabled = true;
                              if (key === 'p3' && !isFilled(locObj.p2)) disabled = true;
                              return (
                                <TableCell align="center" key={key}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={val}
                                    onChange={(e) => handleLocationChange(key, e.target.value)}
                                    sx={{ background: '#fff', borderRadius: 1 }}
                                    placeholder={key.toUpperCase()}
                                    disabled={disabled}
                                  />
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

                        {/* Status column moved after Location columns */}
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
                          {elem.actual}
                        </TableCell>
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
