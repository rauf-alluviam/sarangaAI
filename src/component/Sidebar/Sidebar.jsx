import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.scss';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery,
  Collapse,
  Tooltip,
  Avatar,
} from '@mui/material';
import { MdHome, MdRateReview, MdStorefront } from 'react-icons/md';
import { IoIosLogOut } from 'react-icons/io';
import logo from '../../assets/rabsLogo.png';
import {
  FaCircleChevronLeft,
  FaCircleChevronRight,
  FaFireFlameCurved,
  FaHelmetSafety,
  FaChevronDown,
  FaChevronRight,
  FaThumbsDown,
} from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/Actions/authAction';
import { GiFirstAidKit, GiSmokeBomb } from 'react-icons/gi';
import { FaClipboardList, FaTools, FaUserCircle } from 'react-icons/fa';
import { PiTruckFill } from 'react-icons/pi';
import { IoFileTray } from 'react-icons/io5';
import { RiBox3Fill } from 'react-icons/ri';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

// ----------------------
// Sidebar Sections Config
// ----------------------
const allSections = [
  {
    id: 'compliance',
    title: 'Compliance',
    icon: <GiFirstAidKit />,
    roles: ['admin'],
    items: [
      { icon: <FaFireFlameCurved />, title: 'Fire Detection', path: '/fire' },
      { icon: <FaHelmetSafety />, title: 'PPE Kit', path: '/ppe-kit' },
      { icon: <GiSmokeBomb />, title: 'Smoke Detection', path: '/smoke' },
      { icon: <PiTruckFill />, title: 'Loading-Unloading', path: '/truck' },
    ],
  },
  {
    id: 'positioning',
    title: 'Positioning',
    icon: <IoFileTray />,
    roles: ['admin', 'production'],
    items: [
      { icon: <IoFileTray />, title: 'Bracket-D', path: '/bracket-d' },
      { icon: <IoFileTray />, title: 'Bracket-E', path: '/bracket-e' },
      { icon: <IoFileTray />, title: 'Pes Cover-A', path: '/pes-cover-a' },
      { icon: <IoFileTray />, title: 'Pes Cover-B', path: '/pes-cover-b' },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    icon: <FaClipboardList />,
    roles: ['admin', 'production', 'dispatch'], // Added 'dispatch' role
    items: [
      {
        icon: <MdStorefront />,
        title: 'Store Stock',
        path: '/store-stock',
        roles: ['admin', 'production', 'dispatch'], // Specify which roles can see this item
      },
      {
        icon: <RiBox3Fill />,
        title: 'Fg Stock',
        path: '/fg-stock',
        roles: ['admin', 'production', 'dispatch'], // Specify which roles can see this item
      },
      {
        icon: <PrecisionManufacturingIcon />,
        title: 'Production',
        path: '/production',
        roles: ['admin', 'production'], // Only admin and production can see this
      },
      {
        icon: <FaThumbsDown />,
        title: 'Rejection',
        path: '/rejection',
        roles: ['admin', 'production'], // Only admin and production can see this
      },
      {
        icon: <FaTools />,
        title: 'Tool Management',
        path: '/tool-management',
        roles: ['admin', 'production'], // Only admin and production can see this
      },
      {
        icon: <MdRateReview />,
        title: 'Complaint Board',
        path: '/complaint-board',
        roles: ['admin', 'production'], // Only admin and production can see this
      },
    ],
  },
  {
    id: 'dojo',
    title: 'DOJO2.0',
    icon: <Avatar alt="DOJO" src="/images/dojo.png" />,
    roles: ['admin', 'hr'],
    path: '/dojo-employee',
  },
  {
    id: 'dojo-onboarding',
    title: 'DOJO Onboarding',
    icon: <Avatar alt="Onboarding" src="/images/dojo.png" />,
    roles: ['admin', 'hr'],
    path: '/dojo-onboarding-form',
  },
  {
    id: 'complaint-board',
    title: 'Complaint Board',
    icon: <MdRateReview />,
    roles: ['qc'],
    path: '/complaint-board',
  },
];

const Sidebar = ({ setIsSliderOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [isMinimize, setIsMinimize] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const isLargerThan900 = useMediaQuery('(min-width: 900px)');

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const role = userData?.role?.toLowerCase?.();

  // Filter sections based on user role
  const sidebarSections = allSections.filter((section) => section.roles.includes(role));

  // Filter items within sections based on user role
  const filterItemsByRole = (items, userRole) => {
    if (!items) return null;
    return items.filter((item) => {
      // If item has roles specified, check if user role is included
      if (item.roles) {
        return item.roles.includes(userRole);
      }
      // If no roles specified for item, show it for all section roles
      return true;
    });
  };

  return (
    <div
      className="sidebar"
      style={{
        position: 'relative',
        width: isMinimize ? '5rem' : '15rem',
        transition: '0.2s',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Collapse/Expand */}
      {(isMinimize || isLargerThan900) && (
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
          }}
        />
      )}
      {isMinimize && isLargerThan900 && (
        <div
          onClick={() => setIsMinimize(false)}
          style={{
            fontSize: '1.9rem',
            position: 'fixed',
            top: '1rem',
            left: '4rem',
            borderRadius: '50%',
            zIndex: 9,
            cursor: 'pointer',
            color: 'white',
            backgroundColor: 'grey',
          }}
        >
          <FaCircleChevronRight />
        </div>
      )}

      {/* Logo */}
      <div
        style={{
          height: '8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {!isMinimize && (
          <img
            src={logo}
            alt="logo"
            width={150}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        )}
      </div>

      {/* Menu Sections */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List>
          {/* Dashboard */}
          <ListItem disableGutters className="sidebar-listItem">
            <Button
              onClick={() => {
                navigate('/');
                setIsSliderOpen(false);
              }}
              className="sidebar-link"
              style={{
                borderLeft: path === '/' ? '5px solid #E08272' : '',
              }}
            >
              <ListItemButton>
                <IconButton sx={{ color: '#ffffff9f' }}>
                  <MdHome />
                </IconButton>
                {!isMinimize && <p className="sidebar-list-text">Dashboard</p>}
              </ListItemButton>
            </Button>
          </ListItem>

          {/* Dynamic Sections */}
          {sidebarSections.map((section) => {
            // Filter items for current user role
            const filteredItems = section.items ? filterItemsByRole(section.items, role) : null;

            return (
              <div key={section.id}>
                {/* Case 1: Section has items (collapsible) */}
                {filteredItems && filteredItems.length > 0 ? (
                  <>
                    <ListItem disableGutters className="sidebar-listItem">
                      <Tooltip
                        title={section.title}
                        placement="right"
                        disableHoverListener={!isMinimize}
                      >
                        <Button
                          onClick={() => toggleSection(section.id)}
                          className="sidebar-link section-header"
                        >
                          <ListItemButton>
                            <IconButton sx={{ color: '#ffffff9f' }}>{section.icon}</IconButton>
                            {!isMinimize && (
                              <>
                                <p className="sidebar-list-text" style={{ flex: 1 }}>
                                  {section.title}
                                </p>
                                {expandedSections[section.id] ? (
                                  <FaChevronDown />
                                ) : (
                                  <FaChevronRight />
                                )}
                              </>
                            )}
                          </ListItemButton>
                        </Button>
                      </Tooltip>
                    </ListItem>

                    <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
                      {filteredItems.map((item, index) => (
                        <ListItem key={index} disableGutters className="sidebar-listItem">
                          <Tooltip
                            title={item.title}
                            placement="right"
                            disableHoverListener={!isMinimize}
                          >
                            <Button
                              onClick={() => {
                                navigate(item.path);
                                setIsSliderOpen(false);
                              }}
                              className="sidebar-link"
                              style={{
                                marginLeft: isMinimize ? '0' : '2rem',
                                borderLeft: path === item.path ? '5px solid #E08272' : '',
                              }}
                            >
                              <ListItemButton>
                                <IconButton sx={{ color: '#ffffff9f' }}>{item.icon}</IconButton>
                                {!isMinimize && <p className="sidebar-list-text">{item.title}</p>}
                              </ListItemButton>
                            </Button>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </Collapse>
                  </>
                ) : section.path ? (
                  // Case 2: Direct path (like DOJO2.0)
                  <ListItem disableGutters className="sidebar-listItem">
                    <Tooltip
                      title={section.title}
                      placement="right"
                      disableHoverListener={!isMinimize}
                    >
                      <Button
                        onClick={() => {
                          navigate(section.path);
                          setIsSliderOpen(false);
                        }}
                        className="sidebar-link"
                        style={{
                          borderLeft: path === section.path ? '5px solid #E08272' : '',
                        }}
                      >
                        <ListItemButton>
                          <IconButton sx={{ color: '#ffffff9f' }}>{section.icon}</IconButton>
                          {!isMinimize && <p className="sidebar-list-text">{section.title}</p>}
                        </ListItemButton>
                      </Button>
                    </Tooltip>
                  </ListItem>
                ) : null}
              </div>
            );
          })}
        </List>
      </div>

      {/* Profile + Logout */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <List>
          <ListItem disableGutters className="sidebar-listItem">
            <Button
              onClick={() => {
                navigate('/my-profile');
                setIsSliderOpen(false);
              }}
              className="sidebar-link"
              style={{
                borderLeft: path === '/my-profile' ? '5px solid #E08272' : '',
              }}
            >
              <ListItemButton>
                <IconButton sx={{ color: '#ffffff9f' }}>
                  <FaUserCircle />
                </IconButton>
                {!isMinimize && <p className="sidebar-list-text">My Profile</p>}
              </ListItemButton>
            </Button>
          </ListItem>

          <ListItem disableGutters className="sidebar-listItem">
            <Button className="sidebar-link" onClick={() => dispatch(logout())}>
              <ListItemButton>
                <IconButton sx={{ color: '#ffffff9f' }}>
                  <IoIosLogOut />
                </IconButton>
                {!isMinimize && <p className="sidebar-list-text">Logout</p>}
              </ListItemButton>
            </Button>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
