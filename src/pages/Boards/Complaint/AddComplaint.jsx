import React, { useState } from "react";
import colors from "../../../utils/colors";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addFgStock,
  getAllFgStock,
} from "../../../Redux/Actions/fgStockActions";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddComplaint = ({ setIsOpen }) => {
  const { token } = useSelector((state) => state.auth);
  //   const [itemDescription, setItemDescription]= React.useState('');
  //   const [itemCode, setItemCode]= React.useState('');
  //   const [minimum, setMinimum]= React.useState('');
  //   const [maximum, setMaximum]= React.useState('');
  //   const [todaysTarget, setTodaysTarget]= useState('');
  //   const [current, setCurrent]= React.useState('');
  //   const [schedule, setSchedule]= React.useState('');
  //   const [dispatched, setDispatched]= React.useState('');
  //   const [balance, setBalance]= React.useState('');
  //   const [nextAction, setNextAction]= React.useState('');
  //   const [resp, setResp]= React.useState('');
  //   const [nextDayTarget, setNextDayTarget]= React.useState('');
  //   const [timestamp, setTimestamp]= React.useState('2025-05-22T13:20:56.257Z');

  // {
  //     "customer": "IJL ",
  //     "part_name": "Shade-A",
  //     "complaint": "Short Height mold",
  //     "complaint_date": "2025-06-05",
  //     "part_recieved_date": "2025-06-05",
  //     "problem_description": " PINS hole location area short mold",
  //     "quantity": 2,
  //     "line_name": "Molding",
  //     "tracebility": "2025-04-25",
  //     "first_repeat": "first",
  //     "supplier": "Inhouse",
  //     "process": "Molding",
  //     "temporary_action": "marking in areas",
  //     "temporary_target_date": "2025-05-14",
  //     "root_cause": "setup part mixed",
  //     "permanent_action": "s - ok marking in each part",
  //     "permanent_target_date": "2025-05-07",
  //     "responsibility": "Amzad",
  //     "status": "ok",
  //     "standerdization": "not ok",
  //     "horizental_deployment": true,
  //     "timestamp": "2025-06-11T13:27:34.298000",
  //     "part_received_date": "2025-09-05",
  //     "id": "684981ca67e965218a328fc8"
  //   },
  const [customer, setCustomer] = useState("");
  const [partName, setPartName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [complaintDate, setComplaintDate] = useState("");
  const [partRecievedDate, setPartRecievedDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lineName, setLineName] = useState("");
  const [tracebility, setTracebility] = useState("");
  const [firstRepeat, setFirstRepeat] = useState("");
  const [supplier, setSupplier] = useState("");
  const [process, setProcess] = useState("");
  const [temporaryAction, setTemporaryAction] = useState("");
  const [temporaryTargetDate, setTemporaryTargetDate] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [permanentAction, setPermanentAction] = useState("");
  const [permanentTargetDate, setPermanentTargetDate] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [status, setStatus] = useState("");
  const [standerdization, setStanderdization] = useState("");
  const [horizentalDeployment, setHorizentalDeployment] = useState('yes');
  const [partReceivedDate, setPartReceivedDate] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

//   const dispatch = useDispatch();
  // console.log(new Date())

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // const data = {
//     //     customer: "Honda",
//     //     part_name: "Shade-B",
//     //     complaint: "Short Height mold",
//     //     complaint_date: "2025-06-05",
//     //     part_recieved_date: "2025-06-05",
//     //     problem_description: "PINS hole location area short mold",
//     //     quantity: 2,
//     //     line_name: "Molding",
//     //     tracebility: "2025-04-25",
//     //     first_repeat: "first",
//     //     supplier: "Inhouse",
//     //     process: "Molding",
//     //     temporary_action: "marking in areas",
//     //     temporary_target_date: "2025-05-14",
//     //     root_cause: "setup part mixed",
//     //     permanent_action: "s - ok marking in each part",
//     //     permanent_target_date: "2025-05-07",
//     //     responsibility: "Amzad",
//     //     status: "ok",
//     //     standerdization: "not ok",
//     //     horizental_deployment: "true",
//     //     timestamp: "2025-06-11T13:27:34.298000",
//     //     part_received_date: "2025-09-05"
//     // };

//     const data = {
//         customer,
//         part_name: partName,
//         complaint,
//         complaint_date: complaintDate,
//         part_recieved_date: partRecievedDate,
//         problem_description: problemDescription,
//         quantity,
//         line_name: lineName,
//         tracebility,
//         first_repeat: firstRepeat,
//         supplier,
//         process,
//         temporary_action: temporaryAction,
//         temporary_target_date: temporaryTargetDate,
//         root_cause: rootCause,
//         permanent_action: permanentAction,
//         permanent_target_date: permanentTargetDate,
//         responsibility,
//         status,
//         standerdization,
//         horizental_deployment: horizentalDeployment,
//         timestamp,
//         part_received_date: partReceivedDate,
//       };
//     console.log(data)
//     try {
//         console.log(data)
//       const response= await axios.post(`${BACKEND_API}/submit_customer_complaint_sheet_entry`, data,
//         {
//           headers: {
//             'accept': 'application/json',
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         } 
//       );
//       setIsOpen(false);
//       alert(response.data.message)
//     } catch (error) {
//       console.log(error)

//     }

//     // dispatch(addFgStock(data));
//     // setIsOpen(false);
//     // axios.post('http://
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('first')
    const data = {
      customer,
      part_name: partName,
      complaint,
      complaint_date: complaintDate,
      part_recieved_date: partRecievedDate,
      problem_description: problemDescription,
      quantity,
      line_name: lineName,
      tracebility,
      first_repeat: firstRepeat,
      supplier,
      process,
      temporary_action: temporaryAction,
      temporary_target_date: temporaryTargetDate,
      root_cause: rootCause,
      permanent_action: permanentAction,
      permanent_target_date: permanentTargetDate,
      responsibility,
      status,
      standerdization,
      horizental_deployment: horizentalDeployment,
      timestamp,
      part_received_date: partReceivedDate,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `${BACKEND_API}/submit_customer_complaint_sheet_entry`,
        data,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsOpen(false);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box
    onClick={(e) => e.stopPropagation()}
    height={"auto"}
    borderRadius={"8px"}
    width={"60rem"}
    bgcolor={"white"}
    display={"flex"}
    flexDirection={"column"}
    alignItems={"center"}
    justifyContent={"space-between"}
    p={"2rem"}
  >
    <Typography fontSize={"1.8rem"} textAlign={"center"}>
      Add Complaint
    </Typography>
  
    <form
       onSubmit={handleSubmit}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "0.7rem",
      }}
    >
      <Box display={"flex"} flexDirection={"column"} width={"49%"}>
        <TextField
          fullWidth
          label="Customer Name"
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Part Name"
          type="text"
          value={partName}
          onChange={(e) => setPartName(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Complaint"
          type="text"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          size="small"
          label="Complaint Date"
          sx={{ mt: "1rem" }}
          type="date"
          value={complaintDate}
          onChange={(e) => setComplaintDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
  
        <TextField
          size="small"
          label="Part Received Date"
          sx={{ mt: "1rem" }}
          type="date"
          value={partRecievedDate}
          onChange={(e) => setPartRecievedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
  
        <TextField
          fullWidth
          label="Problem Description"
          type="text"
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Line Name"
          type="text"
          value={lineName}
          onChange={(e) => setLineName(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Traceability"
          type="text"
          value={tracebility}
          onChange={(e) => setTracebility(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />

<TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="First Repeat"
          type="text"
          value={firstRepeat}
          onChange={(e) => setFirstRepeat(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />

<TextField
          fullWidth
          label="Supplier"
          type="text"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
      </Box>
  
      <Box display={"flex"} flexDirection={"column"} width={"49%"}>
        
  
       
  
        <TextField
          fullWidth
          label="Process"
          type="text"
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Temporary Action"
          type="text"
          value={temporaryAction}
          onChange={(e) => setTemporaryAction(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          size="small"
          label="Temporary Target Date"
          sx={{ mt: "1rem" }}
          type="date"
          value={temporaryTargetDate}
          onChange={(e) => setTemporaryTargetDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
  
        <TextField
          fullWidth
          label="Root Cause"
          type="text"
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Permanent Action"
          type="text"
          value={permanentAction}
          onChange={(e) => setPermanentAction(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          size="small"
          label="Permanent Target Date"
          sx={{ mt: "1rem" }}
          type="date"
          value={permanentTargetDate}
          onChange={(e) => setPermanentTargetDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
  
        <TextField
          fullWidth
          label="Responsibility"
          type="text"
          value={responsibility}
          onChange={(e) => setResponsibility(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Status"
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
  
        <TextField
          fullWidth
          label="Standardization"
          type="text"
          value={standerdization}
          onChange={(e) => setStanderdization(e.target.value)}
          sx={{ mt: "1rem" }}
          size="small"
        />
<FormControl fullWidth sx={{ mt: "1rem" }} size="small">
  <InputLabel id="horizental-deployment-label">Horizontal Deployment</InputLabel>
  <Select
    labelId="horizental-deployment-label"
    value={horizentalDeployment}
    onChange={(e) => setHorizentalDeployment(e.target.value)}
    label="Horizontal Deployment"
  >
    <MenuItem value="yes">Yes</MenuItem>
    <MenuItem value="no">No</MenuItem>
  </Select>
</FormControl>
        
        <TextField
          size="small"
          label="Part Received Date"
          sx={{ mt: "1rem" }}
          type="date"
          value={partReceivedDate}
          onChange={(e) => setPartReceivedDate(e.target.value)}
          InputLabelProps={{ shrink: true }} />
      </Box>
    </form>
  

    <Button
      type="submit"
      onClick={handleSubmit}
      variant="contained"
      sx={{ bgcolor: colors.primary, mt: 2 }}
      fullWidth
    >
      Submit
    </Button>
  </Box>
  );
};

export default AddComplaint;
