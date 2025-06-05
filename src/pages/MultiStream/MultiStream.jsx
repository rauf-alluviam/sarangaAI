// import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import { FaRegStopCircle } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'
// import LiveStream from './LiveStream'
// import axios from 'axios'

// const MultiStream = () => {
//     const navigate= useNavigate();
//     const isLargerThan1200= useMediaQuery('(min-width: 1200px)');
//     const [url, setUrl]= useState('');
//     const BACKEND_API= import.meta.env.VITE_BACKEND_API;

//     const corsProxy = 'https://cors-anywhere.herokuapp.com/';
//     const backendURL = 'http://13.202.42.73:8015/start_streaming';
//     const fullURL = corsProxy + backendURL;

// axios.post(fullURL, {
//   model: "fire.pt"
// })
//   .then(res => console.log('Upload successful:', res))
//   .catch(err => console.error('Upload failed:', err));

// fetch(fullURL, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     model: "fire.pt"
//   })
// })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(`Upload failed: ${response.status} - ${text}`);
//       });
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Upload successful:', data);
//   })
//   .catch(err => {
//     console.error(err.message);
//   });

// const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');

// const headers = {
//   'accept': 'application/json',
//   'Authorization': `Bearer ${storedToken}`,
//   'Content-Type': 'application/json',
// };

// const getHeaders = () => ({
//   'accept': 'application/json',
//   'Authorization': `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });


// // const data = {
// //   model: 'fire.pt',
// // };

// const stopMultiStream = async () => {
//   try {
//     await axios.post('http://0.0.0.0:8000/stop_streaming', {}, { headers });
//     console.log('Previous stream stopped');
//   } catch (error) {
//     console.error('Error stopping previous stream:', error.response ? error.response.data : error.message);
//   }
// };

// useEffect(() => {
//   const startStream = async () => {
//     try {
//       // const token = localStorage.getItem("rabsToken");\
//       const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');


//       const headers = {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${storedToken}`,
//       };

//       const data = {
//         model: "fire.pt", // Replace with your actual payload
//       };

//       // First stop any existing stream
//       await stopMultiStream();

//       // Then start new stream
//       const response = await axios.post(
//         'http://0.0.0.0:8000/start_streaming',
//         data,
//         { headers }
//       );

//       console.log('Streaming started:', response.data);
//       setUrl(response.data.stream_url);
//     } catch (error) {
//       console.error('Error starting stream:', error.response ? error.response.data : error.message);
//     }
//   };

//   startStream();
// }, []);

// // useEffect(() => {
// //   const fetchCameras = async () => {
// //     try {
// //       // const response = await axios.get(`http://0.0.0.0:8000/get_cameras`, {
// //       //   headers: getHeaders(),
// //       // });
// //     const response = await axios.get(`http://0.0.0.0:8000/get_cameras`, {
// //         headers: getHeaders(),
// //       });
// //       // setCameras(response.data.cameras);
// //       const cameraList = response.data.cameras || [];
// // setCameras(cameraList);

// // // ✅ Set first camera as selected by default
// // if (cameraList.length > 0) {
// // setSelectedCamera(cameraList[0].camera_id);
// // }
// //       console.log('Cameras:', response.data.cameras);
// //       // setCameras(response.data.cameras); // if you're storing them in state
// //     } catch (error) {
// //       console.error('Error fetching cameras:', error.response?.data || error.message);
// //     }
// //   };

// //   fetchCameras();
// // }, [model, token]);


//   return (
//     <Box height={'87vh'} width={'100%'} display={'flex'} flexDirection={isLargerThan1200 ? 'row' : 'column-reverse'}  justifyContent={'space-between'} alignItems={'start'}>
//     {/* <Box  display={'flex'} flexWrap={'wrap'} flex={1} bgcolor={'grey'} pt={'1rem'} height={'100%'} sx={{overflowY: 'scroll'}}>
//         {
//             [...Array(6)].map((elem, ind)=> (
//                 <Box onClick={()=> navigate(`/single-stream/${ind}`)} key={ind} width={'41%'} height={'21rem'} bgcolor={'lightgrey'} marginLeft={'auto'} marginRight={'auto'} mb={'1rem'}>
// {ind}
//                 </Box>
//             ))
//         }
//     </Box> */}

// {/* <LiveStream /> */}
// {/* <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: 'red'}}> */}
// <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: '100%', flex: 1 }}>

//       <img
//         src={url}
//         alt="Live Stream"
//         style={{
//           width: '100%',
//         //   maxWidth: '900px',
//           borderRadius: '10px',
//           border: '2px solid #333'
//         }}
//       />
//     </div>

//     {/* ---------------------------right side bar-------------------------- */}
//     <Box  display={'flex'}  flexDirection={isLargerThan1200? 'column': 'row'} justifyContent={'space-between'} p={isLargerThan1200? '2rem 0rem': '0.5rem 0rem'} alignItems={isLargerThan1200? 'center': 'start'}  width={isLargerThan1200? '14rem': '100%'} height={isLargerThan1200?'100%': 'auto'} >
   

// <FormControl sx={{  minWidth: 120,  width: isLargerThan1200? '95%': '14rem'}}>
//         <InputLabel id="demo-simple-select-helper-label">Model</InputLabel>
//         <Select
//           labelId="demo-simple-select-helper-label"
//           id="demo-simple-select-helper"
//         //   value={age}
//           label="Age"          
//         //   onChange={handleChange}
//         >
//           {/* <MenuItem value="">
//             <em>None</em>
//           </MenuItem> */}
//           <MenuItem value={'fire.pt'}>Fire</MenuItem>
//           {/* <MenuItem value={20}>ppe</MenuItem>
//           <MenuItem value={30}>Thirty</MenuItem> */}
//         </Select>
//         <FormHelperText>select model</FormHelperText>
//       </FormControl>

// <Button onClick={stopMultiStream} variant='outlined' color='error' sx={{width: '14rem', height: isLargerThan1200?  '2.8rem': '2.5rem', mt: isLargerThan1200? '1rem': '0rem'}} endIcon={<FaRegStopCircle />}>Stop</Button>    
// </Box>
//     </Box>
//   )
// }

// export default MultiStream

// -------------------------------------------
// import {
//   Box,
//   Button,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   MenuItem,
//   Select,
//   useMediaQuery,
// } from '@mui/material';
// import React, { useEffect, useRef, useState } from 'react';
// import { FaRegStopCircle } from 'react-icons/fa';
// import axios from 'axios';

// const MultiStream = () => {
//   const isLargerThan1200 = useMediaQuery('(min-width: 1200px)');
//   const [url, setUrl] = useState('');
//   const [throttledSrc, setThrottledSrc] = useState('');
//   const [model, setModel] = useState('fire.pt');
//   const intervalRef = useRef(null);
//   // const token = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');


//     const [token, setToken] = useState(null);

//   const BACKEND_API = import.meta.env.VITE_BACKEND_API;

//   useEffect(() => {
//       const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
//       if (storedToken) {
//         setToken(storedToken);
//         console.log('Token from localStorage:', storedToken);
//       } else {
//         console.warn('No token found in localStorage.');
//       }
//     }, []);
  

//   const getHeaders = () => ({
//     accept: 'application/json',
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   });

//   const stopMultiStream = async () => {
//     clearInterval(intervalRef.current);
//     setThrottledSrc('');
//     try {
//       await axios.post(`${BACKEND_API}/stop_streaming`, {}, { headers: getHeaders() });
//       console.log('Multi stream stopped');
//     } catch (error) {
//       console.error('Error stopping multi stream:', error.response?.data || error.message);
//     }
//   };

//   const startThrottledStream = (streamUrl) => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setThrottledSrc(`${streamUrl}?t=${Date.now()}`);
//     }, 500); // 500ms = 2 FPS
//   };

//   const startMultiStream = async () => {
//     if (!token) return console.warn('Token not found');
//     try {
//       await stopMultiStream();
//       const res = await axios.post(
//         `${BACKEND_API}/start_streaming`,
//         { model },
//         { headers: getHeaders() }
//       );
//       const streamUrl = res.data.stream_url;
//       setUrl(streamUrl);
//       startThrottledStream(streamUrl);
//       console.log('Multi stream started:', streamUrl);
//     } catch (error) {
//       console.error('Error starting multi stream:', error.response?.data || error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) startMultiStream();
//     return () => clearInterval(intervalRef.current);
//   }, [model, token]);

//   return (
//     <Box
//       height={'87vh'}
//       width={'100%'}
//       display={'flex'}
//       flexDirection={isLargerThan1200 ? 'row' : 'column-reverse'}
//       justifyContent={'space-between'}
//       alignItems={'start'}
//     >
//       {/* Live Stream Section */}
//       {/* {
//         url && ( */}
//           <div
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           padding: '1rem',
//           width: '100%',
//           flex: 1,
//         }}
//       >
//         <img
//           src={throttledSrc || null}
//           alt="Live Stream"
//           style={{
//             width: '100%',
//             borderRadius: '10px',
//             border: '2px solid #333',
//           }}
//         />
//       </div>
//         {/* )
//       } */}
      

//       {/* Right Side Controls */}
//       <Box
//         display={'flex'}
//         flexDirection={isLargerThan1200 ? 'column' : 'row'}
//         justifyContent={'space-between'}
//         p={isLargerThan1200 ? '2rem 0rem' : '0.5rem 0rem'}
//         alignItems={isLargerThan1200 ? 'center' : 'start'}
//         width={isLargerThan1200 ? '14rem' : '100%'}
//         height={isLargerThan1200 ? '100%' : 'auto'}
//       >
//         <FormControl sx={{ minWidth: 120, width: isLargerThan1200 ? '95%' : '14rem' }}>
//           <InputLabel id="model-select-label">Model</InputLabel>
//           <Select
//             labelId="model-select-label"
//             id="model-select"
//             value={model}
//             label="Model"
//             onChange={(e) => setModel(e.target.value)}
//           >
//             <MenuItem value={'fire.pt'}>Fire</MenuItem>
//             {/* Add more models if needed */}
//           </Select>
//           <FormHelperText>Select model</FormHelperText>
//         </FormControl>

//         <Button
//           onClick={stopMultiStream}
//           variant="outlined"
//           color="error"
//           sx={{
//             width: '14rem',
//             height: isLargerThan1200 ? '2.8rem' : '2.5rem',
//             mt: isLargerThan1200 ? '1rem' : '0rem',
//           }}
//           endIcon={<FaRegStopCircle />}
//         >
//           Stop
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default MultiStream;


// -----------working but its showing loading stream text while stopped stream-------------------

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { FaRegStopCircle } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const MultiStream = () => {
  const {cameras}= useSelector((state)=> state.cameras);
  const {userData} = useSelector((state) => state.auth);
  const isLargerThan1200 = useMediaQuery('(min-width: 1200px)');
  const [url, setUrl] = useState('');
  const [throttledSrc, setThrottledSrc] = useState('');
  console.log('url:', url)
  console.log('throttledSrc:', throttledSrc)
  // const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  // const token = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
  const [token, setToken] = useState(null);
  const [extractedModels, setExtractedModels]= useState([]);
  const { model } = useParams();
  // console.log(model)

  const BACKEND_API = import.meta.env.VITE_BACKEND_API;

   // -----------extracted the models of a particular user can see in dropdown only the particular model that he has access-----------
      useEffect(()=> {
        let arr= [];
        for(let key in cameras){
          arr.push(key)
        }
        setExtractedModels(arr)
      }, [])

  useEffect(() => {
      const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
      if (storedToken) {
        setToken(storedToken);
        console.log('Token from localStorage:', storedToken);
      } else {
        console.warn('No token found in localStorage.');
      }
    }, []);
  

  const getHeaders = () => ({
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  // --------------last working code-------------------
  const stopMultiStream = async () => {
    clearInterval(intervalRef.current);
    setThrottledSrc('');
    console.log('Stopping multi stream...');
    try {
      await axios.post(`${BACKEND_API}/stop_streaming?category=${model}`, {}, { headers: getHeaders() });
      console.log('Multi stream stopped');
    } catch (error) {
      console.error('Error stopping multi stream:', error.response?.data || error.message);
    }
  };

  // const stopMultiStream = async () => {
  //   clearInterval(intervalRef.current);  // Stop throttling the stream
  
  //   // Only stop the stream URL if you want to stop the streaming.
  //   setUrl('');  // This removes the live stream view from the screen.
  
  //   // You might want to keep the last throttled source for a "paused" view
  //   // (Do NOT clear throttledSrc if you want a paused image after stopping).
  //   // setThrottledSrc(''); // DON'T clear it if you want to show the paused image.
  
  //   try {
  //     await axios.post(`${BACKEND_API}/stop_streaming?category=${model}`, {}, { headers: getHeaders() });
  //     console.log('Multi stream stopped');
  //   } catch (error) {
  //     console.error('Error stopping multi stream:', error.response?.data || error.message);
  //   }
  // };

  // ------------------working but its showing loading stream text while stopped stream-------------------
  // const stopMultiStream = async () => {
  //   clearInterval(intervalRef.current);
  //   setThrottledSrc('');
  //   setUrl(''); // 🛑 This will also stop the browser from pulling the stream
  //   try {
  //     await axios.post(`${BACKEND_API}/stop_streaming?category=${model}`, {}, { headers: getHeaders() });
  //     console.log('Multi stream stopped');
  //   } catch (error) {
  //     console.error('Error stopping multi stream:', error.response?.data || error.message);
  //   }
  // };

  const startThrottledStream = (streamUrl) => {
    if (!streamUrl) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const url = new URL(streamUrl, window.location.origin);
      url.searchParams.set('t', Date.now().toString());
      setThrottledSrc(url.toString());
    }, 500); // 500ms = 2 FPS
  };

  const startMultiStream = async () => {
    if (!token) return console.warn('Token not found');
    setLoading(true);
    try {
      await stopMultiStream();
      const res = await axios.post(
        `${BACKEND_API}/start_streaming?category=${model}`,
        { category: model },
        { headers: getHeaders() }
      );

      if (res.data?.stream_url) {
        const streamUrl = res.data.stream_url;
        setUrl(streamUrl);
        startThrottledStream(streamUrl);
        console.log('Multi stream started:', streamUrl);
      } else {
        console.error('No stream URL returned from backend');
      }
    } catch (error) {
      console.error('Error starting multi stream:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (token) startMultiStream();
    return () => clearInterval(intervalRef.current);
  }, [model, token]);

  // useEffect(() => {
  //   if (token) startMultiStream();
  //   return () => {
  //     // Stop interval
  //     clearInterval(intervalRef.current);
  
  //     // Stop stream URL in frontend
  //     setUrl('');
  //     // setThrottledSrc('');
  
  //     // Stop stream on backend
  //     stopMultiStream();
  //   };
  // }, [model, token]);

  return (
    <Box
      height={isLargerThan1200? '87vh': 'auto'}
      width={'100%'}
      display={'flex'}
      flexDirection={isLargerThan1200 ? 'row' : 'column'}
      justifyContent={'space-between'}
      alignItems={'start'}
    >
      {/* Live Stream Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          width: '100%',
          flex: 1,
        }}
      >

{url || throttledSrc ? (
  <img
    src={url || throttledSrc}
    alt="Live Stream"
    style={{
      width: '100%',
      borderRadius: '10px',
      border: '2px solid #333',
    }}
  />
) : (
  model? <span style={{fontSize: '1.2rem'}}>Loading stream...</span>: <span style={{fontSize: '1.2rem'}}>Select Model to see video stream</span>
  
)}

      </div>

      {/* Right Side Controls */}
      <Box
        display={'flex'}
        flexDirection={isLargerThan1200 ? 'column' : 'row'}
        justifyContent={isLargerThan1200? 'start': 'space-evenly'}
        // p={isLargerThan1200 ? '2rem 1rem' : '0.5rem 0rem'}
        pt={'2rem'}
        // p={'2rem'}
        alignItems={isLargerThan1200 ? 'center' : 'start'}
        width={isLargerThan1200 ? '14rem' : '100%'}
        height={isLargerThan1200 ? 'auto' : 'auto'}
      >
        {/* <FormControl sx={{ width: isLargerThan1200 ? '100%' : '14rem', mr: !isLargerThan1200 && '2rem' }} >
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
          >
             {
                        extractedModels.map((elem)=>(
            <MenuItem value={elem}>{elem}</MenuItem>
                        ))
                      }
           
          </Select>
          <FormHelperText>Select model</FormHelperText>
        </FormControl> */}
        {/* {
          userData && userData.role == 'admin' && ( */}
          {(
<Box display={'flex'} width={isLargerThan1200? '100%': '70%'} flexDirection={isLargerThan1200? 'column': 'row'}>
        <Button

          onClick={stopMultiStream}
          variant="outlined"
          color="error"
          sx={{
            width: isLargerThan1200? '14rem': '49%',
            height: isLargerThan1200 ? '2.8rem' : '2.5rem',
            mt: isLargerThan1200 ? '1rem' : '0rem',
            mr: !isLargerThan1200 && '1rem'
          }}
          endIcon={<FaRegStopCircle />}
          disabled={loading}
        >
          {loading ? 'Stopping...' : 'Stop'}
        </Button>

        <Button
          onClick={startMultiStream}
          variant="outlined"
          color="primary"
          sx={{
            width: isLargerThan1200? '14rem': '49%',
            height: isLargerThan1200 ? '2.8rem' : '2.5rem',
            mt: isLargerThan1200 ? '1rem' : '0rem',
          }}
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start'}
        </Button>
        </Box>
    )
        }


      </Box>
    </Box>
  );
};

export default MultiStream;

// --------------------------------------
// import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import axios from 'axios';
// import React, { useEffect, useState, useRef } from 'react';
// import { FaRegStopCircle } from 'react-icons/fa';

// const MultiStream = () => {
//   const [url, setUrl] = useState('');
//   const [model, setModel] = useState('ppe.pt');
//   const [token, setToken] = useState(null);
//   const [cameras, setCameras] = useState([]);
//   const [selectedCameras, setSelectedCameras] = useState([]);
//   const intervalRef = useRef(null);

//   const BACKEND_API = import.meta.env.VITE_BACKEND_API;

//   useEffect(() => {
//     const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
//     if (storedToken) {
//       setToken(storedToken);
//       console.log('Token from localStorage:', storedToken);
//     } else {
//       console.warn('No token found in localStorage.');
//     }
//   }, []);

//   const getHeaders = () => ({
//     accept: 'application/json',
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   });

//   const stopStreaming = async () => {
//     if (!token) return console.warn('Cannot stop stream without token');
//     clearInterval(intervalRef.current);
//     setUrl('');

//     try {
//       await axios.post(`${BACKEND_API}/stop_multi_camera_streaming`, {}, { headers: getHeaders() });
//       console.log('Streaming stopped');
//     } catch (error) {
//       console.error('Error stopping streams:', error.response?.data || error.message);
//     }
//   };

//   const startStreaming = async () => {
//     if (!token || selectedCameras.length === 0) return console.warn('Cannot start stream without token or cameras');

//     try {
//       await stopStreaming();  // Graceful stop for any previous streams
//       const response = await axios.post(
//         `${BACKEND_API}/start_multi_camera_streaming`,
//         { cameras: selectedCameras, model: model },
//         { headers: getHeaders() }
//       );

//       console.log('Streaming started:', response.data);
//       const streamUrl = response.data.stream_url; // Assuming this is the combined stream URL
//       setUrl(streamUrl);
//       startThrottledStream(streamUrl);
//     } catch (error) {
//       console.error('Error starting streams:', error.response?.data || error.message);
//     }
//   };

//   const startThrottledStream = (streamUrl) => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setUrl(`${streamUrl}?t=${Date.now()}`);
//     }, 500); // adjust FPS as needed
//   };

//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         const response = await axios.get(`${BACKEND_API}/get_cameras`, { headers: getHeaders() });
//         const cameraList = response.data.cameras || [];
//         setCameras(cameraList);
//         if (cameraList.length > 0) {
//           setSelectedCameras([cameraList[0].camera_id]);
//         }
//       } catch (error) {
//         console.error('Error fetching cameras:', error.response?.data || error.message);
//       }
//     };

//     if (token) fetchCameras();
//   }, [model, token]);

//   return (
//     <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: '100%', flex: 1 }}>
//         {url && (
//           <img
//             src={url}
//             alt="Live Stream"
//             style={{
//               width: '100%',
//               borderRadius: '10px',
//               border: '2px solid #333',
//             }}
//           />
//         )}
//       </div>

//       <Box display={'flex'} alignItems={'center'} height={'3rem'}>
//         <Button
//           onClick={stopStreaming}
//           variant="outlined"
//           color="error"
//           sx={{ width: '25rem', height: '100%', mr: '1rem' }}
//           endIcon={<FaRegStopCircle />}
//         >
//           Stop
//         </Button>

//         <FormControl fullWidth>
//           <InputLabel id="model-select-label">Model</InputLabel>
//           <Select
//             labelId="model-select-label"
//             id="model-select"
//             value={model}
//             label="Model"
//             onChange={(e) => setModel(e.target.value)}
//             sx={{ height: '100%', width: '15rem' }}
//           >
//             <MenuItem value={'fire.pt'}>Fire</MenuItem>
//             <MenuItem value={'ppe.pt'}>PPE</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth>
//           <InputLabel id="camera-select-label">Cameras</InputLabel>
//           <Select
//             labelId="camera-select-label"
//             id="camera-select"
//             multiple
//             value={selectedCameras}
//             label="Cameras"
//             onChange={(e) => setSelectedCameras(e.target.value)}
//             sx={{ height: '100%', width: '15rem' }}
//           >
//             {cameras.map((elem, index) => (
//               <MenuItem key={elem.camera_id || index} value={elem.camera_id}>
//                 {elem.camera_id}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           onClick={startStreaming}
//           variant="outlined"
//           color="primary"
//           sx={{ width: '25rem', height: '100%' }}
//         >
//           Start
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default MultiStream;




