import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import qs from 'qs'; 
export const LOGIN_REQUEST= 'LOGIN_REQUEST';
export const LOGIN_SUCCESS= 'LOGIN_SUCCESS';
export const LOGIN_FAILURE= 'LOGIN_FAILURE';
export const LOGOUT= 'LOGOUT';
const BACKEND_API= import.meta.env.VITE_BACKEND_API;

export const loginSuccess=(token, userData)=>({type:LOGIN_SUCCESS, payload: {token, userData}});

export const login=(username, password, navigate)=> async(dispatch)=>{
    try {
        const response = await axios.post(`${BACKEND_API}/token`,
            qs.stringify({
              username,
              password
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          localStorage.setItem('rabsToken', JSON.stringify(response.data.access_token));
          let token= JSON.parse(localStorage.getItem('rabsToken'));
          let userData= jwtDecode(token);
          localStorage.setItem('rabsUser', JSON.stringify(userData));
          dispatch(loginSuccess(token, userData));
              // ✅ Set auto logout based on token expiry
    const currentTime = Date.now() / 1000; // in seconds
    const expiresIn = userData.exp - currentTime;

    if (expiresIn > 0) {
      setTimeout(() => {
        dispatch(logout());
        navigate('/auth');
        alert('Session expired. Please log in again.');
      }, expiresIn * 1000); // convert to milliseconds
    } else {
      dispatch(logout());
      navigate('/auth');
    }

    navigate('/');
          // alert('Login Success');
    } catch (error) {
        if(error.response){
            alert(error.response.data.message)
          }else{
            console.log(error.message)
          }
    }
}

// export const login = (username, password, navigate) => async (dispatch) => {
//   try {
//     const response = await axios.post(
//       `${BACKEND_API}/token`,
//       qs.stringify({
//         username,
//         password
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const token = response.data.access_token;
//     localStorage.setItem('rabsToken', JSON.stringify(token));

//     const userData = jwtDecode(token);
//     localStorage.setItem('rabsUser', JSON.stringify(userData));

//     dispatch(loginSuccess(token, userData));

//     // ✅ Set auto logout based on token expiry
//     const currentTime = Date.now() / 1000; // in seconds
//     const expiresIn = userData.exp - currentTime;

//     if (expiresIn > 0) {
//       setTimeout(() => {
//         dispatch(logout());
//         navigate('/auth');
//         alert('Session expired. Please log in again.');
//       }, expiresIn * 1000); // convert to milliseconds
//     } else {
//       dispatch(logout());
//       navigate('/auth');
//     }

//     navigate('/');
//   } catch (error) {
//     if (error.response) {
//       alert(error.response.data.message);
//     } else {
//       console.log(error.message);
//     }
//   }
// };


export const logout=()=> (dispatch)=>{
    localStorage.removeItem('rabsToken');
    localStorage.removeItem('rabsUser');
    dispatch({type: LOGOUT})
}