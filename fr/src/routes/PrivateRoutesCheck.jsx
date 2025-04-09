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
  // Проверяем, требуется ли вообще проверка position
  const shouldCheckPosition = RequiredPosition.length > 0
  // Основные проверки доступа
  const hasRequiredRole = RequiredRoles.includes(currentUser.role)
  const hasRequiredPosition = shouldCheckPosition ? RequiredPosition.includes(Number(currentUser.position)) : true // Если position не требуется, считаем проверку пройденной

  if (!currentUser.login) {
    return <Navigate to="/" replace />
  }

  if (!hasRequiredRole) {
    // Можно добавить редирект на страницу "Доступ запрещен"
    return <Navigate to="/" replace />
  }

  if (shouldCheckPosition && !hasRequiredPosition) {
    return <div>404</div>
  }

  return <Component />
}

// export const PrivateRoutesCheck = ({ component: Component, roles: RequiredRoles, position: RequiredPosition = [] }) => {
//   const currentUser = useAuthContext()
//   const location = useLocation()

//   useEffect(() => {
//     localStorage.setItem("currentRoute", location.pathname)
//   }, [location])

//   let renderCmp
//   const hasRequiredRole = RequiredRoles.includes(currentUser.role);
//   const hasRequiredPosition = RequiredPosition.includes(Number(currentUser.position))

//   const hasPosition = Boolean(hasRequiredRole &&  hasRequiredPosition && RequiredPosition)
//   console.log("🚀 ~ PrivateRoutesCheck ~ hasPosition:", hasPosition)

//   if (currentUser.login) {
//     if (RequiredRoles.includes(currentUser.role)) {
//       renderCmp = <Component />
//     }
//   } else {
//     return <Navigate to="/" replace />
//   }
//   return <>{renderCmp}</>
// }
