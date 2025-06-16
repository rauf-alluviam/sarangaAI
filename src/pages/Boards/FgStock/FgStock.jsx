import {
  Alert,
  Box,
  Button,
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

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const FgStock = () => {
  // const { userData, token } = useSelector((state) => state.auth);
  const {fgStockArr}= useSelector((state)=> state.fgStock)
  console.log(fgStockArr)
  const dispatch= useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [stock, setStock] = useState([]);
  console.log(stock);
  // const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState({});
  console.log(edit);
const [status, setStatus]= useState('all');

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
    dispatch(getAllFgStock(date))
  }, [date])

  const handleSubmit = async () => {
    try {
      // const response = await axios.put(
      //   `${BACKEND_API}/update_fg_stock_monitoring_sheet_entry/${edit._id}`,
      //   edit,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      dispatch(editFgStock(edit))
      setEdit({});
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        bgcolor: "lightgray",
      }}
    >
      <Typography
        sx={{
          fontSize: "2rem",
          textAlign: "center",
          borderBottom: "1px solid #282828",
          width: "40rem",
          marginLeft: "auto",
          mr: "auto",
        }}
      >
        DISPATCH STOCK MONITORING BOARD
      </Typography>

      {/* <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your action was successful.
    </Alert> */}

      <Box
        sx={{
          width: "50rem",
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
        <Button
          sx={{ bgcolor: colors.primary, width: "10rem" }}
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          Add New Item
        </Button>
        <TextField
          // size="small"
          label="Date"
          // sx={{ width: '45rem' }}
          sx={{ width: "15rem" }}
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

      {/* --------------Table------------------- */}
      <Box
        position={"relative"}
        // bgcolor={"green"}
        mr={"1rem"}
        p={"0.7rem"}
        borderRadius={"6px"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        overflow={'auto'}
        // minHeight={'74vh'}
        
        
      >
        {/* <Typography position={'absolute'} top={'-1rem'} left={0}>0 Records found</Typography> */}
        {/* <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Report</Typography> */}
        <Paper sx={{ maxHeight: "75vh", overflow: 'auto' }}>
          <TableContainer>
            <Table aria-label="simple table" border={1} >
              <TableHead sx={{ bgcolor: "grey", border: "1px solid black" }}>
                
                <TableRow sx={{bgcolor: 'rgb(164, 182, 211)', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}>
                  <TableCell sx={{ fontSize: "1.2rem" }}>Sr No</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Item Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Item Code
                  </TableCell>
                  {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Minimum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Maximum
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Today's Target
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Current
                  </TableCell>
                  
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Schedule
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Dispatched
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Balance
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Next Action
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Responsibility
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Next Day Target
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem"}}>
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
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell  sx={{ width: "16rem", maxWidth: '16rem', minWidth: '16rem' }} align="center">
                        {elem.item_description}
                      </TableCell>
                      <TableCell  sx={{ width: "11rem", maxWidth: '11rem', minWidth: '11rem' }}  align="center">
                        {elem.item_code}
                      </TableCell>
                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {200}
                      </TableCell>
                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {2500}
                      </TableCell>

                      <TableCell  sx={{ width: "4rem", maxWidth: '4rem', minWidth: '4rem' }} align="center">
                        {/* {elem.todays_target} */}
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Current Stock"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="number"
                            defaultValue={elem.todays_target}
                            onChange={(e) =>
                              setEdit({ ...edit, todays_target: e.target.value })
                            }
                            sx={{ width: "100%", height: '100%' }}
                            size="small"
                          />
                        ) : (
                          elem.todays_target
                        )}
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

                      
                      <TableCell  sx={{ width: "6rem", maxWidth: '6rem', minWidth: '6rem' }} align="center">
                        {edit._id == elem._id ? (
                          
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
                      <TableCell sx={{ width: "10rem", maxWidth: '10rem', minWidth: '10rem' }} align="center">
                        {edit._id == elem._id ? (
                          <TextField
                            fullWidth
                            // label="Dispatched"
                            // placeholder='rtsp://192.168.1.100:554/stream1'
                            type="text"
                            defaultValue={elem.resp}
                            onChange={(e) =>
                              setEdit({ ...edit, resp: e.target.value })
                            }
                            sx={{ width: "100%" }}
                            size="small"
                          />
                        ) : (
                          elem.resp
                        )}
                      </TableCell>
                      <TableCell sx={{ width: "6rem", maxWidth: '6rem', minWidth: '6rem' }} align="center"> 
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
                      </TableCell>
                      <TableCell>{elem.todays_target * 2 <= elem.current ? 
                      <Box bgcolor={'green'}  height={'3rem'} width={'4rem'}></Box>: <Box  bgcolor={'red'} height={'3rem'} width={'4rem'}></Box> }</TableCell>
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
    </Box>
  );
};

export default FgStock;
