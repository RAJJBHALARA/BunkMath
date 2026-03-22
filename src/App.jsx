import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProfileScreen from './pages/ProfileScreen'
import SetupScreen from './pages/SetupScreen'
import StatsScreen from './pages/StatsScreen'
import LoginScreen from './pages/LoginScreen'
import { AuthProvider, useAuth } from './context/AuthContext'

const STORAGE_KEY = 'iqSetup'

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e13] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return currentUser ? children : <Navigate replace to="/login" />
}

function StartRoute() {
  const [targetRoute, setTargetRoute] = useState(null)

  useEffect(() => {
    const hasSetup = Boolean(localStorage.getItem(STORAGE_KEY))
    setTargetRoute(hasSetup ? '/dashboard' : '/setup')
  }, [])

  if (!targetRoute) {
    return null
  }

  return <Navigate replace to={targetRoute} />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<LoginScreen />} path="/login" />
        <Route 
          element={
            <PrivateRoute>
              <StartRoute />
            </PrivateRoute>
          } 
          path="/" 
        />
        <Route 
          element={
            <PrivateRoute>
              <SetupScreen />
            </PrivateRoute>
          } 
          path="/setup" 
        />
        <Route 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
          path="/dashboard" 
        />
        <Route 
          element={
            <PrivateRoute>
              <StatsScreen />
            </PrivateRoute>
          } 
          path="/stats" 
        />
        <Route 
          element={
            <PrivateRoute>
              <ProfileScreen />
            </PrivateRoute>
          } 
          path="/profile" 
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AuthProvider>
  )
}
