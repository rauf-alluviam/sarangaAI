// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import React from 'react'


// const ProtectedRoute = ({ children }) => {
//   const { token } = useSelector((state) => state.auth);

//   if (!token) {
//     return <Navigate to="/auth" replace />;
// // setTimeout(()=>{
// //   return <Navigate to="/auth" replace />;
// // }, 200)
    
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { loginSuccess } from "./Redux/Actions/authAction";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("rabsToken")?.replace(/^"|"$/g, "");
    const storedUserData = localStorage.getItem("rabsUser");

    if (storedToken) {
      dispatch(loginSuccess(storedToken, JSON.parse(storedUserData)));
    }
    setIsInitialized(true);
  }, [dispatch]);

  if (!isInitialized) {
    return null; // Render nothing until initialization is complete
  }

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
