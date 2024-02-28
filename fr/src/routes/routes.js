import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Authtorization/Login/Login";
import { Registration } from "../components/Authtorization/Registration/Registration";
import { RestorePassword } from "../components/Authtorization/RestorePassword/RestorePassword";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/registration',
        element: <Registration />,
      },
      {
        path: '/restorePassword',
        element: <RestorePassword />,
      },
    ]
  }
])