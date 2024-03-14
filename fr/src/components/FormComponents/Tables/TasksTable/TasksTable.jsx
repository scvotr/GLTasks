import { Box } from "@mui/material"
import { DataGrid, ruRU } from "@mui/x-data-grid"

export const TasksTable = ({ tasks }) => {
  const columns = [
    { field: "task_id", headerName: "Task ID", description: "This column description", width: 100 },
    {
      field: "read_status",
      headerName: "read status",
      description: "This column description",
      width: 150,
      renderCell: params => (
        <div style={{ fontWeight: params.value === "unread" ? "bold" : "normal", color: params.value === "unread" ? "red" : "black" }}>
          {params.value}
        </div>
      ),
    },
    { field: "created_on", headerName: "Создана", description: "This column description", width: 250 },
  ];

  const handleCellClick = (params, event) => {
    console.log("Кликнута ячейка:", params.field, params.row.id, params.row, params.row.read_status);
  };

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.read_status === "unread" && b.read_status === "read") {
      return -1; // Переносим непрочитанные задачи в начало списка
    } else if (a.read_status === "read" && b.read_status === "unread") {
      return 1; // Переносим прочитанные задачи в конец списка
    } else {
      // Если обе задачи имеют одинаковый статус или обе непрочитанные/прочитанные, сортируем по дате создания
      return new Date(b.created_on) - new Date(a.created_on);
    }
  });

  return (
    <>
      <Box
        style={{
          height: 500,
          width: "100%",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}
      >
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
  );
};
