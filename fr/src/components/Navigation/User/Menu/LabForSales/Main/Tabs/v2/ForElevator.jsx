import { useEffect, useState } from "react"
import { ReqForLabTableView } from "../../../Tables/v2/ReqForLabTableView"

export const ForElevator = ({ requests = [], currentUser, reRender, setCheckFullScreenOpen, checkFullScreenOpen, isClosedView }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const data = requests.filter(req => req.selectedDepartment.toString() === currentUser.dep.toString() && req.req_status !== "draft")
      setData(data)
    }
  }, [currentUser, requests])

  return (
    <>
      <ReqForLabTableView
        requests={data}
        currentUser={currentUser}
        reRender={reRender}
        setCheckFullScreenOpen={setCheckFullScreenOpen}
        checkFullScreenOpen={checkFullScreenOpen}
        isClosedView={isClosedView}
      />
    </>
  )
}
