import { useEffect, useState } from "react"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { SchedulePlane } from "./PlanTask/SchedulePlane"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { ScheduleCardView } from "../../../../FormComponents/Schedule/ScheduleCardView"
import { ScheduleCardViewV2 } from "../../../../FormComponents/Schedule/ScheduleCardViewV2"

export const SchedulMain = () => {
  const currentUser = useAuthContext()
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [allScheduls, setAllScheduls] = useState({})

  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }

  useEffect(() => {
    try {
      setReqStatus({ loading: true, error: null })
      getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", currentUser.id, setReqStatus).then(data => setAllScheduls(data))
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error })
    }
  }, [formKey])

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText="Новая задача">
        <SchedulePlane reRender={setFormKey} onClose={closeModal} />
      </FullScreenDialog>
      <AppBarForPage title="Планирование: " openModal={openModal} />
      {/* <ScheduleCardView schedules={allScheduls} reRender={setFormKey} /> */}
      <ScheduleCardViewV2 schedules={allScheduls} reRender={setFormKey}/>
    </>
  )
}
