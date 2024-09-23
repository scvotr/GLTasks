import { BearingType } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Technical/BearingType/BearingType'
import { Dimensions } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Technical/Dimensions/Dimensions'
import { Mounting } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Technical/Mounting/Mounting'
import { Technical } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Technical/Technical'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorTechnicalList = [
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
]