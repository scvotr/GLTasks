import { Button, Box } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import Stack from "@mui/material/Stack"
import CancelIcon from "@mui/icons-material/Cancel"
import { FullTaskInfo } from "../../../Tasks/FullTaskInfo/FullTaskInfo"
import { PositionSelect } from "../../../Select/PositionSelect/PositionSelect"
import { UserSelect } from "../../../Select/UserSelect/UserSelect"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { useState } from "react"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"

export const SetResponsibleUser = ({ task, onTaskSubmit }) => {
  const currentUser = useAuthContext()
  const { notifyEvent } = useTaskContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [formData, setFormData] = useState({})

  const getInputData = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  let transferData = {}

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      transferData = {
        task_id: task.task_id,
        setResponseUser_on: true,
        task_status: "inWork",
        responsible_position_id: formData.responsible_position_id,
        // ------------------
        responsible_user_id: formData.responsible_user_id,
        appoint_user_id: task.appoint_user_id,
        appoint_department_id: task.appoint_department_id,
        responsible_department_id: task.responsible_department_id,
        appoint_subdepartment_id: task.appoint_subdepartment_id,
        responsible_subdepartment_id: task.responsible_subdepartment_id,
      }
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/tasks/updateTaskSetResponsibleUser", "POST", transferData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      notifyEvent("need-all-Tasks")
      onTaskSubmit()
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleSetResponcerTask = async isResponced => {
    if (isResponced) {
      try {
        setReqStatus({ loading: true, error: null })
        // await updateTaskResponceSubDep(currentUser.token, transferData, setReqStatus)
        setReqStatus({ loading: false, error: null })
        notifyEvent("need-all-Tasks")
        onTaskSubmit()
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    } else {
      onTaskSubmit()
    }
  }

  return (
    <>
      <>
        <Box>
          <FullTaskInfo task={task} />
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <PositionSelect getData={getInputData} selectedSubDep={+currentUser.subDep}>
                <UserSelect getData={getInputData} />
              </PositionSelect>
            </Stack>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={e => handleSetResponcerTask(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="contained" color="success" endIcon={<ThumbUpIcon />}>
                Назначить
              </Button>
            </Stack>
          </Box>
        </Box>
      </>
    </>
  )
}
