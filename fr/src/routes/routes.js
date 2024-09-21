import App from '../App'
import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../components/Authtorization/Login/Login'
import { Registration } from '../components/Authtorization/Registration/Registration'
import { RestorePassword } from '../components/Authtorization/RestorePassword/RestorePassword'
import { AuthRotesCheck } from './AuthRotesCheck'
import { PrivateRoutesCheck } from './PrivateRoutesCheck'
import { NewUsers } from '../components/Navigation/Admin/Menu/Users/NewUsers'
import { Users } from '../components/Navigation/Admin/Menu/Users/Users'
import { Struct } from '../components/Navigation/Admin/Menu/Struct/Struct'
import { NewStruct } from '../components/Navigation/Admin/Menu/Struct/NewStruct'
import { TasksMain } from '../components/Navigation/User/Menu/Tasks/TasksMain'
import { Tasks } from '../components/Navigation/Admin/Menu/Tasks/Tasks'
import { AllTasks } from '../components/Navigation/Admin/Menu/Tasks/AllTasks'
import { ClosedTask } from '../components/Navigation/User/Menu/Tasks/ClosedTask'
import { GeneralTasksMain } from '../components/Navigation/User/Menu/Tasks/General/GeneralTasksMain'
import InstructionComponent from '../components/Layouts/DefaultLayoutMain/FAQ/InstructionComponent'
import { AnalyticsChart } from '../components/Navigation/User/Menu/Tasks/AnalyticsChart'
import { DocsMain } from '../components/Navigation/User/Menu/Docs/DocsMain'
import { DocsAtchive } from '../components/Navigation/User/Menu/Docs/DocsAtchive'
import { DocsOrdinance } from '../components/Navigation/User/Menu/Docs/DocsOrdinance'
import { SchedulMain } from '../components/Navigation/User/Menu/Schedule/SchedulMain'
import { SchedulsArchive } from '../components/Navigation/User/Menu/Schedule/SchedulsArchive'
import { UsersSchedules } from '../components/Navigation/User/Menu/Schedule/UsersSchedules'
import { InfoNews } from '../components/Layouts/DefaultLayoutMain/FAQ/InfoNews'
import { TasksManualCmp } from '../components/Layouts/DefaultLayoutMain/Manual/TasksManualCmp'
import { LeadTasks } from '../components/Navigation/User/Menu/Tasks/LeadTasks'
import { AllTasksFromSubDep } from '../components/Navigation/User/Menu/Tasks/AllTasksFromSubDep'
import { HelpDeskTasks } from '../components/Navigation/User/Menu/Tasks/HelpDeskTasks'
import { AllTasksToSubDep } from '../components/Navigation/User/Menu/Tasks/AllTasksToSubDep'
import { QRGate } from '../components/Navigation/Admin/Menu/Machines/QRCode/QRGate'
import { DevicesAll, DevicesMain } from '../components/Navigation/Admin/Menu/Devices/DevicesAll'
import { CreateType } from '../components/Navigation/Admin/Menu/Devices/Type/CreateType'
import { CreateWorkshop } from '../components/Navigation/Admin/Menu/Devices/Workshops/CreateWorkshop'
import { DeviceMain } from '../components/Navigation/Admin/Menu/Devices/DeviceMain'
import { CreateMotor } from '../components/Navigation/Admin/Menu/Devices/Motors/CreateMotor'
import { AuthRoutesList } from './RoutesList/Auth/AuthRoutesList'
import { MotorElectricalRoutesList } from './RoutesList/Admin/devices/motor/electrical/MotoElectrical'
import { MotorMechanicalRoutesList } from './RoutesList/Admin/devices/motor/mechanical/MotorMechanical'
import { MotorProtectionList } from './RoutesList/Admin/devices/motor/protection/MotorProtection'
import { MotorTechnicalList } from './RoutesList/Admin/devices/motor/technical/MotorTechnical'
import { MotorServiceTypeList } from './RoutesList/Admin/devices/motor/serviceType/MotorServiceType'
import { UserSettingsRoutesList } from './RoutesList/User/settings/UserSettingsRoutesList'
import { MutualRoutesList } from './RoutesList/Mutual/MutualRoutesList'

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
        path: '/restorePassword',
        element: <RestorePassword />,
      },
      ...AuthRoutesList,
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
      // ------------------------------------13-09-2024
      {
        path: '/admin/devices/:devicesId',
        element: <PrivateRoutesCheck component={QRGate} roles={['chife', 'user', 'admin']} />,
      },
      // !-----------------------------------------
      {
        path: '/admin/devices/main',
        element: <PrivateRoutesCheck component={DeviceMain} roles={['admin']} />,
      },
      {
        path: '/admin/devices/all',
        element: <PrivateRoutesCheck component={DevicesAll} roles={['admin']} />,
      },
      {
        path: '/admin/devices/type/createType',
        element: <PrivateRoutesCheck component={CreateType} roles={['admin']} />,
      },
      {
        path: '/admin/devices/workshop/createWorkshop',
        element: <PrivateRoutesCheck component={CreateWorkshop} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motors/createMotor',
        element: <PrivateRoutesCheck component={CreateMotor} roles={['admin']} />,
      },
      // !-----------------------------------------
      ...MotorElectricalRoutesList,
      ...MotorMechanicalRoutesList,
      ...MotorProtectionList,
      ...MotorTechnicalList,
      ...MotorServiceTypeList,
      // !-----------------------------------------
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
      ...UserSettingsRoutesList,
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
      ...MutualRoutesList
    ],
  },
])
