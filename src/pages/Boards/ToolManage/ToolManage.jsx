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
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../../utils/colors";
import AddTools from "./AddTools";
import { MdDone } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { addTool, fetchTools } from "../../../Redux/Actions/toolManagementActions";

const ToolManage = () => {
  const { token } = useSelector((state) => state.auth);
  const { tools } = useSelector((state) => state.toolManagement);
  console.log(tools);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState({});
  const dispatch = useDispatch();
  console.log(month);
  useEffect(() => {
    async function fetchData() {
      const [selectedYear, selectedMonth] = month.split("-");

      // dispatch(fetchTools(selectedYear, selectedMonth, token));
      try {
        const response = await axios.get(
          `https://rabs.alvision.in/get_daily_tool_management_sheets/${selectedYear}/${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        console.log(response.data); // Axios handles JSON parsing
        setData(response.data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
    fetchData();
  }, [isOpen, month, edit]);

  const handleUpdate = async () => {
    
    try {
      const response = await axios.put(
        `https://rabs.alvision.in/update_tool_management_sheet_entry/${edit.id}`,
        edit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      if (
        response.data.message === "Tool management entry updated successfully"
      ) {
        setEdit({});
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <Box minHeight={"89vh"} position={"relative"}>
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

      <Box
        sx={{
          height: "6rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "0rem 1rem",
          border: "1px solid black",
        }}
      >
        <Box width={"25rem"} height={"95%"} display={'flex'} flexWrap={'wrap'} p={'0.4rem'}>
          <Box width={'40%'} height={'2rem'} bgcolor={'white'} m={'auto'} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid black'}>PM PLAN</Box>
          <Box width={'40%'} height={'2rem'} bgcolor={'white'} m={'auto'} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid black'}>MODIFICATIONS</Box>
          <Box width={'40%'} height={'2rem'} bgcolor={'white'} m={'auto'} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid black'}>PM ACTUAL</Box>
          <Box width={'40%'} height={'2rem'} bgcolor={'white'} m={'auto'} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid black'}>REPAIR</Box>
        </Box>
        <Typography fontSize={"1.8rem"}>
          Tool Management Board - Monthly
        </Typography>
        <Box
          display={"flex"}
          flexDirection={"column"}
          p={"0.4rem"}
          border={"1px solid black"}
        >
          <span>CUM- Cumulative</span>
          <span>PRO- Production</span>
          <span>PM- Preventive Maintainance</span>
        </Box>

       
        <TextField
          size="small"
          label="Select Month and Year"
          // sx={{ width: '45rem' }}
          sx={{ width: "10rem" }}
          // fullWidth
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

<Button
          onClick={() => setIsOpen(true)}
          variant="contained"
          sx={{ bgcolor: colors.primary, width: "9rem" }}
        >
          Add New Item
        </Button>
      </Box>

      <Paper sx={{ maxHeight: "75vh", overflow: "auto"}}>
        <TableContainer>
          <Table aria-label="simple table" border={1}>
            <TableHead sx={{ bgcolor: "grey", border: "1px solid black" }}>
              <TableRow
                sx={{
                  bgcolor: "rgb(164, 182, 211)",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <TableCell align="center" sx={{fontSize: "1rem", minWidth: '1.4rem', maxWidth: '1.4rem', width: '1.4rem'}}>Sr No</TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontSize: "1.2rem",
                    width: "8rem",
                    minWidth: "8rem",
                    maxWidth: "8rem",
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
                  }}
                >
                  Last PM Date/Cum
                </TableCell>
                {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                <TableCell
                  align="center"
                  style={{
                    fontSize: "1.2rem",
                    width: "7rem",
                    minWidth: "7rem",
                    maxWidth: "7rem",
                  }}
                >
                  Next PM Date/Cum
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem", width: "7rem", maxWidth: "7rem", minWidth: '7rem'}} >
                  Month End CUM
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem", width: "7rem", maxWidth: "7rem", minWidth: '7rem'}}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem", width: "10rem", maxWidth: "10rem", minWidth: '10rem' }}>
                  Remark
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontSize: "1.2rem",
                    width: "5rem",
                    minWidth: "5rem",
                    maxWidth: "5rem",
                  }}
                >
                  Edit
                </TableCell>
                
                {/* {[...Array(31)].map((elem, index) => (
                  <TableCell align="center" key={index} style={{width: '1rem', minWidth: '1rem', maxWidth: '1rem', backgroundColor: 'green'}}>{index + 1}</TableCell>
                ))} */}
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
        }}
      >
        {index + 1}
      </TableCell>
    ))}

               
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                data.map((elem, index) => (
                  <TableRow
                    sx={{
                      bgcolor: elem.id == edit.id && "rgb(188, 196, 209)",
                      transition: "0.4s",
                      // boxShadow:
                      //   elem.id == edit.id && "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="center">
                      {elem.id == edit.id ? (
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
                      {elem.id == edit.id ? (
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
                            {elem.id == edit.id ? (
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
                            {elem.id == edit.id ? (
                              <TextField
                                size="small"
                                // label="Last PM Date"
                                // sx={{ width: '45rem' }}
sx={{ height: "100%", width: '100%' }}
                                type="date"
                                // value={lastPmDate}
                                // onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                defaultValue={elem.next_pm_date}
                                onChange={(e) =>
                                  setEdit({
                                    ...edit,
                                    next_pm_date: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Typography>{elem.next_pm_date}</Typography>
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
                      {elem.id == edit.id ? (
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
                      {elem.id == edit.id ? (
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
                      {elem.id == edit.id ? (
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
                      {edit.id == elem.id ? (
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
{[...Array(31)].map((_, index) => (
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
    <Checkbox
      sx={{
        width: '0.5rem', // Adjust checkbox size
        height: '0.5rem', // Adjust checkbox size
        padding: '0', // Remove extra padding
      }}
      size="small"
      checked={
        elem?.last_pm_date?.split("-")[2] === String(index + 1).padStart(2, "0") || false
      }
    />
  </TableCell>
))}
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: "none" }} align="center">
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
        mt={"2rem"}
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
        >
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
        >
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
        >
          TOOL MAINTAINANCE CHECK SHEET
        </Box>
      </Box>
    </Box>
  );
};

export default ToolManage;
