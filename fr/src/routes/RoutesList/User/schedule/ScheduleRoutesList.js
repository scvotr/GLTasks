// ScheduleRoutesList.js
import { UsersSchedules } from '../../../../components/Navigation/User/Menu/Schedule/UsersSchedules'
import { ScheduleArchive } from '../../../../components/Navigation/User/Menu/Schedule/ScheduleArchive'
import { ScheduleMain } from '../../../../components/Navigation/User/Menu/Schedule/ScheduleMain'
import { PrivateRoutesCheck } from '../../../PrivateRoutesCheck'

export const ScheduleRoutesList = [
  {
    path: '/schedule',
    element: <PrivateRoutesCheck component={ScheduleMain} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/schedule/schedulesArchive',
    element: <PrivateRoutesCheck component={ScheduleArchive} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/schedule/taskScheduler',
    element: <PrivateRoutesCheck component={UsersSchedules} roles={['chife', 'user', 'general']} />,
  },
]
