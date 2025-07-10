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
// import AddStock from "./AddStock";
import { useDispatch, useSelector } from 'react-redux';
import { MdDone, MdOutlineCancel, MdOutlineEdit } from 'react-icons/md';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddStoreStock from './AddStoreStock';
import { fetchStoreStock, updateStoreStock } from '../../../store/actions/storeStockAction';
import Swal from 'sweetalert2';
import { IoPersonSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const StoreStock = () => {
  const { storeStockArr } = useSelector((state) => state.storeStock);
  console.log(storeStockArr);

  // Use date instead of week
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);

  console.log(date);
  const [edit, setEdit] = useState({});
  console.log(edit);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    status: '',
    color: '',
    message: '',
  });

  // let stock= [
  //   {
  //     "item_description": "ALTROZ BRACKET-D RH",
  //     "item_code": "10077-7R05S",
  //     "minimum": 200,
  //     "maximum": 2500,
  //     "current": 814,
  //     "schedule": 5760,
  //     "dispatched": 1560,
  //     "balance": 4200,
  //     "next_action": "20-05-25",
  //     "resp": "Shrikant",
  //     "target": 320,
  //     "timestamp": "2025-05-20T10:16:37.249000"
  //   },
  //   {
  //     "item_description": "ABgdhfC",
  //     "item_code": "456fgdf3",
  //     "minimum": 20,
  //     "maximum": 40,
  //     "current": 300,
  //     "schedule": 600,
  //     "dispatched": 340,
  //     "balance": 650,
  //     "next_action": "45-6543",
  //     "resp": "AMOL",
  //     "target": 564,
  //     "timestamp": "2025-05-20T10:17:06.791000"
  //   },
  //   {
  //     "item_description": "ABgdajdasgcsajkdsdhvdiohfC",
  //     "item_code": "456fgdf3",
  //     "minimum": 20,
  //     "maximum": 40,
  //     "current": 300,
  //     "schedule": 600,
  //     "dispatched": 340,
  //     "balance": 650,
  //     "next_action": "45-6543",
  //     "resp": "AMOL",
  //     "target": 564,
  //     "timestamp": "2025-05-20T10:17:59.528000"
  //   },
  //   {
  //     "item_description": "DATA",
  //     "item_code": "1234567",
  //     "minimum": 5,
  //     "maximum": 90,
  //     "current": 80,
  //     "schedule": 40,
  //     "dispatched": 2,
  //     "balance": 90,
  //     "next_action": "3hfhjvkj",
  //     "resp": "rohit",
  //     "target": 780,
  //     "timestamp": "2025-05-20T10:45:50.624000"
  //   }
  // ]

  useEffect(() => {
    const [year, month, day] = date.split('-');
    dispatch(fetchStoreStock(year, month, day, token));
  }, [date, isOpen, dispatch, token]);
  // }, [date, isOpen, edit]);

  const handleSubmit = async () => {
    // Calculate status based on current stock value
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
        (successMessage) => {
          // Success callback
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: successMessage,
            timer: 2000,
            showConfirmButton: false,
          });
          setEdit({}); // Clear the edit state
          setUpdateDialogOpen(false);
        },
        (errorMessage) => {
          // Error callback
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '88vh',
        // bgcolor: "lightgray",
        position: 'relative',
        padding: '1rem',
      }}
    >
      {/* <Typography
        sx={{
          fontSize: "2rem",
          textAlign: "center",
          borderBottom: "1px solid #282828",
          width: "40rem",
          marginLeft: "auto",
          mr: "auto",
        }}
      >
        STORE STOCK MONITORING BOARD
      </Typography> */}

      <Typography
        sx={{
          fontSize: '2rem',
          textAlign: 'center',
          // borderBottom: "1px solid #282828",
          width: '100%',
          // marginLeft: "auto",
          mr: 'auto',
          padding: '1rem 0rem',
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        }}
      >
        STORE STOCK MONITORING BOARD
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          mt: '1.6rem',
          // ml: "auto",
          // mr: "auto",
          padding: '0.5rem',
          // bgcolor: 'red'
        }}
      >
        <Box
          bgcolor={'#f9f9f9'} // Light background color for highlighting
          color={'#282828'}
          display={'flex'}
          alignItems={'center'}
          fontSize={'1.2rem'}
          padding={'0.5rem 0.8rem'}
          borderRadius={'8px'}
          boxShadow={'rgba(56, 56, 56, 0.4) 0px 2px 8px 0px'}
          mr={'auto'}
          sx={{
            cursor: 'pointer', // Pointer cursor for hover effect
            transition: '0.3s ease-in-out', // Smooth transition for hover effect
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(10, 12, 10, 0.38)', // Stronger shadow on hover
            },
          }}
        >
          <Box ml={'1rem'} display={'flex'} alignItems={'center'}>
            <Box
              display={'flex'}
              maxWidth={'12rem'}
              minWidth={'12rem'}
              width={'12rem'}
              alignItems={'center'}
            >
              <IoPersonSharp
                style={{ color: '#282828', fontSize: '1.5rem', marginRight: '0.5rem' }}
              />
              <Typography>Responsible Person-</Typography>
            </Box>

            {storeStockArr.length > 0 ? ( // Check if there is at least one item in storeStockArr
              edit._id === storeStockArr[0]._id ? (
                <>
                  <TextField
                    type="text"
                    defaultValue={storeStockArr[0]?.resp_person}
                    onChange={(e) => setEdit({ ...edit, resp_person: e.target.value })}
                    sx={{ width: '7rem' }}
                    size="small"
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ml: '1rem',
                    }}
                  >
                    <IconButton onClick={() => setEdit({})}>
                      <CloseIcon style={{ color: '#CC7C7C' }} />
                    </IconButton>
                    <IconButton onClick={handleSubmit} style={{ color: 'green' }}>
                      <MdDone />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <div
                  style={{
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
                </div>
              )
            ) : (
              <Typography
                sx={{
                  marginLeft: '1rem',
                  color: '#888',
                  fontStyle: 'italic',
                }}
              >
                No data available
              </Typography>
            )}

            {storeStockArr.length > 0 &&
              edit._id !== storeStockArr[0]?._id && ( // Show Edit button only if data exists
                <IconButton
                  onClick={() => setEdit(storeStockArr[0])}
                  style={{ color: 'grey', marginLeft: '1rem' }}
                >
                  <EditIcon style={{ color: 'rgb(201, 162, 56)' }} />
                </IconButton>
              )}
          </Box>
        </Box>

        {/* <Box display={'flex'}  width={'15rem'} justifyContent={'space-between'} mr={'1rem'}>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'red'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Critical</Typography></Box>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'blue'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Excess</Typography></Box>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'green'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Ok</Typography></Box>

        </Box> */}

        <Box display={'flex'}>
          {/* <Button
          sx={{ bgcolor: colors.primary, width: "12rem", mr: '1rem' }}
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          Add New Item
        </Button> */}
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

      {/* --------------Table------------------- */}
      <Box
        position={'relative'}
        // bgcolor={"lightgrey"}
        mr={'1rem'}
        p={'0.7rem'}
        borderRadius={'6px'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        sx={{
          // bgcolor: 'lightblue',
          minHeight: '64vh', // or a fixed height like "600px"
          width: '100%', // Make sure it's not constrained by parent
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
        {/* <Typography position={'absolute'} top={'-1rem'} left={0}>0 Records found</Typography> */}
        {/* <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Report</Typography> */}
        <Paper sx={{ maxHeight: '100%', overflow: 'hidden', mr: 'auto' }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            {/* <Table aria-label="simple table" border={1} stickyHeader> */}
            <Table stickyHeader aria-label="sticky table" border={1}>
              <TableHead>
                {/* {
      "item_description": "DATA",
      "item_code": "1234567",
      "minimum": 5,
      "maximum": 90,
      "current": 80,
      "schedule": 40,
      "dispatched": 2,
      "balance": 90,
      "next_action": "3hfhjvkj",
      "resp": "rohit",
      "target": 780,
      "timestamp": "2025-05-20T10:45:50.624000" 
    } */}
                <TableRow sx={{ bgcolor: '#f5f5f5 !important', borderBottom: '1px solid #ddd' }}>
                  <TableCell
                    sx={{
                      fontSize: '1.2rem',
                      maxWidth: '4rem',
                      width: '4rem',
                      minWidth: '4rem',
                      backgroundColor: 'inherit',
                    }}
                  >
                    Sr No
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '1.2rem',
                      width: '23rem',
                      maxWidth: '23rem',
                      minWidth: '23rem',
                      backgroundColor: 'inherit',
                    }}
                  >
                    Item Description
                  </TableCell>
                  {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Minimum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Maximum
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '1.2rem',
                      backgroundColor: 'inherit',
                      maxWidth: '9rem',
                      width: '9rem',
                      minWidth: '9rem',
                    }}
                  >
                    Current Stock
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Location
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '1.2rem',
                      backgroundColor: 'inherit',
                      maxWidth: '16rem',
                      width: '16rem',
                      minWidth: '16rem',
                    }}
                  >
                    Plan
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '1.2rem',
                      width: '14rem',
                      minWidth: '14rem',
                      maxWidth: '14rem',
                      backgroundColor: 'inherit',
                    }}
                  >
                    Actual
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {storeStockArr.length > 0 ? (
                  storeStockArr.map((elem, index) => (
                    <TableRow key={elem.id || index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell
                        sx={{
                          width: '20rem',
                          maxWidth: '20rem',
                          minWidth: '20rem',
                        }}
                        align="center"
                      >
                        {elem.item_description}
                      </TableCell>
                      <TableCell sx={{ width: '6rem' }} align="center">
                        {elem.minimum}
                      </TableCell>
                      <TableCell sx={{ width: '6rem' }} align="center">
                        {elem.maximum}
                      </TableCell>
                      <TableCell
                        sx={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Current Stock"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.current}
                            onChange={(e) => setEdit({ ...edit, current: e.target.value })}
                            sx={{ width: '100%' }}
                            size="small"
                          />
                        ) : (
                          elem.current
                        )}
                      </TableCell>

                      <TableCell
                        sx={{ width: '4rem', minWidth: '4rem', maxWidth: '4rem' }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.location}
                            onChange={(e) => setEdit({ ...edit, location: e.target.value })}
                            sx={{ width: '100%' }}
                            size="small"
                          />
                        ) : (
                          elem.location
                        )}
                      </TableCell>

                      {/* <TableCell  sx={{width: '15rem'}} align="center">
<Box
  display="grid"
  gridTemplateColumns="repeat(3, 1fr)"
  gap={2}
  bgcolor={'pink'}
  height={'4rem'}
>
  <Box bgcolor={'red'} height={'100%'}>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</Box>
</TableCell> */}

                      <TableCell
                        sx={{ width: '9rem', minWidth: '9rem', maxWidth: '9rem' }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
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
                      <TableCell
                        sx={{ width: '14rem', minWidth: '14rem', maxWidth: '14rem' }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
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
                      <TableCell sx={{ width: '7rem', height: '100%', padding: 0 }} align="center">
                        {Number(elem.current) < elem.minimum && (
                          <Box
                            width={'25px'}
                            height={'25px'}
                            bgcolor={'red'}
                            borderRadius={'50%'}
                            margin={'auto'}
                          ></Box>
                        )}
                        {Number(elem.current) >= elem.minimum && Number(elem.current) < 400 && (
                          <Box
                            width={'25px'}
                            height={'25px'}
                            bgcolor={'orange'}
                            borderRadius={'50%'}
                            margin={'auto'}
                          ></Box>
                        )}
                        {Number(elem.current) >= 400 && (
                          <Box
                            width={'25px'}
                            height={'25px'}
                            bgcolor={'green'}
                            borderRadius={'50%'}
                            margin={'auto'}
                          ></Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ width: '6rem', maxWidth: '6rem' }} align="center">
                        {edit._id == elem._id ? (
                          <Box
                            sx={{
                              display: 'flex',
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {/* <Button variant="outlined" sx={{}} color="error" onClick={()=> setEdit({})} size="small">Cancel</Button> */}
                            <IconButton onClick={() => setEdit({})}>
                              <CloseIcon style={{ color: 'red' }} />
                            </IconButton>
                            {/* import CloseIcon from '@mui/icons-material/Close'; */}
                            {/* <Button variant="contained"  color="success" onClick={handleSubmit}>Submit</Button> */}
                            <IconButton onClick={handleSubmit} style={{ color: 'green' }}>
                              <MdDone />
                            </IconButton>
                          </Box>
                        ) : (
                          // <Button onClick={()=> setEdit(elem)}>Edit</Button>
                          <IconButton onClick={() => setEdit(elem)} style={{ color: 'grey' }}>
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>

                      {/* <TableCell align="center">{elem.timestamp}</TableCell> */}
                      {/* <TableCell onClick={()=> {setSelectedImg(elem.path), setIsShowImg(true)}} align="center" sx={{height:"10rem", width: '10rem'}}><img src={elem.path} style={{height: '100%', cursor: 'pointer'}} alt="" /></TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <Typography p={'1rem'}>No Result found</Typography>
                )}

                {/* {isLoading && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <Box display={'flex'} justifyContent={'space-between'}>
<Box display={'flex'} flexDirection={'column'} >
                  <Typography fontSize={'1.1rem'}>Days Require For Purchase Materials</Typography>
                  <Box width={'100%'} fontSize={'1.1rem'} display={'flex'} justifyContent={'space-between'}><span>Local : Min- 1</span> <span>Max- 10</span></Box>
                  <Box  width={'100%'} fontSize={'1.1rem'} display={'flex'} justifyContent={'space-between'}><span>Import : Min- 0</span> <span>Max- 0</span></Box>
                </Box>
                <Box display={'flex'}>
                <Box  display={'flex'} alignItems={'center'}><Box bgcolor={'red'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Critical ({'<'}MIN)</Typography></Box>
                <Box  display={'flex'} alignItems={'center'}><Box bgcolor={'red'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Critical ({'<'}MIN)</Typography></Box>
                <Box  display={'flex'} alignItems={'center'}><Box bgcolor={'red'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Critical ({'<'}MIN)</Typography></Box>
                </Box>
                
</Box> */}
        </Paper>
      </Box>
      <Table
        sx={{ position: 'fixed', bottom: 0, bgcolor: 'rgba(0, 55, 173, 0.04)', width: '100rem' }}
      >
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
      </Table>
    </Box>
  );
};

export default StoreStock;

{
  /* <TableCell sx={{ width: '15rem', height: '100%', padding: 0 }} align="center">
  <Box
    display="grid"
    gridTemplateColumns="repeat(3, 1fr)"
    // gap={1}
    bgcolor="pink"
    width="100%"
    height="5rem"
  >
    <Box bgcolor="red" height="100%" display="flex" alignItems="center" justifyContent="center" cursor="pointer">
    <IconButton style={{color: '#282828', fontSize: '1.9rem'}} ><MdDone /></IconButton>
    </Box>
    <Box bgcolor="green" height="100%" display="flex" alignItems="center" justifyContent="center" cursor="pointer">
      4
    </Box>
    <Box bgcolor="blue" height="100%" display="flex" alignItems="center" justifyContent="center" cursor="pointer">
      
    </Box>
  </Box>
</TableCell> */
}
