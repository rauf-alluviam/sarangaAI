import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import colors from '../../utils/colors'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { useState } from 'react';
import { deleteCamera } from '../../Redux/Actions/cameraAction';
import { useSnackbar } from 'notistack';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;


const RemoveCamera = ({setIsOpen}) => {
  const { userData } = useSelector((state) => state.auth);
  const [cameraId, setCameraId] = useState('');
  const [category, setCategory]= useState('');
  const [token, setToken] = useState(''); // ✅ State to hold the token
  const dispatch= useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  
 // ✅ On mount, get the token from localStorage
    useEffect(() => {
      // const storedToken = localStorage.getItem('rabsToken')?.trim();
      const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
      console.log(storedToken)
      if (storedToken) {
        setToken(storedToken);
        console.log('Token from localStorage:', storedToken);
      } else {
        console.warn('No token found in localStorage.');
      }
    }, []);
  
    // ✅ Generate headers only when token exists
    const getHeaders = () => ({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });


  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // prevent page reload

  //   if (!cameraId || !userData.sub) {
  //     alert('Please fill all fields');
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(
  //       `${BACKEND_API}/remove_camera`,
  //       {
  //         headers: getHeaders(),
  //         data: { camera_id: cameraId, email: userData.sub }, // Sending data in the body instead of query params
  //       }
  //     );
  //     console.log(response.data);
  //     alert('Camera removed successfully');
  //     setCameraId('');
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error removing camera');
  //   }

  //   // try {
  //   //   const response = await axios.delete(
  //   //     `${BACKEND_API}/remove_camera?camera_id=${cameraId}`,
  //   //     // { camera_id: cameraId, email: userData.sub },
  //   //     { headers: getHeaders() }
  //   //   );
  //   //   console.log(response.data);
  //   //   alert('Camera removed successfully');
  //   //   setCameraId('');
  //   // } catch (error) {
  //   //   console.error(error);
  //   //   alert('Error removing camera');
  //   // }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    dispatch(deleteCamera({
          cameraId,
         userData,
         category,
          token,
          onSuccess: () => {
            setCameraId('');
            setIsOpen(false);
            enqueueSnackbar('Camera removed successfully!', { variant: 'success' });
          }
        })).catch(() => {
          enqueueSnackbar('Error removing camera', { variant: 'error' });
        });
    // if (!cameraId || !userData.sub) {
    //   alert('Please fill all fields');
    //   return;
    // }
  
    // try {
    //   const response = await axios.delete(
    //     `${BACKEND_API}/remove_camera?camera_id=${cameraId}`, // Sending camera_id in query params
    //     {
    //       headers: getHeaders(), // Ensure the Authorization header is sent
    //     }
    //   );
    //   console.log(response.data); // Should log the response message from the backend
    //   setIsOpen(false); // Close the modal or dialog
    //   alert('Camera removed successfully');
    //   setCameraId(''); // Reset the camera ID after successful removal
    // } catch (error) {
    //   console.error(error); // Log error if any occurs
    //   alert('Error removing camera');
    // }
  };
  
  return (
    <Box  onClick={(e)=> e.stopPropagation()} height={'21rem'} borderRadius={'8px'} width={'37rem'} bgcolor={'white'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'} p={'2rem'}>
        <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography fontSize={'1.8rem'}>Remove Camera</Typography>
        {/* <TextField fullWidth value={userData.sub} id="outlined-basic" label="Email" variant="outlined" /> */}
        <TextField
        fullWidth
          id="outlined-password-input"
          label="Camera Id"
          type="text"
          value={cameraId}
          onChange={(e)=> setCameraId(e.target.value)}
        />

        <FormControl fullWidth sx={{ mt: '1rem' }}>
          <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            onChange={(e)=> setCategory(e.target.value)}
            label="Select Category"
            
            // onChange={handleChange}
          >
            <MenuItem value={'fire'}>Fire</MenuItem>
                              <MenuItem value={'smoke'}>Smoke</MenuItem>
                              <MenuItem value={'ppe'}>PPE</MenuItem>
                              {/* <MenuItem value={'loading'}>Loading-Unloading</MenuItem> */}
          </Select>
        </FormControl>
        <Button type='submit' variant='contained' sx={{bgcolor: colors.primary}} fullWidth>Remove Camera</Button>
        </form>
        </Box>
  )
}

export default RemoveCamera;