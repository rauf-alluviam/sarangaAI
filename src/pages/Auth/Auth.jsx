import React, { useState } from 'react';
import {
  Container,
  Box,
  Stack,
  useMediaQuery,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
// import LoginForm from "../forms/LoginForm";
import './login.scss';
import alliviumImg from '../../assets/images/alluvium.png';
import rabsLogo from '../../assets/rabsLogo.png';
// import lockImg from '../../assets/images/lock.png';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  const sizeSmall = useMediaQuery('(max-width:992px)');
  const isLargerThan990 = useMediaQuery('(min-width: 990px)');
  const navigate = useNavigate();
  const [flag, setFlag] = useState(true);
  const VITE_PROJECT_VERSION = import.meta.env.VITE_PROJECT_VERSION;
  console.log(`Project Version: ${VITE_PROJECT_VERSION}`);

  return (
    <Box width={'100%'} height={'100vh'} display={'flex'}>
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
      <Stack
        direction={sizeSmall ? 'column' : 'row'}
        className="login-row"
        sx={{ height: '100%', width: '100%' }}
      >
        {isLargerThan990 && (
          <Box
            className="login-left-col"
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              bgcolor: '#f5f5f5',
            }}
          >
            <img src={rabsLogo} alt="logo" width={400} style={{ marginTop: '6rem' }} />
            <p style={{ color: 'white' }}>
              <span>"</span>Powering Industrial Safety & Efficiency with Smart Vision<span>"</span>
            </p>
            <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Version: 1.0.3
            </p>
          </Box>
        )}

        <Box
          className="login-right-col"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {
            !isLargerThan990 && (
              <Box className="login-conditional-container" sx={{ textAlign: 'center', mt: '2rem' }}>
                <img src={rabsLogo} alt="logo" width={200} style={{ marginTop: '6rem' }} />
                <p style={{ color: 'white' }}>
                  <span>"</span>Powering Industrial Safety & Efficiency with Smart Vision
                  <span>"</span>
                </p>
                <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Version: 1.0.3
                </p>
              </Box>
            )
            //   : (
            //     <img src={lockImg} alt="lock" width={100} />
            //   )
          }
          {flag ? <Login setFlag={setFlag} /> : <Signup setFlag={setFlag} />}
          {/* <LoginForm /> */}
          {/* <Login /> */}
          {/* <Signup /> */}
          <Typography
            fontSize={'1rem'}
            color="#282828"
            position={'absolute'}
            bottom={'1rem'}
            right={'3rem'}
          >
            © 2025 | Powered by Novusha Consulting Services India LLP
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Auth;
