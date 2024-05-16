import { AppBar, Toolbar, Typography, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { useEffect, useState } from "react"
import { TaskForm } from "./TaskForm/TaskForm"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"

export const TasksMain = () => {
  const { allTasks, notifyEvent, allTasksNoClosed, countAllTasksNoClosed } = useTaskContext()
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
      <AppBarForPage title="Задачи: " openModal={openModal} />
      <TasksTable tasks={allTasks || []} reRender={setFormKey} />
    </>
  )
}
