import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { Button, IconButton, List, ListItem, ListItemButton, useMediaQuery, Collapse, Box, Tooltip } from "@mui/material";
import { MdHome, MdRateReview, MdStorefront } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import logo from '../../assets/images/alluvium.png';
import { FaCircleChevronLeft, FaCircleChevronRight, FaFireFlameCurved, FaHelmetSafety, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/Actions/authAction";
import { GiFirstAidKit, GiSmokeBomb } from "react-icons/gi";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { PiTruckFill } from "react-icons/pi";
import { IoFileTray } from "react-icons/io5";
import { RiBox3Fill } from "react-icons/ri";

const Sidebar = ({ setIsSliderOpen }) => {
  const navigate = useNavigate();
  const [isMinimize, setIsMinimize] = useState(false);
  const location = useLocation();
  let path = location.pathname;
  const dispatch = useDispatch();
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    compliance: false,
    positioning: false,
    inventory: false
  });

  const isLargerThan900 = useMediaQuery('(min-width: 900px)');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarSections = [
    {
      id: 'compliance',
      title: 'Compliance',
      icon: <GiFirstAidKit />,
      items: [
        { icon: <FaFireFlameCurved />, title: 'Fire Detection', path: '/fire' },
        { icon: <FaHelmetSafety />, title: 'PPE Kit', path: '/ppe-kit' },
        { icon: <GiSmokeBomb />, title: 'Smoke Detection', path: '/smoke' },
        { icon: <PiTruckFill />, title: 'Loading-Unloading', path: '/truck' }
      ]
    },
    {
      id: 'positioning',
      title: 'Positioning',
      icon: <IoFileTray />,
      items: [
        { icon: <IoFileTray />, title: 'Bracket-D', path: '/bracket-d' },
        { icon: <IoFileTray />, title: 'Bracket-E', path: '/bracket-e' }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: <FaClipboardList />,
      items: [
        { icon: <RiBox3Fill />, title: 'Fg Stock', path: '/fg-stock' },
        { icon: <MdStorefront />, title: 'Store Stock', path: '/store-stock' },
        { icon: <FaTools />, title: 'Tool Management', path: '/tool-management' },
        { icon: <MdRateReview />, title: 'Complaint Board', path: '/complaint-board' }
      ]
    }
  ];
  
  return (
    <div className="sidebar" style={{
      position: 'relative',
      width: isMinimize ? '5rem' : "15rem",
      padding: isMinimize ? '0 10px' : '0 20px',
      transition: '0.2s', 
      overflow: 'visible',
      maxHeight: '100vh',
      overflowY: 'auto',

      // backgroundColor: 'red'
      
    }}>
      {/* {(!isMinimize || isLargerThan900) && (
        <IconButton onClick={() => setIsMinimize(false)}>
        <FaCircleChevronRight
          style={{
            // backgroundColor: 'grey',
            color: '#282828',
            fontSize: '1.9rem',
            position: 'absolute',
            right: '-2rem',
            top: '1rem',
            borderRadius: '50%',
            zIndex: 999,
            display: isMinimize ? 'flex' : 'none',
            cursor: 'pointer',
            boxShadow: 'rgba(0, 0, 0, 0.83) 1.95px 1.95px 2.6px',

          }}
        />
        </IconButton>
      )} */}
      
      {(isMinimize || isLargerThan900) && (
        <FaCircleChevronLeft
          onClick={() => setIsMinimize(true)}
          style={{
            color: 'white',
            backgroundColor: 'grey',
            fontSize: '1.9rem',
            // position: 'absolute',
            // right: '-1rem',
            // top: '1rem',
            position: 'fixed', // Fixed position
            top: '1rem', // Sticks to the top of the viewport
            left: '14rem', // Adjust based on sidebar width
            borderRadius: '50%',
            zIndex: 999,
            display: !isMinimize ? 'flex' : 'none',
            cursor: 'pointer',
            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
          }}
        />
     )} 

     {/* Expand Icon */}
  {(isMinimize && isLargerThan900) && (
    // <Box
    //   onClick={() => setIsMinimize(false)}
    //   sx={{
    //     // color: 'white',
    //     // backgroundColor: 'grey',
    //     color: 'white',
    //     fontSize: '1.9rem',
    //     position: 'absolute',
    //     right: '-1rem',
    //     top: '1rem',
    //     // borderRadius: '50%',
    //     zIndex: 999,
    //     cursor: 'pointer',
    //     boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    //   }}
    // >
    //   <FaCircleChevronRight  />
    // </Box>
    <div  onClick={() => setIsMinimize(false)}   style={{
      // backgroundColor: 'grey',
      // color: '#282828',
      fontSize: '1.9rem',
      // position: 'absolute',
      // right: '-1rem',
      // top: '1rem',
      position: 'fixed', // Fixed position
            top: '1rem', // Sticks to the top of the viewport
            left: '4rem', // Adjust based on sidebar width
      borderRadius: '50%',
      zIndex: 999,
      display: isMinimize ? 'flex' : 'none',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: 'grey',
     boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',

    }}>
<FaCircleChevronRight  />
    </div>
  )}

  {/* Collapse Icon */}
  {/* {!isMinimize && (

    <div  onClick={() => setIsMinimize(true)}   style={{
      // backgroundColor: 'grey',
      // color: '#282828',
      fontSize: '1.9rem',
      position: 'absolute',
      right: '-1rem',
      top: '1rem',
      borderRadius: '50%',
      zIndex: 999,
      display: isMinimize ? 'flex' : 'none',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: 'grey',
      boxShadow: 'rgba(0, 0, 0, 0.52) 1.95px 1.95px 2.6px',

    }}>
<FaCircleChevronLeft />
    </div>
  )} */}


{/* --------new-------------- */}
{/* {isMinimize && (
  <FaCircleChevronRight
    onClick={() => setIsMinimize(false)}
    style={{
      color: 'white',
      backgroundColor: 'grey',
      fontSize: '1.9rem',
      position: 'absolute',
      right: '-1rem',
      top: '1rem',
      borderRadius: '50%',
      zIndex: 999,
      cursor: 'pointer',
      boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    }}
  />
)}

{!isMinimize && (
  <FaCircleChevronLeft
    onClick={() => setIsMinimize(true)}
    style={{
      color: 'white',
      backgroundColor: 'grey',
      fontSize: '1.9rem',
      position: 'absolute',
      right: '-1rem',
      top: '1rem',
      borderRadius: '50%',
      zIndex: 999,
      cursor: 'pointer',
      boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    }}
  />
)} */}

      <List>
        {/* Logo */}
        <div className="avatar" style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!isMinimize && (
            <img
              src={logo}
              alt="logo"
              width={150}
            />
          )}
        </div>

        {/* Dashboard */}
        <ListItem disableGutters={true} className="sidebar-listItem">
          <Button
            onClick={() => { navigate('/'); setIsSliderOpen(false); }}
            className="sidebar-link"
            style={{
              borderLeft: (path === '/') && '5px solid rgb(241, 92, 109)',
              borderRadius: '8px'
            }}
          >
            <ListItemButton
              sx={{ textAlign: "left" }}
              className="appbar-links"
              style={{ padding: "5px 0" }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "0 10px" }}>
                <IconButton sx={{ color: "#ffffff9f" }}>
                  <MdHome />
                </IconButton>
                {!isMinimize && <p className="sidebar-list-text">Dashboard</p>}
              </div>
            </ListItemButton>
          </Button>
        </ListItem>

        {/* Collapsible Sections */}
        {sidebarSections.map((section) => (
  <div key={section.id}>
    {/* Section Header */}
    <ListItem disableGutters={true} className="sidebar-listItem" onClick={()=> navigate(section.items[0].path)} >
      <Tooltip title={section.title} placement="right" disableHoverListener={!isMinimize}>
        <Button
          onClick={() => toggleSection(section.id)} // Allow toggling regardless of isMinimize
          className="sidebar-link section-header"
          style={{ cursor: 'pointer' }}
        >
          <ListItemButton
            sx={{ textAlign: "left" }}
            className="appbar-links"
            style={{ padding: "5px 0" }}
          >
            <div style={{ display: "flex", alignItems: "center", padding: "0 10px", width: '100%' }}>
              <IconButton sx={{ color: "#ffffff9f" }}>
                {section.icon}
              </IconButton>
              {!isMinimize && (
                <>
                  <p className="sidebar-list-text" style={{ flex: 1 }}>{section.title}</p>
                  {expandedSections[section.id] ? <FaChevronDown /> : <FaChevronRight />}
                </>
              )}
            </div>
          </ListItemButton>
        </Button>
      </Tooltip>
    </ListItem>

    {/* Section Items */}
    <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
      {section.items.map((item, index) => (
        <ListItem key={index} disableGutters={true} className="sidebar-listItem">
          <Tooltip title={item.title} placement="right" disableHoverListener={!isMinimize}>
            <Button
              onClick={() => { navigate(item.path); setIsSliderOpen(false); }}
              className="sidebar-link"
              style={{
                marginLeft: isMinimize ? '0' : '2rem', // Adjust margin based on isMinimize
                borderLeft: (path === item.path) && '5px solid rgb(241, 92, 109)',
                borderRadius: '8px'
              }}
            >
              <ListItemButton
                sx={{ textAlign: "left" }}
                className="appbar-links"
                style={{ padding: "5px 0" }}
              >
                <div style={{ display: "flex", alignItems: "center", padding: "0 10px" }}>
                  <IconButton sx={{ color: "#ffffff9f" }}>
                    {item.icon}
                  </IconButton>
                  {!isMinimize && <p className="sidebar-list-text">{item.title}</p>}
                </div>
              </ListItemButton>
            </Button>
          </Tooltip>
        </ListItem>
      ))}
    </Collapse>
  </div>
))}

        {/* Logout */}
        <ListItem disableGutters={true} className="sidebar-listItem" style={{ marginTop: '2rem' }}>
          <Button className="sidebar-link">
            <ListItemButton
              sx={{ textAlign: "left" }}
              className="appbar-links"
              style={{ padding: "5px 0" }}
            >
              <div
                onClick={() => dispatch(logout())}
                style={{ display: "flex", alignItems: "center", padding: "0 10px" }}
              >
                <IconButton sx={{ color: "#ffffff9f" }}>
                  <IoIosLogOut />
                </IconButton>
                {!isMinimize && <p className="sidebar-list-text">Logout</p>}
              </div>
            </ListItemButton>
          </Button>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;