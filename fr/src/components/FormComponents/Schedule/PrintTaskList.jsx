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
      .map(task => {
        const statusText = task.schedule_status === "new" ? "В работе" : task.schedule_status === "done" ? "Выполнена" : task.schedule_status

        const isDone = task.schedule_status === "done"
        const hasAheadTime = isDone && task.ahead_completed_time

        return `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-family: Arial, sans-serif;">
            <tr>
              <td style="width: 100px; vertical-align: top; padding: 5px; border-bottom: 1px solid #ddd;">
                <strong>Статус:</strong><br>${statusText}
              </td>
              <td style="width: 150px; vertical-align: top; padding: 5px; border-bottom: 1px solid #ddd;">
                <strong>Создана:</strong><br>${formatDate(task.created_on)}
              </td>
              <td style="width: 80%; vertical-align: top; padding: 5px; border-bottom: 1px solid #ddd; word-wrap: break-word;">
                <strong>Описание:</strong><br>
                <div style="max-height: 60px; overflow: hidden; text-overflow: ellipsis;">
                  ${task.schedule_description}
                </div>
              </td>
              <td style="width: 150px; vertical-align: top; padding: 5px; border-bottom: 1px solid #ddd;">
                <strong>Срок:</strong><br>${formatDate(task.deadline_time)}
              </td>
              <td style="width: 150px; vertical-align: top; padding: 5px; border-bottom: 1px solid #ddd;">
                <strong>${hasAheadTime ? "Досрочно:" : "Статус:"}</strong><br>
                ${hasAheadTime ? formatDate(task.ahead_completed_time) : "В работе"}
              </td>
            </tr>
          </table>
        `
      })
      .join("")

    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <html>
        <head>
        <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
        }
        h2, h3, h4 {
          text-align: center;
          color: #2c3e50;
        }
        .print-content {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .indicators-container {
          display: flex;
          flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
          justify-content: center; /* Центрирует элементы по горизонтали */
          margin: 20px 0;
        }
        .indicator-item {
          flex: 0 0 45%; /* Задает ширину элемента 45% */
          margin: 5px; /* Отступ между элементами */
          text-align: left; /* Выравнивание текста влево */
        }
        .user-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f1f1f1;
        }
        .user-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        .comments-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f1f1f1;
        }
        .comments-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        .subdepartment-name, .user-name {
          flex: 1;
        }
        @media print {
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          body {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
        }
      </style>
        </head>
        <body>
          <h2>
            Плановые задания: 
          </h2>
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
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
        Выберите задачи для печати:
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
