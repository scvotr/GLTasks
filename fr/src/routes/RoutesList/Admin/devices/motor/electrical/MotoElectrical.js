import { Amperage } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/amperage/Amperage'
import { CosF } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/cosF/CosF'
import { Efficiency } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/efficiency/Efficiency'
import { Electrical } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/Elecrical'
import { Power } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/power/Power'
import { Voltage } from '../../../../../../components/Navigation/Admin/Menu/Devices/Motors/Сharacteristics/Electrical/voltage/Voltage'
import { PrivateRoutesCheck } from '../../../../../PrivateRoutesCheck'

export const MotorElectricalRoutesList = [
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
]