import { AppBar, Toolbar, Typography, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { useTaskContext } from "../../../../../context/TasksProvider"
import { useEffect, useState } from "react"
import { TaskForm } from "./TaskForm/TaskForm"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"

export const TasksMain = () => {
  const { allTasks, notifyEvent } = useTaskContext()
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
      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Новая задача">
          <TaskForm onTaskSubmit={closeModal} />
        </ModalCustom>
      </>
      <AppBar
        position="static"
        sx={{
          mt: 2,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Задачи:
          </Typography>
          <Fab color="secondary" aria-label="add" onClick={openModal}>
            <AddIcon />
          </Fab>
        </Toolbar>
      </AppBar>
      <TasksTable tasks={allTasks} reRender={setFormKey} />
    </>
  )
}
