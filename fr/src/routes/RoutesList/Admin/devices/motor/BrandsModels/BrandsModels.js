import { MotorBrands } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Characteristics/Brands/MotorBrands'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorBrandsModelsList = [
  {
    path: '/admin/devices/motor/brands',
    element: <PrivateRoutesCheck component={MotorBrands} roles={['admin']} />,
  },
]
