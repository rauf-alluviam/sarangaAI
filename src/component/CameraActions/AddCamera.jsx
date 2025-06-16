// import { Box, Button, TextField, Typography } from '@mui/material'
// import React from 'react'
// import colors from '../../utils/colors'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import { useState } from 'react'
// const BACKEND_API= import.meta.env.VITE_BACKEND_API;

// const AddCamera = () => {
//   const {userData}= useSelector((state)=> state.auth);
//   const [cameraId, setCameraId]= useState('');
//   const [rtspLink, setRtspLink]= useState('');
// const [email, setEmail]= useState('');
//   // console.log(userData.sub)
//   // {
//   //   "camera_id": "string",
//   //   "rtsp_link": "string",
//   //   "polygonal_points": "string"
//   // }

//   // const handleSubmit= async(e)=>{
//   //   e.preventDefault();
//   // // console.log({name, email, password, phone_no})
//   //   try {
//   //     const response= await axios.post(`${BACKEND_API}/add_new_user`,
//   //       {name, email, password, phone_no, role: 'user', cameras: [{
//   //         "camera_id": "",
//   //         "rtsp_link": "",
//   //         "polygonal_points": ""
//   //       }]},
//   //       {
//   //         headers: { "Content-Type": "application/json" } // Ensure JSON format
//   //       }
//   //     );
//   //     console.log(response.data)
//   //     alert('Registration successful');
//   //     setName('');
//   //     setEmail('');
//   //     setPassword('');
//   //     setPhone_no('');
//   //     setTimeout(()=>{
//   //       setFlag(true)
//   //     }, 1000)
      
//   //   } catch (error) {
//   //     console.log(error)
//   //     alert(error.message)
//   //   }

//   // }
//   return (
//     <Box onClick={(e)=> e.stopPropagation()} height={'23rem'} borderRadius={'8px'} width={'37rem'} bgcolor={'white'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'} p={'2rem'}>
//         <Typography fontSize={'1.8rem'}>Add Camera</Typography>
//         <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e)=> setEmail(e.target.value)} />
//         <TextField
//         fullWidth
//           id="outlined-password-input"
//           label="Camera Id"
//           type="text"
//           value={cameraId}
//           onChange={(e)=> setCameraId(e.target.value)}
//         />
//         <TextField
//         fullWidth
//           id="outlined-password-input"
//           label="Rtsp link"
//           type="text"
//           value={rtspLink}
//           onChange={(e)=> setRtspLink(e.target.value)}
//           />
//         <Button variant='contained' sx={{bgcolor: colors.primary}} fullWidth>Add Camera</Button>
//         </Box>
//   )
// }

// export default AddCamera;             

import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import colors from '../../utils/colors';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { addCamera } from '../../Redux/Actions/cameraAction';
import { enqueueSnackbar, useSnackbar } from 'notistack';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const AddCamera = ({setIsOpen}) => {
  const { userData } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  
  // console.log(userData)
  
  const [cameraId, setCameraId] = useState('');
  const [rtspLink, setRtspLink] = useState('');
  const [polygon, setPolygon]= useState('');
  console.log(polygon)
  // "polygon_points": "[(66, 4), (55, 33), (88, 76), (99, 77)]"
  const [email, setEmail] = useState('');
  const [category, setCategory]= useState('');
  const [token, setToken] = useState(''); // ✅ State to hold the token
  const dispatch= useDispatch();
  // const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
  // const getHeaders = () => ({
  //   'accept': 'application/json',
  //   'Authorization': `Bearer ${storedToken}`,
  //   'Content-Type': 'application/json',
  // });
  
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    dispatch(addCamera({
      cameraId,
      rtspLink,
      polygon,
      category,
      // email,
      token,
      onSuccess: () => {
        setCameraId('');
        setRtspLink('');
        setCategory('');
        setPolygon('')
        // setEmail('');
        setIsOpen(false);
        enqueueSnackbar('Camera Added successfully!', { variant: 'success' });
      }
    }));

    // if (!cameraId || !rtspLink || !email) {
    //   alert('Please fill all fields');
    //   return;
    // }

    // try {
    //   const response = await axios.post(
    //     `${BACKEND_API}/add_camera`,
    //     {
    //       camera_id: cameraId,
    //       rtsp_link: rtspLink,
    //       polygonal_points: '',
    //       email: email,
    //     },
    //     {
          
    //         headers: getHeaders(), // ✅ Headers with token

    //     }
    //   );
      
      
    //   console.log('Camera added:', response.data);
    //   setIsOpen(false);
    //   alert('Camera added successfully!');
    //   setCameraId('');
    //   setRtspLink('');
    //   setEmail('');
    // } catch (error) {
    //   console.log(getHeaders())
    //   console.error('Error adding camera:', error.response?.data || error.message);
    //   alert(error.response?.data?.detail || 'Something went wrong');
    // }
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      height={'auto'}
      borderRadius={'8px'}
      width={'37rem'}
      bgcolor={'white'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'space-between'}
      p={'2rem'}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Typography fontSize={'1.8rem'} textAlign={'center'}>Add Camera</Typography>
        
        {/* <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ my: 1 }}
          size='small'
        /> */}
        
        <TextField
          fullWidth
          label="Camera Id"
          type="text"
          value={cameraId}
          onChange={(e) => setCameraId(e.target.value)}
          sx={{ mt: '0.7rem' }}
          size='small'
        />
        
        <TextField
          fullWidth
          label="RTSP Link"
          placeholder='rtsp://192.168.1.100:554/stream1'
          type="text"
          value={rtspLink}
          onChange={(e) => setRtspLink(e.target.value)}
          sx={{ mt: '1rem' }}
          size='small'
        />

<FormControl fullWidth size='small' sx={{ mt: '1rem' }}>
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
                      <MenuItem value={'truck'}>Truck</MenuItem>
  </Select>
</FormControl>

{
  category == 'truck' && 
  <TextField
          fullWidth
          label="Polygonal Points"
          placeholder="e.g., [(66, 4), (55, 33), (88, 76), (99, 77)]" 
          type="text"
          value={polygon}
          onChange={(e) => setPolygon(e.target.value)}
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
          Add Camera
        </Button>
      </form>
    </Box>
  );
};

export default AddCamera;

// 0
// : 
// {camera_id: 'CAMERA_2', rtsp_link: 'Videos/rabs1.mp4'}
// 1
// : 
// {camera_id: 'CAMERA_3', rtsp_link: 'Videos/rabs1.mp4'}
// 2
// : 
// {camera_id: 'CAMERA_1', rtsp_link: 'Videos/rabs1.mp4'}
// length
// : 
// 3
// [[Prototype]]
// : 
// Array(0)

