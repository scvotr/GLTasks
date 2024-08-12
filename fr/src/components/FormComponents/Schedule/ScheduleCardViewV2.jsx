import { Box, Divider, Paper, TextField, Typography, Snackbar, Alert } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { RadioGroupRating } from "../../Navigation/User/Menu/Schedule/RadioGroupRating/RadioGroupRating"
import { useState } from "react"
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog"
import { useAuthContext } from "../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"

export const ScheduleCardViewV2 = ({ schedules, reRender }) => {
  const currentUser = useAuthContext()
  const [scheduleIdToDone, setScheduleIdToDone] = useState(null)
  const [scheduleIdToEdit, setScheduleIdToEdit] = useState(null)
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [scheduleIdToCancel, setScheduleIdToCancel] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [editableDescription, setEditableDescription] = useState("")

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const popupSuccess = text => {
    setSnackbarMessage(text)
    setSnackbarSeverity("success")
    setOpenSnackbar(true)
  }
  const popupError = text => {
    setSnackbarMessage(text)
    setSnackbarSeverity("error")
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  let transferData = {}

  const handleEditDescription = async schedule => {
    setEditableDescription(schedule.schedule_description)
    setEditingScheduleId(schedule.schedule_id)

    transferData = {
      schedule_id: schedule.schedule_id,
      schedule_description: editableDescription,
    }
    if (editableDescription) {
      try {
        setReqStatus({ loading: true, error: null })
        await getDataFromEndpoint(currentUser.token, "/schedule/updateSchedule", "POST", transferData, setReqStatus)
        reRender(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
        setEditingScheduleId(null)
        setEditableDescription("")
        popupSuccess('Задача успешно обновлена!')
      } catch (error) {
        popupError('Ошибка при обновлении задачи.')
        setReqStatus({ loading: false, error: error })
      }
    }
  }

  const handleDoneSchedule = async schedule_id => {
    transferData = {
      schedule_id: schedule_id,
      schedule_status: "done",
    }
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/updateSchedule", "POST", transferData, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
      popupSuccess('Задача выполнена!')
    } catch (error) {
      popupError('Ошибка при закрытии задачи.')
      setReqStatus({ loading: false, error: error })
    }
  }

  const handleDeleteSchedule = async schedule_id => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/removeSchedule", "POST", schedule_id, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
      popupSuccess('Задача удаленна!')
    } catch (error) {
      popupError('Ошибка при удалении задачи.')
      setReqStatus({ loading: false, error: error })
    }
  }

  const handleCancelEdit = () => {
    setEditingScheduleId(null)
    setEditableDescription("") // Сбросьте редактируемое описание
  }

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return <div>Активных задач нет</div>
  }
  return (
    <>
      <Box>
        {schedules.map((schedule, index) => (
          <Paper key={schedule.schedule_id} component="form" sx={{ m: "10px", p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
            <Tooltip title="Завершить">
              <IconButton
                disabled={!!editingScheduleId || schedule.schedule_status === "done"}
                onClick={() => {
                  setScheduleIdToDone(schedule.schedule_id)
                  setDialogText({ title: "Подтвердите выполнение", message: "Вы уверены, что хотите завершить это задание?" })
                  setOpenDialog(true)
                }}>
                {schedule.schedule_status === "done" ? <DoneAllOutlinedIcon sx={{ color: "green" }} /> : <DoneOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            {editingScheduleId === schedule.schedule_id ? (
              <TextField
                id="task_description"
                label="Введите описание задачи"
                placeholder="текст задачи"
                multiline
                minRows={2}
                maxRows={10}
                value={editableDescription} // Используем editableDescription как значение
                onChange={e => setEditableDescription(e.target.value)} // Обновляем состояние при изменении текста
                required
              />
            ) : (
              <Typography variant="h6" gutterBottom>
                {schedule.schedule_description}
              </Typography>
            )}
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Typography variant="overline" display="block" gutterBottom>
              {schedule.created_on}
            </Typography>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <RadioGroupRating rate={schedule.schedule_priority_rate} viewOnly={true} />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Tooltip title="Редактировать">
              <IconButton
                sx={{ color: editingScheduleId === schedule.schedule_id ? "green" : "inherit" }}
                onClick={() => {
                  setScheduleIdToEdit(schedule)
                  setDialogText({ title: "Изменить задачу", message: "Вы уверены, что хотите изменить эту задачу?" })
                  setOpenDialog(true)
                }}>
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
            {editingScheduleId === schedule.schedule_id && (
              <>
                <Tooltip title="Отменить">
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => {
                      setScheduleIdToCancel(true)
                      setDialogText({ title: "Отменить изменения", message: "Вы уверены, что хотите отменить изменения?" })
                      setOpenDialog(true)
                    }}>
                    <CancelOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Divider sx={{ height: 15, m: 0.5 }} orientation="vertical" />
            <Tooltip title="Удалить">
              <IconButton
                disabled={!!editingScheduleId}
                onClick={() => {
                  setScheduleIdToDelete(schedule.schedule_id)
                  setDialogText({ title: "Подтвердите удаление", message: "Вы уверены, что хотите удалить это задание?" })
                  setOpenDialog(true)
                }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          </Paper>
        ))}
         {/* Компонент Snackbar для уведомлений */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setScheduleIdToDelete(null)
        }}
        onConfirm={() => {
          if (scheduleIdToDelete) {
            handleDeleteSchedule(scheduleIdToDelete)
            setScheduleIdToDelete(null)
          } else if (scheduleIdToDone) {
            handleDoneSchedule(scheduleIdToDone)
            setScheduleIdToDone(null)
          } else if (scheduleIdToEdit) {
            handleEditDescription(scheduleIdToEdit)
            setScheduleIdToEdit(null)
          } else if (setScheduleIdToCancel) {
            handleCancelEdit()
          }
          setOpenDialog(false)
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
    </>
  )
}
