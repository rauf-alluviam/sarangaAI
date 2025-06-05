import React from 'react'
import colors from '../../../utils/colors'
import { Box, Button, TextField, Typography } from '@mui/material'

const FourM = () => {
  return (
    <div>
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
                width: "25rem",
                marginLeft: "auto",
                mr: "auto",
              }}
            >
              4M CHANGE BOARD
            </Typography>
      
            <Box
              sx={{
                width: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                mt: "1.6rem",
                ml: "auto",
                mr: "auto",
                padding: "0.5rem",
              }}
            >
              
              <TextField
               size='small'
               label="Select Month and Year"
               // sx={{ width: '45rem' }}
               sx={{ width: '10rem' }}
               // fullWidth
               type="month"
              //  value={monthly}
              //  onChange={(e) => setMonthly(e.target.value)}
               InputLabelProps={{ shrink: true }}
               required
             />
            </Box>
            </Box>
    </div>
  )
}

export default FourM