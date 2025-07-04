import {
  Box,
  Button,
  Checkbox,
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
import { useDispatch, useSelector } from "react-redux";
import colors from "../../../utils/colors";
import AddTools from "./AddTools";
import { MdDone } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { fetchTools, updateTool } from "../../../Redux/Actions/toolManagementActions";
import { enqueueSnackbar } from "notistack";
import { IoPersonSharp } from "react-icons/io5";

const BACKEND_API= import.meta.env.VITE_BACKEND_API;


const ToolManage = () => {
  const { token } = useSelector((state) => state.auth);
  const { tools } = useSelector((state) => state.toolManagement);
  console.log(tools);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState({});
  const dispatch = useDispatch();
  const [isShowingImg, setIsShowImg] = useState(false);
  const [selectedImg] = useState("https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg");
  console.log(month);
  useEffect(() => {
    const [selectedYear, selectedMonth] = month.split("-");
    dispatch(fetchTools(selectedYear, selectedMonth, token));
  }, [month, dispatch, token]);

  const handleUpdate = async () => {
    dispatch(updateTool(edit._id, edit,  token,
      (successMsg)=>{setEdit({}); enqueueSnackbar(successMsg, { variant: 'success' })},
      (errorMsg)=> enqueueSnackbar(errorMsg, { variant: 'error' })
     ));
    
    // try {
    //   const response = await axios.put(
    //     `${BACKEND_API}/update_tool_management_sheet_entry/${edit.id}`,
    //     edit,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   console.log(response.data);
    //   if (
    //     response.data.message === "Tool management entry updated successfully"
    //   ) {
    //     setEdit({});
    //   }
    // } catch (error) {
    //   console.error("Error updating data:", error);
    // }
  };
  return (
    <Box maxHeight={"89vh"} minHeight={'89vh'} position={"relative"}>
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
          <AddTools setIsOpen={setIsOpen} />
        </Box>
      )}

       <Typography
                    sx={{
                      fontSize: "2rem",
                      textAlign: "center",
                      // borderBottom: "1px solid #282828",
                      width: "100%",
                      // marginLeft: "auto",
                      mr: "auto",
                      // padding: "1rem 0rem",
                      // bgcolor: 'white',
                      borderRadius: '12px',
                      // boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                  >
                    STORE STOCK MONITORING BOARD
                  </Typography>

      <Box
        sx={{
          height: "6rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem 1.5rem",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: colors.boxShadows.header,
          mb: "1rem",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          // bgcolor: 'red'
        }}
      >
        {/* Left Side - Responsible Person */}
        <Box 
          display={"flex"} 
          alignItems={"center"} 
          bgcolor={'white'} 
          sx={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            boxShadow: colors.boxShadows.light,
            border: "1px solid rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: colors.hoverShadows.light
            }
          }}
        >
          <Box display={"flex"} alignItems={'center'} minWidth={"12rem"}>
            <IoPersonSharp style={{ color: colors.primary, fontSize: "1.4rem", marginRight: '0.6rem' }} />
            <Typography fontWeight={500} color="#374151">Responsible Person:</Typography>
          </Box>
        
          {tools.length > 0 ? (
            edit._id === tools[0]._id ? (
              <>
                <TextField
                  type="text"
                  defaultValue={tools[0]?.resp_person}
                  onChange={(e) => setEdit({ ...edit, resp_person: e.target.value })}
                  sx={{ 
                    width: "8rem",
                    ml: "0.5rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      fontSize: "0.9rem"
                    }
                  }}
                  size="small"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ml: "0.8rem",
                  }}
                >
                  <IconButton 
                    onClick={() => setEdit({})}
                    sx={{
                      color: "#ef4444",
                      "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton 
                    onClick={handleUpdate} 
                    sx={{
                      color: "#22c55e",
                      "&:hover": { backgroundColor: "rgba(34, 197, 94, 0.1)" }
                    }}
                  >
                    <MdDone />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  backgroundColor: "#f3f4f6",
                  height: "2.2rem",
                  borderRadius: "6px",
                  padding: "0 0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "0.8rem",
                  color: "#374151",
                  fontWeight: 500,
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.08)"
                }}
              >
                {tools[0]?.resp_person || "Not mentioned"}
              </Box>
            )
          ) : (
            <Typography
              sx={{
                marginLeft: "0.8rem",
                color: "#9ca3af",
                fontStyle: "italic",
                fontSize: "0.9rem"
              }}
            >
              No data available
            </Typography>
          )}
        
          {tools.length > 0 && edit._id !== tools[0]?._id && (
            <IconButton
              onClick={() => setEdit(tools[0])}
              sx={{ 
                color: "#f59e0b", 
                marginLeft: "0.8rem",
                "&:hover": { backgroundColor: "rgba(245, 158, 11, 0.1)" }
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        {/* Middle - Legend */}
        <Box 
          width={"45rem"} 
          height={"95%"} 
          display={'flex'} 
          // flexWrap={'wrap'} 
          p={'0.5rem'}
          sx={{
            backgroundColor: "rgba(248, 249, 250, 0.8)",
            borderRadius: "8px",
            border: "1px solid rgba(0, 0, 0, 0.05)"
          }}
        >
          <Box 
            width={'48%'} 
            height={'2rem'} 
            bgcolor={'white'} 
            m={'0.1rem'} 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'start'} 
            sx={{
              borderRadius: "6px",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 3px",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box 
              height={'12px'} 
              width={'12px'} 
              bgcolor={'#ef4444'} 
              ml={'0.6rem'} 
              borderRadius={'50%'}
            />
            <Typography ml={'0.4rem'} fontSize={'0.75rem'} fontWeight={500}>
              PM PLAN
            </Typography>
          </Box>

          <Box 
            width={'48%'} 
            height={'2rem'} 
            bgcolor={'white'} 
            m={'0.1rem'} 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'start'} 
            sx={{
              borderRadius: "6px",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 3px",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box 
              height={'12px'} 
              width={'12px'} 
              bgcolor={'#22c55e'} 
              ml={'0.6rem'} 
              borderRadius={'50%'}
            />
            <Typography ml={'0.4rem'} fontSize={'0.75rem'} fontWeight={500}>
              PM ACTUAL
            </Typography>
          </Box>

          <Box 
            width={'48%'} 
            height={'2rem'} 
            bgcolor={'white'} 
            m={'0.1rem'} 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'start'} 
            sx={{
              borderRadius: "6px",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 3px",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box 
              height={'12px'} 
              width={'12px'} 
              bgcolor={'#3b82f6'} 
              ml={'0.6rem'} 
              borderRadius={'50%'}
            />
            <Typography ml={'0.4rem'} fontSize={'0.75rem'} fontWeight={500}>
              MODIFICATIONS
            </Typography>
          </Box>

          

          <Box 
            width={'48%'} 
            height={'2rem'} 
            bgcolor={'white'} 
            m={'0.1rem'} 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'start'} 
            sx={{
              borderRadius: "6px",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 3px",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box 
              height={'12px'} 
              width={'12px'} 
              bgcolor={'#6b7280'} 
              ml={'0.6rem'} 
              borderRadius={'50%'}
            />
            <Typography ml={'0.4rem'} fontSize={'0.75rem'} fontWeight={500}>
              REPAIR
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Date Selector and Add Button */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            label="Select Month and Year"
            sx={{ 
              width: "11rem",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: colors.boxShadows.minimal
              }
            }}
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            onClick={() => setIsOpen(true)}
            variant="contained"
            sx={{ 
              bgcolor: colors.primary,
              width: "10rem",
              height: "2.5rem",
              borderRadius: "8px",
              boxShadow: colors.boxShadows.light,
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: colors.primary,
                boxShadow: colors.hoverShadows.light,
                transform: "translateY(-1px)"
              }
            }}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      <Box
        position="relative"
        // p="0.7rem"
        borderRadius="6px"
        display="flex"
        flexDirection="column"
        alignItems="start"
        sx={{
          // bgcolor: "red",
          // p: '1rem 0rem',
          height: "81.5vh",
          width: "100%",
          overflow: "auto",
          scrollbarWidth: "thin",
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
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table stickyHeader aria-label="sticky table" border={1}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
                  <TableCell align="center" sx={{fontSize: "1rem", minWidth: '1.4rem', maxWidth: '1.4rem', width: '1.4rem', backgroundColor: "inherit"}}>Sr No</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "8rem",
                      minWidth: "8rem",
                      maxWidth: "8rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Machine
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "10rem",
                      minWidth: "10rem",
                      maxWidth: "10rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Mould Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "7rem",
                      minWidth: "7rem",
                      maxWidth: "7rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Last PM Date/Cum
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "7rem",
                      minWidth: "7rem",
                      maxWidth: "7rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Plan Pm Date
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "7rem",
                      minWidth: "7rem",
                      maxWidth: "7rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Actual Pm Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", width: "7rem", maxWidth: "7rem", minWidth: '7rem', backgroundColor: "inherit"}} >
                    Month End CUM
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", width: "7rem", maxWidth: "7rem", minWidth: '7rem', backgroundColor: "inherit"}}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", width: "10rem", maxWidth: "10rem", minWidth: '10rem', backgroundColor: "inherit" }}>
                    Remark
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      width: "5rem",
                      minWidth: "5rem",
                      maxWidth: "5rem",
                      backgroundColor: "inherit",
                    }}
                  >
                    Edit
                  </TableCell>
                  
                  {[...Array(31)].map((_, index) => (
                    <TableCell
                      align="center"
                      key={index}
                      sx={{
                        width: "1.5rem",
                        minWidth: "1.1rem",
                        maxWidth: "1.1rem",
                        fontSize: "0.7rem",
                        padding: "0.2rem",
                        backgroundColor: "inherit",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tools.length > 0 ? (
                  tools.map((elem, index) => (
                    <TableRow
                      key={elem._id || index}
                      hover
                      sx={{
                        bgcolor: elem._id == edit._id && "rgb(188, 196, 209)",
                        transition: "0.4s",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                    <TableCell align="center">
                      {elem._id == edit._id ? (
                        <TextField
                          fullWidth
                          // label="Schedule"
                          // placeholder='rtsp://192.168.1.100:554/stream1'
                          type="text"
                          defaultValue={elem.machine}
                          onChange={(e) =>
                            setEdit({ ...edit, machine: e.target.value })
                          }
                          sx={{ width: "100%" }}
                          size="small"
                        />
                      ) : (
                        elem.machine
                      )}
                    </TableCell>

                    <TableCell align="center" style={{width: '10rem', minWidth: '10rem', maxWidth: '10rem'}}>
                      {elem._id == edit._id ? (
                        <TextField
                          fullWidth
                          // label="Schedule"
                          // placeholder='rtsp://192.168.1.100:554/stream1'
                          type="text"
                          defaultValue={elem.mould_name}
                          onChange={(e) =>
                            setEdit({ ...edit, mould_name: e.target.value })
                          }
                          sx={{ width: "100%" }}
                          size="small"
                        />
                      ) : (
                        elem.mould_name
                      )}
                    </TableCell>
                    <TableCell sx={{ p: 0, width: "7rem", minWidth: '7rem', maxWidth: '7rem' }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        // bgcolor="red"
                        // width="100%"
                        
                        height={"100%"}
                        alignItems={"center"}
                      >
                        <Box
                          width="100%"
                          //   bgcolor="green"
                          borderBottom="1px solid rgb(92, 92, 92)"
                          p={"0.4rem"}
                          textAlign={"center"}
                          // sx={{maxHeight: '1rem', height: '1rem'}}
                        >
                          <Box
                            sx={{
                              height: "2.5rem",
                              maxHeight: "2.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: '7rem',
                              maxWidth: '7rem',
                              minWidth: '7rem',
                              // bgcolor: 'red'
                              
                            }}
                          >
                            {elem._id == edit._id ? (
                              <TextField
                                size="small"
                                // label="Last PM Date"
                                // sx={{ width: '45rem' }}
                                sx={{ height: "100%", width: '100%' }}
                                type="date"
                                // value={lastPmDate}
                                // onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                defaultValue={elem.last_pm_date}
                                onChange={(e) =>
                                  setEdit({
                                    ...edit,
                                    last_pm_date: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Typography>{elem.last_pm_date}</Typography>
                            )}
                          </Box>
                        </Box>
                        <Box
                          width="100%"
                          p={"0.4rem"}
                          textAlign={"center"}
                          sx={{ height: "2.5rem", maxHeight: "2.5rem" }}
                        >
                          -
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ p: 0, width: "7rem", minWidth: '7rem', maxWidth: '7rem' }}>  
                      <Box
                        display="flex"
                        flexDirection="column"
                        // bgcolor="red"
                        width="100%"
                        height={"100%"}
                        alignItems={"center"}
                      >
                        <Box
                          width="100%"
                          //   bgcolor="green"
                          borderBottom="1px solid rgb(92, 92, 92)"
                          p={"0.4rem"}
                          textAlign={"center"}
                        >
                          <Box
                            sx={{
                              height: "2.5rem",
                              maxHeight: "2.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: '7rem',
                              maxWidth: '7rem',   
                              width: '7rem',

                            }}
                          >
                            {elem._id == edit._id ? (
                              <TextField
                                size="small"
                                // label="Last PM Date"
                                // sx={{ width: '45rem' }}
sx={{ height: "100%", width: '100%' }}
                                type="date"
                                // value={lastPmDate}
                                // onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                defaultValue={elem.plan_pm_date}
                                onChange={(e) =>
                                  setEdit({
                                    ...edit,
                                    plan_pm_date: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Typography>{elem.plan_pm_date}</Typography>
                            )}
                          </Box>
                        </Box>
                        <Box
                          width="100%"
                          p={"0.4rem"}
                          textAlign={"center"}
                          sx={{ height: "2.5rem", maxHeight: "2.5rem" }}
                        >
                          -
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ p: 0, width: "7rem", minWidth: '7rem', maxWidth: '7rem' }}>  
                      <Box
                        display="flex"
                        flexDirection="column"
                        // bgcolor="red"
                        width="100%"
                        height={"100%"}
                        alignItems={"center"}
                      >
                        <Box
                          width="100%"
                          //   bgcolor="green"
                          borderBottom="1px solid rgb(92, 92, 92)"
                          p={"0.4rem"}
                          textAlign={"center"}
                        >
                          <Box
                            sx={{
                              height: "2.5rem",
                              maxHeight: "2.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: '7rem',
                              maxWidth: '7rem',   
                              width: '7rem',

                            }}
                          >
                            {elem._id == edit._id ? (
                              <TextField
                                size="small"
                                // label="Last PM Date"
                                // sx={{ width: '45rem' }}
sx={{ height: "100%", width: '100%' }}
                                type="date"
                                // value={lastPmDate}
                                // onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                defaultValue={elem.actual_pm_date}
                                onChange={(e) =>
                                  setEdit({
                                    ...edit,
                                    actual_pm_date: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Typography>{elem.actual_pm_date}</Typography>
                            )}
                          </Box>
                        </Box>
                        <Box
                          width="100%"
                          p={"0.4rem"}
                          textAlign={"center"}
                          sx={{ height: "2.5rem", maxHeight: "2.5rem" }}
                        >
                          -
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell  align="center">
                      {elem._id == edit._id ? (
                        <TextField
                          fullWidth
                          // label="Schedule"
                          // placeholder='rtsp://192.168.1.100:554/stream1'
                          type="text"
                          defaultValue={elem.month_end_CUM}
                          onChange={(e) =>
                            setEdit({ ...edit, month_end_CUM: e.target.value })
                          }
                          sx={{ width: "100%" }}
                          size="small"
                        />
                      ) : (
                        elem.month_end_CUM
                      )}
                    </TableCell>
                    <TableCell  align="center">
                      {elem._id == edit._id ? (
                        <TextField
                          fullWidth
                          // label="Schedule"
                          // placeholder='rtsp://192.168.1.100:554/stream1'
                          type="text"
                          defaultValue={elem.status}
                          onChange={(e) =>
                            setEdit({ ...edit, status: e.target.value })
                          }
                          sx={{ width: "100%" }}
                          size="small"
                        />
                      ) : (
                        elem.status
                      )}
                    </TableCell>

                    <TableCell  align="center">
                      {elem._id == edit._id ? (
                        <TextField
                          fullWidth
                          // label="Schedule"
                          // placeholder='rtsp://192.168.1.100:554/stream1'
                          type="text"
                          defaultValue={elem.remarks}
                          onChange={(e) =>
                            setEdit({ ...edit, remarks: e.target.value })
                          }
                          sx={{ width: "100%" }}
                          size="small"
                        />
                      ) : (
                        elem.remarks
                      )}
                    </TableCell>


                    {/* <TableCell>{elem.remarks}</TableCell> */}
                    <TableCell style={{width: '5rem', minWidth: '5rem', maxWidth: '5rem'}} align="center">
                      {/* {edit.id == elem.id ? <Button onClick={handleUpdate}>Submit</Button>:<Button onClick={()=> setEdit(elem)}>Edit</Button>}  */}
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
                          <IconButton onClick={() => setEdit({})} size="small">
                            <CloseIcon style={{ color: "#CC7C7C" }} />
                          </IconButton>
                          {/* import CloseIcon from '@mui/icons-material/Close'; */}
                          {/* <Button variant="contained"  color="success" onClick={handleSubmit}>Submit</Button> */}
                          <IconButton
                            onClick={handleUpdate}
                            style={{ color: "green" }}
                            size="small"
                          >
                            <MdDone />
                          </IconButton>
                        </Box>
                      ) : (
                        // <Button onClick={()=> setEdit(elem)}>Edit</Button>
                        <Box
                          width={"100%"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <IconButton
                            onClick={() => setEdit(elem)}
                            style={{ color: "grey" }}
                          >
                            <EditIcon style={{ color: "rgb(201, 162, 56)" }} />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                    {/* {
                  [...Array(31)].map((elem, index) => (
                      <TableCell key={index} ><Checkbox checked={elem?.last_pm_date?.split('-')[1] == index+1 || false} /></TableCell>
                      
                  ))} */}
                    {/* {[...Array(31)].map((_, index) => (
                      <TableCell  key={index}  align="center" style={{width: '1rem', minWidth: '1rem', maxWidth: '1rem', backgroundColor: 'green'}}>
                        <Checkbox
                        sx={{bgcolor: 'pink', width: '100%'}}
                        size="small"
                          checked={
                            elem?.last_pm_date?.split("-")[2] ===
                              String(index + 1).padStart(2, "0") || false
                          }
                        />
                      </TableCell>
                    ))} */}
{/* {[...Array(31)].map((_, index) => (
  <TableCell
    key={index}
    align="center"
    sx={{
      width: '1rem',
      minWidth: '1rem',
      maxWidth: '1rem',
      padding: '0.2rem', // Reduce padding for smaller size
    }}
  >
    <Box >
    <Checkbox
      sx={{
        width: '0.5rem', // Adjust checkbox size
        height: '0.5rem', // Adjust checkbox size
        padding: '0', // Remove extra padding
        color: 'red', // Unchecked color
    '&.Mui-checked': {
      color: 'red', // Checked color
    },
      }}
      size="small"
      // checked={
      //   elem?.last_pm_date?.split("-")[2] === String(index + 1).padStart(2, "0") || false
      // }
      checked={
        typeof elem?.plan_pm_date === 'string' &&
        elem.plan_pm_date.split('-')[2] === String(index + 1).padStart(2, '0')
      }
    />

<Checkbox
      sx={{
        width: '0.5rem', // Adjust checkbox size
        height: '0.5rem', // Adjust checkbox size
        padding: '0', // Remove extra padding
        color: 'green', // Unchecked color
    '&.Mui-checked': {
      color: 'green', // Checked color
    },
      }}
      size="small"
      // checked={
      //   elem?.last_pm_date?.split("-")[2] === String(index + 1).padStart(2, "0") || false
      // }
      checked={
        typeof elem?.actual_pm_date === 'string' &&
        elem.actual_pm_date.split('-')[2] === String(index + 1).padStart(2, '0')
      }
    />
    </Box>
  </TableCell>
))} */}
{[...Array(31)].map((_, index) => (
  <TableCell
    key={index}
    align="center"
    sx={{
      width: '1rem',
      minWidth: '1rem',
      maxWidth: '1rem',
      padding: '0.2rem',
    }}
  >
    <Box>
      {/* Red checkbox (planned PM date) */}
      {typeof elem?.plan_pm_date === 'string' &&
        elem.plan_pm_date.split('-')[2] === String(index + 1).padStart(2, '0') && (
          <Checkbox
            sx={{
              width: '0.5rem',
              height: '0.5rem',
              padding: '0',
              color: 'red',
              '&.Mui-checked': {
                color: 'red',
              },
            }}
            size="small"
            checked
          />
        )}

      {/* Green checkbox (actual PM date) */}
      {typeof elem?.actual_pm_date === 'string' &&
        elem.actual_pm_date.split('-')[2] === String(index + 1).padStart(2, '0') && (
          <Checkbox
            sx={{
              width: '0.5rem',
              height: '0.5rem',
              padding: '0',
              color: 'green',
              '&.Mui-checked': {
                color: 'green',
              },
            }}
            size="small"
            checked
          />
        )}
    </Box>
  </TableCell>
))}


                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={40} sx={{ border: "none" }} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      

      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        p={"0.5rem 0.4rem"}
        position={"sticky"}
        bottom={0}
        // mt={"2rem"}
        bgcolor={"white"}
        // zIndex={100} // Ensure it's above other elements
      >
        <Box
          width={"20rem"}
          height={"3rem"}
          border={"1px solid black"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          onClick={()=> setIsShowImg(true)}
          sx={{cursor: 'pointer'}}        >
          MASTER LIST OF MOLD
        </Box>
        <Box
          width={"20rem"}
          height={"3rem"}
          border={"1px solid black"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          onClick={()=> setIsShowImg(true)}
          sx={{cursor: 'pointer'}}        >
          TOOL LIFE MONITORING SHEET
        </Box>
        <Box
          width={"20rem"}
          height={"3rem"}
          border={"1px solid black"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          onClick={()=> setIsShowImg(true)}
          sx={{cursor: 'pointer'}}
        >
          PM MAINTAINANCE PLAN
        </Box>
        <Box
          width={"20rem"}
          height={"3rem"}
          border={"1px solid black"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          onClick={()=> setIsShowImg(true)}
          sx={{cursor: 'pointer'}}
        >
          TOOL MAINTAINANCE CHECK SHEET
        </Box>
      </Box>
      {
  isShowingImg && 
  <>
  <Box onClick={()=> {setIsShowImg(false)}} bgcolor={'rgba(24, 24, 24, 0.77)'} sx={{overflowY: 'auto'}} position={'fixed'} height={'100%'} width={'100%'} zIndex={'77'} top={0} left={'0'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <img onClick={(e)=> {e.stopPropagation()}} style={{width: '70%', marginTop: '1rem', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}} src={selectedImg} alt="" />
            {/* <Button sx={{position: 'absolute', top: '1rem', right: '1rem'}} onClick={()=> setIsShowImg(false)}>Delete</Button> */}
          </Box>
      
         {/* </Box> */}
         </>
}
</Box>
      
    </Box>
  );
};

export default ToolManage;
