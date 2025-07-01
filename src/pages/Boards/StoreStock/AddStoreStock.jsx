import React, { useState } from 'react'
import colors from '../../../utils/colors'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addStoreStock } from '../../../Redux/Actions/storeStockAction';
import { enqueueSnackbar } from 'notistack';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddStoreStock = ({setIsOpen, setSelectedBoard}) => {
  const {token} = useSelector((state)=> state.auth)
  const {storeStockArr}= useSelector((state)=> state.storeStock)
  const [itemDescription, setItemDescription]= React.useState('');
  // const [minimum, setMinimum]= React.useState('');
  // const [maximum, setMaximum]= React.useState('');
  const [current, setCurrent]= React.useState('');
  const [location, setLocation]= React.useState('');
  const [status, setStatus]= useState('')
  console.log(status)
  const [plan, setPlan]= useState('');
  const [actual, setActual]= useState('')
  const [resp, setResp]= React.useState('');
  // const [dispatched, setDispatched]= React.useState('');
  // const [balance, setBalance]= React.useState('');
  // const [nextAction, setNextAction]= React.useState('');
  // const [target, setTarget]= React.useState('');
  const [timestamp, setTimestamp]= React.useState('2025-05-22T13:20:56.257Z');
  const dispatch= useDispatch();
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
    minimum_STOCK: 200, // Default value
    maximum_STOCK: 2500, // Default value
    current_STOCK: Number(current) || 0,
    location: location,
    status: "", // Will be calculated on backend or left empty
    plan: plan,
    actual: actual,
    timestamp: new Date().toISOString(), // Generate current timestamp
    resp_person: resp || '', // Responsible person, optional
  }
  
  
  // Add responsible person only if this is the first entry (same logic as FG Stock)
  // if (storeStockArr?.length <= 0) {
  //   data.resp_person = resp;
  // }
  
  dispatch(addStoreStock(data, token, 
    (successMessage)=> {
      setIsOpen(false); 
      enqueueSnackbar(successMessage, { variant: 'success' });
      // window.location.reload(); // Reload page after successful addition
    },
    (errorMessage)=> enqueueSnackbar(errorMessage, { variant: 'error' })
  ))
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
              type="number"
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

{
              storeStockArr?.length <= 0 && 
              <TextField
                fullWidth
                label="Responsible Person"
                type="text"
                value={resp}
                onChange={(e) => setResp(e.target.value)}
                sx={{ mt: '1rem' }}
                size='small'
                required
              />
            }

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