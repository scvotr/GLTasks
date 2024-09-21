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
import { ChangePasPin } from '../components/Navigation/User/Menu/Tasks/UserSettings/ChangePasPin'
import { EditProfile } from '../components/Navigation/User/Menu/Tasks/UserSettings/EditProfile'
import { SettingsMain } from '../components/Navigation/User/Menu/Tasks/UserSettings/SettingsMain'
import { EmptyProfile } from '../components/Navigation/User/Menu/Tasks/UserSettings/EmptyProfile'
import { GeneralTasksMain } from '../components/Navigation/User/Menu/Tasks/General/GeneralTasksMain'
import InstructionComponent from '../components/Layouts/DefaultLayoutMain/FAQ/InstructionComponent'
import { AnalyticsChart } from '../components/Navigation/User/Menu/Tasks/AnalyticsChart'
import { DocsMain } from '../components/Navigation/User/Menu/Docs/DocsMain'
import { DocsAtchive } from '../components/Navigation/User/Menu/Docs/DocsAtchive'
import { DocsOrdinance } from '../components/Navigation/User/Menu/Docs/DocsOrdinance'
import { SchedulMain } from '../components/Navigation/User/Menu/Schedule/SchedulMain'
import { SchedulsArchive } from '../components/Navigation/User/Menu/Schedule/SchedulsArchive'
import { UsersSchedules } from '../components/Navigation/User/Menu/Schedule/UsersSchedules'
import { MutualVerificationMain } from '../components/Navigation/User/Menu/MutualVerification/MutualVerificationMain'
import { MutualVerificationDocs } from '../components/Navigation/User/Menu/MutualVerification/MutualVerificationDocs'
import { MutualVerificationArchive } from '../components/Navigation/User/Menu/MutualVerification/MutualVerificationArchive'
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
import { Electrical } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/Elecrical'
import { Mechanical } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Mechanical/Mechanical'
import { Protection } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/Protection'
import { ProtectionLevel } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/ProtectionLevel/ProtectionLevel'
import { ExplosionProof } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/ExplosionProof/ExplosionProof'
import { Brake } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/Brake/Brake'
import { Technical } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Technical/Technical'
import { ServiceType } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/ServiceType/ServiceType'
import { Power } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/power/Power'
import { Voltage } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/voltage/Voltage'
import { Amperage } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/amperage/Amperage'
import { Efficiency } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/efficiency/Efficiency'
import { CosF } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/cosF/CosF'
import { RotationSpeed } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Mechanical/RotationSpeed/RotationSpeed'
import { Torque } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Mechanical/Torque/Torque'
import { Temperature } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Mechanical/Temperature/Temperature'
import { OperationMode } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Mechanical/OperationMode/OperationMode'
import { BearingType } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Technical/BearingType/BearingType'
import { Mounting } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Technical/Mounting/Mounting'
import { Dimensions } from '../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Technical/Dimensions/Dimensions'

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
      // !-----------------------------------------
      {
        path: '/admin/devices/motor/electrical',
        element: <PrivateRoutesCheck component={Electrical} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/electrical/power',
        element: <PrivateRoutesCheck component={Power} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/electrical/voltage',
        element: <PrivateRoutesCheck component={Voltage} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/electrical/amperage',
        element: <PrivateRoutesCheck component={Amperage} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/electrical/efficiency',
        element: <PrivateRoutesCheck component={Efficiency} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/electrical/cosF',
        element: <PrivateRoutesCheck component={CosF} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/mechanical',
        element: <PrivateRoutesCheck component={Mechanical} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/mechanical/rotationSpeed',
        element: <PrivateRoutesCheck component={RotationSpeed} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/mechanical/torque',
        element: <PrivateRoutesCheck component={Torque} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/mechanical/temperature',
        element: <PrivateRoutesCheck component={Temperature} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/mechanical/operationMode',
        element: <PrivateRoutesCheck component={OperationMode} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/protection',
        element: <PrivateRoutesCheck component={Protection} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/protection/protectionLevel',
        element: <PrivateRoutesCheck component={ProtectionLevel} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/protection/explosionProof',
        element: <PrivateRoutesCheck component={ExplosionProof} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/protection/brake',
        element: <PrivateRoutesCheck component={Brake} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/technical',
        element: <PrivateRoutesCheck component={Technical} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/technical/mounting',
        element: <PrivateRoutesCheck component={Mounting} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/technical/Dimensions',
        element: <PrivateRoutesCheck component={Dimensions} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/technical/bearingType',
        element: <PrivateRoutesCheck component={BearingType} roles={['admin']} />,
      },
      {
        path: '/admin/devices/motor/serviceType',
        element: <PrivateRoutesCheck component={ServiceType} roles={['admin']} />,
      },
      // !-----------------------------------------
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