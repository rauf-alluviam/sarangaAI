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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import colors from "../../../utils/colors";
// import AddStock from "./AddStock";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MdDone, MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddStoreStock from "./AddStoreStock";
import { fetchStoreStock, updateStoreStock } from "../../../Redux/Actions/storeStockAction";
import store from "../../../Redux/store";
import { enqueueSnackbar } from "notistack";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const StoreStock = () => {
  const { storeStockArr}= useSelector((state) => state.storeStock);
  console.log(storeStockArr);

  // Get current date
  const currentDate = new Date();

  // Get ISO week number
  const getWeekNumber = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setUTCDate(
      tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7)
    );
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    return { week: weekNo, year: tempDate.getUTCFullYear() };
  };

  const { week, year } = getWeekNumber(currentDate);
  const initialWeekValue = `${year}-W${week.toString().padStart(2, "0")}`;

  const [date, setDate] = useState(initialWeekValue);

  const { userData, token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);

  console.log(date);
  const [stock, setStock] = useState([]);
  console.log(stock);
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState({});
  console.log(edit);
  const dispatch = useDispatch();

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
    const [year, week] = date.split("-W");
    console.log(date);
    dispatch(fetchStoreStock(year, week, token ));
    // async function fetchData() {
    //   try {
    //     setIsLoading(true);
    //     const response = await axios.get(
    //       `${BACKEND_API}/get_weekly_store_stock_monitoring_sheets/${year}/${week}`,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         }, 
    //       }
    //     );
    //     setIsLoading(false);
    //     setStock(response.data);
    //     console.log(response.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchData();
  }, [date]);
  // }, [date, isOpen, edit]);


  const handleSubmit = async () => {
    dispatch(updateStoreStock(
      edit, 
      token, 
      (successMessage) => {
        // Success callback
        enqueueSnackbar(successMessage, { variant: "success" });
        setEdit({}); // Clear the edit state
      },
      (errorMessage) => {
        // Error callback
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    ));
    // try {
    //   const response = await axios.put(
    //     `${BACKEND_API}/update_store_stock_monitoring_sheet_entry/${edit._id}`,
    //     edit,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   setEdit({});

    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        // bgcolor: "lightgray",
        position: "relative",
        padding: "1rem",
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
              STORE STOCK MONITORING BOARD
            </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: "1.6rem",
          // ml: "auto",
          // mr: "auto",
          padding: "0.5rem",  
          // bgcolor: 'red'
        }}
      >
        <Box display={'flex'}  width={'15rem'} justifyContent={'space-between'} mr={'1rem'}>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'red'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Critical</Typography></Box>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'blue'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Excess</Typography></Box>
          <Box display={'flex'} alignItems={'center'}><Box bgcolor={'green'} height={'15px'} width={'15px'} borderRadius={'50%'} mr={'0.5rem'}></Box><Typography>Ok</Typography></Box>

        </Box>

        <Box display={'flex'}>
        <Button
          sx={{ bgcolor: colors.primary, width: "12rem", mr: '1rem' }}
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          Add New Item
        </Button>
        {/* <TextField
          size="small"
          label="Date"
          // sx={{ width: '45rem' }}
          sx={{ width: "15rem" }}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        /> */}

        <TextField
        size="small"
          id="week"
          name="week"
          label="Select Week"
          type="week"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Box>
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
          <AddStoreStock setIsOpen={setIsOpen} />
        </Box>
      )}

      {/* --------------Table------------------- */}
      <Box
        position={"relative"}
        // bgcolor={"lightgrey"}
        mr={"1rem"}
        p={"0.7rem"}
        borderRadius={"6px"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        sx={{
          height: "80vh", // or a fixed height like "600px"
          width: "100%",  // Make sure it's not constrained by parent
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
      >
        {/* <Typography position={'absolute'} top={'-1rem'} left={0}>0 Records found</Typography> */}
        {/* <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Report</Typography> */}
        <Paper sx={{ maxHeight: "75vh", overflow: "auto",  marginLeft: 'auto', mr: 'auto', width: '100%' }}>
          <TableContainer>
            <Table aria-label="simple table" border={1}>
              <TableHead sx={{ bgcolor: "#A4B6D3", border: "1px solid black" }}>
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
                <TableRow>
                  <TableCell sx={{ fontSize: "1.2rem", maxWidth: '1.4rem', width: '1.4rem', minWidth: '1.4rem' }}>Sr No</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", width: "20rem",
                          maxWidth: "20rem",
                          minWidth: "20rem" }}>
                    Item Description
                  </TableCell>
                  {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Minimum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Maximum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Current Stock
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Location
                  </TableCell>
                  
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Plan
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", width: "14rem", minWidth: '14rem', maxWidth: '14rem' }}>
                    Actual
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody >
                {storeStockArr.length > 0 ? (
                  storeStockArr.map((elem, index) => (
                    <TableRow key={elem.id || index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell
                        sx={{
                          width: "20rem",
                          maxWidth: "20rem",
                          minWidth: "20rem",
                        }}
                        align="center"
                      >
                        {elem.item_description}
                      </TableCell>
                      <TableCell sx={{ width: "6rem" }} align="center">
                        {elem.minimum_STOCK}
                      </TableCell>
                      <TableCell sx={{ width: "6rem" }} align="center">
                        {elem.maximum_STOCK}
                      </TableCell>
                      <TableCell sx={{ width: "6rem", minWidth: '6rem', maxWidth: '6rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Current Stock"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.current_STOCK}
                            onChange={(e) =>
                              setEdit({ ...edit, current_STOCK: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.current_STOCK
                        )}
                      </TableCell>

                      <TableCell sx={{ width: "4rem", minWidth: '4rem', maxWidth: '4rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.location}
                            onChange={(e) =>
                              setEdit({ ...edit, location: e.target.value })
                            }
                            sx={{ width: "100%" }}
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
                      
                      <TableCell sx={{ width: "9rem", minWidth: '9rem', maxWidth: '9rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.plan}
                            onChange={(e) =>
                              setEdit({ ...edit, plan: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.plan
                        )}
                      </TableCell>
                      <TableCell sx={{ width: "14rem", minWidth: '14rem', maxWidth: '14rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.actual}
                            onChange={(e) =>
                              setEdit({ ...edit, actual: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.actual
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ width: "7rem", height: "100%", padding: 0 }}
                        align="center"
                      >
 {elem.current_STOCK< elem.minimum_STOCK &&  <Box width={'25px'} height={'25px'} bgcolor={'red'} borderRadius={'50%'} margin={'auto'}></Box>}
                        {elem.current_STOCK> elem.minimum_STOCK && elem.current_STOCK < elem.maximum_STOCK &&  <Box width={'25px'} height={'25px'} bgcolor={'green'} borderRadius={'50%'} margin={'auto'}></Box>}
                        {elem.current_STOCK> elem.maximum_STOCK &&  <Box width={'25px'} height={'25px'} bgcolor={'blue'} borderRadius={'50%'} margin={'auto'}></Box>}
                        {/* <Box
                          display="grid"
                          gridTemplateColumns="repeat(3, 1fr)"
                          // gap={1}
                          bgcolor="pink"
                          width="100%"
                          height="5rem"
                        >
                          <Box
  bgcolor="red"
  onClick={() => {
    if (elem._id === edit._id) {
      setEdit({ ...edit, status: "critical" });
    }
  }}
  height="100%"
  display="flex"
  alignItems="center"
  justifyContent="center"
  sx={{ cursor: "pointer" }}
>
  {
    (
      (elem._id === edit._id && edit.status === "critical") ||
      (elem._id !== edit._id && elem.status === "critical")
    ) && (
      <IconButton style={{ color: "#282828", fontSize: "1.9rem" }}>
        <MdDone />
      </IconButton>
    )
  }
</Box>

<Box
  bgcolor="green"
  onClick={() => {
    if (elem._id === edit._id) {
      setEdit({ ...edit, status: "excess" });
    }
  }}
  height="100%"
  display="flex"
  alignItems="center"
  justifyContent="center"
  sx={{ cursor: "pointer" }}
>
  {
    (
      (elem._id === edit._id && edit.status === "excess") ||
      (elem._id !== edit._id && elem.status === "excess")
    ) && (
      <IconButton style={{ color: "#282828", fontSize: "1.9rem" }}>
        <MdDone />
      </IconButton>
    )
  }
</Box>

<Box
  bgcolor="blue"
  onClick={() => {
    if (elem._id === edit._id) {
      setEdit({ ...edit, status: "ok" });
    }
  }}
  height="100%"
  display="flex"
  alignItems="center"
  justifyContent="center"
  sx={{ cursor: "pointer" }}
>
  {
    (
      (elem._id === edit._id && edit.status === "ok") ||
      (elem._id !== edit._id && elem.status === "ok")
    ) && (
      <IconButton style={{ color: "#282828", fontSize: "1.9rem" }}>
        <MdDone />
      </IconButton>
    )
  }
</Box>
                        </Box> */}
                      </TableCell>
                      <TableCell
                        sx={{ width: "6rem", maxWidth: "6rem" }}
                        align="center"
                      >
                        {edit._id == elem._id ? (
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* <Button variant="outlined" sx={{}} color="error" onClick={()=> setEdit({})} size="small">Cancel</Button> */}
                            <IconButton onClick={() => setEdit({})}>
                              <CloseIcon style={{ color: "red" }} />
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
                            <EditIcon />
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
      <Table sx={{position: 'fixed', bottom: 0, bgcolor: 'lightgrey', width: '100rem'}}>
            <TableRow>
              <TableCell sx={{ border: "1px solid black" }}>
                <Box display={'flex'} flexDirection={'column'} >
                  <Typography fontSize={'1.1rem'}>Days Require For Purchase Materials</Typography>
                  <Box width={'100%'} fontSize={'1.1rem'} display={'flex'} justifyContent={'space-between'}><span>Local : Min- 1</span> <span>Max- 10</span></Box>
                  <Box  width={'100%'} fontSize={'1.1rem'} display={'flex'} justifyContent={'space-between'}><span>Import : Min- 0</span> <span>Max- 0</span></Box>
                </Box>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }}><Box  display={'flex'} alignItems={'center'}><Box bgcolor={'red'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Critical ({'<'}MIN)</Typography></Box></TableCell>
              <TableCell sx={{ border: "1px solid black" }}><Box  display={'flex'} alignItems={'center'}><Box bgcolor={'blue'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Excess ({'>'}MAX)</Typography></Box></TableCell>
              <TableCell sx={{ border: "1px solid black" }}><Box  display={'flex'} alignItems={'center'}><Box bgcolor={'green'} width={'6rem'} height={'3rem'} mr={'1rem'}></Box><Typography fontSize={'1.1rem'}>Ok (MIN-MAX)</Typography></Box></TableCell>

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
