import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Authtorization/Login/Login";
import { Registration } from "../components/Authtorization/Registration/Registration";
import { RestorePassword } from "../components/Authtorization/RestorePassword/RestorePassword";
import { AuthRotes } from "./AuthRotes";
import { PrivateRoutes } from "./PrivateRoutes";
import { NewUsers } from "../components/Navigation/Admin/Menu/Users/NewUsers";
import { Users } from "../components/Navigation/Admin/Menu/Users/Users";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/login',
        element: <AuthRotes component={Login} />,
      },
      {
        path: '/registration',
        element: <AuthRotes component={Registration} />,
      },
      {
        path: '/restorePassword',
        element: <RestorePassword />,
      },
      {
        path: '/admin/users',
        element: <PrivateRoutes component={Users} roles={["admin"]}/>,
      },
      {
        path: '/admin/users/new',
        element: <PrivateRoutes component={NewUsers} roles={["admin"]}/>,
      },
    ]
  }
])