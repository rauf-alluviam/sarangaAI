import React, { useState } from "react";
import { Container, Box, Stack, useMediaQuery, Typography, TextField, InputAdornment, IconButton, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
// import LoginForm from "../forms/LoginForm";
import "./login.scss";
// import alliviumImg from '../../assets/images/alluvium.png';
// import lockImg from '../../assets/images/lock.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import colors from "../../utils/colors";
// import dotenv from 'dotenv';
// import axios from "axios";
// dotenv.config();
// const BACKEND_API = import.meta.process.env.VITE_BACKEND_API;
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const Signup=({setFlag})=> {
  const sizeSmall = useMediaQuery("(max-width:992px)");
  const navigate= useNavigate();
  const [name, setName]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const [role, setRole]= useState('user');
  const [showPassword, setShowPassword] = useState(false);
  // const [phone_no, setPhone_no]= useState('');

  // -----------Registration Form Submited--------------
  const handleSubmit= async(e)=>{
    e.preventDefault();
  console.log({name, email, password, role})
    try {
      const response= await axios.post(`${BACKEND_API}/add_new_user`,
        {name, email, password, role, cameras: {}},
        {
          headers: { "Content-Type": "application/json" } // Ensure JSON format
        }
      );
      console.log(response.data)
      // alert('Registration successful');
      enqueueSnackbar(response?.data?.message || 'User Registered Successfully', { variant: 'success' }) ;
      setName('');
      setEmail('');
      setPassword('');
      // setPhone_no('');
      setRole('');
      setTimeout(()=>{
        setFlag(true)
      }, 1000)
      
    } catch (error) {
      console.log(error)
      // alert(error.message)
      enqueueSnackbar(error?.data?.message || 'Fail To Register User', { variant: 'error' }) ;
    }

  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)" }}>
      <Typography variant="h5" gutterBottom style={{ marginBottom: "20px", textAlign: "center" }}>Signup</Typography>
      <TextField value={name} onChange={(e)=> setName(e.target.value)} size="small" name="name" label="name" margin="dense" fullWidth required/>
      
      <TextField
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
        size="small"
        margin="dense"
        variant="outlined"
        fullWidth
        id="email"
        name="email"
        label="Email"
        type="email"
        style={{ marginBottom: "20px" }}
        required
      />
      {/* <TextField 
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
        size="small"
        margin="dense"
        variant="outlined"
        fullWidth
        id="password"
        name="password"
        label="Password"
        required
       
        style={{ marginBottom: "20px" }}
      /> */}

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


{/* <TextField
value={phone_no}
onChange={(e)=> setPhone_no(e.target.value)}
        size="small"
        margin="dense"
        variant="outlined"
        fullWidth
        id="phone"
        name="phone"
        label="Phone"
        type="number"
        style={{ marginBottom: "20px" }}
      /> */}

<FormControl fullWidth size='small'>
                    <InputLabel id="model-select-label">Role</InputLabel>
                    <Select
                      // size='small'
                      labelId="model-select-label"
                      id="model-select"
                      value={role}
                      label="Role"
                      onChange={(e) => setRole(e.target.value)}
                      sx={{ height: '100%',  flex: 1, mb: '20px' }}
                      
                      
                    >
                      
                      <MenuItem value={'user'}>User</MenuItem>
                      <MenuItem value={'admin'}>Admin</MenuItem>
                    </Select>          
                  </FormControl>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        style={{ backgroundColor: colors.primary, borderRadius: "25px" }}
      >
        Signup
      </Button>
      {/* <Link to={'/signup'}>Login</Link> */}
      {/* <Typography onClick={()=> setFlag(true)} mt={'0.4rem'}  sx={{cursor: 'pointer', color: 'blue', opacity: '60%'}}>Click here to Login</Typography> */}
      <Typography mt={'0.4rem'}>Already have an account?  <u onClick={()=> setFlag(true)} style={{cursor: 'pointer', color: 'blue', opacity: '65%'}}>Login</u> </Typography>
    </form>
   
  );
}

export default Signup;

