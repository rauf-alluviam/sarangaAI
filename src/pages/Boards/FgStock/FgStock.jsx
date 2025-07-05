import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import colors from "../../../utils/colors";
import AddStock from "./AddStock";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MdDone, MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { editFgStock, getAllFgStock } from "../../../Redux/Actions/fgStockActions";
import { IoPersonSharp } from "react-icons/io5";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const FgStock = () => {
  const { userData, token } = useSelector((state) => state.auth);
  const {fgStockArr}= useSelector((state)=> state.fgStock);
  console.log(fgStockArr)
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMonthlyUpdateOpen, setIsMonthlyUpdateOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0].split('-')[2]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  console.log(date)
  const [stock, setStock] = useState([]);
  console.log(stock);
  // const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState({});
  console.log(edit);
  const [status, setStatus]= useState('all');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    status: '',
    color: '',
    message: ''
  });
  const [message, setMessage] = useState('');

  // Item description options for monthly update
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

  
  // Monthly Update form states   
  const [monthlyUpdateData, setMonthlyUpdateData] = useState({
    item_code: '',  
    schedule: '',
    maximum: ''
  });
  

  // useEffect(() => {
  //   const [year, month, day] = date.split("-");
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get(
  //         `${BACKEND_API}/get_daily_fg_stock_monitoring_sheets/${year}/${month}/${day}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setIsLoading(false);
  //       setStock(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, [date, isOpen, edit]);

  useEffect(()=>{
    dispatch(getAllFgStock(date, setMessage))
  }, [date, monthlyUpdateData])

  const handleSubmit = async () => {
    if(!edit.current){
      enqueueSnackbar('Please enter a valid current stock value', { variant: 'error' });
      // setUpdateDialogOpen(false);
      return;
    }

    if(!edit.dispatched){
      enqueueSnackbar('Please enter a valid dispatched value', { variant: 'error' });
      // setUpdateDialogOpen(false);
      return;
    }
    // Calculate status based on current stock value
    const currentStock = Number(edit.current) || 0;
    let status = '';
    let color = '';
    let message = '';

    if (currentStock < edit.minimum) {
      status = 'Critical';
      color = 'red';
      message = `Current stock is below ${edit.minimum} - Critical level!`;
    } else if (currentStock >= edit.minimum && currentStock < 400) {
      status = 'Alert';
      color = 'orange';
      message = 'Current stock is between minimum-400 - Alert level!';
    } else if (currentStock >= 400) {
      status = 'Sufficient';
      color = 'green';
      message = 'Current stock is above 400 - Sufficient level!';
    }

    setUpdateStatus({ status, color, message });
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = () => {
    
    dispatch(editFgStock(edit, date, (successMsg) => {
      setEdit({});
      setUpdateDialogOpen(false);
      enqueueSnackbar(successMsg, { variant: 'success' });
    },
    (errorMsg) => {
      setUpdateDialogOpen(false);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }));
  };

  const handleMonthlyUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        item_description: monthlyUpdateData.item_description,
        schedule: Number(monthlyUpdateData.schedule),
        maximum: Number(monthlyUpdateData.maximum),
        month: date.split('-')[1],
        year: date.split('-')[0],
      };

      console.log('Monthly Update Data:', data);
      // TODO: Add API call to submit monthly update data
      // dispatch(monthlyUpdateAction(data, onSuccess, onError));

      const response= await axios.post(`${BACKEND_API}/set_monthly_schedule_and_maximum_quantity_in_fgstock`, data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
       )

       console.log(response)
      
      // For now, show success message
      enqueueSnackbar(response?.data?.message || 'Monthly update submitted successfully', { variant: 'success' });
      setIsMonthlyUpdateOpen(false);
      setMonthlyUpdateData({
        item_description: '',
        schedule: '',
        maximum: '',
        month: date.split('-')[1],
        year: date.split('-')[0],
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Failed to submit monthly update', { variant: 'error' });
    }
  };

  const handleMessageDialogClose = () => {
    setMessage('');
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        // bgcolor: "lightgray",
        padding: "1rem",
      }}
    >
      <Typography
        sx={{
          fontSize: "2rem",
          textAlign: "center",
          // borderBottom: "1px solid #282828",
          width: "100%",
          // marginLeft: "auto",
          mr: "auto",
          padding: "1rem 0rem",
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        }}
      >
        FG STOCK MONITORING BOARD
      </Typography>

      {/* <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your action was successful.
    </Alert> */}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          mt: "1.6rem",
          ml: "auto",
          mr: "auto",
          padding: "0.5rem",
          // bgcolor: 'red'
        }}
      > 
        {/* <Box bgcolor={'white'} color={'#282828'} display={'flex'} alignItems={'center'} fontSize={'1.2rem'} padding={'0.5rem 0.8rem'} borderRadius={'8px'} boxShadow={'rgba(56, 56, 56, 0.4) 0px 2px 8px 0px;'} mr={'auto'}>
        <IoPersonSharp style={{color: '#282828'}} />
        <Typography ml={'1rem'} display={'flex'} >Responsible Person- 
          <div style={{backgroundColor: 'red', height: '2rem',borderRadius: '14px'}}>{fgStockArr[0]?.resp || 'Not mentioned'}</div></Typography>
        </Box> */}

<Box
  bgcolor={"#f9f9f9"} // Light background color for highlighting
  color={"#282828"}
  display={"flex"}
  alignItems={"center"}
  fontSize={"1.2rem"}
  padding={"0.5rem 0.8rem"}
  borderRadius={"8px"}
  boxShadow={"rgba(56, 56, 56, 0.4) 0px 2px 8px 0px"}
  // border={`1px solid #282828`} // Green border for highlighting
  mr={"auto"}
  
  sx={{
    cursor: "pointer", // Pointer cursor for hover effect
    transition: "0.3s ease-in-out", // Smooth transition for hover effect
    "&:hover": {
      // backgroundColor: "rgba(53, 53, 53, 0.5)", // Light green background on hover
      boxShadow: "0px 4px 12px rgba(10, 12, 10, 0.38)", // Stronger shadow on hover
    },
  }}
>
  
<Box ml={"1rem"} display={"flex"} alignItems={"center"}>
  <Box display={"flex"} maxWidth={"12rem"} minWidth={"12rem"} width={"12rem"} alignItems={'center'}>
    <IoPersonSharp style={{ color: "#282828", fontSize: "1.5rem", marginRight: '0.5rem' }} />
    <Typography>Responsible Person-</Typography>
  </Box>

  {fgStockArr.length > 0 ? ( // Check if there is at least one item in fgStockArr
    edit._id === fgStockArr[0]._id ? (
      <>
        <TextField
          type="text"
          defaultValue={fgStockArr[0]?.resp_person}
          onChange={(e) => setEdit({ ...edit, resp_person: e.target.value })}
          sx={{ width: "7rem" }}
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            ml: "1rem",
          }}
        >
          <IconButton onClick={() => setEdit({})}>
            <CloseIcon style={{ color: "#CC7C7C" }} />
          </IconButton>
          <IconButton onClick={handleSubmit} style={{ color: "green" }}>
            <MdDone />
          </IconButton>
        </Box>
      </>
    ) : (
      <div
        style={{
          backgroundColor: "#FFCDD2",
          height: "2rem",
          borderRadius: "4px",
          padding: "0 0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "0.5rem",
          color: "#282828",
          boxShadow: "rgba(0, 0, 0, 0.17) 0px 3px 8px",
        }}
      >
        {fgStockArr[0]?.resp_person || "Not mentioned"}
      </div>
    )
  ) : (
    <Typography
      sx={{
        marginLeft: "1rem",
        color: "#888",
        fontStyle: "italic",
      }}
    >
      No data available
    </Typography>
  )}

  {fgStockArr.length > 0 && edit._id !== fgStockArr[0]?._id && ( // Show Edit button only if data exists
    <IconButton
      onClick={() => setEdit(fgStockArr[0])}
      style={{ color: "grey", marginLeft: "1rem" }}
    >
      <EditIcon style={{ color: "rgb(201, 162, 56)" }} />
    </IconButton>
  )}
</Box>
</Box>
        {/* <Button
          sx={{ 
            bgcolor: colors.primary,
            width: "10rem", mr: "1rem" }}
          variant="contained"
          onClick={() => setIsOpen(true)} 
        >
          Add New Item  
        </Button> */}

        <Button variant="contained" sx={{mr: '0.8rem', bgcolor: colors.primary}} onClick={() => setIsMonthlyUpdateOpen(true)}>Monthly Update</Button>
        <Button variant="contained" sx={{mr: '0.8rem', bgcolor: colors.primary}} onClick={()=> navigate('/monthly-fg-stock')}>Monthly Sheet</Button>
        <TextField
          size="small"
          label="Date"
          // sx={{ width: '45rem' }}
          sx={{ width: "15rem"}}
          // placeholder="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

{/* <FormControl sx={{width: '14rem'}}>
                       <InputLabel id="Status">Status</InputLabel>
                       <Select
                        // size='small'
                         labelId="Status"
                         id="Status-select"
                         value={status}
                         label="Status"
                         defaultValue="all"
                         onChange={(e) => setStatus(e.target.value)}
                       >
                         <MenuItem value={'all'}>All</MenuItem>
                         <MenuItem value={'excess'}>Excess</MenuItem>
                         <MenuItem value={'ok'}>Ok</MenuItem>
                         
                         
                       </Select>
                     </FormControl> */}
      </Box>
      {isOpen && (
        <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={9}
          onClick={() => setIsOpen(false)}
        >
          <AddStock setIsOpen={setIsOpen} />
        </Box>
      )}

      {/* Monthly Update Dialog */}
      {isMonthlyUpdateOpen && (
        <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={9}
          onClick={() => setIsMonthlyUpdateOpen(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            height={"auto"}
            borderRadius={"8px"}
            width={"35rem"}
            bgcolor={"white"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={"2rem"}
          >
            <Typography fontSize={"1.8rem"} textAlign={"center"} mb={2}>
              Monthly Update
            </Typography>

            <form
              onSubmit={handleMonthlyUpdateSubmit}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <TextField
                fullWidth
                label="Item Description"
                type="text"
                value={monthlyUpdateData.item_description}
                onChange={(e) =>
                  setMonthlyUpdateData({
                    ...monthlyUpdateData,
                    item_description: e.target.value,
                  })
                }
                size="small"
                required
                select
              >
                {itemDescriptionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Schedule"
                type="number"
                value={monthlyUpdateData.schedule}
                onChange={(e) =>
                  setMonthlyUpdateData({
                    ...monthlyUpdateData,
                    schedule: e.target.value,
                  })
                }
                size="small"
                required
              />

              <TextField
                fullWidth
                label="Maximum"
                type="number"
                value={monthlyUpdateData.maximum}
                onChange={(e) =>
                  setMonthlyUpdateData({
                    ...monthlyUpdateData,
                    maximum: e.target.value,
                  })
                }
                size="small"
                required
              />

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsMonthlyUpdateOpen(false);
                    setMonthlyUpdateData({
                      item_description: '',
                      schedule: '',
                      maximum: ''
                    });
                  }}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: colors.primary, flex: 1 }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}

      {/* Message Dialog */}
      {message && (
        <Dialog
          open={Boolean(message)}
          onClose={handleMessageDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography fontSize="1.5rem" fontWeight="bold">
              Update Required
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography fontSize="1rem" color="textSecondary" mb={2}>
              {message}
            </Typography>
            <Typography fontSize="1rem" color="error">
              Please first update the monthly schedule and maximum value before proceeding. 
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleMessageDialogClose}
              variant="contained"
              sx={{ 
                bgcolor: colors.primary,
                '&:hover': {
                  backgroundColor: colors.buttonHover || colors.primary
                }
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Update Status Dialog */}  
      {updateDialogOpen && (
        <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={10}
          onClick={() => setUpdateDialogOpen(false)}
        > 
          <Box
            onClick={(e) => e.stopPropagation()}
            height={"auto"}
            borderRadius={"8px"}
            width={"33rem"}
            bgcolor={"white"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={"2rem"}
          >
            <Typography fontSize={"1.5rem"} textAlign={"center"} mb={2}>
              Stock Status Update
            </Typography>

            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              mb={2}
            >
              <Box
                width={"25px"}
                height={"25px"}
                bgcolor={updateStatus.color}
                borderRadius={"50%"}
                mr={1}
              />
              <Typography fontSize={"1.2rem"} fontWeight={"bold"}>
                {updateStatus.status}
              </Typography>
            </Box>

            <Typography
              fontSize={"1rem"}
              textAlign={"center"}
              color={"textSecondary"}
              mb={3}
            >
              {updateStatus.message}
            </Typography>

            <Typography fontSize={"0.9rem"} textAlign={"center"} mb={3}>
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
                    backgroundColor: colors.buttonHover || colors.primary
                  }
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
        position={"relative"}
        // bgcolor={"green"}
        // mr={"1rem"}
        p={"0.7rem"}
        borderRadius={"6px"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        overflow={'auto'}
        sx={{
          minHeight: "77vh", // or a fixed height like "600px"
          width: "100%",  // Make sure it's not constrained by parent
        //  bgcolor: 'lightblue',
          overflow: "auto", // Enables both vertical & horizontal scroll
          scrollbarWidth: "thin", // Firefox
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
        // minHeight={'74vh'}
      >
        {/* <Typography position={'absolute'} top={'-1rem'} left={0}>0 Records found</Typography> */}
        {/* <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Report</Typography> */}
        <Paper sx={{ maxHeight: "100%", overflow: 'hidden'}} >
        {/* , marginLeft: 'auto', mr: 'auto', width: '100%' */}
          <TableContainer  sx={{ maxHeight: "100%" }} >
            <Table  stickyHeader aria-label="sticky table"  border={1}>
              <TableHead sx={{ bgcolor: "grey", border: "1px solid black"}}>
                
                <TableRow sx={{ bgcolor: "#f5f5f5 !important", borderBottom: "1px solid #ddd" }}>
                  <TableCell sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>Sr No</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Item Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Item Code
                  </TableCell>
                  {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Minimum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Maximum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Schedule
                  </TableCell>
                  
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit", minWidth: '8rem', width: '8rem', maxWidth: '8rem' }}> 
                    Current Stock
                  </TableCell>
                  
                  
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Dispatched
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Balance
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Next Action
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit"  }}>
                    Today's Planning
                  </TableCell>
                 
                  {/* <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Next Day Target
                  </TableCell> */}
                  <TableCell align="center" sx={{ fontSize: "1.2rem", minWidth: '5rem', width: '5rem', maxWidth: '5rem', backgroundColor: "inherit" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit"}}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
              {/* {isLoading && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                )} */}
                {fgStockArr.length > 0 ? (
                  fgStockArr.map((elem, index) => (
                    <TableRow key={elem.id || index} sx={{bgcolor: elem._id== edit._id && 'rgb(188, 196, 209)', transition: '0.4s', boxShadow: elem._id== edit._id && 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                      <TableCell align="center"  sx={{ width: "2rem", maxWidth: '2rem', minWidth: '2rem' }}>{index + 1}</TableCell>
                      <TableCell  sx={{ width: "16rem", maxWidth: '16rem', minWidth: '16rem' }} align="center">
                        {elem.item_description}
                      </TableCell>
                      <TableCell  sx={{ width: "11rem", maxWidth: '11rem', minWidth: '11rem' }}  align="center">
                        {elem.item_code}
                      </TableCell>
                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {elem.minimum}
                      </TableCell>
                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {elem.maximum}
                      </TableCell>
                      <TableCell  sx={{ width: "6rem", maxWidth: '6rem', minWidth: '6rem' }} align="center">
                        {elem.schedule}
                        {/* {edit._id == elem._id ? (
                          
                          <TextField
                            fullWidth
                            // label="Schedule"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.schedule}
                            onChange={(e) =>
                              setEdit({ ...edit, schedule: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.schedule
                        )} */}
                      </TableCell>

                      
                      <TableCell  sx={{ width: "6rem", maxWidth: '6rem', minWidth: '6rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Current Stock"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.current}
                            onChange={(e) =>
                              setEdit({ ...edit, current: e.target.value })
                            }
                            sx={{ width: "100%", height: '100%' }}
                            size="small"
                          />
                        ) : (
                          elem.current
                        )}
                      </TableCell>

                      
                     
                      {/* <TableCell align="center">
                  {edit._id ==elem._id? <TextField
                                fullWidth
                                label="Dispatched"
                                // placeholder='rtsp://192.168.1.100:554/stream1'
                                type="number"
                                defaultValue={elem.current}
                                onChange={(e) => setEdit({...edit, current: e.target.value})}
                                sx={{width: '8rem'}}
                                size='small'
                              />:elem.current}</TableCell> */}
                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            // fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.dispatched}
                            onChange={(e) =>
                              setEdit({ ...edit, dispatched: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.dispatched
                        )}
                      </TableCell>
                      <TableCell  sx={{ width: "5rem", maxWidth: '5rem', minWidth: '5rem' }} align="center">
                        {/* {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.balance}
                            onChange={(e) =>
                              setEdit({ ...edit, balance: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.schedule- elem.dispatched
                        )} */}
                        {elem.schedule- elem.dispatched}
                      </TableCell>

                      <TableCell  sx={{ width: "9rem", maxWidth: '9rem', minWidth: '9rem' }} align="center">
                        {edit._id == elem._id ? (
                          // <TextField
                          //   fullWidth
                          //   // label="Dispatched"
                          //   // placeholder='rtsp://192.168.1.100:554/stream1'
                          //   type="text"
                          //   defaultValue={elem.next_action}
                          //   onChange={(e) =>
                          //     setEdit({ ...edit, next_action: e.target.value })
                          //   }
                          //   sx={{ width: "100%" }}
                          //   size="small"
                          // />
                          <TextField
                                       size='small'
                                      label="Select Date"
                                      // sx={{ width: '45rem' }}
                                      sx={{ width: '100%'}}
                                      type="date"
                                      defaultValue={elem.next_action}
                                      // onChange={(e) => setDate(e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                      onChange={(e)=>  setEdit({ ...edit, next_action: e.target.value })}
                                    />
                        ) : (
                          elem.next_action? elem.next_action: '-'
                        )}
                      </TableCell>

                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Current Stock"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.todays_planning}
                            onChange={(e) =>
                              setEdit({ ...edit, todays_planning: e.target.value })
                            }
                            sx={{ width: "100%", height: '100%' }}
                            size="small"
                          />
                        ) : (
                          elem.todays_planning
                        )}
                      </TableCell>
                     
                      {/* <TableCell sx={{ width: "6rem", maxWidth: '6rem', minWidth: '6rem' }} align="center"> 
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.next_day_target
                            }
                            onChange={(e) =>
                              setEdit({ ...edit, next_day_target
                                : e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.next_day_target

                        )}
                      </TableCell> */}
                      {/* <TableCell>{elem.todays_target * 2 <= elem.current ? 
                      <Box bgcolor={'green'}  height={'3rem'} width={'4rem'}></Box>: <Box  bgcolor={'red'} height={'3rem'} width={'4rem'}></Box> }</TableCell> */}
                     <TableCell>
  {elem.current < elem.minimum && <Box width={'25px'} height={'25px'} bgcolor={'red'} borderRadius={'50%'} margin={'auto'}></Box>}
  {(elem.current >= elem.minimum && elem.current < 400) && (
    <Box width={'25px'} height={'25px'} bgcolor={'orange'} borderRadius={'50%'} margin={'auto'}></Box>
  )}
  {elem.current >= 400 && <Box width={'25px'} height={'25px'} bgcolor={'green'} borderRadius={'50%'} margin={'auto'}></Box>}
</TableCell>

                      <TableCell
                        sx={{ width: "5rem", maxWidth: "5rem" }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              // bgcolor: 'pink'
                            }}
                          >
                            {/* <Button variant="outlined" sx={{}} color="error" onClick={()=> setEdit({})} size="small">Cancel</Button> */}
                            <IconButton onClick={() => setEdit({})}>
                              <CloseIcon style={{ color: "#CC7C7C" }} />
                            </IconButton>
                            {/* import CloseIcon from '@mui/icons-material/Close'; */}
                            {/* <Button variant="contained"  color="success" onClick={handleSubmit}>Submit</Button> */}
                            <IconButton
                              onClick={handleSubmit}
                              style={{ color: "green" }}
                            >
                              <MdDone />
                            </IconButton>
                          </Box>
                        ) : (
                          // <Button onClick={()=> setEdit(elem)}>Edit</Button>
                          <IconButton
                            onClick={() => setEdit(elem)}
                            style={{ color: "grey" }}
                          >
                            <EditIcon style={{color: 'rgb(201, 162, 56)'}} />
                          </IconButton>
                        )}
                      </TableCell>

                      {/* <TableCell align="center">{elem.timestamp}</TableCell> */}
                      {/* <TableCell onClick={()=> {setSelectedImg(elem.path), setIsShowImg(true)}} align="center" sx={{height:"10rem", width: '10rem'}}><img src={elem.path} style={{height: '100%', cursor: 'pointer'}} alt="" /></TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <Typography p={"1rem"}>No Result found</Typography>
                )}

                
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
{/* 
      <Dialog open={true} onClose={false}>
      </Dialog> */}
    </Box>
  );
};

export default FgStock;


