import { ServiceType } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/ServiceType/ServiceType'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorServiceTypeList = [
  {
    path: '/admin/devices/motor/serviceType',
    element: <PrivateRoutesCheck component={ServiceType} roles={['admin']} />,
  },
]
