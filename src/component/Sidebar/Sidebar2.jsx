import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
// import { sidebarData } from "../../assets/data/SidebarData";
import { Button, IconButton, List, ListItem, ListItemButton, useMediaQuery } from "@mui/material";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import { sidebarReportsList } from "../../assets/data/SidebarData";
// import { UserContext } from "../contexts/UserContext";
import AbcIcon from '@mui/icons-material/Abc';
import { MdHome, MdRateReview, MdStorefront } from "react-icons/md";
import { BiSolidVideos } from "react-icons/bi";
import { RiBox3Fill, RiVideoFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import logo from '../../assets/images/alluvium.png';
import { FaCircleChevronLeft, FaCircleChevronRight, FaFireFlameCurved, FaHelmetSafety } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/Actions/authAction";
import { GiFirstAidKit, GiSmokeBomb, GiStack } from "react-icons/gi";
import { FaClipboardList, FaTools, FaTruckLoading } from "react-icons/fa";
import { PiTruckFill } from "react-icons/pi";
import { IoFileTray } from "react-icons/io5";


const Sidebar = ({setIsSliderOpen}) => {
  const navigate= useNavigate();
  const [isMinimize, setIsMinimize]= useState(false);
  const location= useLocation();
  let path= location.pathname;
  console.log(location.pathname)
  const dispatch= useDispatch();
  const [section, setSection]= useState('');
  console.log(section)
    const Data = [
  { id: 1, 
    // icon: <HomeRoundedIcon />, 
    icon: <AbcIcon />,
    name: "Dashboard", 
    url: "dashboard" },
  {
    id: 2,
    // icon: <AssessmentIcon />,
    icon: <AbcIcon />,
    name: "Reports",
    url: "pipe-reports",
  },
  {
    id: 3,
    // icon: <BusinessIcon />, //Changed icon for Client Reports
    icon: <AbcIcon />,
    name: "Client Reports",
    url: "client-reports",
  },
  {
    id: 4,
    // icon: <TaskAltIcon />,
    icon: <AbcIcon />,
    name: "SOP",
    url: "sop",
  },
  { id: 5, 
    // icon: <LiveTvIcon />, 
    icon: <AbcIcon />,
    name: "Single Stream", 
    url: "single-stream-form"},
  { id: 6, 
    // icon: <BurstModeIcon />, 
    icon: <AbcIcon />,
    name: "Multi Stream", 
    url: "multi-stream"}
  // {
  //   id: 4,
  //   icon: <TaskAltIcon />,
  //   name: "Upload SOP",
  //   url: "upload-sop",
  // },
];

const isLargerThan900= useMediaQuery('(min-width: 900px)');

    return (
    <div className="sidebar" style={{position: 'relative', width: isMinimize? '5rem' : "15rem", padding: isMinimize? '0 10px':'0 20px', transition: '0.2s'}}>
      {
        (isMinimize && !isLargerThan900)  &&  
        <FaCircleChevronRight onClick={()=> setIsMinimize(!isMinimize)} style={{color: 'white', backgroundColor: 'grey', fontSize: '1.9rem', position: 'absolute', right: '-1rem', top: '1rem', borderRadius: '50%', zIndex: 9, display: 'flex', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}} />
      }
      {
        (isMinimize && !isLargerThan900) &&  
        <FaCircleChevronLeft onClick={()=> setIsMinimize(!isMinimize)} style={{color: 'white', backgroundColor: 'grey', fontSize: '1.9rem', position: 'absolute', right: '-1rem', top: '1rem', borderRadius: '50%', zIndex: 9, display: 'flex', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}} />
      }
      

      <List>
        <div className="avatar" style={{height: '10rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
         {
          !isMinimize  && 
          <img
            src={logo}
            alt="logo"
            width={isMinimize? 50: 150}
            
          />
         }
          
        </div>

        <ListItem  disableGutters={true} className="sidebar-listItem">
        <Button onClick={()=> {navigate('/'), setIsSliderOpen(false)}} className="sidebar-link" style={{borderLeft: (path == '/') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }}>
                        <MdHome />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Dashboard</p> }
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  {/* <Button  onClick={()=> {navigate('/multi-stream'), setIsSliderOpen(false)}}  className="sidebar-link" title="Video Stream">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <BiSolidVideos />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Video Stream</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button  onClick={()=> {navigate('/multi-stream'), setIsSliderOpen(false)}}  className="sidebar-link" style={{marginLeft: '2rem', borderLeft: (path == '/multi-stream') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}} >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <BiSolidVideos />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Multi Stream</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  
                  

                  <Button onClick={()=> {navigate('/single-stream'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/single-stream') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}} >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <RiVideoFill />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Single Stream</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}
{/* -------------------------------------- */}
                  {/* <Button onClick={()=> navigate('/fire')}  className="sidebar-link" >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaFireFlameCurved />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Fire</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}

                  {/* <Button onClick={()=> navigate('/fire')}  className="sidebar-link" >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <GiSmokeBomb />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Smoke</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}

                  <Button onClick={()=> {navigate('/fire'); setIsSliderOpen(false); setSection('compliance')}}  className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <GiFirstAidKit />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Compliance</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  {/* <Button onClick={()=> navigate('/ppe-kit')}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/ppe-kit') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <GiFirstAidKit />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">PPE Kit</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}

  <Button onClick={()=> {navigate('/fire'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/fire') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaFireFlameCurved />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Fire</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/ppe-kit'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/ppe-kit') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        {/* <GiFirstAidKit /> */}
                        <FaHelmetSafety />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">PPE Kit</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/smoke'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/smoke') && '5px solid rgb(241, 92, 109)', borderRadius: '8px',}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <GiSmokeBomb />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Smoke</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/truck'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/truck') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <PiTruckFill />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Truck</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> 
                 
                  
                  <Button onClick={()=> {navigate('/bracket-d'), setIsSliderOpen(false)}}  className="sidebar-link"  >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <IoFileTray />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Positioning</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/bracket-d'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/bracket-d') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <IoFileTray />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Bracket-D</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

             <Button onClick={()=> {navigate('/bracket-e'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/bracket-e') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <IoFileTray />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Bracket-E</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/fg-stock'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{borderLeft: (path == '/fg-stock') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaClipboardList />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Inventory</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/fg-stock'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/fg-stock') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <RiBox3Fill />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text" >Dispatch Stock</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/store-stock'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/store-stock') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <MdStorefront />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Store Stock</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>
                 
                  <Button onClick={()=> {navigate('/tool-management'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/tool-management') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaTools />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Tool Management</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/complaint-board'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/complaint-board') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <MdRateReview />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Complaint Board</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>
                  {/* <Button onClick={()=> {navigate('/4m-change'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/4m-change') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <GiStack />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">4M Change</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}

                  {/* <Button onClick={()=> {navigate('/fg-stock'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/fg-stock') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaClipboardList />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Store Stock Board</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>

                  <Button onClick={()=> {navigate('/fg-stock'), setIsSliderOpen(false)}}  className="sidebar-link"  style={{marginLeft: '2rem', borderLeft: (path == '/fg-stock') && '5px solid rgb(241, 92, 109)', borderRadius: '8px'}}>
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaClipboardList />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">4M Change Board</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button> */}

                  {/* <Button onClick={()=> navigate('/fire')}  className="sidebar-link" >
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <FaTruckLoading />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Loading-Unloading</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>
                   */}

                  <Button  className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                      onClick={()=> dispatch(logout())}
                        style={{
                          display: "flex",
                          alignItems: "center", 
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }} >
                        <IoIosLogOut />
                        </IconButton>
                        {!isMinimize && <p className="sidebar-list-text">Logout</p>}
                        
                      </div>
                    </ListItemButton>
                  </Button>
                  
        </ListItem>

        {/* {Data.map((val) => {
          const { id, icon, name, url } = val;

          return (
            <div key={id}>
              <ListItem disableGutters={true} className="sidebar-listItem">
                {name === "Reports" ? (
                  <NavLink to={`/${url}`} key={id} className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }}>
                          {icon}
                        </IconButton>
                        <p className="sidebar-list-text">{name}</p>
                      </div>
                    </ListItemButton>
                  </NavLink>
                ) : (
                  <NavLink to={`/${url}`} key={id} className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton sx={{ color: "#ffffff9f" }}>
                          {icon}
                        </IconButton>
                        <p className="sidebar-list-text">{name}</p>
                      </div>
                    </ListItemButton>
                  </NavLink>
                )}
              </ListItem>
            </div>
          );
        })} */}

      </List>
      
    </div>
  );
}

export default Sidebar
// function Sidebar() {



// }

// export default Sidebar;


{/* <List>
        <div className="avatar">
          <img
            src={'https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS326779.jpg'}
            alt="logo"
            width={150}
          />
        </div>

        {sidebarData.map((val) => {
          const { id, icon, name, url } = val;

          return (
            <div key={id}>
              <ListItem disableGutters={true} className="sidebar-listItem">
                {name === "Reports" ? (
                  <NavLink to={`/${url}`} key={id} className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                        }}
                      >
                        <IconButton sx={{ color: "#ffffff9f" }}>
                          {icon}
                        </IconButton>
                        <p className="sidebar-list-text">{name}</p>
                      </div>
                    </ListItemButton>
                  </NavLink>
                ) : (
                  <NavLink to={`/${url}`} key={id} className="sidebar-link">
                    <ListItemButton
                      sx={{ textAlign: "left" }}
                      className="appbar-links"
                      style={{ padding: "5px 0" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton sx={{ color: "#ffffff9f" }}>
                          {icon}
                        </IconButton>
                        <p className="sidebar-list-text">{name}</p>
                      </div>
                    </ListItemButton>
                  </NavLink>
                )}
              </ListItem>

              {name === "Reports" &&
                sidebarReportsList.map((list) => {
                  return (
                    <ListItem
                      disableGutters={true}
                      key={list.id}
                      className="sidebar-listItem"
                      style={{ padding: "0 10px" }}
                    >
                      <NavLink
                        to={`/${list.url}`}
                        key={id}
                        className="sidebar-link"
                      >
                        <ListItemButton
                          sx={{ textAlign: "left" }}
                          className="appbar-links"
                          style={{ padding: "5px 0" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0 15px",
                            }}
                          >
                            <IconButton sx={{ color: "#ffffff9f" }}>
                              {icon}
                            </IconButton>
                            <p className="sidebar-list-text">{list.name}</p>
                          </div>
                        </ListItemButton>
                      </NavLink>
                    </ListItem>
                  );
                })}
            </div>
          );
        })}

        <ListItem
          sx={{ textAlign: "left" }}
          className="sidebar-listItem"
          style={{
            padding: "5px 0",
          }}
        >
          <div className="sidebar-link">
            <ListItemButton
              sx={{ textAlign: "left" }}
              className="appbar-links"
              onClick={() => {
                handleLogout();
              }}
              style={{
                padding: "5px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ color: "#ffffff9f" }}>
                  <LogoutRoundedIcon />
                </IconButton>
                <p className="sidebar-list-text">Logout</p>
              </div>
            </ListItemButton>
          </div>
        </ListItem>
      </List>
       */}
