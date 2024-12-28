import { ElevatorTabs } from "./Tabs/ElevatorTabs"
import { OwnersTabs } from "./Tabs/OwnersTabs"

const ELEVATOR_AE = "3"
const ELEVATOR_PE = "4"

export const ReqForLabMain = ({ requests = [], currentUser, reRender, addNewRequest, approvedRequest, resetApprovedRequest, resetAddNewRequest }) => {
  const isElevator = currentUser.dep.toString() === ELEVATOR_AE || currentUser.dep.toString() === ELEVATOR_PE

  return (
    <>
      {isElevator && (
        <ElevatorTabs
          requests={requests}
          currentUser={currentUser}
          reRender={reRender}
          approvedRequest={approvedRequest}
          resetApprovedRequest={resetApprovedRequest}
          resetAddNewRequest={resetAddNewRequest}
        />
      )}
      {!isElevator && (
        <OwnersTabs
          requests={requests}
          currentUser={currentUser}
          reRender={reRender}
          addNewRequest={addNewRequest}
          approvedRequest={approvedRequest}
          resetApprovedRequest={resetApprovedRequest}
          resetAddNewRequest={resetAddNewRequest}
        />
      )}
    </>
  )
}
