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
// import AddStock from "./AddStock";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MdDone, MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import AddComplaint from "./AddComplaint";
import { fetchComplaints, updateComplaint } from "../../../Redux/Actions/complaintAction";
import { enqueueSnackbar } from "notistack";
import { IoPersonSharp } from "react-icons/io5";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Complaint = () => {
  const { userData, token } = useSelector((state) => state.auth);
  const { complaints, complaintsLoading } = useSelector((state) => state.complaint);
console.log(complaintsLoading, complaints)
  const dispatch= useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // const [stock, setStock] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    console.log(month)
  
  // const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState({});
  console.log(edit)

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



  // useEffect(() => {
  //   // const [year, week] = date.split("-W");
  //   // console.log(date);
  //   async function fetchData() {
  //     const [selectedYear, selectedMonth] = month.split("-");
  //     try {
  //       // setIsLoading(true);
  //       const response = await axios.get(
  //         `${BACKEND_API}/get_monthly_customer_complaint_sheets/${selectedYear}/${selectedMonth}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       // setIsLoading(false);
  //       setStock(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, [date, isOpen, edit, month]);

  useEffect(()=> {
    dispatch(fetchComplaints(month.split("-")[0], month.split("-")[1], token))
  }, [month])

  const handleUpdate = async () => {
    dispatch(updateComplaint(edit.id, edit, 
      (successMsg)=>{setEdit({}); enqueueSnackbar(successMsg, { variant: 'success' })},
      (errorMsg)=> enqueueSnackbar(errorMsg, { variant: 'error' })
  
  ));
    // try {
    //   const response = await axios.put(
    //     `${BACKEND_API}/update_customer_complaint_sheet_entry/${edit.id}`,
    //     edit,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   console.log(response.data);
    //   setEdit({});
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
      }}
    >
      {/* <Typography
        sx={{
          fontSize: "2rem",
          textAlign: "center",
          borderBottom: "1px solid #282828",
          width: "50rem",
          marginLeft: "auto",
          mr: "auto",
        }}
      >
        CUSTOMER COMPLAINT MEETING BOARD
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
              CUSTOMER COMPLAINT MEETING BOARD
            </Typography>

      {/* <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your action was successful.
    </Alert> */}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: "1.6rem",
          ml: "auto",
          // mr: "auto",
          padding: "0.5rem",
          // bgcolor: 'red'
        }}
      >
         <Box
         
  ml="1rem"
  display="flex"
  alignItems="center"
  sx={{
    bgcolor: "#FAFAFA",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
    // width: "100%",
    maxWidth: "600px",
    flexWrap: "wrap", // for responsiveness
  }}
>
  {/* Label Section */}
  <Box
    display="flex"
    width="12rem"
    alignItems="center"
    sx={{ mr: "1rem" }}
  >
    <IoPersonSharp style={{ color: "#282828", fontSize: "1.5rem", marginRight: "0.5rem" }} />
    <Typography fontWeight={500}>Responsible Person-</Typography>
  </Box>

  {/* Conditional Render */}
  {complaints.length > 0 ? (
    edit.id === complaints[0].id ? (
      <>
        <TextField
          type="text"
          defaultValue={complaints[0]?.responsibility || ""}
          onChange={(e) => setEdit({ ...edit, responsibility: e.target.value })}
          sx={{ width: "7rem" }}
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "1rem",
          }}
        >
          <IconButton onClick={() => setEdit({})}>
            <CloseIcon sx={{ color: "#CC7C7C" }} />
          </IconButton>
          <IconButton onClick={handleUpdate}>
            <MdDone style={{ color: "green" }} />
          </IconButton>
        </Box>
      </>
    ) : (
      <Box
        sx={{
          backgroundColor: "#FFCDD2",
          height: "2rem",
          borderRadius: "4px",
          padding: "0 0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: "0.5rem",
          color: "#282828",
          boxShadow: "rgba(0, 0, 0, 0.17) 0px 3px 8px",
        }}
      >
        {complaints[0]?.responsibility || "Not mentioned"}
      </Box>
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

  {/* Edit Icon */}
  {complaints.length > 0 && edit.id !== complaints[0]?.id && (
    <IconButton
      onClick={() => setEdit(complaints[0])}
      sx={{ color: "rgb(201, 162, 56)", ml: "1rem" }}
    >
      <EditIcon />
    </IconButton>
  )}
</Box>

        <Button
          sx={{ bgcolor: colors.primary, width: "10rem", ml: 'auto' }}
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          Add New Item
        </Button>
      <TextField
                size="small"
                label="Select Month and Year"
                // sx={{ width: '45rem' }}
                sx={{ width: "12rem", ml: '1rem' }}
                // fullWidth
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
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
          <AddComplaint setIsOpen={setIsOpen} />
        </Box>
      )}

      {/* --------------Table------------------- */}
      <Box
        position="relative"
        mr="1rem"
        p="0.7rem"
        borderRadius="6px"
        display="flex"
        flexDirection="column"
        alignItems="start"
        sx={{
          height: "80vh",
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
        <Paper sx={{overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader aria-label="sticky table"  border={1} >
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
                  <TableCell sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>Sr No</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Customer
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Part Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Complaint
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Complaint Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Part Received Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Problem Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Quantity
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Line Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Tracability
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    First/ Repeat
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Supplier/ Inhouse
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Process
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Temporary Action
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Target Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Root Cause
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Permanent Action
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Target Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Responsibility
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Standardization
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Horizontal Deployment (Y/N)
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1.2rem", backgroundColor: "inherit" }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {complaints.length > 0 ? (
                  complaints.map((elem, index) => (
                    <TableRow
                      key={elem.id || index}
                      hover
                      sx={{
                        bgcolor: elem.id === edit.id && "rgb(188, 196, 209)",
                        transition: "0.4s",
                        position: "relative",
                      }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.customer || ""}
              onChange={(e) => setEdit({ ...edit, customer: e.target.value })}
              size="small"
            />
          ) : (
            elem.customer
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.part_name || ""}
              onChange={(e) => setEdit({ ...edit, part_name: e.target.value })}
              size="small"
            />
          ) : (
            elem.part_name
          )}    
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.complaint || ""}
              onChange={(e) => setEdit({ ...edit, complaint: e.target.value })}
              size="small"
            />
          ) : (
            elem.complaint
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="date"
              value={edit.complaint_date || ""}
              onChange={(e) =>
                setEdit({ ...edit, complaint_date: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            elem.complaint_date
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="date"
              value={edit.part_received_date || ""}
              onChange={(e) =>
                setEdit({ ...edit, part_received_date: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            elem.part_received_date
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.problem_description || ""}
              onChange={(e) =>
                setEdit({ ...edit, problem_description: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.problem_description
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="number"
              value={Number(edit.quantity) || ""}
              onChange={(e) => setEdit({ ...edit, quantity: Number(e.target.value) })}
              size="small"
            />
          ) : (
            elem.quantity
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.line_name || ""}
              onChange={(e) => setEdit({ ...edit, line_name: e.target.value })}
              size="small"
            />
          ) : (
            elem.line_name
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="date"
              value={edit.tracebility || ""}
              onChange={(e) => setEdit({ ...edit, tracebility: e.target.value })}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            elem.tracebility
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.first_repeat || ""}
              onChange={(e) =>
                setEdit({ ...edit, first_repeat: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.first_repeat
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.supplier || ""}
              onChange={(e) => setEdit({ ...edit, supplier: e.target.value })}
              size="small"
            />
          ) : (
            elem.supplier
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.process || ""}
              onChange={(e) => setEdit({ ...edit, process: e.target.value })}
              size="small"
            />
          ) : (
            elem.process
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.temporary_action || ""}
              onChange={(e) =>
                setEdit({ ...edit, temporary_action: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.temporary_action
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="date"
              value={edit.temporary_target_date || ""}
              onChange={(e) =>
                setEdit({ ...edit, temporary_target_date: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            elem.temporary_target_date
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.root_cause || ""}
              onChange={(e) => setEdit({ ...edit, root_cause: e.target.value })}
              size="small"
            />
          ) : (
            elem.root_cause
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.permanent_action || ""}
              onChange={(e) =>
                setEdit({ ...edit, permanent_action: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.permanent_action
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              type="date"
              value={edit.permanent_target_date || ""}
              onChange={(e) =>
                setEdit({ ...edit, permanent_target_date: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            elem.permanent_target_date
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.responsibility || ""}
              onChange={(e) =>
                setEdit({ ...edit, responsibility: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.responsibility
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            // <TextField
            //   fullWidth
            //   value={edit.status || ""}
            //   onChange={(e) => setEdit({ ...edit, status: e.target.value })}
            //   size="small"
            // />
            <FormControl fullWidth size="small">
            <InputLabel id="status-label">
              Status
            </InputLabel>
            <Select
              labelId="status-label"
              value={edit.status || ""}
              onChange={(e) =>
                setEdit({ ...edit, status: e.target.value })
              }
              label="Status"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>

          ) : (
            <Box>
            {elem.status == 'yes'&& <Box m={'auto'} bgcolor={'green'} width={'22px'} height={'22px'} borderRadius={'50%'}></Box>}
           { elem.status == 'no' && <Box m={'auto'} bgcolor={'red'} width={'22px'} height={'22px'} borderRadius={'50%'}></Box>}
            </Box>
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <TextField
              fullWidth
              value={edit.standerdization || ""}
              onChange={(e) =>
                setEdit({ ...edit, standerdization: e.target.value })
              }
              size="small"
            />
          ) : (
            elem.standerdization
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <FormControl fullWidth size="small">
              <InputLabel id="horizental-deployment-label">
                Horizontal Deployment
              </InputLabel>
              <Select
                labelId="horizental-deployment-label"
                value={edit.horizental_deployment || ""}
                onChange={(e) =>
                  setEdit({ ...edit, horizental_deployment: e.target.value })
                }
                label="Horizontal Deployment"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          ) : (
            elem.horizental_deployment
          )}
        </TableCell>
        <TableCell align="center">
          {edit.id === elem.id ? (
            <Box display="flex" justifyContent="center">
              <IconButton onClick={() => setEdit({})}>
                <CloseIcon style={{ color: "#CC7C7C" }} />
              </IconButton>
              <IconButton onClick={handleUpdate}>
                <MdDone style={{ color: "green" }} />
              </IconButton>
            </Box>
          ) : (
            <IconButton onClick={() => setEdit(elem)} >
              <EditIcon style={{ color: "rgb(201, 162, 56)" }} />
            </IconButton>
          )}
        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={23} align="center">
                      <Typography>No complaints available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Complaint;
