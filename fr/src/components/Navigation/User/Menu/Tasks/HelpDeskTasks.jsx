import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { useEffect, useState } from "react"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { TaskForm } from "./TaskForm/TaskForm"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"

export const HelpDeskTasks = () => {
  const { allLeadTasks, allLeadTasksForSupp, notifyEvent } = useTaskContext()
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    notifyEvent("need-all-Tasks")
  }, [formKey])

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
        <TaskForm onTaskSubmit={closeModal} />
      </ModalCustom>
      <AppBarForPage title="Техническая поддрежка: " openModal={openModal} />
      <TasksTable tasks={allLeadTasksForSupp || []} reRender={setFormKey} />
    </>
  )
}
