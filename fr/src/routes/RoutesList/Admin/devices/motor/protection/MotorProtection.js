import { Brake } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/Brake/Brake'
import { ExplosionProof } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/ExplosionProof/ExplosionProof'
import { Protection } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/Protection'
import { ProtectionLevel } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Protection/ProtectionLevel/ProtectionLevel'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorProtectionList = [
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
]
