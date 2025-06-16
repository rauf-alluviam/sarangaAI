import React, { useState } from "react";
import { Container, Box, Stack, useMediaQuery, Typography, TextField, InputAdornment, IconButton, Button } from "@mui/material";
// import LoginForm from "../forms/LoginForm";
import "./login.scss";
import alliviumImg from '../../assets/images/alluvium.png';
// import lockImg from '../../assets/images/lock.png';
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Auth=()=> {
  const sizeSmall = useMediaQuery("(max-width:992px)");
  const isLargerThan990= useMediaQuery("(min-width: 990px)");
  const navigate= useNavigate();
  const [flag, setFlag]= useState(true);

  return (
    <Box bgcolor={'red'} width={'100%'} height={'100vh'} display={'flex'}>
        {/* <Box width={'50%'} height={'100%'} bgcolor={'red'}>
          {!sizeSmall && (
          <Box className="login-left-col" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", bgcolor: "#f5f5f5" }}>
            <img src={alliviumImg} alt="logo" width={400} />
            <p>
              <span>"</span>Building world's best computer vision products<span>"</span>
            </p>
          </Box>
        )}
        </Box>
        <Box width={'50%'} height={'100%'} bgcolor={'yellow'}>right</Box> */}
        {/* ---------- */}
        <Stack direction={sizeSmall ? "column" : "row"} className="login-row" sx={{ height: "100%", width: "100%" }}>
        {isLargerThan990 && (
          <Box className="login-left-col" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", bgcolor: "#f5f5f5" }}>
            <img src={alliviumImg} alt="logo" width={400} />
            <p>
              <span>"</span>Building world's best computer vision products<span>"</span>
            </p>
          </Box>
        )}

        <Box className="login-right-col" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
          {!isLargerThan990 && (
            <Box className="login-conditional-container" sx={{ textAlign: "center" }}>
              <img src={alliviumImg} alt="logo" width={200} />
              <p>
                <span>"</span>Building world's best computer vision products<span>"</span>
              </p>
            </Box>
          ) 
        //   : (
        //     <img src={lockImg} alt="lock" width={100} />
        //   )
          }
    {flag? <Login setFlag={setFlag} />: <Signup setFlag={setFlag} /> }
          {/* <LoginForm /> */}
          {/* <Login /> */}
          {/* <Signup /> */}

        </Box>
      </Stack>
        
    </Box>
   
  );
}

export default Auth;