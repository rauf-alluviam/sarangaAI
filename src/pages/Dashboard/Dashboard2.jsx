// // Material UI version of the provided Dashboard (using @mui/material and @mui/icons-material as needed)
// // Note: You may need to adapt styling and layout with MUI's Box, Grid, Card, etc.
// // This conversion focuses on structure, not pixel-perfect styles. Icons from 'lucide-react' are retained.

// import React, { useState } from 'react';
// import {
//   Box,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   CardActionArea,
//   InputLabel,
//   TextField,
//   IconButton,
//   useTheme
// } from '@mui/material';
// import {
//   Camera,
//   QrCode,
//   CheckCircle,
//   Lock,
//   Calendar,
//   BarChart3,
//   Users,
//   Shield,
//   Truck,
//   Package,
//   Store,
//   Settings,
//   Wrench,
//   Flame,
//   AlertTriangle,
//   Eye,
//   TrendingUp
// } from 'lucide-react';

// const Dashboard = ({ setIsOpen }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [activeCard, setActiveCard] = useState(null);

//   const detectionCategories = [
//     { name: 'Fire Detection', count: 24, icon: Flame, color: '#F87171' },
//     { name: 'Smoke Detection', count: 18, icon: AlertTriangle, color: '#FB923C' },
//     { name: 'PPE Detection', count: 156, icon: Shield, color: '#60A5FA' },
//     { name: 'Loading/Unloading', count: 89, icon: Truck, color: '#34D399' },
//   ];

//   const quickActions = [
//     { title: 'Snap Check', description: 'Quick image verification and analysis', icon: Camera, color: '#A78BFA', onClick: () => console.log('Snap Check clicked') },
//     { title: 'QR Locker', description: 'Secure QR code management system', icon: QrCode, color: '#818CF8', onClick: () => console.log('QR Locker clicked') },
//   ];

//   const systemModules = [
//     { title: 'Fire Detection', path: '/fire', icon: Flame },
//     { title: 'Smoke Detection', path: '/smoke', icon: AlertTriangle },
//     { title: 'PPE Detection', path: '/ppe-kit', icon: Shield },
//     { title: 'Loading/Unloading', path: '/truck', icon: Truck },
//     { title: 'Dispatch Stock', path: '/fg-stock', icon: Package },
//     { title: 'Store Stock Board', path: '/store-stock', icon: Store },
//     { title: '4M Change Board', path: '/4m-change', icon: Settings },
//     { title: 'Tool Management', path: '/tool-management', icon: Wrench },
//   ];

//   const mockCameras = [
//     { id: 'CAM-001', rtsp: 'rtsp://192.168.1.100:554/stream1', model: 'Fire Detection', status: 'Active' },
//     { id: 'CAM-002', rtsp: 'rtsp://192.168.1.101:554/stream1', model: 'Smoke Detection', status: 'Active' },
//     { id: 'CAM-003', rtsp: 'rtsp://192.168.1.102:554/stream1', model: 'PPE Detection', status: 'Inactive' },
//   ];

//   return (
//     <Box sx={{ p: 4, background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)' }}>
//       <Box maxWidth="lg" mx="auto" display="flex" flexDirection="column" gap={4}>
//         <Card sx={{ backdropFilter: 'blur(10px)', p: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Welcome to Alvision Dashboard
//           </Typography>
//           <Typography align="center" color="text.secondary">
//             Advanced AI-powered monitoring and detection system
//           </Typography>
//         </Card>

//         <Grid container spacing={2}>
//           {quickActions.map((action, i) => (
//             <Grid item xs={12} md={6} key={i}>
//               <CardActionArea onClick={action.onClick} onMouseEnter={() => setActiveCard(action.title)} onMouseLeave={() => setActiveCard(null)}>
//                 <Card sx={{ display: 'flex', p: 2, backgroundColor: '#f3f4f6' }}>
//                   <Box sx={{ p: 2, borderRadius: 2, backgroundColor: action.color }}>
//                     <action.icon color="white" />
//                   </Box>
//                   <Box ml={2} flexGrow={1}>
//                     <Typography variant="h6" color="text.primary">{action.title}</Typography>
//                     <Typography variant="body2" color="text.secondary">{action.description}</Typography>
//                   </Box>
//                   <CheckCircle color={action.color} />
//                 </Card>
//               </CardActionArea>
//             </Grid>
//           ))}
//         </Grid>

//         <Grid container spacing={2}>
//           {detectionCategories.map((cat, i) => (
//             <Grid item xs={12} sm={6} md={3} key={i}>
//               <Card sx={{ p: 2 }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Box sx={{ p: 1, borderRadius: 2, backgroundColor: cat.color }}>
//                     <cat.icon color="white" size={24} />
//                   </Box>
//                   <TrendingUp color={cat.color} />
//                 </Box>
//                 <Typography variant="body2" color="text.secondary">{cat.name}</Typography>
//                 <Typography variant="h5">{cat.count}</Typography>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         <Grid container spacing={2}>
//           <Grid item xs={12} lg={8}>
//             <Card sx={{ p: 3 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Typography variant="h6"><BarChart3 style={{ marginRight: 8 }} /> Detection Analytics</Typography>
//                 <TextField type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} size="small" />
//               </Box>
//               <Box textAlign="center" py={4}>
//                 <Box sx={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#60a5fa', mx: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                   <BarChart3 color="white" size={48} />
//                 </Box>
//                 <Typography variant="h6" mt={2}>Analytics Dashboard</Typography>
//                 <Typography variant="body2" color="text.secondary">Real-time detection data and insights for {selectedDate}</Typography>
//               </Box>
//             </Card>
//           </Grid>

//           <Grid item xs={12} lg={4}>
//             <Card sx={{ p: 3 }}>
//               <Typography variant="h6" mb={2}><Eye style={{ marginRight: 8 }} /> Camera Status</Typography>
//               {mockCameras.map((cam, i) => (
//                 <Box key={i} sx={{ mb: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
//                   <Box display="flex" justifyContent="space-between">
//                     <Typography fontWeight="bold">{cam.id}</Typography>
//                     <Typography variant="caption" sx={{ backgroundColor: cam.status === 'Active' ? '#d1fae5' : '#fee2e2', color: cam.status === 'Active' ? '#065f46' : '#991b1b', px: 1, borderRadius: 1 }}>{cam.status}</Typography>
//                   </Box>
//                   <Typography variant="body2">{cam.model}</Typography>
//                   <Typography variant="caption" color="text.secondary">{cam.rtsp}</Typography>
//                 </Box>
//               ))}
//             </Card>
//           </Grid>
//         </Grid>

//         <Card sx={{ p: 3 }}>
//           <Typography variant="h6" mb={2}><Settings style={{ marginRight: 8 }} /> System Modules</Typography>
//           <Grid container spacing={2}>
//             {systemModules.map((mod, i) => (
//               <Grid item xs={6} sm={3} md={1.5} key={i}>
//                 <CardActionArea onClick={() => console.log(`Navigate to ${mod.path}`)}>
//                   <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0f2fe' }}>
//                     <mod.icon color="#1e3a8a" />
//                     <Typography variant="caption" display="block" mt={1}>{mod.title}</Typography>
//                   </Card>
//                 </CardActionArea>
//               </Grid>
//             ))}
//           </Grid>
//         </Card>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
