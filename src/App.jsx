import { useEffect, useState } from 'react';
import './App.css';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import Sidebar from './component/Sidebar/Sidebar';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Auth from './pages/Auth/Auth';
import Home from './pages/Dashboard/Dashboard';
import Navbar from './component/Navbar/Navbar';
import MultiStream from './pages/MultiStream/MultiStream';
import SingleStream from './pages/SingleStream/SingleStream';
import AddCamera from './component/CameraActions/AddCamera';
import RemoveCamera from './component/CameraActions/RemoveCamera';
import Dashboard from './pages/Dashboard/Dashboard';
import Fire from './pages/Detection/Fire';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import { loginSuccess, logout } from './Redux/Actions/authAction';
import Ppe from './pages/Detection/Ppe';
import React from 'react';
import UnderConstruction from './component/UnderConstruction';
import { fetchCameras } from './Redux/Actions/cameraAction';
import Smoke from './pages/Detection/Smoke';
import Truck from './pages/Detection/Truck';
import { Scale } from '@mui/icons-material';
import { IoMdClose } from 'react-icons/io';
import FgStock from './pages/Boards/FgStock/FgStock';
import StoreStock from './pages/Boards/StoreStock/StoreStock';
import FourM from './pages/Boards/FourM/FourM';
import ToolManage from './pages/Boards/ToolManage/ToolManage';
import BracketD from './pages/Detection/BracketD/BracketD';
import DojoEmployee from './pages/Dojo/DojoEmployee.jsx';
import DojoL1 from './pages/Dojo/DojoL1.jsx';
import DojoL2 from './pages/Dojo/DojoL2.jsx';
import EmployeeDetails from './pages/Dojo/EmployeeDetails.jsx';
import Complaint from './pages/Boards/Complaint/Complaint';
import BracketE from './pages/Detection/BracketE/BracketE';
import Dashboard2 from './pages/Dashboard/Dashboard2';
import UserProfile from './pages/UserProfile/UserProfile';
import PasswordReset from './pages/UserProfile/PasswordReset';
import TempPasswordGenerator from './pages/UserProfile/TempPasswordGenerator';
import UserManagement from './pages/UserProfile/UserManagement';
import MidSidebar from './component/Sidebar/MidSidebar';
import { MdMenu } from 'react-icons/md';
import MonthlyFgStock from './pages/Boards/FgStock/MonthlyFgStock';
import MonthlyFgStockNew from './pages/Boards/FgStock/MonthlyFgStockNew';
import MonthlyRejection from './pages/Boards/Rejection/RejectionMonthly';
import MonthlyStoreStock from './pages/Boards/StoreStock/MonthlyStoreStock';
import MonthlyStoreStockNew from './pages/Boards/StoreStock/MonthlyStoreStockNew';
import Rejection from './pages/Boards/Rejection/Rejection';
import Production from './pages/Boards/Production/Production';
import PesCoverA from './pages/Detection/PesCover/PesCoverA';
import PesCoverB from './pages/Detection/PesCoverB/PesCoverB';
// import Dashboard2 from './pages/Dashboard/Dashboard2'

// import Sidebar from './component/Sidebar/Sidebar'

function App() {
  const { token, userData } = useSelector((state) => state.auth);
  console.log(token, userData);
  //  const [isLoggedIn, setIsLoggedIn]= useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  console.log(isSliderOpen);
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(userData);
  //   useEffect(() => {
  //     const token = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
  //     const storedUserData = localStorage.getItem('rabsUser'); // Retrieve persisted user data

  //     if (token) {
  //         const userData = storedUserData ? JSON.parse(storedUserData) : jwtDecode(token);
  //         dispatch(loginSuccess(token, userData)); // Initialize Redux state
  //     }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
    const storedUserData = localStorage.getItem('rabsUser');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired - trigger logout
          dispatch(logout());
          localStorage.removeItem('rabsToken');
          localStorage.removeItem('rabsUser');
        } else {
          // Token is valid - load user
          const userData = storedUserData ? JSON.parse(storedUserData) : decodedToken;
          dispatch(loginSuccess(token, userData));
        }
      } catch (error) {
        console.error('Invalid token:', error);
        dispatch(logout());
        localStorage.removeItem('rabsToken');
        localStorage.removeItem('rabsUser');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    console.log(token);
    dispatch(fetchCameras(token));
  }, [dispatch, token]);
  // const token= JSON.parse(localStorage.getItem('rabsToken'));
  // if(token){
  //   const decoded= jwtDecode(token)
  //   console.log(decoded)
  //   const currentTime = Date.now() / 1000; // in seconds

  // if (decoded.exp && decoded.exp < currentTime) {
  //   console.log("Token is expired");
  //   localStorage.removeItem("rabsToken");
  //   navigate("/auth"); // or your logic
  // }
  // }

  // -------------------screens----------------
  const isLargerThan1000 = useMediaQuery('(min-width: 1000px)');

  return (
    <Box bgcolor={'lightpink'} display={'flex'} height="100vh" position={'relative'}>
      {/* Static Sidebar with Fixed Width */}
      {/* <Box width="13vw" bgcolor="blue"> */}
      {/* <Box position={'absolute'} top={0} left={0} height={'100vh'} width={'100vw'} zIndex={99} bgcolor={'rgba(0, 0, 0, 0.6)'}> */}
      {
        path !== 'auth' && isLargerThan1000 && <Sidebar />
        // <Box position={'relative'} display={!isSliderOpen && 'none'}><Button sx={{position: 'absolute', top: '1rem', right: '0', zIndex: '999'}} onClick={()=> setIsSliderOpen(true)}>close</Button>
        //   <Sidebar /></Box>
      }
      {/* </Box> */}
      {/* {
  (isSliderOpen && !isLargerThan1000)  &&  */}
      {/* <Box className={`asideBack ${isSliderOpen? 'open': ''}`} onClick={()=> setIsSliderOpen(false)} > */}
      {/* <Box> */}
      {path !== 'auth' && !isLargerThan1000 && (
        <Box
          className={`aside ${isSliderOpen ? 'open' : ''}`}
          width={'15rem'}
          onClick={(e) => e.stopPropagation()}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '0',
              zIndex: '1000',
              color: 'white',
              bgcolor: 'red',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setIsSliderOpen(false)}
          >
            <IoMdClose />
          </Box>
          <MidSidebar setIsSliderOpen={setIsSliderOpen} />
        </Box>
      )}

      {/* </Box> */}

      {/* </Box> */}
      {/* } */}

      {/* </Box> */}

      {/* </Box> */}

      {/* Main Content Area */}
      <Box flex={1} sx={{ overflowY: 'scroll', bgcolor: 'white', backgroundColor: '#F3F4F6' }}>
        {/* Fixed Navbar */}
        {/* <Box flex={1} bgcolor={'red'}>dd */}
        {/* {isLargerThan1000 && path !== 'auth' && <Navbar setIsOpen={setIsOpen} setIsSliderOpen={setIsSliderOpen} />} */}
        {!isLargerThan1000 && path !== 'auth' && (
          <MdMenu
            style={{
              fontSize: '1.5rem',
              marginRight: '1rem',
              position: 'fixed',
              left: '1rem',
              top: '1rem',
            }}
            onClick={() => setIsSliderOpen(true)}
          />
        )}

        {/* </Box> */}

        {/* Routes with padding to avoid overlapping with fixed navbar */}
        <Box mt="0px" p={path == 'auth' ? '0rem' : '1rem 0.5rem'}>
          <Routes>
            <Route path="/auth" element={token ? <Navigate to="/" replace /> : <Auth />} />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  {/* <PasswordReset />
              <TempPasswordGenerator />
              <UserProfile /> */}
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/multi-stream" element={<MultiStream />} />
            <Route path="/single-stream/:id" element={<SingleStream />} />
            <Route path="/fire" element={<Fire />} /> */}
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard setIsOpen={setIsOpen} />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/" element={<ProtectedRoute><Dashboard2 setIsOpen={setIsOpen} /></ProtectedRoute>} /> */}
            {/* <Route path="/multi-stream" element={<ProtectedRoute><MultiStream /></ProtectedRoute>} /> */}
            <Route
              path="/multi-stream/:model"
              element={
                <ProtectedRoute>
                  <MultiStream />
                </ProtectedRoute>
              }
            />
            <Route
              path="/single-stream"
              element={
                <ProtectedRoute>
                  <SingleStream />
                </ProtectedRoute>
              }
            />
            <Route
              path="/single-stream/:model/:cameraId"
              element={
                <ProtectedRoute>
                  <SingleStream />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ppe-kit"
              element={
                <ProtectedRoute>
                  <Ppe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fire"
              element={
                <ProtectedRoute>
                  <Fire />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smoke"
              element={
                <ProtectedRoute>
                  <Smoke />
                </ProtectedRoute>
              }
            />
            <Route
              path="/truck"
              element={
                <ProtectedRoute>
                  <Truck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bracket-d"
              element={
                <ProtectedRoute>
                  <BracketD />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dojo-employee"
              element={
                <ProtectedRoute>
                  <DojoEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dojo-l1"
              element={
                <ProtectedRoute>
                  <DojoL1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dojo-l2"
              element={
                <ProtectedRoute>
                  <DojoL2 />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/:userId"
              element={
                <ProtectedRoute>
                  <EmployeeDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bracket-e"
              element={
                <ProtectedRoute>
                  <BracketE />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pes-cover-a"
              element={
                <ProtectedRoute>
                  <PesCoverA />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pes-cover-b"
              element={
                <ProtectedRoute>
                  <PesCoverB />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fg-stock"
              element={
                <ProtectedRoute>
                  <FgStock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store-stock"
              element={
                <ProtectedRoute>
                  <StoreStock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tool-management"
              element={
                <ProtectedRoute>
                  <ToolManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaint-board"
              element={
                <ProtectedRoute>
                  <Complaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rejection"
              element={
                <ProtectedRoute>
                  <Rejection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/production"
              element={
                <ProtectedRoute>
                  <Production />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monthly-fg-stock"
              element={
                <ProtectedRoute>
                  <MonthlyFgStockNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-rejection"
              element={
                <ProtectedRoute>
                  <MonthlyRejection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-store-stock"
              element={
                <ProtectedRoute>
                  <MonthlyStoreStockNew />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/4m-change" element={<ProtectedRoute><FourM /></ProtectedRoute>} /> */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>

      {(isOpen == 'open-add' || isOpen == 'open-remove') && (
        <Box
          bgcolor={'rgba(0, 0, 0, 0.6)'}
          position={'fixed'}
          height={'100vh'}
          width={'100vw'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          zIndex={9}
          onClick={() => setIsOpen(false)}
        >
          {isOpen == 'open-add' && <AddCamera setIsOpen={setIsOpen} />}
          {isOpen == 'open-remove' && <RemoveCamera setIsOpen={setIsOpen} />}
        </Box>
      )}
    </Box>
  );
}

export default App;
