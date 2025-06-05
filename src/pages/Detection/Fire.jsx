// import { Box, Typography } from '@mui/material'
// import React from 'react'

// const Smoke = () => {
//   return (
//     <Box height={'88vh'} width={'100vw'} bgcolor={'lightgrey'}>
//         <Typography fontSize={'1.5rem'}>Smoke Detection:</Typography>
//         <Typography p={'0.7rem 1rem'} bgcolor={'white'} width={'19rem'} borderRadius={'5px'} border={'1px solid grey'} mt={'2rem'}>Number Of Running Cameras- 4</Typography>
//     </Box>
//   )
// }

// export default Smoke;


import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import React, { useState } from 'react';
import colors from '../../utils/colors';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ImageModal from './ImageModal';
import { IoCameraSharp } from 'react-icons/io5';
import { RiScan2Fill } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Fire = () => {
  // 2025-05-31
  // const [date, setDate] = useState('2025-05-02');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthly, setMonthly]= useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth is 0-based
    return `${year}-${month}`;
  })
  const navigate= useNavigate();
  const location= useLocation();
  const path= location.pathname.split('/')[1];
 
  console.log(monthly);
  const {cameras}= useSelector((state)=> state.cameras);
  console.log(cameras)
  const [allCameras, setAllCameras]= useState([]);
  // const [cameras, setCameras] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  // console.log(startTime)
  // console.log(endTime)
  const [selectedImg, setSelectedImg]= useState('');
  const [isShowImg, setIsShowImg]= useState(false);
  // const [camera, setCamera] = useState('');
  
  const [token, setToken] = useState(''); // ✅ State to hold the token
  const [selectedCamera, setSelectedCamera] = useState(''); // State for selected camera
  const [count, setCount]= useState(0);
  const [report, setReport]= useState([]);
  const [filter, setFilter]= useState('day');
  console.log(report);

    const BACKEND_API = import.meta.env.VITE_BACKEND_API;

     useEffect(() => {
          let combined = [];
          for (let key in cameras) {
            let cameraArray = cameras[key];
            let updatedArray = cameraArray.map(cam => ({ ...cam, model: key })); // add model to each object
            combined = combined.concat(updatedArray);
          }
          setAllCameras(combined);
        }, [cameras]);
    

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!date || !startTime || !endTime || !camera) {
  //     alert('Please fill in all required fields');
  //     return;
  //   }

  //   // You can handle result fetching or other logic here
  //   console.log({ date, startTime, endTime, camera });
  // };


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

  //   useEffect(() => {
  //     if (!token) return; // ⛔ Don't run unless token is available
  //     const fetchCameras = async () => {
  //       try {
  //         // const response = await axios.get(`http://0.0.0.0:8000/get_cameras`, {
  //         //   headers: getHeaders(),
  //         // });
  //       const response = await axios.get(`${BACKEND_API}/get_cameras`, {
  //           headers: getHeaders(),
  //         });
  //         // setCameras(response.data.cameras);
  //         const cameraList = response.data.cameras || [];
  // setCameras(cameraList);
  
  // // ✅ Set first camera as selected by default
  // if (cameraList.length > 0) {
  //   setSelectedCamera(cameraList[0].camera_id);
  // }
  //         console.log('Cameras:', response.data.cameras);
  //         // setCameras(response.data.cameras); // if you're storing them in state
  //       } catch (error) {
  //         console.error('Error fetching cameras:', error.response?.data || error.message);
  //       }
  //     };
    
  //     fetchCameras();
  //   }, [token]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // if (!date || !startTime || !endTime || !camera) {
    //   alert('Please fill in all required fields');
    //   return;
    // }

    if (!date) {
      alert('Please fill in all required fields');
      return;
    }
    // for day wise filter-------
    const [year, month, day] = date.split('-');

    //for monthly report----
    const [year2, month2]= monthly.split('-');
       
    const startTimeFormatted = startTime.replace(':', '%3A');
    const endTimeFormatted = endTime.replace(':', '%3A');
  
    try {
      const response = await axios.get(
        // filter == 'day'? `${BACKEND_API}/snapdate_count-daywise/${year}/${month}/${day}?camera_id=100` :  `http://localhost:8015/snapmonth/${year2}/${month2}?camera_id=100`,
        filter == 'day'? `${BACKEND_API}/snapdate_count-daywise/${year}/${month}/${day}?camera_id=${selectedCamera}&category=fire` : 
        filter== 'month'? `${BACKEND_API}/snapmonth/${year2}/${month2}?camera_id=${selectedCamera}&category=fire` : 
        // `${BACKEND_API}/snapdate_count-timerange/2025/5/2?category=smoke&start_time=15%3A42&end_time=15%3A43&camera_id=9`,
        `${BACKEND_API}/snapdate_count-timerange/${year}/${month}/${day}?category=fire&start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&camera_id=${selectedCamera}`, 

        // `${BACKEND_API}/snapdate_count-timerange/2025/06/25?start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&camera_id=100`,
        // `${BACKEND_API}/snapdate_count-timerange/2025/06/25?start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&camera_id=100`,
       
        {
          headers: getHeaders(),
        }
        // {
        //   params: { camera_id: 100 }
        // }
      );
  setCount(response.data.count);
  setReport(response.data.snapshots)
  
      console.log('API response:', response.data.count);
      console.log('API response:', response);
      // Do something with the result
    } catch (err) {
      console.error('API error:', err.response?.data?.detail || err.message);
      setCount(0);
      setReport([]);
      alert(err.response?.data?.detail || err.message);
     
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // if (!date || !startTime || !endTime || !camera) {
  //   //   alert('Please fill in all required fields');
  //   //   return;
  //   // }

  //   if (!date || !startTime || !endTime || !selectedCamera) {
  //     alert('Please fill in all required fields');
  //     return;
  //   }
  
  //   const [year, month, day] = date.split('-');
  //   const startTimeFormatted = startTime.replace(':', '%3A');
  //   const endTimeFormatted = endTime.replace(':', '%3A');
  
  //   try {
  //     const response = await axios.get(
  //       `${BACKEND_API}/snapdate_count-timerange/2025/04/23?start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&camera_id=5`,
  //       {
  //         headers: getHeaders(),
  //       }
  //       // {
  //       //   params: { camera_id: 100 }
  //       // }
  //     );
  // setCount(response.data.count)
  // setReport(response.data.snapshots)
  //     console.log('API response:', response.data.count);
  //     console.log('API response:', response);
  //     // Do something with the result
  //   } catch (err) {
  //     console.error('API error:', err.response?.data || err.message);
  //     alert('Failed to fetch data');
  //   }
  // };
// --------------------------------------------------
  // useEffect(()=>{
  //   handleSubmit()
  // }, [selectedCamera])

//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         // const response = await axios.get(`http://0.0.0.0:8000/get_cameras`, {
//         //   headers: getHeaders(),
//         // });
//       const response = await axios.get(`http://0.0.0.0:8000/get_cameras`, {
//           headers: getHeaders(),
//         });
//         // setCameras(response.data.cameras);
//         const cameraList = response.data.cameras || [];
// setCameras(cameraList);

// // ✅ Set first camera as selected by default
// if (cameraList.length > 0) {
//   setSelectedCamera(cameraList[0].camera_id);
// }
//         console.log('Cameras:', response.data.cameras);
//        hhhhhhhh // setCameras(response.data.cameras); // if you're storing them in state
//       } catch (error) {
//         console.error('Error fetching cameras:', error.response?.data || error.message);
//       }
//     };
  
//     fetchCameras();
//   }, [token]);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Define your colors here

const cameraData = [
  {
    camId: 'Fire',
    detections: [
      { name: `camId- ${2}`, count: 1000 },
    ],
  },
  {
    camId: 'Smoke',
    detections: [
      { name: `camId- ${22}`, count: 402 },
      { name: `camId- ${33}`, count: 120 },
    ],
  },
  {
    camId: 'PPE',
    detections: [
      { name: `camId- ${44}`, count: 500 },
      { name: `camId- ${9}`, count: 100 },
      { name: `camId- ${11}`, count: 1002 },
      { name: `camId- ${6}`, count: 800 },
    ],
  },
];

// Filter data for the "Fire" model
const fireData = cameraData.find((camera) => camera.camId === 'Fire')?.detections || [];

const isLargerThan1000= useMediaQuery('(min-width: 1000px)');
const isLargerThan850= useMediaQuery('(min-width: 850px)');

  return (
    <Box height="88vh" flex={1} p={2} position={'relative'} display={'flex'} flexDirection={isLargerThan850? 'row': 'column-reverse'} justifyContent={isLargerThan850? 'space-between': 'start'}>
      {/* <Typography fontSize="1.1rem">Fire Detection</Typography> */}
{isShowImg && <ImageModal selectedImg={selectedImg} setIsShowImg={setIsShowImg} />}

<Box display={'flex'} flexDirection={'column'} width={'90%'} alignItems={'start'}>
  <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Detection:-</Typography>
{/* -----------------------Show cameras of Fire------------------------------------------ */}
 <Box  mt={'0rem'}  width={'100%'} borderRadius={'6px'} display={'flex'} alignItems={'start'} justifyContent={'space-between'}>
          {/* <Typography fontSize={'1.4rem'} mb={'1rem'} borderBottom={'1px solid grey'}>Camera Details:</Typography> */}
        <Paper sx={{width: '80%'}}>
        <Typography fontSize={'1.4rem'} mb={'1rem'} ml={'0.5rem'} mt={'0.4rem'}>Camera Details:</Typography>
        <TableContainer>
      <Table aria-label="simple table">
        <TableHead  sx={{bgcolor: 'lightgrey'}}>
          <TableRow >
            <TableCell sx={{fontSize: '1.2rem'}}>Sr No</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Camera Id</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Rtsp Link</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Single Live stream</TableCell>
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>User</TableCell> */}
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>Model</TableCell> */}
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>Delete</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            cameras?.fire?.length>0?
            cameras?.fire.map((elem, index)=>(
<TableRow key={index}> 
            <TableCell align="start">{index+1}</TableCell>
            <TableCell align="start">{elem.camera_id}</TableCell>
            <TableCell align="start"><Box width={'25rem'} p={'0rem 0.5rem'} sx={{overflowX: 'auto'}}>{elem.rtsp_link}</Box></TableCell>
            <TableCell align="start"><IconButton onClick={()=> navigate(`/single-stream/fire/${elem.camera_id}`)}><FaEye /></IconButton></TableCell>
            {/* <TableCell align="start">yash@gmail.com</TableCell> */}
            {/* <TableCell align="start">{elem.model}</TableCell> */}
            {/* <TableCell align="start"><Button variant='contained' size='small' sx={{bgcolor: '#CE9E9D'}}>Delete</Button></TableCell> */}
          </TableRow>
            )): <Typography p={'1rem'}>No camera found</Typography>
          }
            
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>

    <Box onClick={()=> navigate(`/multi-stream/fire`)} height={'11rem'} width={'13rem'} bgcolor={'white'} mr={'1.5rem'} ml={'1rem'} borderRadius={'8px'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{cursor: 'pointer'}} boxShadow={'rgba(0, 0, 0, 0.14) 0px 3px 8px'}>
      <Box width={'3rem'} height={'3rem'} bgcolor={'rgba(139, 172, 159, 0.54)'} color='rgb(0, 122, 71)' boxShadow={'rgba(50, 50, 93, 0.29) 0px 13px 27px -5px, rgba(0, 0, 0, 0.16) 0px 8px 16px -8px'} borderRadius={'50%'} display={'flex'} alignItems={'center'} justifyContent={'center'}><MdLiveTv /></Box>
      <Typography mt={'1rem'}>Live Multi Stream</Typography>
      </Box>
          </Box>
      
        
      {/* ----------Report Table-------------------- */}
      <Box width={isLargerThan1000? '98%': '98%'} mt={isLargerThan850?'4rem': '4rem'} position={'relative'} bgcolor={'lightgrey'} mr={'1rem'} p={'0.7rem'} borderRadius={'6px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography position={'absolute'} top={'-1.9rem'} left={0}>{report.length} Records found</Typography>
          <Typography fontSize={'1.6rem'} sx={{borderBottom: '1px solid grey', mb: '1rem'}}>Fire Report</Typography>
          <Paper sx={{ width: '100%',maxHeight: '75vh', overflow: 'auto' }}>
        <TableContainer>
      <Table aria-label="simple table">
        <TableHead sx={{bgcolor: 'grey'}}>
          <TableRow >
            <TableCell sx={{fontSize: '1.2rem'}}>Sr No</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Date</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Time</TableCell>
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Image</TableCell>
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>Video Clip</TableCell> */}
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>Action</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody >
          {
            report.length>0?
            report.map((elem, index)=>(
<TableRow style={{height: '10rem'}} key={elem.id || index}> 
            <TableCell align="start">{index+1}</TableCell>
            <TableCell align="start">{date}</TableCell>
            <TableCell align="start">{elem.time}</TableCell>
            {/* <TableCell align="start">1</TableCell> */}
            <TableCell onClick={()=> {setSelectedImg(elem.path), setIsShowImg(true)}} align="start" sx={{height:"10rem", width: '10rem'}}><img src={elem.path} style={{height: '100%', cursor: 'pointer'}} alt="" /></TableCell>
            {/* <TableCell align="start">-</TableCell> */}
            {/* <TableCell align="start"><Button variant='contained' sx={{bgcolor: 'orangered'}}>Remove</Button></TableCell> */}
          </TableRow>
            )): <Typography p={'1rem'}>No Result found</Typography>
          } 
            
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>
          </Box>
          </Box>

          
          {/* -----------------------search and Filters-------------- */}

          <Box
        // component="form"
        // onSubmit={handleSubmit}
        display="flex"
        // height="80vh"
        height={'auto'}
        width={isLargerThan850? "20rem": '100%'}
        justifyContent="start"
        alignItems="center"
        mt={0}
        gap={2}
        // bgcolor={'grey'}
        flexDirection={'column'}
        
      >

        <Box display={'flex'} flexDirection={isLargerThan850? 'column': 'row'} width={'100%'}>
        {/* <PieChart width={280} height={220}>
      <Pie
        data={fireData}
        cx="50%"
        cy="50%"
        innerRadius={60} // smaller hole
        outerRadius={80} // smaller outer radius
        dataKey="count"
      >
        {fireData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="vertical" verticalAlign="middle" align="right" />
    </PieChart> */}

         <Box
          bgcolor="white"
          p="1rem"
          fontSize="1.1rem"
          width="100%"
          // height="90%"
          borderRadius="7px"
          display="flex"
          alignItems="center"
          boxShadow="rgba(0, 0, 0, 0.14) 0px 3px 8px"
          mb={isLargerThan850 && '1rem'}
          mr={!isLargerThan850 && '1rem'}
        >
          <Box sx={{width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 223, 182, 0.43)', borderRadius: '50%', mr: '1rem'}}>
            {/* <IoCameraSharp style={{color: 'rgb(177, 22, 99)'}} /> */}
            <RiScan2Fill  style={{color: 'rgb(177, 136, 22)'}} />
            </Box>
          Total detections - {report.length}
        </Box>

<Box
mb={'1rem'}
          bgcolor="white"
          p="1rem"
          fontSize="1.1rem"
          width="100%"
          // height="90%"
          borderRadius="7px"
          display="flex"
          alignItems="center"
          boxShadow="rgba(0, 0, 0, 0.14) 0px 3px 8px"
        >
          <Box sx={{width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 200, 227, 0.4)', borderRadius: '50%', mr: '1rem'}}>
            <IoCameraSharp style={{color: 'rgb(177, 22, 99)'}} />
            </Box>
          
          <Typography display={'flex'} alignItems={'center'}><Box height={'10px'} width={'10px'} bgcolor={'green'} mr={'0.5rem'} borderRadius={'50%'}></Box>Running Cameras - {cameras?.fire?.length} </Typography>
          
        </Box>

        {/* <Box
        mb={'1rem'}
          bgcolor="white"
          p="1rem"
          fontSize="1.1rem"
          width="100%"
          // height="90%"
          borderRadius="7px"
          display="flex"
          alignItems="center"
          boxShadow="rgba(0, 0, 0, 0.14) 0px 3px 8px"
        >
          <Box sx={{width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 200, 227, 0.4)', borderRadius: '50%', mr: '1rem'}}>
            <IoCameraSharp style={{color: 'rgb(177, 22, 99)'}} />
            </Box>
          
          <Typography>Multi Streaming</Typography>
          
        </Box> */}

        {/* <Box
          bgcolor="white"
          p="1rem"
          fontSize="1.1rem"
          width="100%"
          // height="90%"
          borderRadius="7px"
          display="flex"
          alignItems="center"
          boxShadow="rgba(0, 0, 0, 0.14) 0px 3px 8px"
        >
          <Box sx={{width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 200, 227, 0.4)', borderRadius: '50%', mr: '1rem'}}>
            <IoCameraSharp style={{color: 'rgb(177, 22, 99)'}} />
            </Box>
          
          <Typography>Single Streaming</Typography>
          
        </Box> */}

        
        </Box>



        {/* -------------selector for a Monthly/ daywise/ Hourly option--------------------- */}



        {/* --------All fields for enter a durations for report filter--------- */}
        <Box
        component="form"
        onSubmit={handleSubmit}
          width="100%"
          // height="100%"
          height={'auto'}
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          borderRadius="12px"
          padding="1.3rem"
          boxShadow="rgba(0, 0, 0, 0.14) 0px 3px 8px"
          position={'relative'}
          bgcolor={'white'}
          flexDirection={'column'}
        >
          <FormControl required sx={{  width: '100%', mb: '1.2rem' }} >
            <InputLabel id="camera-label">Filter</InputLabel>
            <Select
             size='small'
              labelId="camera-label"
              id="Filter"
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value={'hour'}>Sort By Hour</MenuItem>
              <MenuItem value={'day'}>Sort By Day</MenuItem>
              <MenuItem value={'month'}>Sort By Month</MenuItem>
              
              
            </Select>
          </FormControl>

          {/* <Typography position={'absolute'} bottom={0} color='orange' fontSize={'0.9rem'}>select the date, time, camera to see result</Typography> */}
          
          {
            (filter == 'day' || filter == 'hour')  && 
            <TextField
             size='small'
            label="Select Date"
            // sx={{ width: '45rem' }}
            sx={{ width: '100%', mb: '1.2rem'  }}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          }

          {
            filter == 'month' && 
            <TextField
            size='small'
  label="Select Month and Year"
  // sx={{ width: '45rem' }}
  sx={{ width: '100%', mb: '1.2rem'  }}
  // fullWidth
  type="month"
  value={monthly}
  onChange={(e) => setMonthly(e.target.value)}
  InputLabelProps={{ shrink: true }}
  required
/>
          }



          {
            filter == 'hour' && 
            <>
           <TextField
             size='small'
              label="Start Time"
              fullWidth
              sx={{ mb: '1.2rem'  }}
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              required
            />
  
            <TextField
             size='small'
              label="End Time"
              fullWidth
              sx={{ mb: '1.2rem'  }}
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              required
            />
            </>
          }

          <FormControl fullWidth size='small'>
                    <InputLabel id="model-select-label">Camera</InputLabel>
                    <Select
                    required
                      // size='small'
                      labelId="model-select-label"
                      id="model-select"
                      value={selectedCamera}
                      label="Camera"
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      sx={{ height: '100%',  flex: 1, mb: '1.2rem'  }}
                    >
                      {
            
                       cameras?.fire?.length > 0  &&
                        cameras.fire.map((elem, index) => (
                          <MenuItem key={elem.camera_id || index} value={elem.camera_id}>
                            {elem.camera_id}
                          </MenuItem>
                        ))
                      }
                      {/* <MenuItem value={'fire.pt'}>Fire</MenuItem>
                      <MenuItem value={'smoke.pt'}>Smoke</MenuItem>
                      <MenuItem value={'ppe.pt'}>PPE</MenuItem>
                      <MenuItem value={'loading.pt'}>Loading-Unloading</MenuItem> */}
                    </Select>          
                  </FormControl>

          <Button type="submit" variant="contained" sx={{bgcolor: colors.primary, p: '0.4rem 2rem', width: '100%'}}>
            Result
          </Button>
        </Box> 


       
        
      </Box>  
    </Box>
  );
};

export default Fire;
