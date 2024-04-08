import { Button, Box } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import Stack from "@mui/material/Stack"
import { useState } from "react"
import { HOST_ADDR } from "../../../../../utils/remoteHosts"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { FullTaskInfo } from "../../../Tasks/FullTaskInfo/FullTaskInfo"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { Loader } from "../../../Loader/Loader"

export const updateTaskStatus = async (token, data, onSuccess) => {
  try {
    // const res = await fetch(HOST_ADDR + "/tasks/updateTaskStatus", {
    const res = await fetch(HOST_ADDR + "/tasks/updateTaskStatusNew", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const resData = await res.json()
      onSuccess(null)
      return resData
    } else {
      throw new Error("Server response was not ok or content type is not JSON")
    }
  } catch (error) {
    onSuccess(error)
  }
}

export const ToApprove = ({ task, onTaskSubmit }) => {
  const currentUser = useAuthContext()
  const { notifyEvent } = useTaskContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleApproveTask = async isApprove => {
    let transferData = {}
    if (isApprove) {
      transferData = {
        task_id: task.task_id,
        task_status: "approved",
        approved_on: true,
        // ------------------
        appoint_user_id: task.appoint_user_id, // пользователь который создал задачу
        appoint_department_id: task.appoint_department_id, // Департамент в котором создали задачу
        appoint_subdepartment_id: task.appoint_subdepartment_id, // Отдел в котором создали задачу
        responsible_department_id: task.responsible_department_id, // Департамент для кого создали задачу
        responsible_subdepartment_id: task.responsible_subdepartment_id, // Отдел для кого создали задачу
        // -----
        user_role: currentUser.role,
        // ----to mail
        user_name: task.appoint_user_last_name,
        appoint_department_name: task.appoint_department_name,
        task_descript: task.task_descript,
      }
      try {
        setReqStatus({ loading: true, error: null })
        await updateTaskStatus(currentUser.token, transferData, setReqStatus)
        setReqStatus({ loading: false, error: null })
        notifyEvent("need-all-Tasks")
        onTaskSubmit()
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    } else {
      transferData = {
        task_id: task.task_id,
        // task_status: "reject",
        task_status: "toApprove",
        reject_on: true,
      }
      try {
        setReqStatus({ loading: true, error: null })
        await updateTaskStatus(currentUser.token, transferData, setReqStatus)
        setReqStatus({ loading: false, error: null })
        notifyEvent("need-all-Tasks")
        onTaskSubmit()
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }

  return (
    <>
      <Box>
        <FullTaskInfo task={task} />
        <Box sx={{ mt: 2 }}>
          <Loader reqStatus={reqStatus}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={() => handleApproveTask(false)}>
                Отклонить
              </Button>
              <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={() => handleApproveTask(true)}>
                Согласовать
              </Button>
            </Stack>
          </Loader>
        </Box>
      </Box>
    </>
  )
}
