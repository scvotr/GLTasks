import { useEffect, useState } from "react"
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

export const LabForSalesView = ({ requests, currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen, isClosedView }) => {
  const isElevator = isElevatorUser(currentUser)
  const [data, setData] = useState([])

  useEffect(() => {
    if (!Array.isArray(requests) || !currentUser?.id) {
      setData([])
      return
    }
    const filteredData = requests.filter(req => {
      // Безопасный доступ к свойствам
      const users = req?.users || []
      const userStatus = users.find(user => user?.user_id === Number(currentUser.id))
      if (isClosedView) {
        // Для закрытых: статус closed И пользователь прочитал
        return req?.req_status === "closed" && userStatus?.read_status === "readed"
      } else {
        // Для открытых: статус не closed ИЛИ пользователь не прочитал
        return req?.req_status !== "closed" || userStatus?.read_status === "unread"
      }
    })
    setData(filteredData)
  }, [isClosedView, requests, currentUser?.id])

  return (
    <>
      {isElevator && (
        <ForElevator
          // requests={requests}
          requests={data}
          currentUser={currentUser}
          reRender={reRender}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
          isClosedView={isClosedView}
        />
      )}
      {!isElevator && (
        <ForOwners
          // requests={requests}
          requests={data}
          currentUser={currentUser}
          reRender={reRender}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
          isClosedView={isClosedView}
        />
      )}
    </>
  )
}
