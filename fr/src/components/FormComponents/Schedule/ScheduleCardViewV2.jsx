import { Box, Divider, Paper, TextField, Typography, Snackbar, Alert, LinearProgress, Stack } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { RadioGroupRating } from "../../Navigation/User/Menu/Schedule/RadioGroupRating/RadioGroupRating"
import { useEffect, useState } from "react"
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog"
import { useAuthContext } from "../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { formatDate } from "../../../utils/formatDate"

const OFF_TIME = "17:00:00"

function LinearDeterminate({ created_on, deadline_time, estimated_time }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const deadlineDate = new Date(`${deadline_time} ${OFF_TIME}`)
      const createdDate = new Date(created_on)
      const totalTime = deadlineDate.getTime() - createdDate.getTime() // общее время выполнения в миллисекундах
      const elapsedTime = Date.now() - createdDate.getTime() // время, прошедшее с момента создания

      const newProgress = Math.min((elapsedTime / totalTime) * 100, 100)
      setProgress(newProgress)
    }

    calculateProgress()
  }, [created_on, deadline_time, estimated_time])

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  )
}

export const ScheduleCardViewV2 = ({ schedules, reRender, isLead }) => {
  // const today = new Date().toISOString().split("T")[0]
  const today = new Date()
  const currentUser = useAuthContext()
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [editableDescription, setEditableDescription] = useState("")
  const [editableDeadline, setEditableDeadline] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [openDialog, setOpenDialog] = useState(false)
  const [keyWordsFilter, setKeyWordsFilter] = useState("")
  console.log(keyWordsFilter)

  const [scheduleIdToDone, setScheduleIdToDone] = useState(null)
  const [scheduleIdToEdit, setScheduleIdToEdit] = useState(null)
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [scheduleIdToCancel, setScheduleIdToCancel] = useState(false)

  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  let transferData = {}

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

  const calculateEstimatedTime = (createdOn, deadlineTime) => {
    const createdDate = new Date(createdOn)
    const deadlineDate = new Date(deadlineTime)
    const timeDifference = (deadlineDate - createdDate) / (1000 * 60 * 60) // разница в часах
    return timeDifference.toFixed(2) // округляем до двух знаков после запятой
  }

  const calculateRemainingTime = deadlineTime => {
    const now = new Date()
    const deadlineDate = new Date(`${deadlineTime} ${OFF_TIME}`)
    const timeDifference = deadlineDate - now // разница в миллисекундах
    if (timeDifference <= 0) {
      return true // если дедлайн уже прошел
    }

    // const hoursRemaining = (timeDifference / (1000 * 60)).toFixed(2) // конвертируем в часы
    // return hoursRemaining

    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    const secondsRemaining = Math.floor((timeDifference % (1000 * 60)) / 1000)

    // return `${daysRemaining} дн. ${hoursRemaining} ч. ${minutesRemaining} мин. ${secondsRemaining} сек.`
    return {
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      secondsRemaining,
      message: `${daysRemaining} дн. ${hoursRemaining} ч. ${minutesRemaining} мин. ${secondsRemaining} сек.`,
    }
  }

  const schedulesWithTime = Object.values(schedules).map(scheduleItem => ({
    ...scheduleItem,
    // estimated_time: calculateEstimatedTime(scheduleItem.created_on, scheduleItem.deadline_time),
    estimated_time: calculateRemainingTime(scheduleItem.deadline_time),
  }))

  // Фильтрация расписаний на основе введенного запроса
  const filteredSchedules = schedulesWithTime.filter(schedule => schedule.schedule_description.toLowerCase().includes(keyWordsFilter.toLowerCase()))

  console.log(filteredSchedules)

  const handleEditDescription = async schedule => {
    setEditableDescription(schedule.schedule_description)
    setEditingScheduleId(schedule.schedule_id)
    setEditableDeadline(schedule.deadline_time)

    transferData = {
      schedule_id: schedule.schedule_id,
      schedule_description: editableDescription,
      deadline_time: editableDeadline || schedule.deadline_time, // Используем новую дату, если она была изменена, иначе оставляем старую
    }
    if (editableDescription) {
      try {
        setReqStatus({ loading: true, error: null })
        await getDataFromEndpoint(currentUser.token, "/schedule/updateSchedule", "POST", transferData, setReqStatus)
        reRender(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
        setEditingScheduleId(null)
        setEditableDescription("")
        popupSuccess("Задача успешно обновлена!")
      } catch (error) {
        popupError("Ошибка при обновлении задачи.")
        setReqStatus({ loading: false, error: error })
      }
    }
  }

  const handleDoneSchedule = async schedule_id => {
    transferData = {
      schedule_id: schedule_id,
      schedule_status: "done",
      ahead_completed_time: today,
    }
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/updateSchedule", "POST", transferData, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
      popupSuccess("Задача выполнена!")
    } catch (error) {
      popupError("Ошибка при закрытии задачи.")
      setReqStatus({ loading: false, error: error })
    }
  }

  const handleDeleteSchedule = async schedule_id => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/removeSchedule", "POST", schedule_id, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
      popupSuccess("Задача удаленна!")
    } catch (error) {
      popupError("Ошибка при удалении задачи.")
      setReqStatus({ loading: false, error: error })
    }
  }

  const handleCancelEdit = () => {
    setEditingScheduleId(null)
    setEditableDescription("") // Сбросьте редактируемое описание
    setEditableDeadline("") // Сбросить редактируемую дату
  }

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return <></>
  }
  return (
    <>
      <Box sx={{ m: "10px", width: "100%" }}>
        <TextField
          label="Фильтр по тексту задачь"
          value={keyWordsFilter}
          onChange={e => setKeyWordsFilter(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </Box>
      <Box>
        {filteredSchedules &&
          filteredSchedules.map((schedule, index) => (
            <Box key={schedule.schedule_id} sx={{ m: "10px", width: "100%" }}>
              {(() => {
                if (schedule.estimated_time === true && schedule.schedule_status !== "done") {
                  return (
                    <>
                      <LinearProgress variant="determinate" color="secondary" />
                    </>
                  )
                } else if (schedule.schedule_status === "done") {
                  return (
                    <>
                      <LinearProgress variant="determinate" color="success" />
                    </>
                  )
                } else {
                  return (
                    <>
                      <LinearDeterminate
                        sx={{ width: "100%" }}
                        created_on={schedule.created_on}
                        deadline_time={schedule.deadline_time}
                        estimated_time={schedule.estimated_time}
                      />
                    </>
                  )
                }
              })()}
              <Paper
                key={schedule.schedule_id}
                component="form"
                sx={{ mt: "5px", p: "2px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "left" }}>
                  <Tooltip title="Завершить">
                    <IconButton
                      disabled={!!editingScheduleId || schedule.schedule_status === "done" || isLead}
                      onClick={() => {
                        setScheduleIdToDone(schedule.schedule_id)
                        setDialogText({ title: "Подтвердите выполнение", message: "Вы уверены, что хотите завершить это задание?" })
                        setOpenDialog(true)
                      }}>
                      {schedule.schedule_status === "done" ? <DoneAllOutlinedIcon sx={{ color: "green" }} /> : <DoneOutlinedIcon />}
                    </IconButton>
                  </Tooltip>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Box>
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
                    sx={{ width: "55%", m: "10px" }}
                  />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "left", flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {schedule.schedule_description}
                    </Typography>
                  </Box>
                )}
                {/* --------------------------------------------------------------- */}
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <RadioGroupRating rate={schedule.schedule_priority_rate} viewOnly={true} />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                {/* --------------------------------------------------------------- */}
                <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                  {editingScheduleId === schedule.schedule_id ? (
                    <>
                      <Divider sx={{ height: 60, m: 0.5 }} orientation="vertical" />
                      <TextField
                        id="deadline_time"
                        label="Выполнить до:"
                        type="date"
                        name="deadline_time"
                        InputLabelProps={{ shrink: true }}
                        value={editableDeadline} // Используем состояние для даты
                        onChange={e => setEditableDeadline(e.target.value)} // Обновляем состояние даты
                        variant="outlined"
                        sx={{ m: "10px" }}
                        // inputProps={{ min: schedule.deadline_time }} // Ограничиваем минимальную дату
                        inputProps={{ min: today }} // Ограничиваем минимальную дату
                        required
                      />
                      <Divider sx={{ height: 60, m: 0.5 }} orientation="vertical" />
                    </>
                  ) : (
                    <>
                      {schedule.schedule_status === "done" ? (
                        <></>
                      ) : (
                        <>
                          {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
                          <Typography variant="body2">
                            <Stack>
                              <Box>До:</Box>
                              <Box>{formatDate(schedule.deadline_time)}</Box>
                              {/* <Box>
                                {" "}
                                {schedule.estimated_time.daysRemaining > 0 && <span>{schedule.estimated_time.daysRemaining} дн. </span>}
                                {schedule.estimated_time.hoursRemaining > 0 && <span>{schedule.estimated_time.hoursRemaining} ч. </span>}
                                {schedule.estimated_time.minutesRemaining > 0 && <span>{schedule.estimated_time.minutesRemaining} м. </span>}
                                {schedule.estimated_time.secondsRemaining > 0 && <span>{schedule.estimated_time.secondsRemaining} с.</span>}
                              </Box> */}
                            </Stack>
                          </Typography>
                          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        </>
                      )}
                    </>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {(() => {
                      if (schedule.estimated_time === true && schedule.schedule_status !== "done") {
                        return (
                          <>
                            <Stack>
                              <Box>Просроченно!</Box>
                              <Box>{formatDate(schedule.deadline_time)}</Box>
                            </Stack>
                          </>
                        )
                      } else if (schedule.schedule_status === "done") {
                        return (
                          <>
                            <Stack sx={{ bgcolor: "yellow" }}>
                              <Box>Завершено</Box>
                              <Box>{formatDate(schedule.ahead_completed_time)}</Box>
                            </Stack>
                          </>
                        )
                      } else {
                        return (
                          <>
                            {schedule.estimated_time.daysRemaining > 0 && <span>{schedule.estimated_time.daysRemaining} дн. </span>}
                            {schedule.estimated_time.hoursRemaining > 0 && <span>{schedule.estimated_time.hoursRemaining} ч. </span>}
                            {schedule.estimated_time.minutesRemaining > 0 && <span>{schedule.estimated_time.minutesRemaining} м. </span>}
                            {schedule.estimated_time.secondsRemaining > 0 && <span>{schedule.estimated_time.secondsRemaining} с.</span>}
                          </>
                        )
                      }
                    })()}
                  </Typography>
                  {isLead ? (
                    <></>
                  ) : (
                    <>
                      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                      <Tooltip title="Редактировать">
                        {schedule.schedule_status === "done" ? (
                          <IconButton disabled>
                            <EditOutlinedIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            sx={{ color: editingScheduleId === schedule.schedule_id ? "green" : "inherit" }}
                            onClick={() => {
                              setScheduleIdToEdit(schedule)
                              setDialogText({ title: "Изменить задачу", message: "Вы уверены, что хотите изменить эту задачу?" })
                              setOpenDialog(true)
                            }}>
                            <EditOutlinedIcon />
                          </IconButton>
                        )}
                      </Tooltip>
                    </>
                  )}
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
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  {isLead ? (
                    <></>
                  ) : (
                    <>
                      <Tooltip title="Удалить">
                        <IconButton
                          // disabled={!!editingScheduleId || schedule.schedule_status === "done"}
                          onClick={() => {
                            setScheduleIdToDelete(schedule.schedule_id)
                            setDialogText({ title: "Подтвердите удаление", message: "Вы уверены, что хотите удалить это задание?" })
                            setOpenDialog(true)
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
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
