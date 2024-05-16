import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"

import React, { useState } from "react"
import { Button, TextField, Typography, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import ReportIcon from "@mui/icons-material/Report"

export const DocsOrdinance = () => {
  const [tasks, setTasks] = useState([{ description: "", report: "", completed: false }])
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [report, setReport] = useState("")
  const [taskAdded, setTaskAdded] = useState(false)

  const handleAddTask = () => {
    setTasks([...tasks, { description: "", report: "", completed: false }])
    setTaskAdded(true)
  }

  const handleDeleteTask = index => {
    const updatedTasks = [...tasks]
    updatedTasks.splice(index, 1)
    setTasks(updatedTasks)
  }

  const handleAddReport = index => {
    setSelectedTaskIndex(index)
    setReport("")
    setReportDialogOpen(true)
  }

  const handleSaveReport = () => {
    const updatedTasks = [...tasks]
    updatedTasks[selectedTaskIndex].report = report
    setTasks(updatedTasks)
    setReportDialogOpen(false)
  }

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks]
    updatedTasks[index][field] = value
    setTasks(updatedTasks)
  }

  return (
    <>
      <AppBarForPage title="Актуальные распоряжения:" />

      <Typography variant="h6" gutterBottom>
        Планирование задач
      </Typography>
      {tasks.map((task, index) => (
        <div key={index}>
          <TextField
            label={`Задача ${index + 1}`}
            value={task.description}
            onChange={e => handleTaskChange(index, "description", e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <div>
            <IconButton onClick={() => handleDeleteTask(index)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleAddReport(index)}>
              <ReportIcon />
            </IconButton>
          </div>
          <Typography variant="h6" gutterBottom>
            Отчет к задач
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ backgroundColor: taskAdded ? "#f0f0f0" : "inherit" }} // Изменить фон поля с отчетом после добавления задачи
          >
            {task.report}
          </Typography>
        </div>
      ))}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Добавить отчет</DialogTitle>
        <DialogContent>
          <TextField label="Отчет" multiline rows={4} fullWidth variant="outlined" value={report} onChange={e => setReport(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveReport} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddTask}>
            Добавить задачу
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
