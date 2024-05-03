import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { Button, TextField, Typography, IconButton, Grid, Box, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const SchedulePlane = ({ onClose, reRender }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null, })

  const initVal = {
    schedule_id: uuidv4(),
    assign_user_id: currentUser.id,
    schedule_status: "new",
    schedule_type: "",
    schedule_title: "",
    schedule_description: "",
    schedule_comment: [],
    deadline_time: "",
    estimated_time: 0,
    schedule_priority: false,
    appoint_user_id: currentUser.id,
    appoint_department_id: currentUser.dep,
    appoint_subdepartment_id: currentUser.subDep,
    appoint_position_id: currentUser.position,
  }

  const today = new Date().toISOString().split("T")[0]
  const [planeTasks, setPlaneTasks] = useState([initVal])

  const handleAddTask = () => {
    setPlaneTasks([initVal, ...planeTasks])
  }

  const handleDeleteTask = index => {
    const updatedTasks = [...planeTasks]
    updatedTasks.splice(index, 1)
    setPlaneTasks(updatedTasks)
  }

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...planeTasks]
    updatedTasks[index][field] = value
    setPlaneTasks(updatedTasks)
  }

  const handleCreate = async event => {
    event.preventDefault()
    try {
      setReqStatus({ loading: true, error: null })
      getDataFromEndpoint(currentUser.token, "/schedule/addSchedules", "POST", planeTasks, setReqStatus)
       reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error })
    }
    onClose()
  }

  return (
    <>
      <Box component="form" onSubmit={handleCreate} sx={{ mb: "2%", ml: "1%", mr: "1%", mt: "1%" }}>
        <Typography variant="h6" gutterBottom>
          Планирование:
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddTask}>
              Добавить задачу
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" type="submit">
              Создать
            </Button>
          </Grid>
        </Grid>
        {planeTasks.map((task, index) => (
          <Box key={index} sx={{ m: "15px" }}>
            <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
              <TextField
                id="schedule_description"
                placeholder="Описание паланируемой задачи"
                multiline
                minRows={4}
                maxRows={10}
                variant="outlined"
                label={`Задача ${planeTasks.length - index}`}
                value={task.schedule_description}
                onChange={e => handleTaskChange(index, "schedule_description", e.target.value)}
                fullWidth
                sx={{ marginBottom: "10px" }}
                required
              />
              <Stack direction="row">
                <TextField
                  id="deadline_time"
                  label="Выпонить до:"
                  type="date"
                  name="deadline_time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={task.deadline_time}
                  onChange={e => handleTaskChange(index, "deadline_time", e.target.value)}
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                  inputProps={{ min: today }}
                  required
                />
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon />
                  <Typography variant="h6" gutterBottom>
                    Удалить
                  </Typography>
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Box>
    </>
  )
}
