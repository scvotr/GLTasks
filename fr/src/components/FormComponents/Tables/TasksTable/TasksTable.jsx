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
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined"
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined"
import RoundaboutRightOutlinedIcon from "@mui/icons-material/RoundaboutRightOutlined"
import RoundaboutLeftOutlinedIcon from "@mui/icons-material/RoundaboutLeftOutlined"

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CancelIcon from "@mui/icons-material/Cancel"
import DoneAllIcon from "@mui/icons-material/DoneAll"

export const TasksTable = ({ tasks, reRender }) => {
  console.log(tasks)
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [actionTypeTS, setActionTypeTS] = useState()

  const columns = [
    { field: "task_id", headerName: "№", description: "This column description", width: 70 },
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

    // { field: "appoint_department_name", headerName: "Назначил", description: "От кого", width: 150 },
    // { field: "appoint_subdepartment_name", headerName: "Отдел", description: "От кого", width: 170 },
    {
      field: "appoint_user_last_name",
      headerName: "От ",
      description: "От кого",
      width: 150,
      renderCell: params => (
        <div>
          <SportsKabaddiOutlinedIcon style={{ marginRight: "5px" }} />
          {params.value}
        </div>
      ),
    },

    // { field: "responsible_department_name", headerName: "Исполнитель", description: "Для кого", width: 220 },
    { field: "responsible_subdepartment_name", headerName: "Для", description: "От кого", width: 150 },
    {
      field: "responsible_user_last_name",
      headerName: "Ответсвеный",
      description: "Кому",
      width: 150,
      renderCell: params => (
        <div>
          <DriveFileMoveOutlinedIcon style={{ marginRight: "5px" }} />
          {params.value}
        </div>
      ),
    },

    { field: "task_descript", headerName: "Задача", description: "Краткое описание", width: 350 },
    {
      field: "task_status",
      headerName: "Статус",
      description: "Статус задачи",
      width: 100,
      renderCell: params => {
        let iconComponent

        if (params.row.task_status === "toApprove") {
          iconComponent = <HourglassEmptyIcon />
        } else if (params.row.task_status === "approved") {
          iconComponent = <CheckCircleOutlineIcon />
        } else if (params.row.task_status === "inWork") {
          iconComponent = <AssignmentIcon />
        } else if (params.row.task_status === "needToConfirm") {
          iconComponent = <CancelIcon />
        } else if (params.row.task_status === "closed") {
          iconComponent = <DoneAllIcon />
        }

        return (
          <div>
            {iconComponent}
            {params.value}
          </div>
        )
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
      <Box
        style={{
          height: "100%",
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
          getRowClassName={params => {
            if (params.row.read_status === "unread") {
              return "bold-row"
            }
            if (params.row.read_status === "readed") {
              if (params.row.task_status === "toApprove") {
                return "toApprove-row"
              } else if (params.row.task_status === "approved") {
                return "approved-row"
              } else if (params.row.task_status === "inWork") {
                return "inWork-row"
              } else if (params.row.task_status === "needToConfirm") {
                return "needToConfirm-row"
              } else if (params.row.task_status === "closed") {
                return "closed-row"
              }
            }
            // return params.row.read_status === "unread" ? "bold-row" : ""
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
