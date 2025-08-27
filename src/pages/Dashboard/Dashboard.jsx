import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { deleteCamera } from '../../Redux/Actions/cameraAction';

// Icons (deduped and only the ones used)
import {
  LocalFireDepartment as FlameIcon,
  Security as ShieldIcon,
  LocalShipping as TruckIcon,
  Inventory as PackageIcon,
  Store as StoreIcon,
  Build as WrenchIcon,
  Message as MessageSquareIcon,
  LocationOn as MapPinIcon,
  ChevronRight as ChevronRightIcon,
  QrCode as QrCodeIcon,
  CameraAlt as CameraAltIcon,
  Assignment as TaskManagementIcon,
  EmojiObjects as ActivityIcon,
} from '@mui/icons-material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BsGraphUp } from 'react-icons/bs';

const COLORS = ['#BB7E7E', '#C4AF7D', '#60AB8A', 'grey', '#8aa3c7', '#a38fb3'];

const Dashboard = ({ setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { userData, token } = useSelector((state) => state.auth);
  const { cameras } = useSelector((state) => state.cameras);

  const [allCameras, setAllCameras] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const BACKEND_API = import.meta.env.VITE_BACKEND_API;

  // Flatten camera groups by model
  useEffect(() => {
    if (!cameras) {
      setAllCameras([]);
      return;
    }
    let combined = [];
    for (let key in cameras) {
      const arr = Array.isArray(cameras[key]) ? cameras[key] : [];
      const withModel = arr.map((cam) => ({ ...cam, model: key }));
      combined = combined.concat(withModel);
    }
    setAllCameras(combined);
  }, [cameras]);

  // Fetch graph data for selected date
  useEffect(() => {
    const fetchCameraDetections = async () => {
      try {
        const [year, month, day] = date.split('-');
        const res = await axios.get(
          `${BACKEND_API}/snapshots_all-daywise/${year}/${month}/${day}`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setGraphData(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        setGraphData([]);
      }
    };
    fetchCameraDetections();
  }, [date, BACKEND_API, token]);

  const handleDelete = (cameraId, category) => {
    dispatch(
      deleteCamera({
        cameraId,
        userData,
        category,
        token,
        onSuccess: () => {
          setIsOpen(false);
          enqueueSnackbar('Camera removed successfully!', { variant: 'success' });
        },
      })
    );
  };

  // ------------------------
  // Catalog (full list)
  // ------------------------
  const fullCategories = useMemo(
    () => [
      {
        title: 'Detection Systems', // a.k.a. "Compliance"
        items: [
          {
            icon: FlameIcon,
            title: 'Fire Detection',
            path: '/fire',
            color: '#FF4444',
            bgColor: '#FFE6E6',
          },
          {
            icon: ActivityIcon,
            title: 'Smoke Detection',
            path: '/smoke',
            color: '#FF8C00',
            bgColor: '#FFF0E6',
          },
          {
            icon: ShieldIcon,
            title: 'PPE Detection',
            path: '/ppe-kit',
            color: '#4169E1',
            bgColor: '#E6EDFF',
          }, // PPE Kit -> PPE Detection
          {
            icon: TruckIcon,
            title: 'Loading/Unloading',
            path: '/truck',
            color: '#32CD32',
            bgColor: '#E6FFE6',
          }, // Loading-Unloading -> Loading/Unloading
        ],
      },
      {
        title: 'Inventory Management',
        items: [
          {
            icon: PackageIcon,
            title: 'FG Stock',
            path: '/fg-stock',
            color: '#8A2BE2',
            bgColor: '#F0E6FF',
          },
          {
            icon: StoreIcon,
            title: 'Store Stock',
            path: '/store-stock',
            color: '#FF6347',
            bgColor: '#FFE6E0',
          },
          {
            icon: WrenchIcon,
            title: 'Tool Management',
            path: '/tool-management',
            color: '#20B2AA',
            bgColor: '#E6FCFA',
          },
          {
            icon: MessageSquareIcon,
            title: 'Complaint Board',
            path: '/complaint-board',
            color: '#FFD700',
            bgColor: '#FFFCE6',
          },
          {
            icon: PrecisionManufacturingIcon,
            title: 'Production',
            path: '/production',
            color: '#DC143C',
            bgColor: '#FFE6EA',
          },
          {
            icon: PrecisionManufacturingIcon,
            title: 'Rejection',
            path: '/rejection',
            color: '#B22222',
            bgColor: '#FFE6EA',
          },
        ],
      },
      {
        title: 'Positioning Systems',
        items: [
          {
            icon: MapPinIcon,
            title: 'Bracket-D',
            path: '/bracket-d',
            color: '#FF1493',
            bgColor: '#FFE6F0',
          },
          // External sample (as in your code)
          {
            icon: MapPinIcon,
            title: 'Bracket-E',
            path: 'http://snapcheckv1.s3-website.ap-south-1.amazonaws.com/login',
            color: '#00CED1',
            bgColor: '#E6FCFD',
          },
          {
            icon: MapPinIcon,
            title: 'Pes Cover-A',
            path: '/pes-cover-a',
            color: '#6b7280',
            bgColor: '#eef2f7',
          },
          {
            icon: MapPinIcon,
            title: 'Pes Cover-B',
            path: '/pes-cover-b',
            color: '#6b7280',
            bgColor: '#eef2f7',
          },
        ],
      },
      {
        title: 'DOJO2.0',
        items: [
          // you had Bracket-D label here, but path is the dojo page—keeping path as is
          {
            icon: MapPinIcon,
            title: 'DOJO Employee',
            path: '/dojo-employee',
            color: '#7c3aed',
            bgColor: '#f3e8ff',
          },
        ],
      },
    ],
    []
  );

  // ------------------------
  // Role Access Map
  // ------------------------
  const ROLE_ACCESS = useMemo(
    () => ({
      admin: {
        // Compliance = Detection Systems
        'Detection Systems': [
          'Fire Detection',
          'PPE Detection',
          'Smoke Detection',
          'Loading/Unloading',
        ],
        'Positioning Systems': ['Bracket-D', 'Bracket-E', 'Pes Cover-A', 'Pes Cover-B'],
        'Inventory Management': [
          'FG Stock',
          'Store Stock',
          'Tool Management',
          'Complaint Board',
          'Rejection',
          'Production',
        ],
        'DOJO2.0': ['DOJO Employee'],
      },
      production: {
        'Positioning Systems': ['Bracket-D', 'Bracket-E', 'Pes Cover-A', 'Pes Cover-B'],
        'Inventory Management': [
          'FG Stock',
          'Store Stock',
          'Tool Management',
          'Complaint Board',
          'Rejection',
          'Production',
        ],
      },
      hr: {
        'DOJO2.0': ['DOJO Employee'],
      },
      qc: {
        'Inventory Management': ['Complaint Board'],
      },
    }),
    []
  );

  const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const getUserRole = () => normalize(userData?.role) || 'admin';
  const role = getUserRole();
  const isAdmin = role === 'admin';

  const filterCategoriesByRole = (role) => {
    const access = ROLE_ACCESS[role] || {};
    const allowedCategoryTitles = Object.keys(access).map(normalize);

    return fullCategories
      .map((cat) => {
        const catTitleNorm = normalize(cat.title);
        if (!allowedCategoryTitles.includes(catTitleNorm)) return null;

        const allowedItems =
          access[Object.keys(access).find((k) => normalize(k) === catTitleNorm)] || [];
        const allowedItemsNorm = new Set(allowedItems.map(normalize));

        const items = cat.items.filter((it) => allowedItemsNorm.has(normalize(it.title)));
        if (!items.length) return null;

        return { ...cat, items };
      })
      .filter(Boolean);
  };

  // Remove the duplicate declaration of role here
  const visibleCategories = useMemo(() => filterCategoriesByRole(role), [role, fullCategories]);

  // External tools – visible to all roles (keep as-is)
  const redirectLinks = [
    {
      title: 'External Tools',
      items: [
        {
          icon: QrCodeIcon,
          title: 'Qr Locker',
          path: 'http://qrlocker.s3-website.ap-south-1.amazonaws.com/login',
          color: '#9932CC',
          bgColor: '#F3E6FF',
        },
        {
          icon: CameraAltIcon,
          title: 'Snapcheck',
          path: 'http://snapcheckv1.s3-website.ap-south-1.amazonaws.com/login',
          color: '#FF8C69',
          bgColor: '#FFF2ED',
        },
        {
          icon: TaskManagementIcon,
          title: 'Task Management',
          path: '#',
          color: '#228B22',
          bgColor: '#E6F7E6',
        },
      ],
    },
  ];

  const isLargerThan1390 = useMediaQuery('(min-width: 1390px)');
  const isLargerThan1000 = useMediaQuery('(min-width: 1000px)');

  const handleCardClick = (path) => {
    if (!path) return;
    if (/^https?:\/\//i.test(path)) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  return (
    <Box
      sx={{ minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        display="flex"
        width="100%"
        height="auto"
        flexDirection="column"
        alignItems="start"
        p="0rem 1rem"
      >
        {/* Header */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          sx={{ my: 4, textAlign: 'center' }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: 1,
              background: 'linear-gradient(180deg, #E08272, rgba(138, 44, 55, 0.63))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Welcome To The <span style={{ color: 'inherit' }}>Rabs Industries</span>
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Advanced AI-powered monitoring and detection system
          </Typography>
        </Box>

        {/* Role-filtered categories */}
        <Grid container spacing={4} mb={4}>
          {visibleCategories.map((cat, i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ backgroundColor: '#f9fafb', borderRadius: 2, boxShadow: 2 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" color="#282828">
                      {cat.title}
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container spacing={3}>
                    {cat.items.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                          <Card
                            variant="outlined"
                            onClick={() => handleCardClick(item.path)}
                            sx={{
                              cursor: 'pointer',
                              borderRadius: 2,
                              transition: '0.3s',
                              '&:hover': {
                                boxShadow: 3,
                                borderColor: item.color,
                                transform: 'translateY(-2px)',
                                '& .view-details': {
                                  color: item.color,
                                  transform: 'translateX(4px)',
                                },
                              },
                            }}
                          >
                            <CardContent>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                              >
                                <Box
                                  sx={{
                                    width: 39,
                                    height: 39,
                                    borderRadius: '50%',
                                    backgroundColor: item.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Icon style={{ color: item.color, fontSize: '22px' }} />
                                </Box>
                              </Box>
                              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                {item.title}
                              </Typography>
                              <Box
                                className="view-details"
                                display="flex"
                                alignItems="center"
                                color="text.secondary"
                                sx={{ transition: 'all 0.3s ease' }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ mr: 0.5, transition: 'color 0.3s ease' }}
                                >
                                  View details
                                </Typography>
                                <ChevronRightIcon
                                  fontSize="small"
                                  sx={{ transition: 'transform 0.3s ease' }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* External tools (visible only to admin) */}
        {isAdmin && (
          <Grid container spacing={4} mb={4}>
            {redirectLinks.map((cat, i) => (
              <Grid item xs={12} key={i}>
                <Card sx={{ backgroundColor: '#f9fafb', borderRadius: 2, boxShadow: 2 }}>
                  <CardHeader
                    title={
                      <Typography variant="h6" color="#282828">
                        {cat.title}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      {cat.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card
                              variant="outlined"
                              onClick={() => handleCardClick(item.path)}
                              sx={{
                                cursor: 'pointer',
                                borderRadius: 2,
                                transition: '0.3s',
                                '&:hover': {
                                  boxShadow: 3,
                                  borderColor: item.color,
                                  transform: 'translateY(-2px)',
                                  '& .view-details': {
                                    color: item.color,
                                    transform: 'translateX(4px)',
                                  },
                                },
                              }}
                            >
                              <CardContent>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={1}
                                >
                                  <Box
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: '50%',
                                      backgroundColor: item.bgColor,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Icon style={{ color: item.color, fontSize: '18px' }} />
                                  </Box>
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                  {item.title}
                                </Typography>
                                <Box
                                  className="view-details"
                                  display="flex"
                                  alignItems="center"
                                  color="text.secondary"
                                  sx={{ transition: 'all 0.3s ease' }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ mr: 0.5, transition: 'color 0.3s ease' }}
                                  >
                                    View details
                                  </Typography>
                                  <ChevronRightIcon
                                    fontSize="small"
                                    sx={{ transition: 'transform 0.3s ease' }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Graphs + Camera table (visible only to admin) */}
        {isAdmin && (
          <Box
            display="flex"
            flexDirection={isLargerThan1390 ? 'row' : 'column'}
            justifyContent="space-between"
            alignItems="start"
            width="100%"
            mt="1.4rem"
          >
            {/* Graphs */}
            <Box
              display="flex"
              minHeight="30rem"
              flex={1}
              flexDirection="column"
              bgcolor="white"
              p="1rem"
              borderRadius="8px"
              sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 3px 8px' }}
            >
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
              >
                <Typography fontSize="1.4rem" fontWeight={500} color="#181818">
                  <BsGraphUp style={{ color: 'tomato', marginRight: '1rem', fontSize: '1.8rem' }} />
                  Model-wise Detection Overview:
                </Typography>

                <TextField
                  size="small"
                  label="Select Date"
                  sx={{ width: '18rem' }}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Box>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '1rem',
                  maxHeight: '27rem',
                  overflowY: 'auto',
                  gap: '1rem',
                }}
              >
                {graphData.length > 0 ? (
                  graphData.map((camera, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '1rem',
                        borderRadius: '9px',
                        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',
                      }}
                    >
                      <Box
                        display="flex"
                        width="100%"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{camera.category}</p>
                      </Box>

                      <PieChart width={280} height={220}>
                        <Pie
                          data={(camera.cameras || []).map((c) => ({
                            ...c,
                            name: c.camera_id || c.name || 'Unknown',
                            totalDetections: Array.isArray(c.images) ? c.images.length : 0,
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="totalDetections"
                          nameKey="name"
                        >
                          {(camera.cameras || []).map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value} detections`,
                            `Camera: ${props?.payload?.name ?? 'Unknown'}`,
                          ]}
                        />
                        <Legend />
                      </PieChart>

                      {/* Legend below */}
                      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                          {(camera.cameras || []).map((c, idx) => (
                            <li
                              key={`legend-item-${idx}`}
                              style={{ marginBottom: '6px', color: COLORS[idx % COLORS.length] }}
                            >
                              {`CameraId ${c.camera_id}: ${
                                Array.isArray(c.images) ? c.images.length : 0
                              } detections`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '1.1rem', color: 'grey', marginTop: '2rem' }}>
                    No Data found for {date}
                  </p>
                )}
              </div>
            </Box>

            {/* Camera Details */}
            <Box
              display="flex"
              flexDirection="column"
              width={isLargerThan1390 ? '34%' : '100%'}
              ml={isLargerThan1390 ? '1rem' : 0}
              mt={isLargerThan1390 ? 0 : '2rem'}
            >
              <Box
                width="100%"
                bgcolor="white"
                p="0.7rem"
                borderRadius="6px"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  width="100%"
                  justifyContent="space-between"
                  mb="0.5rem"
                >
                  <Typography fontSize="1.2rem" borderBottom="1px solid grey">
                    Camera Details:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsOpen('open-add')}
                    sx={{
                      p: '0.4rem 0.9rem',
                      fontSize: isLargerThan1000 ? '0.8rem' : '0.7rem',
                      ml: 'auto',
                    }}
                  >
                    Add Camera
                  </Button>
                </Box>

                <Paper sx={{ width: '100%', maxHeight: '25.3rem', overflow: 'auto' }}>
                  <TableContainer component={Paper} sx={{ maxHeight: '25rem' }}>
                    <Table aria-label="camera table" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Sr No</TableCell>
                          <TableCell sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            Camera Id
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            Rtsp Link
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Model</TableCell>
                          <TableCell sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            Delete
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allCameras?.length ? (
                          allCameras.map((elem, index) => (
                            <TableRow key={`${elem?.camera_id}-${index}`}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{elem?.camera_id}</TableCell>
                              <TableCell>
                                <Box
                                  width="12rem"
                                  p="0 0.5rem"
                                  sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
                                >
                                  {elem?.rtsp_link}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <span
                                  style={{
                                    backgroundColor: 'rgb(92, 126, 100)',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9px',
                                    color: 'white',
                                  }}
                                >
                                  {elem?.model}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{ bgcolor: '#CE9E9D', '&:hover': { bgcolor: '#c78e8d' } }}
                                  onClick={() => handleDelete(elem?.camera_id, elem?.model)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Typography p="1rem">No camera found</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
