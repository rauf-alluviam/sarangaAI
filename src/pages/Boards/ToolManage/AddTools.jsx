import React from "react";
import colors from "../../../utils/colors";
import { Box, Button, TextField, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { addTool } from "../../../Redux/Actions/toolManagementActions";
import { enqueueSnackbar } from "notistack";

// const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const BACKEND_API= import.meta.env.VITE_BACKEND_API;


const AddTools = ({ setIsOpen }) => {
    const {token} = useSelector((state)=> state.auth)
    const [machine, setMachine] = React.useState("");
  const [mouldName, setMouldName] = React.useState("");
    const [monthEndCum, setMonthEndCum] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [lastPmDate, setLastPmDate] = React.useState("");
    const [planPmDate, setPlanPmDate] = React.useState("");
    const [actualPmDate, setActualPmDate] = React.useState("");
    const [respPerson, setRespPerson] = React.useState("");
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
                    plan_pm_date: planPmDate,
                  actual_pm_date: actualPmDate,
                  resp_person: respPerson,
                  timestamp: new Date().toISOString()
                }
                
    // Handle form submission logic here
    // console.log(machine, mouldName, monthEndCum, status, remarks, lastPmDate, nextPmDate);
    // dispatch(addTool(formData, token, 
    //     (successMessage) => {
    //         setIsOpen(false);
    //         enqueueSnackbar(successMessage || 'Tool added successfully', { variant: 'success' });
    //         setSelectedBoard('none');
    //     }, 
    //     (errorMessage) => {
    //         enqueueSnackbar(errorMessage || 'Failed to add Tool', { variant: 'error' });
    //     }
    // ));
    dispatch(
      addTool(
        formData,
        token,
        (successMessage) => {
          // Success callback
          setIsOpen(false);
          enqueueSnackbar(successMessage || "Tool added successfully", { variant: "success" });
          // setSelectedBoard("none");
        },
        (errorMessage) => {
          // Error callback
          enqueueSnackbar(errorMessage || "Failed to add Tool", { variant: "error" });
        }
      )
    );
    // try {
    //     const response= await axios.post(
    //         `${BACKEND_API}/submit_tool_management_sheet_entry`,
    //         {
    //             machine,
    //             mould_name: mouldName,
    //             month_end_CUM: monthEndCum,
    //             status,
    //             remarks,
    //             last_pm_date: lastPmDate,
    //             plan_pm_date: planPmDate,
//             actual_pm_date: actualPmDate,
//             resp_person: respPerson,
    //         },
    //         {
    //             headers: {
    //                 'accept': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         }
    //     )
    //     console.log(response)
    //     if(response.data.message == 'Entry submitted') {
    //         setIsOpen(false);
    //         // enqueueSnackbar(response?.data?.message, { variant: 'success' })
    //         enqueueSnackbar(response?.data?.message || 'Tool added successfully', { variant: 'success' })
    //         // setSelectedBoard('none')
    //         // alert("Tool added successfully");
          
    //     }
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   // enqueueSnackbar(error?.data?.message, { variant: 'error' })
    //   enqueueSnackbar(error?.response?.data?.message || 'Failed to add Tool', { variant: 'error' })
        
    // }
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
            label="Plan PM Date"
            // sx={{ width: '45rem' }}
            sx={{ mt: "1rem" }}
            type="date"
            value={planPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setPlanPmDate(e.target.value)}
          />

          <TextField
            size="small"
            label="Actual PM Date"
            sx={{ mt: "1rem" }}
            type="date"
            value={actualPmDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setActualPmDate(e.target.value)}
          />

          <TextField
            fullWidth
            label="Responsible Person"
            type="text"
            value={respPerson}
            onChange={(e) => setRespPerson(e.target.value)}
            sx={{ mt: "1rem" }}
            size="small"
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
            value={planPmDate}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setPlanPmDate(e.target.value)}
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
