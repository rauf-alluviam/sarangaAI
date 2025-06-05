import {
  Box,
  Checkbox,
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
import React, { useState } from "react";

const ToolManage = () => {
    const [month, setMonth]= useState(new Date().toISOString().slice(0, 7));
    console.log(month)
  return (
    <Box>
       <Box sx={{ height: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '0rem 1rem', border: '1px solid black'}}>
        <Box width={'20rem'} height={'95%'} bgcolor={'grey'}></Box>
        <Typography fontSize={'2.5rem'}>Tool Management Board - Monthly</Typography>
        <Box display={'flex'} flexDirection={'column'} p={'0.4rem'} border={'1px solid black'}>
            <span>CUM- Cumulative</span>
            <span>PRO- Production</span>
            <span>PM- Preventive Maintainance</span>
        </Box>
        <TextField
                       size='small'
                       label="Select Month and Year"
                       // sx={{ width: '45rem' }}
                       sx={{ width: '10rem' }}
                       // fullWidth
                       type="month"
                       value={month}
                       onChange={(e) => setMonth(e.target.value)}
                       InputLabelProps={{ shrink: true }}
                       
                     />
       </Box>


      <Paper sx={{ maxHeight: "75vh", overflow: "auto" }}>
        <TableContainer>
          <Table aria-label="simple table" border={1}>
            <TableHead sx={{ bgcolor: "grey", border: "1px solid black" }}>
              <TableRow
                sx={{
                  bgcolor: "rgb(164, 182, 211)",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <TableCell sx={{ fontSize: "1.2rem" }}>Sr No</TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  Mould Name
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  M/c
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  Last PM Date/Cum
                </TableCell>
                {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  Next PM Date/Cum
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  Month End CUM
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.2rem" }}>
                  Status
                </TableCell>
                {
                [...Array(31)].map((elem, index) => (
                    <TableCell key={index} >{index+1}</TableCell>
                    
                ))}
               
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>4708</TableCell>
                <TableCell>Alt shade-A</TableCell>
                <TableCell sx={{ p: 0, width: '100%' }}>
  <Box
    display="flex"
    flexDirection="column"
    // bgcolor="red"
    width="100%"
    height={'100%'}
    alignItems={'center'}
    
  >
    <Box
      width="100%"
    //   bgcolor="green"
      borderBottom="1px solid rgb(92, 92, 92)"
      p={'0.4rem'}
      textAlign={'center'}
    >
      Top
    </Box>
    <Box width="100%" p={'0.4rem'} textAlign={'center'}>Bottom</Box>
  </Box>
</TableCell>

                <TableCell sx={{ p: 0, width: '100%' }}>
                <Box
    display="flex"
    flexDirection="column"
    // bgcolor="red"
    width="100%"
    height={'100%'}
    alignItems={'center'}
    
  >
    <Box
      width="100%"
    //   bgcolor="green"
      borderBottom="1px solid rgb(92, 92, 92)"
      p={'0.4rem'}
      textAlign={'center'}
    >
      Top
    </Box>
    <Box width="100%" p={'0.4rem'} textAlign={'center'}>Bottom</Box>
  </Box>
                </TableCell>

                <TableCell>300</TableCell>
                <TableCell>Pr/Cu</TableCell>
{
                [...Array(31)].map((elem, index) => (
                    <TableCell key={index} ><Checkbox /></TableCell>
                    
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box width={'100%'} display={'flex'} justifyContent={'space-between'} p={'0rem 0.4rem'} mt={'1rem'}>
        <Box width={'20rem'} height={'3rem'} border={'1px solid black'} display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>MASTER LIST OF MOLD</Box>
        <Box width={'20rem'} height={'3rem'} border={'1px solid black'} display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>TOOL LIFE MONITORING SHEET</Box>
        <Box width={'20rem'} height={'3rem'} border={'1px solid black'} display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>PM MAINTAINANCE PLAN</Box>
        <Box width={'20rem'} height={'3rem'} border={'1px solid black'} display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>TOOL MAINTAINANCE CHECK SHEET</Box>
      </Box>
    </Box>
  );
};

export default ToolManage;
