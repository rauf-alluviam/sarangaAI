import React, { useState } from "react";
import { Container, Box, Stack, useMediaQuery, Typography, TextField, InputAdornment, IconButton, Button } from "@mui/material";
// import LoginForm from "../forms/LoginForm";
import "./login.scss";
// import alliviumImg from '../../assets/images/alluvium.png';
// import lockImg from '../../assets/images/lock.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import qs from 'qs'; 
import { useDispatch } from "react-redux";
import { login, loginSuccess } from "../../Redux/Actions/authAction";

const BACKEND_API= import.meta.env.VITE_BACKEND_API;

const Login=({setFlag})=> {
  const sizeSmall = useMediaQuery("(max-width:992px)");
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');

  const handleSubmit= async(e)=>{
    e.preventDefault();
    // console.log({username, password})
    dispatch(login(username, password, navigate))
    // navigate('/')
  //   try {
     
  //     console.log("Sending:", { username, password }); // Debug: Check if username & password exist

  // const response = await axios.post(`${BACKEND_API}/token`,
  //   qs.stringify({
  //     username,
  //     password
  //   }),
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   }
  // );

  // localStorage.setItem('rabsToken', JSON.stringify(response.data.access_token))
  // alert('Login Successfull');
  // // localStorage.setItem('rabsToken', JSON.stringify(response.access_token))

  // console.log("Response:", response.data.access_token);
  //   } catch (error) {
  //     console.log(error)
  //     alert(error.message)
  //   }

  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)" }}>
    <Typography variant="h5" gutterBottom style={{ marginBottom: "20px", textAlign: "center" }}>Login</Typography>
    <TextField
    value={username}
    onChange={(e) => setUsername(e.target.value)}
      size="small"
      margin="dense"
      variant="outlined"
      fullWidth
      id="email"
      name="email"
      label="Email"
      type="name"
      style={{ marginBottom: "20px" }}
      required
    />
    <TextField
    value={password}
    type="password"
    onChange={(e)=> setPassword(e.target.value)}
      size="small"
      margin="dense"
      variant="outlined"
      fullWidth
      id="password"
      name="password"
      label="Password"
      // InputProps={{
      //   endAdornment: (
      //     <InputAdornment position="end">
      //       <IconButton
      //         aria-label="toggle password visibility"
      //         edge="end"
      //         size="small"
      //       >
      //         {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
      //       </IconButton>
      //     </InputAdornment>
      //   ),
      // }}
      style={{ marginBottom: "20px" }}
      required
    />

    <Button
      fullWidth
      type="submit"
      variant="contained"
      color="primary"
      size="large"
      style={{ background: "linear-gradient(to right, #D31027, #EA384D)", borderRadius: "25px" }}
    >
      Login
    </Button>
    <Typography mt={'0.4rem'}>Don't have account?  <u onClick={()=> setFlag(false)} style={{cursor: 'pointer', color: 'blue', opacity: '65%'}}>Signup</u> </Typography>
   
  </form>
   
  );
}

export default Login;

 // <Container maxWidth={false} className="login-container" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", width: '100vw', bgcolor: 'red', padding: 0, margin: 0 }}>
    //   <Stack direction={sizeSmall ? "column" : "row"} className="login-row" sx={{ height: "100%", width: "100%" }}>
    //     {!sizeSmall && (
    //       <Box className="login-left-col" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", bgcolor: "#f5f5f5" }}>
    //         <img src={alliviumImg} alt="logo" width={400} />
    //         <p>
    //           <span>"</span>Building world's best computer vision products<span>"</span>
    //         </p>
    //       </Box>
    //     )}

    //     <Box className="login-right-col" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
    //       {sizeSmall ? (
    //         <Box className="login-conditional-container" sx={{ textAlign: "center" }}>
    //           <img src={alliviumImg} alt="logo" width={200} />
    //           <p>
    //             <span>"</span>Building world's best computer vision products<span>"</span>
    //           </p>
    //         </Box>
    //       ) : (
    //         <img src={lockImg} alt="lock" width={100} />
    //       )}
    //       {/* <LoginForm /> */}
    //       <form style={{ maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)" }}>
    //   <Typography variant="h5" gutterBottom style={{ marginBottom: "20px", textAlign: "center" }}>Login</Typography>
    //   <TextField
    //     size="small"
    //     margin="dense"
    //     variant="outlined"
    //     fullWidth
    //     id="email"
    //     name="email"
    //     label="Email"
    //     type="email"
    //     style={{ marginBottom: "20px" }}
    //   />
    //   <TextField
    //     size="small"
    //     margin="dense"
    //     variant="outlined"
    //     fullWidth
    //     id="password"
    //     name="password"
    //     label="Password"
    //     InputProps={{
    //       endAdornment: (
    //         <InputAdornment position="end">
    //           <IconButton
    //             aria-label="toggle password visibility"
    //             edge="end"
    //             size="small"
    //           >
    //             {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
    //           </IconButton>
    //         </InputAdornment>
    //       ),
    //     }}
    //     style={{ marginBottom: "20px" }}
    //   />

    //   <Button
    //     fullWidth
    //     type="submit"
    //     variant="contained"
    //     color="primary"
    //     size="large"
    //     style={{ background: "linear-gradient(to right, #D31027, #EA384D)", borderRadius: "25px" }}
    //   >
    //     Login
    //   </Button>
    // </form>
    //     </Box>
    //   </Stack>
    // </Container>

// import { Container, useMediaQuery } from '@mui/material';
// import React from 'react'
// import alliviumImg from '../../assets/images/alluvium.png'


// const Login = () => {
//     const sizeSmall = useMediaQuery("(max-width:992px)");

//   return (
//     <Container fluid className="login-container">
//       <Row className="login-row">
//         {!sizeSmall && (
//           <Col className="login-left-col">
//             <div
//               className="login-left-col-inner-container"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <img
//                 src={alliviumImg}
//                 alt="logo"
//                 width={400}
//               />
//               <p>
//                 <span>"</span>Building world's best computer vision products
//                 <span>"</span>
//               </p>
//             </div>
//           </Col>
//         )}

//         <Col className="login-right-col">
//           <div className="login-right-col-inner-container">
//             {sizeSmall ? (
//               <div className="login-conditional-container">
//                 <img
//                 src={alliviumImg}
//                 //   src={require("../assets/images/alluvium.png")}
//                   alt="logo"
//                 />
//                 <p>
//                   <span>"</span>Building world's best computer vision products
//                   <span>"</span>
//                 </p>
//               </div>
//             ) : (
//               <img 
//               src={alliviumImg}
//             //   src={require("../assets/images/Lock.png")} 
//               alt="lock" />
//             )}
//             {/* <LoginForm /> */}
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   )
// }

// export default Login