import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { useEffect, useState } from "react"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { TaskForm } from "./TaskForm/TaskForm"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"

export const LeadTasks = () => {
  const { allLeadTasks, notifyEvent } = useTaskContext()
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  console.log(allLeadTasks)

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
      <AppBarForPage title="Мои Задачи: " openModal={openModal} />
      <TasksTable tasks={allLeadTasks || []} reRender={setFormKey} />
    </>
  )
}
