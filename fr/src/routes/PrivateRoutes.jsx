import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthProvider'

export const PrivateRoutes = ({ component: Component, roles: RequiredRoles }) => {
  const currentUser = useAuthContext()
  let renderCmp

  if (currentUser.login) {
    if (RequiredRoles.includes(currentUser.role)) {
      renderCmp = <Component />
    } else {
      return <Navigate to="/" replace />
    }
  }
  renderCmp = <Component />
  return <>{renderCmp}</>
}
