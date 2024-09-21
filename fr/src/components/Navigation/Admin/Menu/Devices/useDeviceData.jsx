import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"

export const useDeviceData = () => {
  const currentUser = useAuthContext()
  const [useReqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [useAllWorkflowsByDep, setAllWorkflowsByDep] = useState([])
  const [useAllDeviceTypes, setAllDeviceTypes] = useState([])

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const workflows = await getDataFromEndpoint(currentUser.token, `/admin/workflow/allWorkflowByDep`, "POST", null, setReqStatus)
        const devicesTypes = await getDataFromEndpoint(currentUser.token, `/admin/devices/types/read`, "POST", null, setReqStatus)
        setAllWorkflowsByDep(workflows)
        setAllDeviceTypes(devicesTypes)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const useGroupedWorkflowsByDep = useAllWorkflowsByDep.reduce((acc, item) => {
    if (!acc[item.department_name]) {
      acc[item.department_name] = []
    }
    acc[item.department_name].push({
      id: item.id,
      department_id: item.department_id,
      workshop_name: item.workshop_name,
    })
    return acc
  }, {})

  return { useAllDeviceTypes, useGroupedWorkflowsByDep, useReqStatus }
}
