import { ForElevator } from "./Tabs/v2/ForElevator"
import { ForOwners } from "./Tabs/v2/ForOwners"

const ELEVATOR_AE = "3"
const ELEVATOR_PE = "4"

// Утилита для проверки роли
const isElevatorUser = user => {
  if (!user || !user.dep) return false
  const department = String(user.dep)
  return department === ELEVATOR_AE || department === ELEVATOR_PE
}

export const LabForSalesView = ({ requests = [], currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen }) => {
  const isElevator = isElevatorUser(currentUser)

  return (
    <>
      {isElevator && (
        <ForElevator
          requests={requests}
          currentUser={currentUser}
          reRender={reRender}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
        />
      )}
      {!isElevator && (
        <ForOwners
          requests={requests}
          currentUser={currentUser}
          reRender={reRender}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
        />
      )}
    </>
  )
}
