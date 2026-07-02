import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { AuthContext } from '../context/AuthContext'

const AlreadyAuthMiddleware = () => {
  const { isLogged } = useContext(AuthContext)

  // Si ya inició sesión, lo mandamos al Home
  if (isLogged) {
    return <Navigate to="/home" replace />
  }

  // Si no está logueado, lo dejamos pasar a login/register
  return <Outlet />
}

export default AlreadyAuthMiddleware