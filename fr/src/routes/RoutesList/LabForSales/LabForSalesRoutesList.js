import { LabForSalesMain } from "../../../components/Navigation/User/Menu/LabForSales/LabForSalesMain";
import { LabRequestForAvailability } from "../../../components/Navigation/User/Menu/LabForSales/LabRequestForAvailability";
import { MutualVerificationArchive } from "../../../components/Navigation/User/Menu/MutualVerification/MutualVerificationArchive";
import { MutualVerificationDocs } from "../../../components/Navigation/User/Menu/MutualVerification/MutualVerificationDocs";
import { PrivateRoutesCheck } from "../../PrivateRoutesCheck";

export const LabForSalesRoutesList = [
  {
    path: '/labForSales',
    element: <PrivateRoutesCheck component={LabForSalesMain} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/labForSales/requestForAvailability',
    element: <PrivateRoutesCheck component={LabRequestForAvailability} roles={['chife', 'user', 'general']} />,
  },
  {
    path: '/labForSales/archive',
    element: <PrivateRoutesCheck component={MutualVerificationArchive} roles={['chife', 'user', 'general']} />,
  },
]