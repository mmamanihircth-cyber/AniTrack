import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { AuthContext } from '../context/AuthContext'

const AlreadyAuthMiddleware = () => {
  const { isLogged } = useContext(AuthContext)
  if (isLogged) {
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}

export default AlreadyAuthMiddleware