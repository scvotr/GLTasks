import "./TasksTable.css"
import { Box, Stack, useMediaQuery } from "@mui/material"
import { DataGrid, ruRU } from "@mui/x-data-grid"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined"
import { useEffect, useRef, useState } from "react"
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
  const [statusText, setStatusText] = useState("")
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 })

  const columns = [
    {
      field: "id",
      headerName: "№",
      description: "This column description",
      width: 50,
    },
    {
      field: "read_status",
      headerName: "",
      description: "This column description",
      width: 5,
      renderCell: params => (
        <Stack style={{ fontWeight: params.value === "unread" ? "bold" : "normal", color: params.value === "unread" ? "green" : "black" }}>
          {params.value === "unread" ? <EmailOutlinedIcon /> : <DraftsOutlinedIcon />}
        </Stack>
      ),
    },
    {
      field: "appoint_subdepartment_id",
      headerName: "",
      description: "This column description",
      width: 5,
      renderCell: params => {
        let render
        if (params.row.appoint_subdepartment_id.toString() === currentUser.subDep.toString()) {
          render = <UnarchiveOutlinedIcon />
        } else {
          render = <ArchiveOutlinedIcon />
        }
        return <Stack>{render}</Stack>
      },
    },
    {
      field: "task_status",
      headerName: "Статус",
      description: "Статус задачи",
      width: 120,
      renderCell: params => {
        let iconComponent
        let statusText

        switch (params.row.task_status) {
          case "toApprove":
            iconComponent = <HourglassEmptyIcon />
            statusText = "Новая"
            break
          case "approved":
            iconComponent = <CheckCircleOutlineIcon />
            statusText = "Согласована"
            break
          case "inWork":
            iconComponent = <AssignmentIcon />
            statusText = "В работе"
            break
          case "needToConfirm":
            iconComponent = <DoneOutlinedIcon />
            statusText = "На проверке"
            break
          case "closed":
            iconComponent = <DoneAllIcon />
            statusText = "Закрыта"
            break
          default:
            statusText = ""
        }

        return (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
            {iconComponent} {statusText}
            {/* {params.value} */}
          </Stack>
        )
      },
    },
    {
      field: "appoint_user_last_name",
      headerName: "От ",
      description: "От кого",
      width: 130,
    },
    { field: "responsible_subdepartment_name", headerName: "Для", description: "Для какого отдела", width: 220 },
    { field: "responsible_department_name", headerName: "Предприятие", description: "Для какого предприятия", width: 220 },
    {
      field: "responsible_user_last_name",
      headerName: "Ответственный",
      description: "Ответственное лицо",
      width: 140,
      cellClassName: "super-app-theme--cell",
      renderCell: params => {
        let render
        if (params.value) {
          render = params.value
        } else {
          render = "------"
        }
        return <div>{render}</div>
      },
    },

    { field: "task_descript", headerName: "Задача", description: "Краткое описание задания", width: gridSize.width >= 1633 ? 520 : 300 },

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
        const date = new Date(params.value)
        const formattedDate = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
        return <div>{formattedDate}</div>
      },
      comparator: (date1, date2) => {
        const dateObj1 = new Date(date1)
        const dateObj2 = new Date(date2)
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

  const [filterModel, setFilterModel] = useState({ items: [] })

  const handleFilterModelChange = newFilterModel => {
    setFilterModel(newFilterModel)
  }

  const gridRef = useRef(null)

  const updateGridSize = () => {
    if (gridRef.current) {
      const { clientWidth, clientHeight } = gridRef.current
      setGridSize({ width: clientWidth, height: clientHeight })
    }
  }
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateGridSize()
    })
    if (gridRef.current) {
      observer.observe(gridRef.current)
      updateGridSize() // Первоначальное измерение
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <>
        {selectedTask && (
          <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText={statusText}>
            <RenderByAction actionByStatus={actionTypeTS} task={selectedTask} onTaskSubmit={closeModal} />
          </FullScreenDialog>
        )}
      </>
      <Loader reqStatus={reqStatus}>
        <Box ref={gridRef}>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
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
            onFilterModelChange={handleFilterModelChange}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
            }}
            pageSizeOptions={[20, 25, 30]}
          />
        </Box>
      </Loader>
    </>
  )
}
