import { DataGrid, ruRU } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { ConfirmationDialog } from "../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

const columns = [
  { field: "task_id", headerName: "Task ID", description: "This column description", width: 70 },
  {
    field: "read_status",
    headerName: "",
    description: "This column description",
    width: 50,
    renderCell: params => (
      <div style={{ fontWeight: params.value === "unread" ? "bold" : "normal", color: params.value === "unread" ? "green" : "black" }}>
        {params.value === "unread" ? <EmailOutlinedIcon /> : <DraftsOutlinedIcon />}
      </div>
    ),
  },
  // { field: "created_on", headerName: "Создана", description: "This column description", width: 250 },
  { field: "appoint_user_last_name", headerName: "От", description: "От кого", width: 150 },
  { field: "responsible_subdepartment_name", headerName: "Для", description: "Для кого", width: 220 },
  { field: "responsible_department_name", headerName: "Для", description: "Для кого", width: 220 },
  { field: "responsible_user_last_name", headerName: "От", description: "От кого", width: 150 },
  { field: "task_descript", headerName: "Задача", description: "Краткое описание", width: 200 },
  { field: "task_status", headerName: "Статус", description: "Статус задачи", width: 100 },
]

export const AdminTasksTable = ({ tasks, reRender }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const handleCellClick = params => {
    // console.log("Кликнута ячейка:", params.field, params.row.id, params.row, params.row.read_status)
    setSelectedTask({
      task_id: params.row.task_id,
      file_name: params.row.file_names,
    })
    setOpenDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedTask) return
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/tasks/removeTask", "POST", selectedTask, setReqStatus)
      .then(data => {
        setReqStatus({ loading: false, error: null })
        setOpenDialog(false) // Закрыть диалог после удаления
        reRender(prevKey => prevKey + 1)
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error.message })
        setOpenDialog(false)
      })
  }

  return (
    <>
      <>
        <ConfirmationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Подтвердите удаление задачи"
          message="Вы уверены, что хотите удалить эту задачу?"
        />
      </>
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
          rows={
            tasks && tasks.length > 0
              ? tasks.map(task => ({
                  ...task,
                  id: task.task_id,
                }))
              : []
          }
          columns={columns}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          onCellClick={handleCellClick}
          getRowClassName={params => {
            return params.row.read_status === "unread" ? "bold-row" : ""
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15, 25, 75]}
        />
      </Box>
    </>
  )
}
