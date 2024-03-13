import { v4 as uuidv4 } from "uuid"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { Box, Button, Divider } from "@mui/material"
import { TextDataField } from "./TextDataField/TextDataField"
import { useState } from "react"
import { SelectDataField } from "../TaskForm/SelectDataField/SelectDataField"
import { ImageBlock } from "./ImageBlock/ImageBlock"
import { sendNewTaskData } from "../../../../../../utils/sendNewTaskData"

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
  const [isInternalTask, setIsInternalTask] =
    useState(false)
  const [reqStatus, setReqStatus] = useState({
    loading: true,
    error: null,
  })
  const [isEdit, setIsEdit] = useState(false)

  const getInputData = async e => {
    const { name, value, files, checked } = e.target
    if (name === "add_new_files" || name === "append_new_files" ) {
      const allowedTypes = [ "image/jpeg", "image/png", "application/pdf", ]
      const data = Array.from(files).filter(file =>
        allowedTypes.includes(file.type)
      )
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
              } else if (
                file.type.startsWith("application/pdf")
              ) {
                resolve(e.target.result)
              }
            }
            reader.readAsDataURL(file)
          })
        })
      )
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
      if (
        value.toString() === currentUser.subDep.toString()
      ) {
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
    // установка признака статуса задачи
    // Если пользоваель руководитель то задача согласованна
    // Если пользоваель не руководитель то задача требует согласования
    // Два типа задач задачи от пользовтеля пользователю
    // Два типа задач задачи от начальника начальнику на распределение
    // сотрудник отдела ХПР назначет задачу сотруднику своего же отдела
    // задача требует согласования начальником отдела ХПР
    // сотрдуник создает задачу внешнему отделу
    // задача требует согласования начальником его отдела
    // начальник отдела ХПР создает задачу в нутри своего отдела
    // задача согласования не требует и сразу назначается на пользователя
    // ! responsible_user_id = 'сотрудник' task_status = approved appoint_user_id = 'начальник'
    // начальник отдела ХПР создает задачу для внешнего отдела
    // задача согласования не требует и сразу назначается отдел 
    // ! responsible_subdepartment_id task_status

    if (isInternalTask && currentUser.role === "chife") {
      console.log("Внутрення задача от начальника")
      formData.task_status = "approved"
      formData.approved_on = true
    } else if (
      !isInternalTask &&
      currentUser.role === "chife"
    ) {
      console.log("Внешняя задача от начальника")
      formData.task_status = "approved"
      formData.approved_on = true
    } else if (
      isInternalTask &&
      currentUser.role === "user"
    ) {
      console.log("Внутрення задача от пользователя")
      formData.task_status = "toApprove"
      formData.approved_on = false
    } else if (
      !isInternalTask &&
      currentUser.role === "user"
    ) {
      console.log("Внешняя задача от пользователя")
      formData.task_status = "toApprove"
      formData.approved_on = false
    } else {
      // Логика для других случаев
    }
    try {
      setReqStatus({ loading: true, error: null })
      // нужно что придумать
      await sendNewTaskData(
        currentUser.token,
        formData,
        // "/tasks/addNewTask",
        // "POST",
        // setReqStatus
        onTaskSubmit()
      )
      setReqStatus({ loading: false, error: null })
    } catch (error) {
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

  const removeTaskExistingFiles = (index) => {
    const updatedFiles = [...formData.old_files]; //! поле для фалов с сервера
    const nameRem = [...formData.file_names];
    updatedFiles.splice(index, 1);
    const removedNam = nameRem.splice(index, 1);
    const updatedFilesToRemove = [...formData.filesToRemove, removedNam];

    setFormData((prev) => ({
      ...prev,
      old_files: updatedFiles, //!поле для фалов с сервера
      file_names: nameRem,
      filesToRemove: updatedFilesToRemove,
    }));
  };

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
      <TextDataField
        getData={getInputData}
        value={formData}
      />
      <Divider />
      <SelectDataField
        getData={getInputData}
        value={formData}
        internalTask={isInternalTask}
      />
      <Divider />
      <ImageBlock
        files={formData}
        getData={getInputData}
        isEdit={isEdit}
        takeAddedIndex={removeTaskAddedFiles}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Создать задачу
      </Button>
    </Box>
  )
}
