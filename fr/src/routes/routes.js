import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Authtorization/Login/Login";
import { Registration } from "../components/Authtorization/Registration/Registration";
import { RestorePassword } from "../components/Authtorization/RestorePassword/RestorePassword";
import { AuthRotes } from "./AuthRotes";
import { PrivateRoutes } from "./PrivateRoutes";
import { NewUsers } from "../components/Navigation/Admin/Menu/Users/NewUsers";
import { Users } from "../components/Navigation/Admin/Menu/Users/Users";
import { Struct } from "../components/Navigation/Admin/Menu/Struct/Struct";
import { NewStruct } from "../components/Navigation/Admin/Menu/Struct/NewStruct";
import { TasksMain } from "../components/Navigation/User/Menu/Tasks/TasksMain";
import { Tasks } from "../components/Navigation/Admin/Menu/Tasks/Tasks";
import { AllTasks } from "../components/Navigation/Admin/Menu/Tasks/AllTasks";
import { ClosedTask } from "../components/Navigation/User/Menu/Tasks/ClosedTask";
import { ChangePasPin } from "../components/Navigation/User/Menu/Tasks/UserSettings/ChangePasPin";
import { EditProfile } from "../components/Navigation/User/Menu/Tasks/UserSettings/EditProfile";
import { SettingsMain } from "../components/Navigation/User/Menu/Tasks/UserSettings/SettingsMain";


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
      {
        path: '/admin/struct',
        element: <PrivateRoutes component={Struct} roles={["admin"]}/>,
      },
      {
        path: '/admin/struct/new',
        element: <PrivateRoutes component={NewStruct} roles={["admin"]}/>,
      },
      {
        path: '/admin/tasks',
        element: <PrivateRoutes component={Tasks} roles={["admin"]}/>,
      },
      {
        path: '/admin/tasks/all',
        element: <PrivateRoutes component={AllTasks} roles={["admin"]}/>,
      },
      {
        path: '/tasks',
        element: <PrivateRoutes component={TasksMain} roles={["chife", "user"]}/>,
      },
      {
        path: '/tasks/closedTask',
        element: <PrivateRoutes component={ClosedTask} roles={["chife", "user"]}/>,
      },
      {
        path: '/settings',
        element: <PrivateRoutes component={SettingsMain} roles={["chife", "user"]}/>,
      },
      {
        path: '/settings/profile',
        element: <PrivateRoutes component={EditProfile} roles={["chife", "user"]}/>,
      },
      {
        path: '/settings/changePasPin',
        element: <PrivateRoutes component={ChangePasPin} roles={["chife", "user"]}/>,
      },
    ]
  }
])