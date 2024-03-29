import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthProvider'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const PrivateRoutes = ({ component: Component, roles: RequiredRoles }) => {
  const location = useLocation();
  

  useEffect(()=> {
    console.log(location)
    localStorage.setItem('currentRoute', location.pathname);
  }, [location])

  const currentUser = useAuthContext()
  let renderCmp

  if (currentUser.login) {
    if (RequiredRoles.includes(currentUser.role)) {
      renderCmp = <Component />
    }
  } else {
    return <Navigate to="/" replace />
  }
  return <>{renderCmp}</>
}
