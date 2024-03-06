import { v4 as uuidv4 } from "uuid"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { Box, Button, Divider, Stack } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { TextDataField } from "./TextDataField/TextDataField"
import { useState } from "react"
import { SelectDataField } from "../TaskForm/SelectDataField/SelectDataField"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

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
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })

  const getInputData = e => {
    const { name, value, files, checked } = e.target

    if (name === "responsible_subdepartment_id") {
      if (value.toString() === currentUser.subDep.toString()) {
        console.log("Internal task")
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

  const handleSubmit = event => {
    event.preventDefault()
    if (isInternalTask && currentUser.role === "chife") {
      console.log("Внутрення задача от начальника")
      formData.task_status = "approved"
    } else if (!isInternalTask && currentUser.role === "chife") {
      console.log("Внешняя задача от начальника")
      formData.task_status = "approved"
    } else if (isInternalTask && currentUser.role === "user") {
      console.log("Внутрення задача от пользователя")
      formData.task_status = "toApprove"
    } else if (!isInternalTask && currentUser.role === "user") {
      console.log("Внешняя задача от пользователя")
      formData.task_status = "toApprove"
    } else {
      // Логика для других случаев
    }
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/tasks/addNewTask", "POST", formData, setReqStatus)
    .then(data => {
      onTaskSubmit();
      setReqStatus({ loading: false, error: null });
    })
    .catch(error => {
      setReqStatus({ loading: false, error: error.message });
    });
    // onTaskSubmit();
    setFormData(initValue)
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
      <TextDataField getData={getInputData} value={formData} />
      <Divider />
      <SelectDataField getData={getInputData} value={formData} internalTask={isInternalTask} />
      <Divider />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Создать задачу
      </Button>
    </Box>
  )
}
