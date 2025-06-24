import React, { useState } from "react";
import { Container, Box, Stack, useMediaQuery, Typography, TextField, InputAdornment, IconButton, Button, Dialog, FormControl, InputLabel, OutlinedInput } from "@mui/material";
// import LoginForm from "../forms/LoginForm";
import "./login.scss";
// import alliviumImg from '../../assets/images/alluvium.png';
// import lockImg from '../../assets/images/lock.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import qs from 'qs'; 
import { useDispatch } from "react-redux";
import { login, loginSuccess } from "../../Redux/Actions/authAction";
import TempPasswordGenerator from "../UserProfile/TempPasswordGenerator";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const BACKEND_API= import.meta.env.VITE_BACKEND_API;

const Login=({setFlag})=> {
  const sizeSmall = useMediaQuery("(max-width:992px)");
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');
  const [openReset, setOpenReset]= useState(false);
  const [resetPassMail, setResetPassMail]= useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSendTempPassword = async (e) => {
    e.preventDefault();
    // setIsGenerating(true);
    // setError('');
    // setSuccess(false);

    try {
        const response= await axios.post(`https://rabs.alvision.in/reset_password?email=${resetPassMail}`, {})
        // setSuccess(true);
    setOpenReset(false);
        console.log('Temporary password generation response:', response.data);
    } catch (error) {
        console.error('Error generating temporary password:', error);
        // setError('Failed to send temporary password. Please try again.');
        console.log(error)
    }finally {
          // setIsGenerating(false);
        }
    // try {
    //   const tempPassword = generateTempPassword();
    //   console.log('Generated temporary password:', tempPassword);
      
    //   // Simulate API call to send email - replace with actual backend integration
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
    //   // Simulate backend updating force_password_change flag
    //   console.log('Setting force_password_change to true for user:', currentUser._id);
      
    //   setSuccess(true);

    // } catch (error) {
    //   console.error('Error sending temporary password:', error);
    //   setError('Failed to send temporary password. Please try again.');
    // } finally {
    //   setIsGenerating(false);
    // }
  };

  return (
    <>
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
    
<FormControl sx={{ width: '100%', mb: '1rem' }} variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
          value={password}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e)=> setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={()=> setShowPassword(!showPassword)}
                  // onMouseDown={handleMouseDownPassword}
                  // onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

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
   <Typography>Do you remember password? <span onClick={()=> setOpenReset(true)} style={{color: 'rgb(15, 59, 155)', cursor: 'pointer', fontWeight: 500, fontSize: '1.1rem'}}>Forgot Password</span></Typography>

   
  </form>

{/* -----------Forgot password dialog---------------- */}
  <Dialog open={openReset} onClose={()=> setOpenReset(false)} maxWidth={'xs'} fullWidth>
    <Box height={'14rem'} width={'28rem'}>
    <form onSubmit={handleSendTempPassword} style={{ maxWidth: "400px", padding: "20px",width: '100%', height: '100%', borderRadius: "10px", display: 'flex',flexDirection: 'column', justifyContent: 'space-evenly', margin: 'auto' }}>
    <Typography variant="h5" gutterBottom style={{ marginBottom: "20px", textAlign: "center" }}>Reset Password</Typography>
    <TextField
    value={resetPassMail}
    onChange={(e) => setResetPassMail(e.target.value)}
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

    <Button
      fullWidth
      type="submit"
      variant="contained"
      color="primary"
      size="large"
      style={{ background: "linear-gradient(to right, #D31027, #EA384D)", borderRadius: "7px" }}
    >
      Send Temporary Password
    </Button>

   
  </form>
    </Box>
   </Dialog>

  </>
   
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