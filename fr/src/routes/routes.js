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
import { EmptyProfile } from "../components/Navigation/User/Menu/Tasks/UserSettings/EmptyProfile";
import { GeneralTasksMain } from "../components/Navigation/User/Menu/Tasks/General/GeneralTasksMain";
import InstructionComponent from "../components/Layouts/DefaultLayoutMain/FAQ/InstructionComponent";
import { AnalyticsChart } from "../components/Navigation/User/Menu/Tasks/AnalyticsChart";
import { DocsMain } from "../components/Navigation/User/Menu/Docs/DocsMain";
import { DocsAtchive } from "../components/Navigation/User/Menu/Docs/DocsAtchive";
import { DocsOrdinance } from "../components/Navigation/User/Menu/Docs/DocsOrdinance";
import { SchedulMain } from "../components/Navigation/User/Menu/Schedule/SchedulMain";
import { SchedulsArchive } from "../components/Navigation/User/Menu/Schedule/SchedulsArchive";
import { UsersSchedules } from "../components/Navigation/User/Menu/Schedule/UsersSchedules";
import { MutualVerificationMain } from "../components/Navigation/User/Menu/MutualVerification/MutualVerificationMain";
import { MutualVerificationDocs } from "../components/Navigation/User/Menu/MutualVerification/MutualVerificationDocs";
import { MutualVerificationArchive } from "../components/Navigation/User/Menu/MutualVerification/MutualVerificationArchive";
import { InfoNews } from "../components/Layouts/DefaultLayoutMain/FAQ/InfoNews";
import { TasksManualCmp } from "../components/Layouts/DefaultLayoutMain/Manual/TasksManualCmp";


export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/main',
        element: <AuthRotes component={InfoNews} />,
      },
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
        path: '/main2',
        element: <PrivateRoutes component={InfoNews} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/manualTasks',
        element: <PrivateRoutes component={TasksManualCmp} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/tasks',
        element: <PrivateRoutes component={TasksMain} roles={["chife", "user"]}/>,
      },
      {
        path: '/general/tasks',
        element: <PrivateRoutes component={GeneralTasksMain} roles={["general"]}/>,
      },
      {
        path: '/tasks/closedTask',
        element: <PrivateRoutes component={ClosedTask} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/tasks/AnalyticsChart',
        element: <PrivateRoutes component={AnalyticsChart} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/settings',
        element: <PrivateRoutes component={SettingsMain} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/settings/profile',
        element: <PrivateRoutes component={EditProfile} roles={["chife", "user", "new", "general"]}/>,
      },
      {
        path: '/settings/changePasPin',
        element: <PrivateRoutes component={ChangePasPin} roles={["chife", "user", "new", "general"]}/>,
      },
      {
        path: '/settings/emptyProfile',
        element: <PrivateRoutes component={EmptyProfile} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/docs',
        element: <PrivateRoutes component={DocsMain} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/docs/docsArchive',
        element: <PrivateRoutes component={DocsAtchive} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/docs/ordinance',
        element: <PrivateRoutes component={DocsOrdinance} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/docs/ordinance',
        element: <PrivateRoutes component={DocsOrdinance} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/schedule',
        element: <PrivateRoutes component={SchedulMain} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/schedule/schedulesArchive',
        element: <PrivateRoutes component={SchedulsArchive} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/schedule/taskScheduler',
        element: <PrivateRoutes component={UsersSchedules} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/mutualVerification',
        element: <PrivateRoutes component={MutualVerificationMain} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/mutualVerification/docs',
        element: <PrivateRoutes component={MutualVerificationDocs} roles={["chife", "user", "general"]}/>,
      },
      {
        path: '/mutualVerification/archive',
        element: <PrivateRoutes component={MutualVerificationArchive} roles={["chife", "user", "general"]}/>,
      },
    ]
  }
])