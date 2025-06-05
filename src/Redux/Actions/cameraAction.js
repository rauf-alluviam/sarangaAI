import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import {
//   ADD_CAMERA_REQUEST,
//   ADD_CAMERA_SUCCESS,
//   ADD_CAMERA_FAILURE
// } from './cameraActionTypes';
export const GET_CAMERAS= 'GET_CAMERAS';
export const ADD_CAMERA_REQUEST= 'ADD_CAMERA_REQUEST';
export const ADD_CAMERA_SUCCESS= 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAILURE= 'ADD_CAMERA_FAILURE';
export const REMOVE_CAMERA_SUCCESS= 'REMOVE_CAMERA_SUCCESS';



const BACKEND_API = import.meta.env.VITE_BACKEND_API;

export const getCameras = (cam) => ({ type: GET_CAMERAS, payload: cam });
export const addCameraRequest = () => ({ type: ADD_CAMERA_REQUEST });
export const addCameraSuccess = (camera) => ({ type: ADD_CAMERA_SUCCESS, payload: camera });
export const addCameraFailure = (error) => ({ type: ADD_CAMERA_FAILURE, payload: error });
// export const removeCameraSuccess = (cameraId) => ({ type: REMOVE_CAMERA_SUCCESS, payload: cameraId });

export const removeCameraSuccess = (cameraId, category) => ({
  type: REMOVE_CAMERA_SUCCESS,
  payload: { cameraId, category }
});


export const fetchCameras=(token)=> async(dispatch)=>{
    try {
        const response= await axios.get(`${BACKEND_API}/get_cameras`, 
            {
                headers: {
                  'accept': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              }
        )

        const cameraList = response.data.cameras || [];
    dispatch(getCameras(cameraList));
        console.log('Cameras:', response.data.cameras);
    } catch (error) {
        console.error('Error fetching cameras:', error.response?.data || error.message);
    }
}

export const addCamera = ({ cameraId, rtspLink, category, polygon, token, onSuccess }) => async (dispatch) => {
  
  if (!cameraId || !rtspLink || !category) {
    alert('Please fill all fields');
    return;
  }

  try {
    // const decoded = jwtDecode(token);
    // const currentTime = Date.now() / 1000;

    // if (decoded.exp < currentTime) {
    //   alert('Session expired. Please log in again.');
    //   localStorage.removeItem('rabsToken');
    //   localStorage.removeItem('rabsUser');
    //   window.location.href = '/login';
    //   return;
    // }

    dispatch(addCameraRequest());

    const response = await axios.post(
      `${BACKEND_API}/add_camera`,
      {
        camera_id: cameraId,
        rtsp_link: rtspLink,
        category,
        polygon_points: polygon
        // polygonal_points: '',
        // email: email,
      },
      {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    // console.log({ cameraId, rtspLink, category, token, onSuccess })
console.log(response.data)

    // dispatch(addCameraSuccess(response.data));
    dispatch(addCameraSuccess({camera_id: cameraId, rtsp_link: rtspLink, category, polygon_points: polygon}));
    // alert('Camera added successfully!');
    if (onSuccess) onSuccess(); // clear form or close modal

  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'Something went wrong';
    dispatch(addCameraFailure(errorMsg));
    alert(errorMsg);
  }
};

export const deleteCamera=({cameraId, userData, category , token, onSuccess})=> async(dispatch)=>{
    if (!cameraId || !userData.sub || !category) {
        alert('Please fill all fields');
        return;
      }

      try {
        const response = await axios.delete(
            `${BACKEND_API}/remove_camera?camera_id=${cameraId}&category=${category}`, // Sending camera_id in query params
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  } 
            }
          );
          dispatch(removeCameraSuccess(cameraId, category));
          // dispatch(removeCameraSuccess(cameraId));
          // alert('Camera removed successfully');
          if (onSuccess) onSuccess(); // clear form or close modal
      } catch (error) {
        console.error(error); // Log error if any occurs
        alert('Error removing camera');
      }
}