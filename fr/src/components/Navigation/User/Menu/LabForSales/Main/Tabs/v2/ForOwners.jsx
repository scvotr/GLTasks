import { useEffect, useState } from "react"
import { ReqForLabTableView } from "../../../Tables/v2/ReqForLabTableView"

const SALES_SUBDEB_G = "13"

export const ForOwners = ({ requests = [], currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const data = requests.filter(req => currentUser.subDep.toString() !== SALES_SUBDEB_G && req.req_status !== "draft")
      setData(data)
    }
    if (currentUser.subDep.toString() === SALES_SUBDEB_G) {
      setData(requests)
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
      />
    </>
  )
}
