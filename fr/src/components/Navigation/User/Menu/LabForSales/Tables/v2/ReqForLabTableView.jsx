import { useEffect, useState } from "react"
import { ReqForLabTable } from "./Tables/ReqForLabTable"

export const ReqForLabTableView = ({ requests, currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen, isClosedView }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    if (currentUser.login) {
      if (!Array.isArray(requests)) return
      const filteredData = requests.filter(req => {
        // Если запрос НЕ закрыт — оставляем его
        if (req.req_status !== "closed") return true
        // Если запрос закрыт, проверяем, не прочитан ли он текущим пользователем
        const isReadByUser = req.users?.some(user => user.user_id === currentUser.id && user.read_status === "readed")
        // Оставляем запрос, только если он НЕ прочитан пользователем
        return !isReadByUser
      })
      setData(filteredData)
    }
  }, [requests, currentUser])

  return (
    <>
      <ReqForLabTable
        requests={isClosedView ? requests : data}
        currentUser={currentUser}
        reRender={reRender}
        setCheckFullScreenOpen={setCheckFullScreenOpen}
        checkFullScreenOpen={checkFullScreenOpen}
      />
    </>
  )
}
