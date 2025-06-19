import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { AppBarForPage } from "../../components/AppBarForPage/AppBarForPage"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"

const fetchLabData = async (currentUser, setLabData, setReqStatus) => {
  const endpoint = `/lab/analytics/getData`
  setReqStatus({ loading: true, error: null })
  try {
    const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", setReqStatus)
    setLabData(data)
    setReqStatus({ loading: false, error: null })
  } catch (error) {
    setReqStatus({ loading: false, error: error.message })
  }
}

export const LabAnalyticsMain = () => {
  const currentUser = useAuthContext()
  const [labData, setLabData] = useState([])
  console.log("🚀 ~ LabAnalyticsMain ~ labData:", labData)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.login) {
        await fetchLabData(currentUser, setLabData, setReqStatus)
      }
    }
    fetchData()
  }, [currentUser])

  return (
    <>
      <Loader reqStatus={reqStatus}>
        <AppBarForPage title="Аналитика:" />
      </Loader>
    </>
  )
}
