import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, Card, CardContent, Grid, Avatar, Chip, LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsCameraReelsFill, BsGraphUp } from 'react-icons/bs';
import { FaClipboardList, FaFire, FaTools, FaTruckLoading } from 'react-icons/fa';
import { IoMedkit, IoStorefront } from 'react-icons/io5';
import { MdOutlineManageHistory, MdSmokeFree, MdSpatialTracking } from 'react-icons/md';
import colors from '../../utils/colors';
import { useNavigate } from 'react-router-dom';
import { GiSmokeBomb } from 'react-icons/gi';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { deleteCamera, fetchCameras } from '../../Redux/Actions/cameraAction';
import { useSnackbar } from 'notistack';
import { Camera, CheckCircle, QrCode, TrendingUp, Security, Inventory, Assessment, Notifications, Speed, Timeline, Analytics } from '@mui/icons-material';

const Dashboard2 = ({ setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { userData, token } = useSelector((state) => state.auth);
  const { cameras } = useSelector((state) => state.cameras);
  
  const [allCameras, setAllCameras] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalCameras: 0,
    totalDetections: 0,
    activeAlerts: 3,
    systemHealth: 98
  });

  const BACKEND_API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    let combined = [];
    for (let key in cameras) {
      let cameraArray = cameras[key];
      let updatedArray = cameraArray.map(cam => ({ ...cam, model: key }));
      combined = combined.concat(updatedArray);
    }
    setAllCameras(combined);
    setStats(prev => ({ ...prev, totalCameras: combined.length }));
  }, [cameras]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A80', '#82B1FF'];

  useEffect(() => {
    const fetchCameraDetections = async () => {
      try {
        const [year, month, day] = date.split('-');
        const response = await axios.get(`${BACKEND_API}/snapshots_all-daywise/${year}/${month}/${day}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const data = response.data.data ? response.data.data : [];
        setGraphData(data);
        
        const totalDetections = data.reduce((acc, category) => {
          return acc + category.cameras.reduce((camAcc, camera) => {
            return camAcc + camera.images.length;
          }, 0);
        }, 0);
        setStats(prev => ({ ...prev, totalDetections }));
      } catch (error) {
        console.log(error);
        setGraphData([]);
      }
    };
    fetchCameraDetections();
  }, [date, token]);

  const handleDelete = (cameraId, category) => {
    dispatch(deleteCamera({
      cameraId,
      userData,
      category,
      token,
      onSuccess: () => {
        setIsOpen(false);
        enqueueSnackbar('Camera removed successfully!', { variant: 'success' });
      }
    }));
  };

  const isLargerThan1390 = useMediaQuery('(min-width: 1390px)');
  const isLargerThan768 = useMediaQuery('(min-width: 768px)');

  // Sample data for trending
  const trendingData = [
    { name: 'Mon', detections: 45, alerts: 3 },
    { name: 'Tue', detections: 52, alerts: 1 },
    { name: 'Wed', detections: 38, alerts: 4 },
    { name: 'Thu', detections: 61, alerts: 2 },
    { name: 'Fri', detections: 55, alerts: 5 },
    { name: 'Sat', detections: 42, alerts: 1 },
    { name: 'Sun', detections: 48, alerts: 2 }
  ];

  const quickAccessItems = [
    { title: 'Fire Detection', icon: <FaFire />, path: '/fire', color: '#FF6B6B', count: '12 Active' },
    { title: 'PPE Monitoring', icon: <IoMedkit />, path: '/ppe-kit', color: '#4ECDC4', count: '8 Violations' },
    { title: 'Smoke Detection', icon: <GiSmokeBomb />, path: '/smoke', color: '#45B7D1', count: '3 Alerts' },
    { title: 'Truck Safety', icon: <FaTruckLoading />, path: '/truck', color: '#96CEB4', count: '15 Monitored' },
    { title: 'Inventory', icon: <FaClipboardList />, path: '/fg-stock', color: '#FFEAA7', count: '245 Items' },
    { title: 'Tool Management', icon: <FaTools />, path: '/tool-management', color: '#DDA0DD', count: '89 Tools' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 3
    }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        p: 4,
        mb: 3,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h3" fontWeight="800" sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Welcome to RABS Industries
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight="400">
              Advanced AI-powered monitoring and detection system
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {userData?.sub?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {userData?.sub?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { 
            title: 'Total Cameras', 
            value: stats.totalCameras, 
            icon: <Camera sx={{ fontSize: 40 }} />, 
            color: '#FF6B6B',
            trend: '+12%',
            subtitle: 'Active monitoring'
          },
          { 
            title: 'Today\'s Detections', 
            value: stats.totalDetections, 
            icon: <TrendingUp sx={{ fontSize: 40 }} />, 
            color: '#4ECDC4',
            trend: '+8%',
            subtitle: 'Incidents detected'
          },
          { 
            title: 'Active Alerts', 
            value: stats.activeAlerts, 
            icon: <Notifications sx={{ fontSize: 40 }} />, 
            color: '#FFA726',
            trend: '-5%',
            subtitle: 'Require attention'
          },
          { 
            title: 'System Health', 
            value: `${stats.systemHealth}%`, 
            icon: <Speed sx={{ fontSize: 40 }} />, 
            color: '#66BB6A',
            trend: '+2%',
            subtitle: 'Overall performance'
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              border: `2px solid ${stat.color}20`,
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: `0 20px 40px ${stat.color}30`
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ 
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                    borderRadius: '16px',
                    p: 1.5,
                    color: 'white'
                  }}>
                    {stat.icon}
                  </Box>
                  <Chip 
                    label={stat.trend} 
                    size="small" 
                    sx={{ 
                      background: stat.trend.includes('+') ? '#E8F5E8' : '#FFF3E0',
                      color: stat.trend.includes('+') ? '#2E7D32' : '#F57C00',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <Typography variant="h3" fontWeight="800" color={stat.color} mb={0.5}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" fontWeight="600" color="text.primary" mb={0.5}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Access Grid */}
      <Grid container spacing={3} mb={4}>
        {quickAccessItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': { 
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`
              }
            }} onClick={() => navigate(item.path)}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box sx={{ 
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                    borderRadius: '16px',
                    p: 2,
                    color: item.color,
                    fontSize: '1.8rem'
                  }}>
                    {item.icon}
                  </Box>
                  <Chip 
                    label={item.count} 
                    sx={{ 
                      background: `${item.color}15`,
                      color: item.color,
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <Typography variant="h6" fontWeight="700" color="text.primary">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Click to access {item.title.toLowerCase()} dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics and External Tools Row */}
      <Grid container spacing={3} mb={4}>
        {/* Weekly Trends */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            height: '100%',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="text.primary">
                    Weekly Detection Trends
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detection patterns and alert frequency over the past week
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Chip label="Detections" sx={{ background: '#4ECDC420', color: '#4ECDC4' }} />
                  <Chip label="Alerts" sx={{ background: '#FF6B6B20', color: '#FF6B6B' }} />
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendingData}>
                  <defs>
                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="detections" 
                    stroke="#4ECDC4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorDetections)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="#FF6B6B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAlerts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* External Tools */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2} height="100%">
            <Grid item xs={12}>
              <Card 
                component="a" 
                href="http://snapcheckv1.s3-website.ap-south-1.amazonaws.com/login"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    transform: 'scale(1.05)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }
                }}
              >
                <CardContent sx={{ p: 3, zIndex: 1 }}>
                  <Box display="flex" alignItems="center">
                    <Camera sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        SnapCheck
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Quick image verification and analysis
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card 
                component="a" 
                href="http://qrlocker.s3-website.ap-south-1.amazonaws.com/login?redirect=%2F"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    transform: 'scale(1.05)',
                    boxShadow: '0 20px 40px rgba(240, 147, 251, 0.4)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }
                }}
              >
                <CardContent sx={{ p: 3, zIndex: 1 }}>
                  <Box display="flex" alignItems="center">
                    <QrCode sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        QR Locker
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Secure QR code management system
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Detection Analytics and Camera Management */}
      <Grid container spacing={3}>
        {/* Detection Analytics */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            height: '100%',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="text.primary">
                    Detection Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time detection data by category
                  </Typography>
                </Box>
                <TextField
                  size="small"
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ 
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ height: '400px', overflowY: 'auto' }}>
                {graphData.length > 0 ? (
                  <Grid container spacing={2}>
                    {graphData.map((category, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ 
                          height: '320px',
                          borderRadius: '16px',
                          border: `2px solid ${COLORS[index % COLORS.length]}20`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 10px 30px ${COLORS[index % COLORS.length]}20`
                          }
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="h6" textAlign="center" mb={2} fontWeight="600">
                              {category.category}
                            </Typography>
                            <ResponsiveContainer width="100%" height={180}>
                              <PieChart>
                                <Pie
                                  data={category.cameras.map((c) => ({
                                    ...c,
                                    name: `Cam ${c.camera_id}`,
                                    value: c.images.length,
                                  }))}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={60}
                                  dataKey="value"
                                >
                                  {category.cameras.map((_, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ 
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <Box mt={1} sx={{ maxHeight: '80px', overflowY: 'auto' }}>
                              {category.cameras.map((c, idx) => (
                                <Typography key={idx} variant="caption" display="block" sx={{ 
                                  color: COLORS[idx % COLORS.length],
                                  fontWeight: '600',
                                  mb: 0.5
                                }}>
                                  Camera {c.camera_id}: {c.images.length} detections
                                </Typography>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
                    <Analytics sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No data found for {date}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Try selecting a different date
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Camera Management */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            height: '100%',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Camera sx={{ mr: 2, color: '#667eea', fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight="700" color="text.primary">
                    Camera Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor and manage all cameras
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  System Health
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.systemHealth} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4ECDC4, #44A08D)',
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.systemHealth}% operational
                </Typography>
              </Box>

              <TableContainer sx={{ 
                maxHeight: '350px',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '3px',
                },
              }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', background: '#f8f9fa' }}>Camera</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', background: '#f8f9fa' }}>Model</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', background: '#f8f9fa' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCameras.length > 0 ? (
                      allCameras.map((camera, index) => (
                        <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ 
                                width: 24, 
                                height: 24, 
                                mr: 1, 
                                fontSize: '0.7rem',
                                background: 'linear-gradient(45deg, #667eea, #764ba2)'
                              }}>
                                {camera.camera_id}
                              </Avatar>
                              <Typography variant="body2" fontWeight="600">
                                {camera.camera_id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={camera.model} 
                              size="small"
                              sx={{ 
                                background: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: '600',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '0.7rem'
                              }}
                              onClick={() => handleDelete(camera.camera_id, camera.model)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Camera sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                          <Typography color="text.secondary">
                            No cameras found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </Box>
  );
};

export default Dashboard2;