import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { Button, IconButton, List, ListItem, ListItemButton, useMediaQuery, Collapse, Tooltip } from "@mui/material";
import { MdHome, MdRateReview, MdStorefront } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import logo from '../../assets/rabsLogo.png';
import { FaCircleChevronLeft, FaCircleChevronRight, FaFireFlameCurved, FaHelmetSafety, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/Actions/authAction";
import { GiFirstAidKit, GiSmokeBomb } from "react-icons/gi";
import { FaClipboardList, FaTools, FaUserCircle } from "react-icons/fa";
import { PiTruckFill } from "react-icons/pi";
import { IoFileTray } from "react-icons/io5";
import { RiBox3Fill } from "react-icons/ri";

const MidSidebar = ({ setIsSliderOpen }) => {
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
      padding: '0',
      transition: '0.2s', 
      overflow: 'hidden',
      maxHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Collapse/Expand Icons */}
      {/* {(isMinimize || isLargerThan900) && (
        <FaCircleChevronLeft
          onClick={() => setIsMinimize(true)}
          style={{
            color: 'white',
            backgroundColor: 'grey',
            fontSize: '1.9rem',
            position: 'fixed',
            top: '1rem',
            left: '14rem',
            borderRadius: '50%',
            zIndex: 9,
            display: !isMinimize ? 'flex' : 'none',
            cursor: 'pointer',
            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
          }}
        />
     )} 

     {(isMinimize && isLargerThan900) && (
        <div  onClick={() => setIsMinimize(false)}   style={{
          fontSize: '1.9rem',
          position: 'fixed',
          top: '1rem',
          left: '4rem',
          borderRadius: '50%',
          zIndex: 9,
          display: isMinimize ? 'flex' : 'none',
          cursor: 'pointer',
          color: 'white',
          backgroundColor: 'grey',
         boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
        }}>
          <FaCircleChevronRight  />
        </div>
      )} */}

      {/* Fixed Logo Section */}
      <div style={{
        height: '8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMinimize ? '0 10px' : '0 20px',
      }}>
        {!isMinimize && (
          <img
            src={logo}
            alt="logo"
            width={150}
            style={{cursor: 'pointer'}}
            onClick={() => { navigate('/');}}
          />
        )}
      </div>

      {/* Scrollable Content Area with disabled mouse wheel and hidden scrollbar */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isMinimize ? '0 10px' : '0 20px',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // Internet Explorer 10+
        }}
        onWheel={(e) => {
          e.preventDefault(); // Disable mouse wheel scrolling
        }}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', // Safari and Chrome
          },
        }}
      >
        <List>
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
                    onClick={() => toggleSection(section.id)}
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
                          marginLeft: isMinimize ? '0' : '2rem',
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
        </List>
      </div>

      {/* Fixed Bottom Profile Section */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMinimize ? '0 10px' : '0 20px',
        backgroundColor: 'inherit',
      }}>
        <List>
          {/* My Profile */}
          <ListItem disableGutters={true} className="sidebar-listItem">
            <Button 
              onClick={() => { navigate('/my-profile'); setIsSliderOpen(false); }}
              className="sidebar-link"
              style={{
                borderLeft: (path === '/my-profile') && '5px solid rgb(241, 92, 109)',
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
                    <FaUserCircle />
                  </IconButton>
                  {!isMinimize && <p className="sidebar-list-text">My Profile</p>}
                </div>
              </ListItemButton>
            </Button>
          </ListItem>

          {/* Logout */}
          <ListItem disableGutters={true} className="sidebar-listItem">
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
    </div>
  );
};

export default MidSidebar;