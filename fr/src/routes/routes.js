import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Authtorization/Login/Login";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ]
  }
])