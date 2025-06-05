import { Box, Button } from '@mui/material'
import React from 'react'

const ImageModal = ({selectedImg, setIsShowImg}) => {
  return (
   <Box onClick={()=> {setIsShowImg(false)}} bgcolor={'rgba(24, 24, 24, 0.77)'} sx={{overflowY: 'auto'}} position={'fixed'} height={'100%'} width={'100%'} zIndex={'77'} top={0} left={'0'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
    <img onClick={(e)=> {e.stopPropagation()}} style={{width: '70%', marginTop: '1rem', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}} src={selectedImg} alt="" />
    {/* <Button sx={{position: 'absolute', top: '1rem', right: '1rem'}} onClick={()=> setIsShowImg(false)}>Delete</Button> */}

   </Box>
  )
}

export default ImageModal