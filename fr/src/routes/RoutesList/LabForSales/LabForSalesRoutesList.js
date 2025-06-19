import { LabAnalyticsMain } from '../../../components/Navigation/User/Menu/LabForSales/LabAnalytics/LabAnalyticsMain'
import { LabForSalesMain } from '../../../components/Navigation/User/Menu/LabForSales/LabForSalesMain'
import { LabRequestForAvailability } from '../../../components/Navigation/User/Menu/LabForSales/LabRequestForAvailability'
import { ReqLabForSalesClosed } from '../../../components/Navigation/User/Menu/LabForSales/ReqLabForSalesClosed'
import { PrivateRoutesCheck } from '../../PrivateRoutesCheck'

export const LabForSalesRoutesList = [
  {
    path: '/labForSales',
    element: <PrivateRoutesCheck component={LabForSalesMain} roles={['chife', 'user', 'general']} position={[4, 2, 33, 47, 15, 16, 27, 28]} />,
  },
  {
    path: '/labForSales/closed',
    element: <PrivateRoutesCheck component={ReqLabForSalesClosed} roles={['chife', 'user', 'general']} position={[4, 2, 33, 47, 15, 16, 27, 28]} />,
  },
  {
    path: '/labForSales/analytics',
    element: <PrivateRoutesCheck component={LabAnalyticsMain} roles={['chife', 'user', 'general']} position={[2, 33, 47]} />,
  },
  {
    path: '/labForSales/requestForAvailability',
    element: <PrivateRoutesCheck component={LabRequestForAvailability} roles={['chife', 'user', 'general']} position={[4, 2, 33, 47, 15, 16, 27, 28]} />,
  },
]
