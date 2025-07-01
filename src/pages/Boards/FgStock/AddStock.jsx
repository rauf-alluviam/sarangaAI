import React, { useState } from 'react'
import colors from '../../../utils/colors'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFgStock, getAllFgStock } from '../../../Redux/Actions/fgStockActions';
import { enqueueSnackbar } from 'notistack';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddStock = ({setIsOpen, setSelectedBoard}) => {
const {token} = useSelector((state)=> state.auth)
  const {fgStockArr}= useSelector((state)=> state.fgStock)

  const [itemDescription, setItemDescription]= React.useState('');
  const [itemCode, setItemCode]= React.useState('');
  const [minimum, setMinimum]= React.useState('');
  const [maximum, setMaximum]= React.useState('');
  const [todaysTarget, setTodaysTarget]= useState('');
  const [current, setCurrent]= React.useState('');
  const [schedule, setSchedule]= React.useState('');
  const [dispatched, setDispatched]= React.useState('');
  const [balance, setBalance]= React.useState('');
  const [nextAction, setNextAction]= React.useState('');
  const [resp, setResp]= React.useState('');
  const [nextDayTarget, setNextDayTarget]= React.useState('');
  const [timestamp, setTimestamp]= React.useState('2025-05-22T13:20:56.257Z');
  const dispatch= useDispatch();
  // console.log(new Date())

const handleSubmit= async(e)=>{
  e.preventDefault();
  const data= {
    item_description: itemDescription,
    item_code: itemCode,
    minimum: 200,
    // maximum: 2500,
    todays_planning: todaysTarget,
    current: current,
    // schedule: schedule,
    dispatched: dispatched,
    balance: schedule-dispatched,
    next_action: nextAction,
    resp_person : resp,
    // next_day_target: nextDayTarget,
    timestamp: timestamp
  }
// try {
//   const response= await axios.post(`${BACKEND_API}/submit_fg_stock_monitoring_sheet_entry`, data,
//     {
//       headers: {
//         'accept': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }  
//     }
//   );
//   setIsOpen(false);
//   alert(response.data.message)
// } catch (error) {
//   console.log(error)
  
// }

dispatch(addFgStock(data, 
  (successMsg) => {
    setIsOpen(false); 
    enqueueSnackbar(successMsg, { variant: 'success' });
    setTimeout(()=>{
      window.location.reload();
    }, 800)
  },
  (errorMsg) => {enqueueSnackbar(errorMsg, { variant: 'error' });}
 
));
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
              required
              
            />
            
            <TextField
              fullWidth
              label="Item Code"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              // required
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
              label="Todays Planning"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="number"
              value={todaysTarget}
              onChange={(e) => setTodaysTarget(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            />

<TextField
              fullWidth
              label="Current Stock"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            />
          

{/* <TextField
              // fullWidth
              label="Schedule"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="number"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            /> */}
            </Box>

            <Box display={'flex'} flexDirection={'column'} width={'49%'}>
            <TextField
              fullWidth
              label="Dispatched"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="number"
              value={dispatched}
              onChange={(e) => setDispatched(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            />

{/* <TextField
              fullWidth
              label="Balance"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            /> */}

{/* <TextField
              fullWidth
              label="Next Action"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
            /> */}

            <TextField
                                                   size='small'
                                                  label="Select Date"
                                                  // sx={{ width: '45rem' }}
                                                  sx={{ mt: '1rem' }}
                                                  type="date"
                                                  value={nextAction}
                                                  // onChange={(e) => setDate(e.target.value)}
                                                  InputLabelProps={{ shrink: true }}
                                                  onChange={(e) => setNextAction(e.target.value)}
                                                  // required
                                                />
{
  fgStockArr?.length <= 0 && 
  <TextField
              fullWidth
              label="Responsible Person"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="text"
              value={resp}
              onChange={(e) => setResp(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            />
}


{/* <TextField
              fullWidth
              label="Next Day Target"
              // placeholder='rtsp://192.168.1.100:554/stream1'
              type="number"
              value={nextDayTarget}
              onChange={(e) => setNextDayTarget(e.target.value)}
              sx={{ mt: '1rem' }}
              size='small'
              required
            /> */}

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

export default AddStock