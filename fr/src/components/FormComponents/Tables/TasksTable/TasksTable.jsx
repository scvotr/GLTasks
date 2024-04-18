import "./TasksTable.css"
import { Box } from "@mui/material"
import { DataGrid, ruRU } from "@mui/x-data-grid"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ModalCustom } from "../../../ModalCustom/ModalCustom"
import { RenderByAction } from "../RenderByAction/RenderByAction"
import { FullScreenDialog } from "../../../FullScreenDialog/FullScreenDialog"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined"
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined"

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import AssignmentIcon from "@mui/icons-material/Assignment"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import { Loader } from "../../Loader/Loader"

export const TasksTable = ({ tasks, reRender }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [actionTypeTS, setActionTypeTS] = useState()

  const columns = [
    {
      field: "id",
      headerName: "№",
      description: "This column description",
      width: 70,
      // renderCell: params => {
      //   let test
      //   test = params.value.match(/\d{4}/)[0]
      //   return <div> {test} </div>
      // },
    },
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
    {
      field: "appoint_subdepartment_id",
      headerName: "",
      description: "This column description",
      width: 20,
      renderCell: params => {
        let render
        if (params.row.appoint_subdepartment_id.toString() === currentUser.subDep.toString()) {
          render = <UnarchiveOutlinedIcon />
        } else {
          render = <ArchiveOutlinedIcon />
        }
        return <div>{render}</div>
      },
    },
    {
      field: "task_status",
      headerName: "Статус",
      description: "Статус задачи",
      width: 130,
      renderCell: params => {
        let iconComponent
        let statusText

        if (params.row.task_status === "toApprove") {
          iconComponent = <HourglassEmptyIcon />
          statusText = "новая"
        } else if (params.row.task_status === "approved") {
          iconComponent = <CheckCircleOutlineIcon />
          statusText = "Согласована"
        } else if (params.row.task_status === "inWork") {
          iconComponent = <AssignmentIcon />
          statusText = "В работе"
        } else if (params.row.task_status === "needToConfirm") {
          iconComponent = <DoneOutlinedIcon />
          statusText = "На проверке"
        } else if (params.row.task_status === "closed") {
          iconComponent = <DoneAllIcon />
          statusText = "Закрыта"
        }

        return (
          <div>
            {iconComponent} {statusText}
            {/* {params.value} */}
          </div>
        )
      },
    },
    // { field: "created_on", headerName: "Создана", description: "This column description", width: 250 },

    // { field: "appoint_department_name", headerName: "Назначил", description: "От кого", width: 150 },
    // { field: "appoint_subdepartment_name", headerName: "Отдел", description: "От кого", width: 170 },
    {
      field: "appoint_user_last_name",
      headerName: "От ",
      description: "От кого",
      width: 150,
      // renderCell: params => (
      //   <div>
      //     <SportsKabaddiOutlinedIcon style={{ marginRight: "5px" }} />
      //     {params.value}
      //   </div>
      // ),
    },

    // { field: "responsible_department_name", headerName: "Исполнитель", description: "Для кого", width: 220 },
    { field: "responsible_subdepartment_name", headerName: "Для", description: "Для какого отдела", width: 150 },
    {
      field: "responsible_user_last_name",
      headerName: "Ответственный",
      description: "Ответсвенное лицо",
      width: 150,
      cellClassName: "super-app-theme--cell",
      renderCell: params => {
        let render
        if (params.value) {
          render = params.value
        } else {
          render = '------'
        }
        return <div>{render}</div>
      },
    },

    { field: "task_descript", headerName: "Задача", description: "Краткое описание задания", width: 500 },

    {
      field: "deadline",
      headerName: "Выполнить до:",
      description: "This column description",
      width: 120,
      headerClassName: "super-app-theme--header",
      type: "date",
      valueGetter: params => new Date(params.value),
      filter: "datePicker",
      renderCell: params => {
        // Получаем дату из строки
        const date = new Date(params.value)
        // Форматируем дату в нужный формат (день-месяц-год)
        const formattedDate = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`

        return <div>{formattedDate}</div>
      },
      comparator: (date1, date2) => {
        // Преобразуем значения в объекты Date
        const dateObj1 = new Date(date1)
        const dateObj2 = new Date(date2)

        // Сравниваем даты
        if (dateObj1 < dateObj2) {
          return -1
        }
        if (dateObj1 > dateObj2) {
          return 1
        }
        return 0
      },
    },
  ]

  const handleCellClick = (params, event) => {
    // console.log("Кликнута ячейка:", params.field, params.row.id, params.row, params.row.read_status)

    setActionTypeTS(params.row.task_status)
    openModal(params.row)

    let updatedData = {}

    if (currentUser.role === "chife") {
      if (currentUser.subDep.toString() === params.row.appoint_subdepartment_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.appoint_subdepartment_id,
          read_status: "readed",
        }
      } else if (currentUser.subDep.toString() === params.row.responsible_subdepartment_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.responsible_subdepartment_id,
          read_status: "readed",
        }
      }
    } else if (currentUser.role.toString() === "general") {
      if (currentUser.dep.toString() === params.row.appoint_department_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.appoint_department_id,
          read_status: "readed",
        }
      } else if (currentUser.dep.toString() === params.row.responsible_department_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.responsible_department_id,
          read_status: "readed",
        }
      }
    } else if (currentUser.role === "user") {
      if (currentUser.id.toString() === params.row.appoint_user_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.appoint_user_id,
          read_status: "readed",
        }
      } else if (currentUser.id.toString() === params.row.responsible_user_id.toString()) {
        updatedData = {
          task_id: params.row.task_id,
          user_id: params.row.responsible_user_id,
          read_status: "readed",
        }
      }
    }
    // если задача не прочитана то при клике на я чейку обновить статус в прочтено
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

  const openModal = task => {
    setSelectedTask(task)
    setModalOpen(true)
  }
  const closeModal = () => {
    setSelectedTask(null)
    setModalOpen(false)
    reRender(prevKey => prevKey + 1)
  }

  return (
    <>
      <>
        {selectedTask && (
          // <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText={selectedTask.task_status}>
          //   <RenderByAction actionByStatus={actionTypeTS} task={selectedTask} onTaskSubmit={closeModal} />
          // </ModalCustom>
          <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText={selectedTask.task_status}>
            <RenderByAction actionByStatus={actionTypeTS} task={selectedTask} onTaskSubmit={closeModal} />
          </FullScreenDialog>
        )}
      </>
      <Loader reqStatus={reqStatus}>
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
              "& .super-app-theme--header": {
                backgroundColor: "rgba(255, 7, 0, 0.55)",
              },
              "& .super-app-theme--cell": {
                backgroundColor: "rgba(224, 183, 60, 0.55)",
                color: "#1a3e72",
                fontWeight: "600",
              },
            }}
            // autoHeight
            rowHeight={25}
            rows={sortedTasks.map(task => ({
              ...task,
              id: task.id,
            }))}
            columns={columns}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onCellClick={handleCellClick}
            getRowClassName={params => {
              if (params.row.read_status === "unread") {
                return "bold-row"
              }
              return params.row.read_status === "unread" ? "bold-row" : ""
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 15, 25]}
          />
        </Box>
      </Loader>
    </>
  )
}
