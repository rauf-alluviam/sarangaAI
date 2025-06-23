import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsCameraReelsFill, BsCheck2Square, BsGraphUp, BsQrCodeScan } from 'react-icons/bs';
import { FaClipboardList, FaFire, FaTools, FaTruckLoading } from 'react-icons/fa';
import { IoMedkit, IoStorefront } from 'react-icons/io5';
import { MdOutlineManageHistory, MdSmokeFree, MdSpatialTracking } from 'react-icons/md';
import colors from '../../utils/colors';
import { useNavigate } from 'react-router-dom';
import { GiSmokeBomb } from 'react-icons/gi';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { deleteCamera, fetchCameras } from '../../Redux/Actions/cameraAction';
import { useSnackbar } from 'notistack';
import { Camera, CheckCircle, QrCode } from '@mui/icons-material';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


const Dashboard = ({setIsOpen}) => {
  const navigate= useNavigate();
  const dispatch= useDispatch();
    const { enqueueSnackbar } = useSnackbar();
  const {userData, token}= useSelector((state)=> state.auth);
  const {cameras}= useSelector((state)=> state.cameras);
  console.log(cameras);
  const [allCameras, setAllCameras]= useState([]);
  const [graphData, setGraphData]= useState([]);
  console.log(graphData)
  // const [cameras, setCameras]= useState([]);
  // const [token, setToken]= useState(''); // ✅ State to hold the token
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // console.log(cameras);
  console.log(date);

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
  // const cameraData = [
  //   { cameraId: 'Cam 1', fire: 4, smoke: 3, ppe: 10 },
  //   { cameraId: 'Cam 2', fire: 1, smoke: 5, ppe: 8 },
  // ];
  const cameraData = [
    {
      category: 'Fire',
      cameras: [
        { camera_id: `camId- ${2}`, count: 1000 },
       
      ],
    },
    {
      category: 'Smoke',
      cameras: [
        // { name: 'fire', count: 7 },
        { camera_id: `camId- ${22}`, count: 402 },
        { camera_id: `camId- ${33}`, count: 120 },
      ],
    },
    {
      category: 'PPE',
      cameras: [
        { camera_id: `camId- ${44}`, count: 500 },
        { camera_id: `camId- ${9}`, count: 100 },
        { camera_id: `camId- ${11}`, count: 1002 },
        { camera_id: `camId- ${6}`, count: 800 },
      ],
    },
    // {
    //   camId: 'cam4',
    //   user: 'uday@gmail.com',
    //   detections: [
    //     { name: 'fire', count: 50 },
    //     { name: 'smoke', count: 130 },
    //     { name: 'ppe', count: 200 },
    //   ],
    // },
    // Add more cameras here
  ];

  // const COLORS = ['#FF4C4C', '#FFA500', '#00C49F'];
  const COLORS = [
    '#BB7E7E',  // Red
 '#C4AF7D', // Orange
    // '#00C49F'   // Green
    '#60AB8A', 
    'grey'
  ];

  useEffect(()=>{
    const fetchCameraDetections= async()=>{
try {
  const [year, month, day] = date.split('-');
  const response = await axios.get(`${BACKEND_API}/snapshots_all-daywise/${year}/${month}/${day}`,
  // const response = await axios.get(`${BACKEND_API}/snapshots_all-daywise/2025/5/12`,
    {
      headers:{
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }
  );
  setGraphData(response.data.data? response.data.data: []);
  console.log(response.data);
} catch (error) {
  console.log(error)
  setGraphData([]);
}
    }
    fetchCameraDetections();
  }, [date])

 
  const handleDelete=(cameraId, category)=>{
     dispatch(deleteCamera({
              cameraId,
             userData,
             category,
              token,
              onSuccess: () => {
                // setCameraId('');
                setIsOpen(false);
                enqueueSnackbar('Camera removed successfully!', { variant: 'success' });
              }
            }));
  }



  // const [isBlink, setIsBlink]= useState(true);

  // // Use useEffect to manage the blinking interval
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsBlink(prevBlink => !prevBlink); // Use the previous state for toggle
  //   }, 1000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);

  // ----------getting the token--------
  // useEffect(() => {
  //   // const storedToken = localStorage.getItem('rabsToken')?.trim();
  //   const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
  //   console.log(storedToken)
  //   if (storedToken) {
  //     setToken(storedToken);
  //     console.log('Token from localStorage:', storedToken);
  //   } else {
  //     console.warn('No token found in localStorage.');
  //   }
  // }, []);

  // // ✅ Generate headers only when token exists
  // const getHeaders = () => ({
  //   'accept': 'application/json',
  //   'Authorization': `Bearer ${token}`,
  //   'Content-Type': 'application/json',
  // });

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
// // setCameras(cameraList);

// // ✅ Set first camera as selected by default
// if (cameraList.length > 0) {
//   // setSelectedCamera(cameraList[0].camera_id);
// }
//         console.log('Cameras:', response.data.cameras);
//         // setCameras(response.data.cameras); // if you're storing them in state
//       } catch (error) {
//         console.error('Error fetching cameras:', error.response?.data || error.message);
//       }
//     };
//   setTimeout(()=>{
//     fetchCameras();
//   }, 1000)
    
//   }, [token]);

  // useEffect(()=>{
  //   dispatch(fetchCameras(token))
  // }, [token])

    const quickActions = [
    { title: 'Snap Check', description: 'Quick image verification and analysis', icon: Camera, color: '#A78BFA', onClick: () => console.log('Snap Check clicked') },
    { title: 'QR Locker', description: 'Secure QR code management system', icon: QrCode, color: '#818CF8', onClick: () => console.log('QR Locker clicked') },
  ];


  // --------screen sizes----------
  const isLargerThan1390= useMediaQuery('(min-width: 1390px)');

  return (
    <Box sx={{minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box display={'flex'} width={'100%'} height={'auto'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'start'} mb={'auto'} p={'0rem 1rem'} >
        <Box bgcolor={'white'} width={'100%'} mt={'0.4rem'} height={'100%'} p={'1.3rem'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} mb={'auto'} borderRadius={'19px'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}>
          <Typography fontSize={'1.8rem'} mb={'1rem'}>
            {/* <span style={{color: colors.primary}}> Hi {userData?.sub?.split('@')[0].replace(/^./, c => c.toUpperCase())}...</span>  */}
            Welcome To the Rabs Industries</Typography>
         {/* <Typography  color='grey'>Advanced AI-powered monitoring and detection system</Typography> */}
          {/* <Box bgcolor={'blue'} width={'100%'} height={'14rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}>
              {
                [
                  {icon: <BsGraphUp />, count: 0, title: 'Camera Count'},
                  {icon: <MdSpatialTracking />, count: 0, title: 'Total Detection'},
                  {icon: <FaFire />, count: 0, title: 'Smoke Detection'},
                  {icon: <MdSmokeFree />, count: 0, title: 'Smoke Detection'},
                  {icon: <FaTruckLoading />, count: 0, title: 'Load-unload'},
                  {icon: <IoMedkit />, count: 0, title: 'PPE Detection'}
                ].map((elem, index)=>(
                  <Box bgcolor={'white'} width={'15rem'} borderRadius={'13px'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} p={'1rem'} alignItems={'center'} boxShadow={'rgba(149, 157, 165, 0.2) 0px 8px 24px'}>
                    <span style={{backgroundColor: 'green',fontSize: '1.7rem', color: colors.primary, padding: '0.5rem', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{elem.icon}</span>
                    
                    <Typography fontSize={'3rem'}>{elem.count}</Typography>
                    <Typography fontSize={'1.1rem'}>{elem.title}</Typography>
                  </Box>
                ))
              }
          </Box> */}


<Box width={'100%'} height={'8rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}  >
              {
                [
                  {icon: <FaFire />, title: 'Fire Detection', path: '/fire', color: '#81A493'},
                  {icon: <GiSmokeBomb />, title: 'Smoke Detection', path: '/smoke', color: '#A38181'},
                  {icon: <IoMedkit />, title: 'PPE Detection', path: '/ppe-kit', color: '#767794'},
                  {icon: <FaTruckLoading />, title: 'Loading-unloading', path: '/truck', color: 'rgb(155, 131, 119)'},
                  {icon: <FaClipboardList />, title: 'Dispatch Stock', path: '/fg-stock', color: '#7C99AE'},
                  {icon: <IoStorefront />, title: 'Store Stock Board', path: '/store-stock', color: 'rgb(128, 116, 128)'},
                  {icon: <MdOutlineManageHistory />, title: 'Complaint', path: '/complaint-board', color: 'rgb(112, 152, 155)'},
                  {icon: <FaTools />, title: 'Tool Manage Board', path: 'tool-management', color: '#A5A06B'},
                  {icon: <FaTools />, title: 'BracketD', path: 'bracket-d', color: 'rgb(80, 105, 88)'},
                  // {icon: <FaTools />, title: 'BracketD', path: 'bracket-d', color: 'rgb(80, 105, 88)'},
                ].map((elem, index)=>(
                  <Box key={index} onClick={()=> navigate(elem.path)} bgcolor={elem.color} width={'24%'} borderRadius={'13px'} display={'flex'} flexDirection={'column'}  justifyContent={'space-between'} p={'1rem'}  alignItems={'center'} sx={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    },
                  }}>
                    <span
  style={{
    backgroundColor: 'rgba(202, 202, 202, 0.83)', // lightgrey with opacity
    backdropFilter: 'blur(8px)', // blur effect for translucent background
    WebkitBackdropFilter: 'blur(8px)', // Safari support
    fontSize: '1.7rem',
    color: colors.primary,
    padding: '0.5rem',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgba(50, 50, 93, 0.12) 0px 13px 27px -5px, rgba(0, 0, 0, 0.1) 0px 8px 16px -8px'
  }}
>
  {elem.icon}
</span>
                    <Typography fontSize={'3rem'}>{elem.count}</Typography>
                    <Typography fontSize={'1rem'} textAlign={'center'}>{elem.title}</Typography>
                  </Box>
                ))
              }
          </Box>

{/* <Box width={'100%'} height={'11rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}  >
              {
                [
                  {icon: <FaFire />, title: 'Compliance', path: '/fire', color: '#1AAF51', backColor: '#F0FDF4' },
                  {icon: <GiSmokeBomb />, title: 'Positioning', path: '/smoke', color: '#EC5B0D', backColor: '#FFF7ED'},
                  {icon: <IoMedkit />, title: 'Inventory Management', path: '/ppe-kit', color: '#2A6AEE', backColor: '#E5EBF3'},
                ].map((elem, index)=>(
                  <Box key={index} onClick={()=> navigate(elem.path)} bgcolor={elem.backColor}  width={'32%'} borderRadius={'13px'} display={'flex'} flexDirection={'column'}  justifyContent={'space-between'} p={'1rem'}  alignItems={'center'} sx={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    },
                  }}>
                    <Box display={'flex'} alignItems={'center'} mr={'auto'}>
                    <span
  style={{
    backgroundColor: elem.color, // lightgrey with opacity
    backdropFilter: 'blur(8px)', // blur effect for translucent background
    WebkitBackdropFilter: 'blur(8px)', // Safari support
    fontSize: '1.7rem',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgba(50, 50, 93, 0.12) 0px 13px 27px -5px, rgba(0, 0, 0, 0.1) 0px 8px 16px -8px'
  }}
>
  {elem.icon}
</span>
<Box display={'flex'} flexDirection={'column'} ml={'0.5rem'} alignItems={'start'}>
                    <Typography fontSize={'1.1rem'} textAlign={'center'} >{elem.title}</Typography>
                    <Typography>Fire, smoke and PPE Detection</Typography>
                    </Box>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} mr={'auto'}>
                      <span>- Fire</span>
                      <span>- Smoke</span>
                      <span>- PPE</span>
                      <span>- Truck</span>
                    </Box>
                  </Box>
                ))
              }
          </Box> */}

         
          
        </Box>

{/* -------------------------graph visualization----------------------------- */}
<Box display={'flex'} flexDirection={isLargerThan1390?'row': 'column'} justifyContent={'space-between'} alignItems={'start'} width={'100%'} mt={'1.4rem'} >
          <Box display={'flex'} minHeight={'30rem'} flex={1} flexDirection={'column'} bgcolor={'white'}  p={'1rem'} borderRadius={'8px'} sx={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 3px 8px'}}>
<Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={'1.4rem'} fontWeight={500} color='#181818'><BsGraphUp style={{color: 'tomato', marginRight: '1rem', fontSize: '1.8rem'}} />Model-wise Detection Overview:</Typography>

          <TextField  
             size='small'
            label="Select Date"
            sx={{ width: '18rem' }}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          </Box>
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem', maxHeight: '27rem', overflowY: 'scroll' }}>
      {cameraData.map((camera, index) => (
        <div
          key={index}
          style={{
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1rem',
            borderRadius: '9px',
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',
          }}
        >
          <Box display="flex" width="100%" justifyContent="space-between" alignItems="start">
            <p style={{ fontSize: '1.4rem' }}>{camera.camId}</p>
          </Box>

          <PieChart width={280} height={220}>
            <Pie
              data={camera.cameras.map((c) => ({
                ...c,
                name: c.camera_id || c.name || 'Unknown',
              }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="count"
              nameKey="name"
            >
              {camera.cameras.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </div>
      ))}
    </div> */}
    
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', margin: '1rem', maxHeight: '27rem', overflowY: 'scroll' }}>
  {graphData.length > 0 ? (
    graphData.map((camera, index) => (
      <div
        key={index}
        style={{
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '1rem',
          borderRadius: '9px',
          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',
        }}
      >
        <Box display="flex" width="100%" justifyContent="space-between" alignItems="start">
          <p style={{ fontSize: '1.4rem' }}>{camera.category}</p>
        </Box>

        <PieChart width={280} height={220}>
          <Pie
            data={camera.cameras.map((c) => ({
              ...c,
              name: c.camera_id || c.name || 'Unknown',
              totalDetections: c.images.length, // Use images.length for detections
            }))}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="totalDetections"
            nameKey="name"
          >
            {camera.cameras.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} detections`,
              `Camera: ${props.payload.name}`,
            ]}
          />
        </PieChart>

        {/* Custom Legend Below the Pie Chart */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {camera.cameras.map((c, index) => (
              <li
                key={`legend-item-${index}`}
                style={{ marginBottom: '8px', color: COLORS[index % COLORS.length] }}
              >
                {`CameraId ${c.camera_id}: ${c.images.length} detections`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))
  ) : (
    <p style={{ fontSize: '1.5rem', color: 'grey', marginTop: '10rem'}}>No Data found for {date}</p>
  )}
</div>
    {/* <Box>
      {
        COLORS.map((elem)=>(
          <Box>fire</Box>  
        ))
      }
    </Box> */}


    </Box>

    <Box display={'flex'} flexDirection={'column'} width={isLargerThan1390? '34%': '100%'} ml={isLargerThan1390? '1rem': '0rem'}>
      {/* <Box display={'flex'} justifyContent={'space-between'} margin={'1rem'} >
        <Box component={'a'} target="_blank"
    rel="noopener noreferrer" href='http://snapcheckv1.s3-website.ap-south-1.amazonaws.com/login' width={'48%'} bgcolor={'rgba(73, 104, 150, 0.29)'} sx={{cursor: 'pointer', textDecoration: 'none', color: 'black'}} height={'3.9rem'} display={'flex'} alignItems={'center'} justifyContent={'center'} boxShadow={'rgba(0, 0, 0, 0.1) 0px 4px 12px;'} borderRadius={'8px'}>Snapcheck</Box>
        <Box component={'a'}target="_blank"
    rel="noopener noreferrer" href='http://qrlocker.s3-website.ap-south-1.amazonaws.com/login?redirect=%2F' width={'48%'} bgcolor={'rgba(150, 73, 115, 0.29)'}  sx={{cursor: 'pointer', textDecoration: 'none', color: 'black'}} height={'3.9rem'} display={'flex'} alignItems={'center'} justifyContent={'center'}  boxShadow={'rgba(0, 0, 0, 0.1) 0px 4px 12px;'} borderRadius={'8px'}>QR Locker</Box>
      </Box> */}

<Box display={'flex'} justifyContent={'space-between'} margin={'1rem'}>

<Box
    component={'a'}
    target="_blank"
    rel="noopener noreferrer"
    href='http://qrlocker.s3-website.ap-south-1.amazonaws.com/login'
    width={'48%'}
    height={'3.9rem'}
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    borderRadius={'8px'}
    sx={{
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'black',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
      background: 'linear-gradient(135deg, rgba(150,73,115,0.5), rgba(161, 42, 42, 0.2))',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    {/* <FiCheckCircle /> */}
    <BsQrCodeScan style={{fontSize: '1.5rem', position: 'relative', right: '2.3rem'}} />
    <Typography >QR Locker</Typography>
   
  </Box>
  
  <Box
    component={'a'}
    target="_blank"
    rel="noopener noreferrer"
    href='http://snapcheckv1.s3-website.ap-south-1.amazonaws.com/login'
    width={'48%'}
    height={'3.9rem'}
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    borderRadius={'8px'}
    sx={{
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'black',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
      background: 'linear-gradient(135deg, rgba(73,104,150,0.5), rgba(97, 96, 160, 0.2))',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <BsCheck2Square  style={{fontSize: '1.5rem', position: 'relative', right: '2.3rem'}} />
    {/* <BsQrCodeScan style={{fontSize: '1.5rem', position: 'relative', right: '2.3rem'}} /> */}
    <Typography>Snapcheck</Typography>
   
  </Box>

  

 
</Box>
{/* ---------------camera details--------------- */}
     <Box width={'100%'}  mt={isLargerThan1390? '0rem':'2rem'} bgcolor={'white'}  p={'0.7rem'} borderRadius={'6px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Typography fontSize={'1.4rem'} mb={'1rem'} borderBottom={'1px solid grey'}>Camera Details:</Typography>
        <Paper sx={{ width: '100%',maxHeight: '25.3rem', overflow: 'auto' }}>
        <TableContainer component={Paper} sx={{ maxHeight: '25rem'}}>
        <Table aria-label="simple table">
      {/* <Table  stickyHeader aria-label="sticky table"> */}
        <TableHead  sx={{bgcolor: 'lightgrey'}}>
          <TableRow>
            <TableCell sx={{fontSize: '1.2rem'}}>Sr No</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Camera Id</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Rtsp Link</TableCell>
            {/* <TableCell align="start" sx={{fontSize: '1.2rem'}}>User</TableCell> */}
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Model</TableCell>
            <TableCell align="start" sx={{fontSize: '1.2rem'}}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            allCameras.length>0?
            allCameras.map((elem, index)=>(
<TableRow key={index}> 
            <TableCell align="start">{index+1}</TableCell>
            <TableCell align="start">{elem.camera_id}</TableCell>
            <TableCell align="start"><Box width={'10rem'} p={'0rem 0.5rem'} sx={{overflowX: 'auto'}}>{elem.rtsp_link}</Box></TableCell>
            {/* <TableCell align="start">yash@gmail.com</TableCell> */}
            <TableCell align="start"><span style={{backgroundColor: 'rgb(92, 126, 100)', padding: '0.2rem 0.6rem',width: '5rem', borderRadius: '9px', color: 'white'}}>{elem.model}</span></TableCell>
            <TableCell align="start"><Button variant='contained' size='small' sx={{bgcolor: '#CE9E9D'}} onClick={()=> handleDelete(elem.camera_id, elem.model)}>Delete</Button></TableCell>
          </TableRow>
            )): <Typography p={'1rem'}>No camera found</Typography>
          }
            
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>
          </Box>

          </Box>
          </Box>




        {/* <Box bgcolor={'white'} width={'26rem'} borderRadius={'6px'} height={'10rem'} mt={'3rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} p={'1rem'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}>
          <Typography fontSize={'1.5rem'}>Camera</Typography>
           <Box width={'100%'} height={'50%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>     
<Button  variant='outlined'  onClick={()=> setIsOpen('open-add')} sx={{height: '60%', color: 'green', borderColor: 'green', width: '45%'}}>Add</Button>
<Button variant='outlined' onClick={()=> setIsOpen('open-remove')} sx={{height: '60%', color: 'red', borderColor: 'red', width: '45%'}}>Remove</Button>

           </Box>
           
        </Box> */}
        </Box>
        </Box>
  )
}

export default Dashboard;


