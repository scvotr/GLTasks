import { Navigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthProvider"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"

export const PrivateRoutesCheck = ({ component: Component, roles: RequiredRoles, position: RequiredPosition = [] }) => {
  const currentUser = useAuthContext()
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem("currentRoute", location.pathname)
  }, [location])

  let renderCmp

  const hasRequiredPosition = RequiredPosition.includes(Number(currentUser.position))

  if (currentUser.login) {
    if (RequiredRoles.includes(currentUser.role) && hasRequiredPosition) {
      renderCmp = <Component />
    }
  } else {
    return <Navigate to="/" replace />
  }
  return <>{renderCmp}</>
}
