import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"

export const MotorRepairLogView = ({ motor }) => {
  const currentUser = useAuthContext()
  const [response, setResponse] = useState({ loading: false, error: null })
  const [tableData, setTableData] = useState([])



  return <>MotorRepairLogView</>
}
