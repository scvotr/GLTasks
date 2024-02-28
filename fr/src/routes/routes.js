import App from "../App";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: []
  }
])