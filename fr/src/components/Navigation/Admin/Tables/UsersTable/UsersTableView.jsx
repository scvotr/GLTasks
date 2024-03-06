import { DataGrid, ruRU } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import { useState } from "react"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { EditUserForm } from "../../EditUserForm/EditUserForm"

const columns = [
  {
    field: "id",
    headerName: "UserID",
    description: "Id пользовтелей",
    width: 90,
  },
  {
    field: "name",
    headerName: "Имя",
    description: "Логин пользователя",
    width: 90,
  },
  {
    field: "department",
    headerName: "Департамент",
    description: "Департамент пользователя",
    width: 100,
  },
  {
    field: "subdepartment",
    headerName: "Отдел",
    description: "Отдел пользователя",
    width: 100,
  },
  {
    field: "position",
    headerName: "Должность",
    description: "Отдел пользователя",
    width: 240,
  },
  {
    field: "role",
    headerName: "Роль",
    description: "Роль пользователя",
    width: 200,
  },
  {
    field: "first_name",
    headerName: "Имя",
    description: "Имя пользователя",
    width: 100,
  },
  {
    field: "middle_name",
    headerName: "Фамилия",
    description: "Фамилия пользователя",
    width: 100,
  },
  {
    field: "last_name",
    headerName: "Отчество",
    description: "Отчество пользователя",
    width: 100,
  },
]

export const UsersTableView = ({ actionType, users, reRender  }) => {
  const [actionTypeTS, setActionTypeTS] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const openModal = user => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalOpen(false)
    reRender(prevKey => prevKey + 1)
  }

  const handleCellClick = (params, event) => {
    // console.log("Кликнута ячейка:", params.field, params.row.id, params.row, params.row.task_status)
    setActionTypeTS(params.row.task_status)
    openModal(params.row)
  }

  return (
    <>
      <>
        {selectedUser && (
          <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText='Редактировать'>
            <EditUserForm user={selectedUser} onTaskSubmit={closeModal} />
          </ModalCustom>
        )}
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
            columns={columns}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onCellClick={handleCellClick}
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
    </>
  )
}
