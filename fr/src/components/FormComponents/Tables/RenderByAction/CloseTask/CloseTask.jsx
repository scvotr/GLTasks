import { Button, Box, TextField } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import Stack from "@mui/material/Stack"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { FullTaskInfo } from "../../../Tasks/FullTaskInfo/FullTaskInfo"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { useState } from "react"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../Loader/Loader"

export const CloseTask = ({ task, onTaskSubmit }) => {
  const currentUser = useAuthContext()
  const { notifyEvent } = useTaskContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formData, setFormData] = useState({})

  const handleClosedTask = async isClose => {
    let transferData = {}

    if (isClose) {
      transferData = {
        task_id: task.task_id,
        closed_on: true,
        task_status: "closed",
        responsible_position_id: task.responsible_position_id,
        // -----
        responsible_user_id: task.responsible_user_id,
        appoint_user_id: task.appoint_user_id,
        appoint_department_id: task.appoint_department_id,
        responsible_department_id: task.responsible_department_id,
        appoint_subdepartment_id: task.appoint_subdepartment_id,
        responsible_subdepartment_id: task.responsible_subdepartment_id,
        // -----
        user_role: currentUser.role,
        // ----to mail
        current_user: currentUser.id,
        user_name: task.appoint_user_last_name,
        appoint_department_name: task.appoint_department_name,
        task_descript: task.task_descript,
      }
      try {
        setReqStatus({ loading: true, error: null })
        await getDataFromEndpoint(currentUser.token, "/tasks/updateTaskStatusNew", "POST", transferData, setReqStatus)
        setReqStatus({ loading: false, error: null })
        notifyEvent("need-all-Tasks")
        onTaskSubmit()
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    } else {
      transferData = {
        task_id: task.task_id,
        reject_on: true,
        task_status: "inWork",

        responsible_user_id: task.responsible_user_id,
        appoint_user_id: task.appoint_user_id,
        appoint_department_id: task.appoint_department_id,
        responsible_department_id: task.responsible_department_id,
        appoint_subdepartment_id: task.appoint_subdepartment_id,
        responsible_subdepartment_id: task.responsible_subdepartment_id,
        // -----
        user_role: currentUser.role,
        // ----to mail
        // так как при уведомлении нужено именно поле user_id в место current_user
        user_id: currentUser.id,
        // current_user: currentUser.id,
        // так как при уведомлении нужено именно поле user_dep и user_subDep
        user_dep: currentUser.dep,
        user_subDep: currentUser.subDep,
        // ------------------
        // изменение дедлайна
        deadline_changed: appDate !== null ? appDate.deadline : task.deadline,
        // ---------------
        user_name: task.appoint_user_last_name,
        appoint_department_name: task.appoint_department_name,
        task_descript: task.task_descript,
      }
      try {
        setReqStatus({ loading: true, error: null })
        await getDataFromEndpoint(currentUser.token, "/tasks/updateTaskStatusNew", "POST", transferData, setReqStatus)
        setReqStatus({ loading: false, error: null })
        notifyEvent("need-all-Tasks")
        onTaskSubmit()
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }
  // -----------------------------------------
  const today = new Date().toISOString().split("T")[0]

  console.log(task.deadline === today)

  const [appDate, setAppDate] = useState(null)
  console.log(appDate)

  const getData = async e => {
    const { name, value } = e.target;
    console.log(name, value);
    const updatedAppDate = { ...appDate, [name]: value };
    setAppDate(updatedAppDate);
  }
  // -----------------------------------------

  return (
    <>
      <Box>
        <Box sx={{ mt: 2 }}>
          <Loader reqStatus={reqStatus}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              {/* -------------------- */}
              <TextField
                id="date"
                label="Выпонить до:"
                type="date"
                name="deadline"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ min: today }}
                // value={task.deadline}
                value={(appDate && appDate.deadline) || task.deadline}
                onChange={e => {
                  getData(e) // Вызов функции обратного вызова для обновления состояния formData
                }}
                required
              />
              {/* -------------------- */}
              <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={() => handleClosedTask(false)}>
                Отклонить
              </Button>
              <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={() => handleClosedTask(true)}>
                Подтвердить
              </Button>
            </Stack>
          </Loader>
        </Box>
        <FullTaskInfo task={task} />
      </Box>
    </>
  )
}
