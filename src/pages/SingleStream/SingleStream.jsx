// import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { FaRegStopCircle } from 'react-icons/fa'
// import { useSelector } from 'react-redux';

// const SingleStream = () => {
//   const [url, setUrl]= useState();
//   const [model, setModel]= useState('');
//   // const {token} = useSelector((state)=> state.auth)
//   // const [cameras, setCameras]= useState()
//   console.log(url)
//   const BACKEND_API= import.meta.env.VITE_BACKEND_API;

// const token= localStorage.getItem('rabsToken');
// console.log('Token from localStorage:', token);


// const headers = {
//   'accept': 'application/json',
//   'Authorization': `Bearer ${token}`,
//   'Content-Type': 'application/json',
// };


// const data = {
//   model: 'ppe.pt',
// };

// // const getCamera = async () => {
// //   const headers = {
// //     'accept': 'application/json',
// //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYW1kZW8iLCJleHAiOjE3NDQ2Mjk2Mjd9.nZ-w2G4I8lGhWvdZak18IFoxtpbhkR8MIbDx28hqh-Q'
// //   };

// //   try {
// //     const response = await axios.get('http://13.202.42.73:8015/get_cameras', { headers });
// //     console.log('Camera List:', response.data.cameras);
// //     setCameras(response.data.cameras)
// //   } catch (error) {
// //     console.error('Error fetching cameras:', error.response?.data || error.message);
// //   }
// // };

// // getCamera();


// const stopStreaming=()=>{
//   axios.post(`${BACKEND_API}/stop_single_camera_streaming`, {}, {headers});
//   console.log('Token from localStorage:', token);

//   // alert('single stream stopped')
// }

// const startStreaming= ()=>{
//   stopStreaming();
//   axios.post(`${BACKEND_API}/start_single_camera_streaming?camera_id=1`, data, { headers })
//   .then(response => {
//     console.log('Streaming started:', response.data);
//     setUrl(response.data.stream_url)
//     console.log('Token from localStorage:', token);

//   })
//   .catch(error => {
//     console.error('Error starting stream:', error.response ? error.response.data : error.message);
//   });
// }

// useEffect(()=>{
//   startStreaming();
// }, [model])


  

// // try {
// //   const response= axios.get('http://13.202.42.73:8015/get_cameras');
// //   console.log(response)
// // } catch (error) {
// //   console.log(error)
// // }
//   return (
//     <Box display={'flex'} flexDirection={'column'} alignItems={'end'} >
//         {/* <Box bgcolor={'black'} width={'100%'} height={'80vh'}>Single Stream</Box> */}
//         <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center', padding: '1rem', width: '100%' }}>
//       <img
//         src={url}
//         alt="Live Stream"
//         style={{
//           width: '100%',
//           // height: '100%',
//         //   maxWidth: '900px',
//           borderRadius: '10px',
//           border: '2px solid #333'
//         }}
//       />
//     </div>
//     <Box display={'flex'} alignItems={'center'} height={'3rem'}>
//               <Button onClick={stopStreaming} variant='outlined' color='error' sx={{width: '25rem', height: '100%', mr: '1rem'}} endIcon={<FaRegStopCircle />}>Stop</Button>
//    {/* <Button onClick={startStreaming} sx={{width: '14rem', height: '2.8rem', mt: '1rem'}} variant='outlined'>start</Button> */}
//    <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Model</InputLabel>
//   <Select
//   //  sx={{width: '14rem', height: '2.8rem', mt: '1rem'}} 
//   sx={{height: '100%', width: '15rem'}}
//     labelId="demo-simple-select-label"
//     id="demo-simple-select"
//     value={model}
//     label="Model"
//     onChange={(e)=> setModel(e.target.value)}
//   >
//     <MenuItem value={'fire.pt'}>Fire</MenuItem>
//     <MenuItem value={'smoke.pt'}>smoke</MenuItem>
//     <MenuItem value={'ppe.pt'}>PPE</MenuItem>
//     <MenuItem value={'ppe.pt'}>Loading-Unloading</MenuItem>
//   </Select>
// </FormControl>

// {/* <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Cam</InputLabel>
//   <Select
//   //  sx={{width: '14rem', height: '2.8rem', mt: '1rem'}} 
//   sx={{height: '100%', width: '15rem'}}
//     labelId="demo-simple-select-label"
//     id="demo-simple-select"
//     // value={model}
//     label="Cam"
//     // onChange={(e)=> setModel(e.target.value)}
//   >
   
// {Array.isArray(cameras) &&
//   cameras.map((elem, index) => (
//     <MenuItem key={elem.camera_id || index} value={elem.camera_id}>
//       Camera {elem.camera_id}
//     </MenuItem>
// ))}
   
//   </Select>
// </FormControl> */}

//    </Box>
//     </Box>
//   )
// }

// export default SingleStream

// -----------------------------
// import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaRegStopCircle } from 'react-icons/fa';

// const SingleStream = () => {
//   const [url, setUrl] = useState();
//   const [model, setModel] = useState('ppe.pt');
//   const [token, setToken] = useState(null);
//   const [cameras, setCameras] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   console.log(selectedCamera)

//   const BACKEND_API = import.meta.env.VITE_BACKEND_API;

//   // useEffect(()=>{
//   //   const response= axios.get(`${BACKEND_API}/get_cameras`, { headers: getHeaders() });
//   //   console.log(response)
//   // }, [])
  

//   // ✅ On mount, get the token from localStorage
//   useEffect(() => {
//     // const storedToken = localStorage.getItem('rabsToken')?.trim();
//     const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
//     console.log(storedToken)
//     if (storedToken) {
//       setToken(storedToken);
//       console.log('Token from localStorage:', storedToken);
//     } else {
//       console.warn('No token found in localStorage.');
//     }
//   }, []);

//   // ✅ Generate headers only when token exists
//   const getHeaders = () => ({
//     'accept': 'application/json',
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   });

//   // const data = { 'fire.pt' };

//   const stopStreaming = async () => {
//     if (!token) return console.warn('Cannot stop stream without token');

//     try {
//       console.log(getHeaders())
//       await axios.post(`${BACKEND_API}/stop_single_camera_streaming`, {}, { headers: getHeaders() });
//       console.log('Streaming stopped');
//     } catch (error) {
//       console.error('Error stopping stream:', error.response?.data || error.message);
//     }
//   };

//   const startStreaming = async () => {
//     if (!token) return console.warn('Cannot start stream without token');

//     try {
//       await stopStreaming();
//       const response = await axios.post(`${BACKEND_API}/start_single_camera_streaming?camera_id=${selectedCamera}`, {model: "fire.pt"}
//       , {
//         headers: getHeaders(),
//       });
//       console.log('Streaming started:', response.data);
//       setUrl(response.data.stream_url);
//     } catch (error) {
//       console.error('Error starting stream:', error.response?.data || error.message);
//     }
//   };

//   // ✅ Run stream only when token is loaded and model changes
//   useEffect(() => {
//     if (token) {
//       startStreaming();
//     }
//   }, [model, token, selectedCamera]);

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
//         // setCameras(response.data.cameras); // if you're storing them in state
//       } catch (error) {
//         console.error('Error fetching cameras:', error.response?.data || error.message);
//       }
//     };
  
//     fetchCameras();
//   }, [model, token]);

//   return (
//     <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
      
// <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: '100%', flex: 1 }}>
//           <img
//           src={url}
//           alt="Live Stream"
//           style={{
//             width: '100%',
//             borderRadius: '10px',
//             border: '2px solid #333',
//           }}
//         />
//       </div>


//       <Box display={'flex'} alignItems={'center'} height={'3rem'} >
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
//             {/* <MenuItem value={'smoke.pt'}>Smoke</MenuItem>
//             <MenuItem value={'ppe.pt'}>PPE</MenuItem>
//             <MenuItem value={'loading.pt'}>Loading-Unloading</MenuItem> */}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth>
//           <InputLabel id="model-select-label">Camera</InputLabel>
//           <Select
//             labelId="model-select-label"
//             id="model-select"
//             value={selectedCamera}
//             label="Camera"
//             onChange={(e) => setSelectedCamera(e.target.value)}
//             sx={{ height: '100%', width: '15rem' }}
//           >
//             {
//               cameras.map((elem, index) => (
//                 <MenuItem key={elem.camera_id || index} value={elem.camera_id}>
//                   {elem.camera_id}
//                 </MenuItem>
//               ))
//             }
//             {/* <MenuItem value={'fire.pt'}>Fire</MenuItem>
//             <MenuItem value={'smoke.pt'}>Smoke</MenuItem>
//             <MenuItem value={'ppe.pt'}>PPE</MenuItem>
//             <MenuItem value={'loading.pt'}>Loading-Unloading</MenuItem> */}
//           </Select>          
//         </FormControl>
//       </Box>

     
//     </Box>
//   );
// };

// export default SingleStream;


// -----------latest------

import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FaRegStopCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SingleStream = () => {
  const {userData, token}= useSelector((state)=> state.auth);
  const {cameras}= useSelector((state)=> state.cameras);
    const [allCameras, setAllCameras]= useState([]);
    // console.log(allCameras)
  const [url, setUrl] = useState('');
  const [throttledSrc, setThrottledSrc] = useState('');
  // const [model, setModel] = useState('');
  const [model2, setModel2] = useState('');
  // const [token, setToken] = useState(null);
  const [extractedModels, setExtractedModels]= useState([]);
  // const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const { model, cameraId } = useParams();
  // console.log(model, cameraId)
  // console.log(selectedCamera)
  const intervalRef = useRef(null);

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

    // -----------extracted the models of a particular user can see in dropdown only the particular model that he has access-----------
    useEffect(()=> {
      let arr= [];
      for(let key in cameras){
        for(let i=0; i< cameras[key].length; i++){
if(cameras[key][i].camera_id == selectedCamera){
          
          arr.push(key)
        }
        }
        
        
      }
      setExtractedModels(arr)
    }, [selectedCamera])

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
  //   if (storedToken) {
  //     setToken(storedToken);
  //     console.log('Token from localStorage:', storedToken);
  //   } else {
  //     console.warn('No token found in localStorage.');
  //   }
  // }, []);

  const getHeaders = () => ({
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const stopStreaming = async () => {
    console.log(token)
    if (!token) return console.warn('Cannot stop stream without token');
    clearInterval(intervalRef.current);
    setThrottledSrc('');

    try {
      await axios.post(
        // `${BACKEND_API}/stop_single_camera_streaming?category=${model? model: model2}`, 
        `${BACKEND_API}/stop_single_camera_streaming?category=${model}`, 
        //  `http://192.168.3.5:8015/stop_single_camera_streaming?category=${model}`,
        {}, { headers: getHeaders() });
      console.log('Streaming stopped');
    } catch (error) {
      console.error('Error stopping stream:', error.response?.data || error.message);
    }
  };

  const startStreaming = async () => {
    if (!token) return console.warn('Cannot start stream without token');

    try {
      await stopStreaming();
      console.log(model, cameraId)
      const response = await axios.post(
        // `${BACKEND_API}/start_single_camera_streaming?camera_id=${selectedCamera}&category=${model? model: model2}`,
        
        `${BACKEND_API}/start_single_camera_streaming?camera_id=${cameraId}&category=${model}`,
        { model: model },
        { headers: getHeaders() }
      );
      console.log('Streaming started:', response.data);
      const streamUrl = response.data.stream_url;
      setUrl(streamUrl);
      startThrottledStream(streamUrl);
    } catch (error) {
      console.error('Error starting stream:', error.response?.data || error.message);
    }
  };

  const startThrottledStream = (streamUrl) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setThrottledSrc(`${streamUrl}?t=${Date.now()}`);
    }, 500); // adjust this interval for FPS (e.g. 1000 = 1 FPS, 200 = 5 FPS)
  };

  // useEffect(() => {
  //   if (token && selectedCamera && model) {
  //     console.log(model)
  //     startStreaming();
  //   }
  //   return () => clearInterval(intervalRef.current);
  // }, [model, cameraId, token, selectedCamera]);

  useEffect(() => {
    if (token && cameraId && model) {
      console.log(model)
      startStreaming();
    }
    return () => clearInterval(intervalRef.current);
  }, [model, cameraId, token, selectedCamera]);

  useEffect(()=>{
    stopStreaming();
  }, [selectedCamera])

  // ------fetch cameras-----
  // useEffect(() => {
  //   const fetchCameras = async () => {
  //     try {
  //       const response = await axios.get(`${BACKEND_API}/get_cameras`, {
  //         headers: getHeaders(),
  //       });

  //       const cameraList = response.data.cameras || [];
  //       setCameras(cameraList);
  //       if (cameraList.length > 0) {
  //         setSelectedCamera(cameraList[0].camera_id);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching cameras:', error.response?.data || error.message);
  //     }
  //   };

  //   if (token) fetchCameras();
  // }, [model, token]);

  return (
    <Box display={'flex'}  alignItems={'start'} position={'relative'}  >
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: '100%', flex: 1 }}>
        <img
          src={throttledSrc}
          alt="Live Stream"
          style={{
            width: '100%',
            borderRadius: '10px',
            border: '2px solid #333',
          }}
        />
      </div> */}


  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: '100%', flex: 1}}>
  {url && (
    <img
      src={url}
      alt="Live Stream"
      style={{
        width: '100%',
        borderRadius: '10px',
        border: '2px solid #333',
      }}
    />
  )}
  </div>

       <Box bgcolor={'white'} borderRadius={'5px'}  display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'start'} p={'1rem'} pt={'2rem'} width={'14rem'} height={'90vh'} >
       

        
{/* 
        <FormControl fullWidth>
          <InputLabel id="camera-select-label">Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={selectedCamera}
            label="Camera"
            onChange={(e) => {setSelectedCamera(e.target.value), setModel2(model), setModel('')}}
            sx={{ width: '100%', mb: '1rem' }}
          >
            {allCameras.length > 0 && allCameras.map((elem, index) => (
              <MenuItem key={elem.camera_id || index} value={elem.camera_id}>
                {elem.camera_id}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

{/* -----------------Select Model------------------------- */}
        {/* <FormControl fullWidth>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
            sx={{ width: '100%', mb: '1rem' }}
          >
          {
            extractedModels.map((elem)=>(
<MenuItem value={elem}>{elem}</MenuItem>
            ))
          }
           
          </Select>
        </FormControl> */}

        <Button
          onClick={stopStreaming}
          variant="outlined"
          color="error"
          sx={{ width: '100%', mb: '1rem'}}
          endIcon={<FaRegStopCircle />}
        >
          Stop
        </Button>

        <Button
                  onClick={startStreaming}
                  variant="outlined"
                  color="primary"
                  sx={{
                    width: '100%'
                  }}
                  // disabled={loading}
                >
                  Start
                  {/* {loading ? 'Starting...' : 'Start'} */}
                </Button>
      </Box>
     
    </Box>
  );
};

export default SingleStream;

