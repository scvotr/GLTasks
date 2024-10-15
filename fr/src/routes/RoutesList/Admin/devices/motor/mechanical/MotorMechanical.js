import { Mechanical } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Mechanical/Mechanical'
import { OperationMode } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Mechanical/OperationMode/OperationMode'
import { RotationSpeed } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Mechanical/RotationSpeed/RotationSpeed'
import { Temperature } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Mechanical/Temperature/Temperature'
import { Torque } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Mechanical/Torque/Torque'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorMechanicalRoutesList = [
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
]
