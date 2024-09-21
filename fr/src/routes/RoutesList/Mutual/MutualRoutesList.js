import { MutualVerificationArchive } from "../../../components/Navigation/User/Menu/MutualVerification/MutualVerificationArchive";
import { MutualVerificationDocs } from "../../../components/Navigation/User/Menu/MutualVerification/MutualVerificationDocs";
import { PrivateRoutesCheck } from "../../PrivateRoutesCheck";

export const MutualRoutesList = [
  {
    path: '/mutualVerification',
    element: <PrivateRoutesCheck component={MutualVerificationDocs} roles={['chife', 'user', 'general']} />,
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
