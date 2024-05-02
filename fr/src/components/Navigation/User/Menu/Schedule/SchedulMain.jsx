import { useEffect, useState } from "react"
import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"
import { SchedulePlane } from "./PlanTask/SchedulePlane"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"

export const SchedulMain = () => {
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }

  useEffect(() => {}, [formKey])

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText="Новая задача">
        <SchedulePlane reRender={setFormKey} onClose={closeModal}/>
      </FullScreenDialog>
      <AppBarForPage title="Планирование: " openModal={openModal} />
    </>
  )
}
