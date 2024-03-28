import { v4 as uuidv4 } from "uuid"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { Box, Button, Divider, CircularProgress } from "@mui/material"
import { TextDataField } from "./TextDataField/TextDataField"
import { useEffect, useState } from "react"
import { SelectDataField } from "../TaskForm/SelectDataField/SelectDataField"
import { ImageBlock } from "./ImageBlock/ImageBlock"
import { sendNewTaskData } from "../../../../../../utils/sendNewTaskData"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

export const TaskForm = ({ taskToEdit, onTaskSubmit }) => {
  const currentUser = useAuthContext()
  const initValue = {
    task_id: uuidv4(),
    task_status: "new",
    task_descript: "",
    task_comment: [],
    deadline: "",
    task_priority: false,
    appoint_user_id: currentUser.id, // кто назначил = текущий пользователь
    appoint_department_id: currentUser.dep,
    appoint_subdepartment_id: currentUser.subDep,
    appoint_position_id: currentUser.position,
    responsible_user_id: "",
    responsible_department_id: "",
    responsible_subdepartment_id: "",
    responsible_position_id: "",
    files: [],
    filePreviews: [],
    filesToRemove: [],
    task_files: [],
  }
  const [formData, setFormData] = useState(initValue)
  const [isInternalTask, setIsInternalTask] = useState(false)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [isEdit, setIsEdit] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (taskToEdit) {
      setIsEdit(true)
    }
  }, [taskToEdit])

  const getInputData = async e => {
    const { name, value, files, checked } = e.target
    if (name === "add_new_files" || name === "append_new_files") {
      setReqStatus({ loading: true })
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
      const data = Array.from(files).filter(file => allowedTypes.includes(file.type))
      const previews = await Promise.all(
        data.map(file => {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = e => {
              if (file.type.startsWith("image/")) {
                const img = new Image()
                img.src = e.target.result
                img.onload = () => {
                  resolve(e.target.result)
                }
              } else if (file.type.startsWith("application/pdf")) {
                resolve(e.target.result)
              }
            }
            reader.readAsDataURL(file)
          })
        })
      )
      setReqStatus({ loading: false })
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...data],
        filePreviews: [...prev.filePreviews, ...previews],
      }))
    }
    // установка признака типа задачи
    // если отдел текущего пользователя совподает с отделом куда назначена задача
    // то Internal task = false
    if (name === "responsible_subdepartment_id") {
      if (value.toString() === currentUser.subDep.toString()) {
        setIsInternalTask(true)
      } else {
        setIsInternalTask(false)
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    // Устанавливаем состояние loading в true перед отправкой данных
    setReqStatus({ loading: true, error: null })
    // Логика для определения статуса задачи
    if (isInternalTask && currentUser.role === "chife") {
      // console.log("Внутрення задача от начальника")
      formData.task_status = "inWork"
      //! formData.approved_on = true
      formData.setResponseUser_on = true
    } else if (!isInternalTask && currentUser.role === "chife") {
      // console.log("Внешняя задача от начальника")
      formData.task_status = "approved"
      formData.approved_on = true
    } else if (isInternalTask && currentUser.role === "user") {
      // console.log("Внутрення задача от пользователя")
      formData.task_status = "toApprove"
      formData.approved_on = false
    } else if (!isInternalTask && currentUser.role === "user") {
      // console.log("Внешняя задача от пользователя")
      formData.task_status = "toApprove"
      formData.approved_on = false
    } else {
      // Логика для других случаев
    }
    try {
      if (isEdit) {
        console.log("EDIT TASK")
      } else {
        // Отправляем данные на сервер
        await sendNewTaskData(currentUser.token, formData, onTaskSubmit)
        // Если операция завершилась успешно, устанавливаем loading в false
        setReqStatus({ loading: false, error: null })
      }
    } catch (error) {
      // Если произошла ошибка, устанавливаем loading в false и сохраняем ошибку
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const removeTaskAddedFiles = index => {
    const updatedFiles = [...formData.files]
    const updatedPreviews = [...formData.filePreviews]
    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setFormData(prev => ({
      ...prev,
      files: updatedFiles,
      filePreviews: updatedPreviews,
    }))
  }

  const removeTaskExistingFiles = index => {
    const updatedFiles = [...formData.old_files] //! поле для фалов с сервера
    const nameRem = [...formData.file_names]
    updatedFiles.splice(index, 1)
    const removedNam = nameRem.splice(index, 1)
    const updatedFilesToRemove = [...formData.filesToRemove, removedNam]

    setFormData(prev => ({
      ...prev,
      old_files: updatedFiles, //!поле для фалов с сервера
      file_names: nameRem,
      filesToRemove: updatedFilesToRemove,
    }))
  }

  const handelRemoveTask = async e => {
    e.preventDefault()
    console.log("REMOVE TASK")
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleConfirmDelete = () => {
    setOpenDialog(false)
    // Здесь добавьте логику удаления задачи
    handelRemoveTask()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{
        p: 1,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
        "& .MuiTextField-root": { m: 1, width: "55ch" },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      {reqStatus.loading ? (
        <CircularProgress />
      ) : (
        <>
          <TextDataField getData={getInputData} value={formData} />
          <Divider />
          <SelectDataField getData={getInputData} value={formData} internalTask={isInternalTask} />
          <Divider />
          {/* <ImageBlock files={formData} getData={getInputData} isEdit={isEdit} takeAddedIndex={removeTaskAddedFiles} toEdit={isEdit} /> */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isEdit ? "Изменить" : "Создать задачу"}
          </Button>
          {isEdit && (
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleOpenDialog}>
              удалить
            </Button>
          )}
          <>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Подтвердите удаление задачи</DialogTitle>
              <DialogContent>
                <DialogContentText>Вы уверены, что хотите удалить эту задачу?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                <Button onClick={handleConfirmDelete} variant="contained" color="error">
                  Подтвердить удаление
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </>
      )}
    </Box>
  )
}
