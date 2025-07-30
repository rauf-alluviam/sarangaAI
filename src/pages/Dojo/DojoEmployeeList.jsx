// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardHeader,
//   Avatar,
//   Grid,
//   CircularProgress,
//   Alert,
//   Chip,
// } from '@mui/material';
// import { Person as PersonIcon, Cake as CakeIcon, Phone as PhoneIcon } from '@mui/icons-material';

// const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_all_trainees_information`;

// const DojoEmployeeList = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [trainees, setTrainees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(API_URL, {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error('Network response was not ok');
//         return res.json();
//       })
//       .then((data) => {
//         setTrainees(data.trainees || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [token]);

//   const handleCardClick = (userId) => {
//     navigate(`/employee/${userId}`);
//   };

//   if (loading)
//     return (
//       <Container
//         maxWidth="lg"
//         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
//       >
//         <CircularProgress size={80} />
//       </Container>
//     );

//   if (error)
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography
//         variant="h3"
//         component="h1"
//         gutterBottom
//         align="center"
//         sx={{ fontWeight: 'bold', mb: 4 }}
//       >
//         Dojo Employee List
//       </Typography>

//       {trainees.length === 0 ? (
//         <Typography variant="h5" align="center">
//           No
//         </Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {trainees.map((trainee) => (
//             <Grid item xs={12} sm={6} md={4} key={trainee.user_id}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   cursor: 'pointer',
//                   '&:hover': {
//                     boxShadow: 6,
//                     transform: 'translateY(-4px)',
//                     transition: 'all 0.3s ease',
//                   },
//                 }}
//                 onClick={() => handleCardClick(trainee.user_id)}
//               >
//                 <CardHeader
//                   avatar={
//                     <Avatar sx={{ bgcolor: 'secondary.main' }}>
//                       <PersonIcon />
//                     </Avatar>
//                   }
//                   title={trainee.user_info.full_name || 'N/A'}
//                   subheader={`ID: ${trainee.user_id}`}
//                 />
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="body2" color="text.secondary" gutterBottom>
//                     <CakeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     {trainee.user_info.dob || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" gutterBottom>
//                     <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     {trainee.user_info.phone || 'N/A'}
//                   </Typography>
//                   <Chip
//                     label={
//                       trainee.induction.completed ? 'Induction Completed' : 'Pending Induction'
//                     }
//                     color={trainee.induction.completed ? 'success' : 'warning'}
//                     size="small"
//                     sx={{ mt: 1 }}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default DojoEmployeeList;
import React from 'react';

const DojoEmployeeList = () => {
  return (
    <div>
      <h1>Dojo Employee List</h1>
      <p>This is the Dojo Employee List page.</p>
      {/* Add your employee list components here */}
    </div>
  );
};

export default DojoEmployeeList;
