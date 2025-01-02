import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to='/login' replace/>
}

export default ProtectRoute
