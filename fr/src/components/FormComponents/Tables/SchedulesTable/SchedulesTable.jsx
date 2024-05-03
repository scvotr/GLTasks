import { Box, Typography } from "@mui/material"
import { DataGrid, ruRU } from "@mui/x-data-grid"
import { useState } from "react"

export const SchedulesTable = ({ schedules, reRender }) => {
  const [selectedRow, setSelectedRow] = useState(null)

  const columns = [
    { field: "id", headerName: "№", description: "Номер задания", maxWidth: 50, flex: 1 },
    // { field: "created_on", headerName: "от: ", description: "дата создания", width: 170 },
    { field: "schedule_description", headerName: "задание: ", description: "описание задания", flex: 1 },
    { field: "deadline_time", headerName: "до: ", description: "крайний срок", width: 170, flex: 1 },
  ]

  const handleRowClick = params => {
    setSelectedRow(params.row) // Обновляем выбранную строку при клике на нее
    console.log(selectedRow)
  }

  return (
    <>
      <Box
        sx={{
          height: "75vh",
          width: "100%",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          overflowX: "auto", // Добавляем горизонтальную прокрутку, если содержимое таблицы не помещается
        }}>
        <DataGrid
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center", // Если требуется центрировать текст в ячейках
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center", // Если требуется центрировать текст в заголовках столбцов
            },
          }}
          autoHeight
          columns={columns}
          rows={schedules}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          onRowClick={handleRowClick}
        />
      </Box>
      {selectedRow && (
        <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 5 }}>
          <Typography variant="body1">Текст задачи: {selectedRow.schedule_description}</Typography>
        </Box>
      )}
    </>
  )
}
