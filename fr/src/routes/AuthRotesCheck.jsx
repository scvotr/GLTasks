import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthProvider'

export const AuthRotesCheck = ({ component: Component }) => {
  const currentUser = useAuthContext()
  return (
    <>
      {!currentUser.login ? (
        <>
          <Component />
        </>
      ) : (
        <>
          <Navigate to="/" replace />
        </>
      )}
    </>
  )
}