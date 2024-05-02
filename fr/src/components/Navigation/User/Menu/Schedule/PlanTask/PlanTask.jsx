import { useState } from "react"
import { Button, TextField, Typography, IconButton, Grid, Box, Stack, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

export const PlanTask = ({ onClose }) => {
  const today = new Date().toISOString().split("T")[0]
  const [planeTasks, setPlaneTasks] = useState([{ description: "", dueDate: "", completed: false }])

  const handleAddTask = () => {
    setPlaneTasks([{ description: "", dueDate: "", completed: false }, ...planeTasks])
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

  const handleCreate = event => {
    event.preventDefault()
    console.log(planeTasks)
    // onClose()
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
                id="task_description"
                placeholder="Описание паланируемой задачи"
                multiline
                minRows={4}
                maxRows={10}
                variant="outlined"
                label={`Задача ${planeTasks.length - index}`}
                value={task.description}
                onChange={e => handleTaskChange(index, "description", e.target.value)}
                fullWidth
                sx={{ marginBottom: "10px" }}
                required
              />
              <Stack direction="row">
                <TextField
                  id="date"
                  label="Выпонить до:"
                  type="date"
                  name="deadline"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={task.dueDate}
                  onChange={e => handleTaskChange(index, "dueDate", e.target.value)}
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
