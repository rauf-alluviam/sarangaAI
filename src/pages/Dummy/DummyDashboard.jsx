 <Box bgcolor={'white'} width={'100%'} mt={'0.4rem'} height={'100%'} p={'1.3rem'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} mb={'auto'} borderRadius={'19px'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}>
          <Typography fontSize={'1.8rem'} mb={'1rem'}>
            {/* <span style={{color: colors.primary}}> Hi {userData?.sub?.split('@')[0].replace(/^./, c => c.toUpperCase())}...</span>  */}
            Welcome To the Rabs Industries</Typography>
            
         {/* <Typography  color='grey'>Advanced AI-powered monitoring and detection system</Typography> */}
          {/* <Box bgcolor={'blue'} width={'100%'} height={'14rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}>
              {
                [
                  {icon: <BsGraphUp />, count: 0, title: 'Camera Count'},
                  {icon: <MdSpatialTracking />, count: 0, title: 'Total Detection'},
                  {icon: <FaFire />, count: 0, title: 'Smoke Detection'},
                  {icon: <MdSmokeFree />, count: 0, title: 'Smoke Detection'},
                  {icon: <FaTruckLoading />, count: 0, title: 'Load-unload'},
                  {icon: <IoMedkit />, count: 0, title: 'PPE Detection'}
                ].map((elem, index)=>(
                  <Box bgcolor={'white'} width={'15rem'} borderRadius={'13px'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} p={'1rem'} alignItems={'center'} boxShadow={'rgba(149, 157, 165, 0.2) 0px 8px 24px'}>
                    <span style={{backgroundColor: 'green',fontSize: '1.7rem', color: colors.primary, padding: '0.5rem', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{elem.icon}</span>
                    
                    <Typography fontSize={'3rem'}>{elem.count}</Typography>
                    <Typography fontSize={'1.1rem'}>{elem.title}</Typography>
                  </Box>
                ))
              }
          </Box> */}


<Box width={'100%'} height={'8rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}  >
              {
                [
                  {icon: <FaFire />, title: 'Fire Detection', path: '/fire', color: '#81A493'},
                  {icon: <GiSmokeBomb />, title: 'Smoke Detection', path: '/smoke', color: '#A38181'},
                  {icon: <IoMedkit />, title: 'PPE Detection', path: '/ppe-kit', color: '#767794'},
                  {icon: <FaTruckLoading />, title: 'Loading-unloading', path: '/truck', color: 'rgb(155, 131, 119)'},
                  {icon: <FaClipboardList />, title: 'Fg Stock', path: '/fg-stock', color: '#7C99AE'},
                  {icon: <IoStorefront />, title: 'Store Stock Board', path: '/store-stock', color: 'rgb(128, 116, 128)'},
                  {icon: <MdOutlineManageHistory />, title: 'Complaint', path: '/complaint-board', color: 'rgb(112, 152, 155)'},
                  {icon: <FaTools />, title: 'Tool Manage Board', path: 'tool-management', color: '#A5A06B'},
                  {icon: <FaTools />, title: 'BracketD', path: 'bracket-d', color: 'rgb(80, 105, 88)'},
                  // {icon: <FaTools />, title: 'BracketD', path: 'bracket-d', color: 'rgb(80, 105, 88)'},
                ].map((elem, index)=>(
                  <Box key={index} onClick={()=> navigate(elem.path)} bgcolor={elem.color} width={'24%'} borderRadius={'13px'} display={'flex'} flexDirection={'column'}  justifyContent={'space-between'} p={'1rem'}  alignItems={'center'} sx={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    },
                  }}>
                    <span
  style={{
    backgroundColor: 'rgba(202, 202, 202, 0.83)', // lightgrey with opacity
    backdropFilter: 'blur(8px)', // blur effect for translucent background
    WebkitBackdropFilter: 'blur(8px)', // Safari support
    fontSize: '1.7rem',
    color: colors.primary,
    padding: '0.5rem',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgba(50, 50, 93, 0.12) 0px 13px 27px -5px, rgba(0, 0, 0, 0.1) 0px 8px 16px -8px'
  }}
>
  {elem.icon}
</span>
                    <Typography fontSize={'3rem'}>{elem.count}</Typography>
                    <Typography fontSize={'1rem'} textAlign={'center'}>{elem.title}</Typography>
                  </Box>
                ))
              }
          </Box>

{/* <Box width={'100%'} height={'11rem'} display={'flex'} justifyContent={'space-between'} gap={'0.5rem'}  >
              {
                [
                  {icon: <FaFire />, title: 'Compliance', path: '/fire', color: '#1AAF51', backColor: '#F0FDF4' },
                  {icon: <GiSmokeBomb />, title: 'Positioning', path: '/smoke', color: '#EC5B0D', backColor: '#FFF7ED'},
                  {icon: <IoMedkit />, title: 'Inventory Management', path: '/ppe-kit', color: '#2A6AEE', backColor: '#E5EBF3'},
                ].map((elem, index)=>(
                  <Box key={index} onClick={()=> navigate(elem.path)} bgcolor={elem.backColor}  width={'32%'} borderRadius={'13px'} display={'flex'} flexDirection={'column'}  justifyContent={'space-between'} p={'1rem'}  alignItems={'center'} sx={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    },
                  }}>
                    <Box display={'flex'} alignItems={'center'} mr={'auto'}>
                    <span
  style={{
    backgroundColor: elem.color, // lightgrey with opacity
    backdropFilter: 'blur(8px)', // blur effect for translucent background
    WebkitBackdropFilter: 'blur(8px)', // Safari support
    fontSize: '1.7rem',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgba(50, 50, 93, 0.12) 0px 13px 27px -5px, rgba(0, 0, 0, 0.1) 0px 8px 16px -8px'
  }}
>
  {elem.icon}
</span>
<Box display={'flex'} flexDirection={'column'} ml={'0.5rem'} alignItems={'start'}>
                    <Typography fontSize={'1.1rem'} textAlign={'center'} >{elem.title}</Typography>
                    <Typography>Fire, smoke and PPE Detection</Typography>
                    </Box>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} mr={'auto'}>
                      <span>- Fire</span>
                      <span>- Smoke</span>
                      <span>- PPE</span>
                      <span>- Truck</span>
                    </Box>
                  </Box>
                ))
              }
          </Box> */}

         
          
        </Box>