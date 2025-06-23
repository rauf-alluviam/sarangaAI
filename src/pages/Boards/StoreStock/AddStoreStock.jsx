import React, { useState } from 'react'
import colors from '../../../utils/colors'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { useSelector } from 'react-redux';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddStoreStock = ({setIsOpen, setSelectedBoard}) => {
  const {token} = useSelector((state)=> state.auth)
  const [itemDescription, setItemDescription]= React.useState('');
  // const [minimum, setMinimum]= React.useState('');
  // const [maximum, setMaximum]= React.useState('');
  const [current, setCurrent]= React.useState('');
  const [location, setLocation]= React.useState('');
  const [status, setStatus]= useState('')
  console.log(status)
  const [plan, setPlan]= useState('');
  const [actual, setActual]= useState('')
  // const [dispatched, setDispatched]= React.useState('');
  // const [balance, setBalance]= React.useState('');
  // const [nextAction, setNextAction]= React.useState('');
  // const [resp, setResp]= React.useState('');
  // const [target, setTarget]= React.useState('');
  const [timestamp, setTimestamp]= React.useState('2025-05-22T13:20:56.257Z');
  // console.log(new Date())


  // {
  //   "item_description": "string",
  //   "minimum_STOCK": 0,
  //   "maximum_STOCK": 0,
  //   "current_STOCK": 0,
  //   "location": "string",
  //   "status": "string",
  //   "plan": "string",
  //   "actual": "string",
  //   "timestamp": "2025-05-28T08:51:04.021Z"
  // }

const handleSubmit= async(e)=>{
  e.preventDefault();
  const data= {
    item_description: itemDescription,
    minimum_STOCK: 200,
    maximum_STOCK: 2500,
    current_STOCK: current,
    location: location,
  //  status: current< this.minimum_STOCK? 'critical': current> this.maximum_STOCK? 'ok': 'excess', 
  status: current< 200? 'critical': current< 2500? 'ok': 'excess', 
   plan: plan,
   actual: actual,
    timestamp: timestamp
  }
try {
  const response= await axios.post(`${BACKEND_API}/submit_store_stock_monitoring_sheet_entry`, data,
    {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }
  );
  setIsOpen(false);
  // setSelectedBoard('none')
  alert(response.data.message)
} catch (error) {
  console.log(error)
  
}
  // axios.post('http://
}
  return (
    <Box
          onClick={(e) => e.stopPropagation()}
          height={'auto'}
          borderRadius={'8px'}
          width={'60rem'}
          bgcolor={'white'}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={'2rem'}
        >
                      <Typography fontSize={'1.8rem'} textAlign={'center'}>Add Stock</Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%', bgcolor: 'red', display: 'flex', justifyContent: 'space-between', paddingTop: '0.7rem'}}>
            <Box display={'flex'} flexDirection={'column'} width={'49%'}>
            <TextField
              fullWidth
              label="Item Description"
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              sx={{ mt: '1rem'}}
              size='small'
            />
              
{/* <TextField
              fullWidth
              label="Minimum"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={minimum}
              onChange={(e) => setMinimum(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            />

<TextField
              // fullWidth
              label="Maximum"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={maximum}
              onChange={(e) => setMaximum(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            /> */}

<TextField
              fullWidth
              label="Current"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            />
          

<TextField
              // fullWidth
              label="Location"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            />
            </Box>

            <Box display={'flex'} flexDirection={'column'} width={'49%'}>
            {/* <TextField
              fullWidth
              label="Dispatched"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={dispatched}
              onChange={(e) => setDispatched(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            
            /> */}
{/* 
           <FormControl sx={{  width: '100%'}} >
                       <InputLabel id="Status">Status</InputLabel>
                       <Select
                        size='small'
                         labelId="Status"
                         id="Status-select"
                         value={status}
                         label="Status"
                         onChange={(e) => setStatus(e.target.value)}
                       >
                         <MenuItem value={'critical'}>Critical</MenuItem>
                         <MenuItem value={'excess'}>Excess</MenuItem>
                         <MenuItem value={'ok'}>Ok</MenuItem>
                         
                         
                       </Select>
                     </FormControl> */}

                    

<TextField
              fullWidth
              label="Plan"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            />

<TextField
              fullWidth
              label="Actual"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            />





<Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: colors.primary, mt: 2 }}
              fullWidth
            >
              Submit
            </Button>
            </Box>

    
   
    
            
           
          </form>
        </Box>
  )
}

export default AddStoreStock