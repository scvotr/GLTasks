import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthProvider'

export const AuthRotes = ({ component: Component }) => {
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