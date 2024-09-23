import { ChangePasPin } from '../../../../components/Navigation/User/Menu/Tasks/UserSettings/ChangePasPin'
import { EditProfile } from '../../../../components/Navigation/User/Menu/Tasks/UserSettings/EditProfile'
import { EmptyProfile } from '../../../../components/Navigation/User/Menu/Tasks/UserSettings/EmptyProfile'
import { SettingsMain } from '../../../../components/Navigation/User/Menu/Tasks/UserSettings/SettingsMain'
import { PrivateRoutesCheck } from '../../../PrivateRoutesCheck'

export const UserSettingsRoutesList = [
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
]
