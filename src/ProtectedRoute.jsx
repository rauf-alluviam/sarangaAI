import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from 'react'


const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/auth" replace />;
// setTimeout(()=>{
//   return <Navigate to="/auth" replace />;
// }, 200)
    
  }

  return children;
};

export default ProtectedRoute;
