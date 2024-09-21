import { Login } from '../../components/Authtorization/Login/Login'
import { Registration } from '../../components/Authtorization/Registration/Registration'
import { AuthRotesCheck } from '../AuthRotesCheck'

export const AuthRoutesList = [
  {
    path: '/login',
    element: <AuthRotesCheck component={Login} />,
  },
  {
    path: '/registration',
    element: <AuthRotesCheck component={Registration} />,
  },
]
