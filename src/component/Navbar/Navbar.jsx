import { Box, Button, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
// import logo from '../../assets/images/Count.png'
import logo from '../../assets/rabsLogo.png'
import { useNavigate } from 'react-router-dom'
import { FaCircleUser } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { MdMenu } from 'react-icons/md'

const Navbar = ({setIsOpen, setIsSliderOpen, isSliderOpen}) => {
  const {userData} = useSelector((state) => state.auth);
  console.log(userData)
  const navigate= useNavigate();


  const isLargerThan1000= useMediaQuery('(min-width: 1000px)');

  
  return (
    <Box
          bgcolor={"white"}
          // width={'100%'}
           width={"inherit"}
          // flex={1}
          height={"4.5rem"}
          // position={"fixed"}
          position={"sticky"}
          top={0}
          zIndex={8} // Ensures navbar stays above content
          boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={'0rem 2rem'}

        >
          <Box height={'100%'} display={'flex'} alignItems={'center'}>
          {!isLargerThan1000 &&  <MdMenu style={{fontSize: '1.5rem', marginRight: '1rem'}} onClick={()=> setIsSliderOpen(true)} />}
          {/* {(isLargerThan1000 && isSliderOpen) &&  <MdMenu style={{fontSize: '1.5rem', marginRight: '1rem'}} onClick={()=> setIsSliderOpen(true)} />} */}
          
          <img src={logo} onClick={()=> navigate('/')} style={{height: isLargerThan1000? '70%': '40%', cursor: 'pointer'}} alt="" />
          </Box>
          
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {/* {
            (userData && userData.role === 'admin') &&
            <Box>
          <Button variant='contained' onClick={()=> setIsOpen('open-add')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: '0.8rem', mr: '0.8rem' }}>Add Camera</Button>
          <Button variant='contained'  onClick={()=> setIsOpen('open-remove')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: '0.8rem', mr: '0.8rem'  }}>Remove Camera</Button>
          </Box>} */}
          <Box>
          <Button variant='contained' onClick={()=> setIsOpen('open-add')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: isLargerThan1000? '0.8rem': '0.6rem', mr: '0.8rem' }}>Add Camera</Button>
          <Button variant='contained'  onClick={()=> setIsOpen('open-remove')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: isLargerThan1000? '0.8rem': '0.6rem', mr: '0.8rem'  }}>Remove Camera</Button>
          </Box>
          <Box sx={{bgcolor: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%',ml: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer'}}><FaCircleUser style={{height: '100%', width: '100%', backgroundColor: 'white'}} /></Box>
          {/* <Box bgcolor={'red'} position={'absolute'} right={'0'} bottom={'-2rem'} height={'2rem'} width={'14rem'}>email id- punit@gmail.com</Box> */}
          </Box>

          


        </Box>
  )
}

export default Navbar