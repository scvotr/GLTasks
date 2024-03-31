import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useLocalStorageRoute = () => {
  
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const savedRoute = localStorage.getItem("currentRoute")
    if (savedRoute && savedRoute !== location.pathname) {
      navigate(savedRoute)
    }
  }, [location, navigate])
}

export default useLocalStorageRoute