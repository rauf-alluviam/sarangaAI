import { Box, Button, FormControl, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
// import logo from '../../assets/images/Count.png'
import logo from '../../assets/rabsLogo.png'
import { useNavigate } from 'react-router-dom'
import { FaCircleUser } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { MdMenu } from 'react-icons/md'
import { Add } from '@mui/icons-material'
import AddStock from '../../pages/Boards/FgStock/AddStock'
import AddStoreStock from '../../pages/Boards/StoreStock/AddStoreStock'
import AddTools from '../../pages/Boards/ToolManage/AddTools'

const Navbar = ({setIsOpen, setIsSliderOpen, isSliderOpen}) => {
  const {userData} = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('none');
  console.log(selectedBoard)
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
          
          {/* <FormControl sx={{width: '10rem', mr: '1rem'}} size='small'>
  <InputLabel id="demo-simple-select-label">Boards</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={selectedBoard}
    label="Board"
    onChange={(e)=> setSelectedBoard(e.target.value)}
    defaultValue={'none'}
  >
    <MenuItem value={'none'}>None</MenuItem>
    <MenuItem value={'fg-stock'}>Fg Stock</MenuItem>
    <MenuItem value={'store-stock'}>Store Stock</MenuItem>
    <MenuItem value={'tool-manage'}>Tool Management</MenuItem>
    <MenuItem value={'complaint'}>Complaint</MenuItem>
  </Select>
</FormControl> */}

          <Box>
          <Button variant='contained' onClick={()=> setIsOpen('open-add')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: isLargerThan1000? '0.8rem': '0.6rem', mr: '0.8rem' }}>Add Camera</Button>
          <Button variant='contained'  onClick={()=> setIsOpen('open-remove')} sx={{bgcolor: 'rgb(241, 92, 109)', color: 'white', p: '0.4rem 0.9rem', fontSize: isLargerThan1000? '0.8rem': '0.6rem', mr: '0.8rem'  }}>Remove Camera</Button>
          </Box>
          
          <Box onClick={()=> navigate('/my-profile')} sx={{bgcolor: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%',ml: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer'}}>
            <FaCircleUser style={{height: '100%', width: '100%', backgroundColor: 'white'}} />
            </Box>

            {/* <Box position={'fixed'} right={'0'} top={0} height={'100vh'} width={'100vw'} bgcolor={'rgba(0, 0, 0, 0.7)'} zIndex={99} >
              <Box width={'50%'} bgcolor={'white'} position={'absolute'} top={0} right={0} height={'100%'}>profile section</Box>
            </Box> */}
          {/* <Box bgcolor={'red'} position={'absolute'} right={'0'} bottom={'-2rem'} height={'2rem'} width={'14rem'}>email id- punit@gmail.com</Box> */}
          </Box>
        
          {/* --------------Add Fg Stock---------------------------- */}
          {/* {
            selectedBoard === 'fg-stock' && 
            <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={9}
          // onClick={() => setIsOpen(false)}
          onClick={() => setSelectedBoard('none')}
        > 
        <AddStock setSelectedBoard={setSelectedBoard} />
        </Box>
          }

       
          {
            selectedBoard === 'store-stock' && 
            <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={9}
          // onClick={() => setIsOpen(false)}
          onClick={() => setSelectedBoard('none')}
        > 
        <AddStoreStock setSelectedBoard={setSelectedBoard} />
        </Box>
          }

          {
            selectedBoard === 'tool-manage' && 
            <Box
          bgcolor={"rgba(0, 0, 0, 0.6)"}
          position={"fixed"}
          top={0}
          left={0}
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={9}
          // onClick={() => setIsOpen(false)}
          onClick={() => setSelectedBoard('none')}
        > 
        <AddTools setSelectedBoard={setSelectedBoard} />
        </Box>
          } */}
        </Box>

  )
}

export default Navbar