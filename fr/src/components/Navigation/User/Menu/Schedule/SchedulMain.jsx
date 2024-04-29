import { useState } from "react"
import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"

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

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Новая задача">

      </ModalCustom>
      <AppBarForPage title="Планирование: " openModal={openModal}/>
    </>
  )
}
