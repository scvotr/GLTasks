import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Authtorization/Login/Login";
import { Registration } from "../components/Authtorization/Registration/Registration";
import { RestorePassword } from "../components/Authtorization/RestorePassword/RestorePassword";
import { AuthRotes } from "./AuthRotes";
import { PrivateRoutes } from "./PrivateRoutesCheck';
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
import { LeadTasks } from "../components/Navigation/User/Menu/Tasks/LeadTasks";
import { AllTasksFromSubDep } from "../components/Navigation/User/Menu/Tasks/AllTasksFromSubDep";
import { HelpDeskTasks } from "../components/Navigation/User/Menu/Tasks/HelpDeskTasks";
import { AllTasksToSubDep } from "../components/Navigation/User/Menu/Tasks/AllTasksToSubDep";


export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/main',
        element: <AuthRotesCheck component={InfoNews} />,
      },
      {
        path: '/login',
        element: <AuthRotesCheck component={Login} />,
      },
      {
        path: '/registration',
        element: <AuthRotesCheck component={Registration} />,
      },
      {
        path: '/restorePassword',
        element: <RestorePassword />,
      },
      {
        path: '/admin/users',
        element: <PrivateRoutesCheck component={Users} roles={['admin']} />,
      },
      {
        path: '/admin/users/new',
        element: <PrivateRoutesCheck component={NewUsers} roles={['admin']} />,
      },
      {
        path: '/admin/struct',
        element: <PrivateRoutesCheck component={Struct} roles={['admin']} />,
      },
      {
        path: '/admin/struct/new',
        element: <PrivateRoutesCheck component={NewStruct} roles={['admin']} />,
      },
      {
        path: '/admin/tasks',
        element: <PrivateRoutesCheck component={Tasks} roles={['admin']} />,
      },
      {
        path: '/admin/tasks/all',
        element: <PrivateRoutesCheck component={AllTasks} roles={['admin']} />,
      },
      {
        path: '/main2',
        element: <PrivateRoutesCheck component={InfoNews} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/manualTasks',
        element: <PrivateRoutesCheck component={TasksManualCmp} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/tasks',
        element: <PrivateRoutesCheck component={TasksMain} roles={['chife', 'user']} />,
      },
      {
        path: '/general/tasks',
        element: <PrivateRoutesCheck component={GeneralTasksMain} roles={['general']} />,
      },
      {
        path: '/tasks/leadTasks',
        element: <PrivateRoutesCheck component={LeadTasks} roles={['chife']} />,
      },
      {
        path: '/tasks/allTasksFromSubDep',
        element: <PrivateRoutesCheck component={AllTasksFromSubDep} roles={['chife']} />,
      },
      {
        path: '/tasks/allTasksToSubDep',
        element: <PrivateRoutesCheck component={AllTasksToSubDep} roles={['chife']} />,
      },
      {
        path: '/tasks/helpDesk',
        element: <PrivateRoutesCheck component={HelpDeskTasks} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/tasks/closedTask',
        element: <PrivateRoutesCheck component={ClosedTask} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/tasks/AnalyticsChart',
        element: <PrivateRoutesCheck component={AnalyticsChart} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/settings',
        element: <PrivateRoutesCheck component={SettingsMain} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/settings/profile',
        element: <PrivateRoutesCheck component={EditProfile} roles={['chife', 'user', 'new', 'general']} />,
      },
      {
        path: '/settings/changePasPin',
        element: <PrivateRoutesCheck component={ChangePasPin} roles={['chife', 'user', 'new', 'general']} />,
      },
      {
        path: '/settings/emptyProfile',
        element: <PrivateRoutesCheck component={EmptyProfile} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/docs',
        element: <PrivateRoutesCheck component={DocsMain} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/docs/docsArchive',
        element: <PrivateRoutesCheck component={DocsAtchive} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/docs/ordinance',
        element: <PrivateRoutesCheck component={DocsOrdinance} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/docs/ordinance',
        element: <PrivateRoutesCheck component={DocsOrdinance} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/schedule',
        element: <PrivateRoutesCheck component={SchedulMain} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/schedule/schedulesArchive',
        element: <PrivateRoutesCheck component={SchedulsArchive} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/schedule/taskScheduler',
        element: <PrivateRoutesCheck component={UsersSchedules} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/mutualVerification',
        element: <PrivateRoutesCheck component={MutualVerificationMain} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/mutualVerification/docs',
        element: <PrivateRoutesCheck component={MutualVerificationDocs} roles={['chife', 'user', 'general']} />,
      },
      {
        path: '/mutualVerification/archive',
        element: <PrivateRoutesCheck component={MutualVerificationArchive} roles={['chife', 'user', 'general']} />,
      },
    ]
  }
])
