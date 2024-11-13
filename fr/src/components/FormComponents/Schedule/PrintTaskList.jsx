import React, { useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import { Box, List, ListItem, ListItemText, Checkbox, Button, Typography } from "@mui/material"

export const PrintTaskList = ({ tasks }) => {
  const [selectedTasks, setSelectedTasks] = useState([])

  const handleSelectTask = taskId => {
    setSelectedTasks(prevSelected => (prevSelected.includes(taskId) ? prevSelected.filter(id => id !== taskId) : [...prevSelected, taskId]))
  }

  const handleCheckboxClick = (event, taskId) => {
    event.stopPropagation()
    handleSelectTask(taskId)
  }

  const handlePrintSelectedTasks = () => {
    const printContent = selectedTasks
      .map(taskId => tasks.find(task => task.id === taskId))
      .map(
        task => `
            <div>
              <p>
                <span style="display: inline-block; width: 80px; text-align: left;">
                  Статус: ${
                    task.schedule_status === 'new'
                      ? 'В работе'
                      : task.schedule_status === 'done' && task.ahead_completed_time === null
                      ? 'Выполнена'
                      : task.schedule_status === 'done' && task.ahead_completed_time !== null
                      ? 'Выполнена'
                      : task.schedule_status
                  }
                </span> | 
                <span style="display: inline-block; width: 150px; text-align: left;">
                  Создана: ${formatDate(task.created_on)}
                </span> | 
                <span style="display: inline-block; width: 200px; text-align: left; font-weight: bold;">
                  ${task.schedule_description}
                </span> | 
                <span style="display: inline-block; width: 150px; text-align: left;">
                  Выполнить до: ${formatDate(task.deadline_time)}
                </span> 
                ${
                  task.ahead_completed_time 
                    ? `<span style="display: inline-block; width: 150px; text-align: left;">
                        досрочно: ${formatDate(task.ahead_completed_time)}
                      </span>`
                    : '<span style="display: inline-block; width: 150px; text-align: left;">В работе</span>'
                } |
              </p>
              <hr />
            </div>
          `
      )
      .join("")

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Selected Tasks</title>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleSelectAll = () => {
    const allTaskIds = tasks.map(task => task.id)
    setSelectedTasks(allTaskIds)
  }

  const handleResetAll = () => {
    setSelectedTasks([])
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Typography variant="h6" gutterBottom>
        Выбериете задачи для печати:
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem key={task.id} dense onClick={() => handleSelectTask(task.id)}>
            <Checkbox
              edge="start"
              onClick={event => handleCheckboxClick(event, task.id)}
              checked={selectedTasks.includes(task.id)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={task.schedule_description} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleSelectAll}>
          Выбрать все
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleResetAll}>
          Сбросить все
        </Button>
      </Box>
      <Button variant="contained" color="primary" onClick={handlePrintSelectedTasks} sx={{ mt: 2 }}>
        Печать выбранных задач
      </Button>
    </Box>
  )
}
