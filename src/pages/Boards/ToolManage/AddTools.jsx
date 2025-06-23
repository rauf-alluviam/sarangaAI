import React from "react";
import colors from "../../../utils/colors";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTool } from "../../../Redux/Actions/toolManagementActions";

const AddTools = ({setIsOpen, setSelectedBoard}) => {
    const {token} = useSelector((state)=> state.auth)
    const [machine, setMachine] = React.useState("");
  const [mouldName, setMouldName] = React.useState("");
    const [monthEndCum, setMonthEndCum] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [lastPmDate, setLastPmDate] = React.useState("");
    const [nextPmDate, setNextPmDate] = React.useState("");
    const dispatch = useDispatch();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData= {
                    machine,
                    mould_name: mouldName,
                    month_end_CUM: monthEndCum,
                    status,
                    remarks,
                    last_pm_date: lastPmDate,
                    next_pm_date: nextPmDate
                }
    // Handle form submission logic here
    // console.log(machine, mouldName, monthEndCum, status, remarks, lastPmDate, nextPmDate);
    // dispatch(addTool(formData, token));
    try {
        const response= await axios.post(
            `https://rabs.alvision.in/submit_tool_management_sheet_entry`,
            {
                machine,
                mould_name: mouldName,
                month_end_CUM: monthEndCum,
                status,
                remarks,
                last_pm_date: lastPmDate,
                next_pm_date: nextPmDate
            },
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        )
        console.log(response)
        if(response.data.message == 'Entry submitted') {
            setIsOpen(false);
            // setSelectedBoard('none')
            alert("Tool added successfully");
        }
    } catch (error) {
      console.error("Error submitting form:", error);
        
    }
  };
  return (
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
      <Typography fontSize={"1.8rem"} textAlign={"center"}>
        Add New Item
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          bgcolor: "red",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "0.7rem",
        }}
      >
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <TextField
            fullWidth
            label="Machine"
            type="text"
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

       
          <TextField
            fullWidth
            label="Mould"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={mouldName}
            onChange={(e) => setMouldName(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

          <TextField
            // fullWidth
            label="Month End CUM"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={monthEndCum}
            onChange={(e) => setMonthEndCum(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

<TextField
            fullWidth
            label="Status"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

          <TextField
            fullWidth
            label="Remarks"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

          <TextField
            size="small"
            label="Last PM Date"
            // sx={{ width: '45rem' }}
            sx={{ mt: "1rem" }}
            type="date"
            value={lastPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setLastPmDate(e.target.value)}
          />

          <TextField
            size="small"
            label="Next PM Date"
            // sx={{ width: '45rem' }}
            sx={{ mt: "1rem" }}
            type="date"
            value={nextPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setNextPmDate(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: colors.primary, mt: 2 }}
                
          >
            Submit
          </Button>
        </Box>

        {/* <Box display={"flex"} flexDirection={"column"} width={"49%"}>
          <TextField
            fullWidth
            label="Plan"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

          <TextField
            fullWidth
            label="Actual"
            // placeholder='rtsp://192.168.1.100:554/stream1'
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
          />

          <TextField
            size="small"
            label="Select Date"
            // sx={{ width: '45rem' }}
            sx={{ mt: "1rem" }}
            type="date"
            value={lastPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setLastPmDate(e.target.value)}
          />

          <TextField
            size="small"
            label="Select Date"
            // sx={{ width: '45rem' }}
            sx={{ mt: "1rem" }}
            type="date"
            value={nextPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setNextPmDate(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: colors.primary, mt: 2 }}
            fullWidth
          >
            Submit
          </Button>
        </Box> */}
      </form>
    </Box>
  );
};

export default AddTools;
