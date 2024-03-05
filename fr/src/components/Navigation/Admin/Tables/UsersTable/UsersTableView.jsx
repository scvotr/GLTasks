import { DataGrid, ruRU } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import { useState } from "react"

export const UsersTableView = ({ actionType, users }) => {
  return (
    <>
      <Box
        sx={{
          height: 500,
          width: "100%",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <DataGrid
          rowHeight={25}
          rows={
            users && users
              ? users.map(user => ({
                  ...user,
                  id: user.id,
                }))
              : []
          }

          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
            sorting: {
              sortModel: [{ field: "created_on", sort: "desc" }], // Направление сортировки: 'asc' - по возрастанию, 'desc' - по убыванию
            },
          }}
          pageSizeOptions={[15, 20, 25]}
        />
        </Box>
    </>
  )
}
