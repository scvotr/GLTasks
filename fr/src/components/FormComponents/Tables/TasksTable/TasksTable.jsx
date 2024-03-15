import { Box } from "@mui/material"
import { DataGrid, ruRU } from "@mui/x-data-grid"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../context/AuthProvider"

export const TasksTable = ({ tasks, reRender }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })

  const columns = [
    { field: "task_id", headerName: "Task ID", description: "This column description", width: 100 },
    {
      field: "read_status",
      headerName: "read status",
      description: "This column description",
      width: 150,
      renderCell: params => (
        <div style={{ fontWeight: params.value === "unread" ? "bold" : "normal", color: params.value === "unread" ? "red" : "black" }}>{params.value}</div>
      ),
    },
    { field: "created_on", headerName: "Создана", description: "This column description", width: 250 },
  ]

  const handleCellClick = (params, event) => {
    console.log("Кликнута ячейка:", params.field, params.row.id, params.row, params.row.read_status)
    const updatedData = {
      task_id: params.row.task_id,
      user_id: params.row.appoint_subdepartment_id,
      read_status: "readed",
    }

    if (params.row.read_status === "unread") {
      setReqStatus({ loading: true, error: null })
      getDataFromEndpoint(currentUser.token, "/tasks/updateReadStatus", "POST", updatedData, setReqStatus)
        .then(data => {
          setReqStatus({ loading: false, error: null })
        })
        .catch(error => {
          setReqStatus({ loading: false, error: error.message })
        })
      reRender(prevKey => prevKey + 1) 
    }
  }

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.read_status === "unread" && b.read_status === "readed") {
      return -1 // Переносим непрочитанные задачи в начало списка
    } else if (a.read_status === "readed" && b.read_status === "unread") {
      return 1 // Переносим прочитанные задачи в конец списка
    } else {
      // Если обе задачи имеют одинаковый статус или обе непрочитанные/прочитанные, сортируем по дате создания
      return new Date(b.created_on) - new Date(a.created_on)
    }
  })

  return (
    <>
      <Box
        style={{
          height: 500,
          width: "100%",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <DataGrid
          rowHeight={25}
          rows={sortedTasks.map(task => ({
            ...task,
            id: task.task_id,
          }))}
          columns={columns}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          onCellClick={handleCellClick}
        />
      </Box>
    </>
  )
}
