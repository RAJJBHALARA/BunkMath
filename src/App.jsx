import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProfileScreen from './pages/ProfileScreen'
import SetupScreen from './pages/SetupScreen'
import StatsScreen from './pages/StatsScreen'

const STORAGE_KEY = 'iqSetup'

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
    <Routes>
      <Route element={<StartRoute />} path="/" />
      <Route element={<SetupScreen />} path="/setup" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<StatsScreen />} path="/stats" />
      <Route element={<ProfileScreen />} path="/profile" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
