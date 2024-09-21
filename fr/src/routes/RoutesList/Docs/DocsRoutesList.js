// DocsRoutesList.js

import { DocsArchive } from '../../../components/Navigation/User/Menu/Docs/DocsArchive';
import { DocsMain } from '../../../components/Navigation/User/Menu/Docs/DocsMain';
import { DocsOrdinance } from '../../../components/Navigation/User/Menu/Docs/DocsOrdinance';
import { PrivateRoutesCheck } from '../../PrivateRoutesCheck';


export const DocsRoutesList = [
  {
    path: '/docs',
    element: <PrivateRoutesCheck component={DocsMain} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/docs/docsArchive',
    element: <PrivateRoutesCheck component={DocsArchive} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/docs/ordinance',
    element: <PrivateRoutesCheck component={DocsOrdinance} roles={['chife', 'user', 'general']} />,
  },
];