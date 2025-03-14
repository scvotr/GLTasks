import {
  Box,
  Divider,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  LinearProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { RadioGroupRating } from "../../Navigation/User/Menu/Schedule/RadioGroupRating/RadioGroupRating"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog"
import { useAuthContext } from "../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { formatDate } from "../../../utils/formatDate"
import { PrintTaskList } from "./PrintTaskList"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { Loader } from "../Loader/Loader"
import { useSnackbar } from "../../../context/SnackbarProvider"

const OFF_TIME = "17:00:00"

// Memoize the component to prevent unnecessary re-renders
const LinearDeterminate = memo(({ created_on, deadline_time, estimated_time }) => {
  const [progress, setProgress] = useState(0)

  // Memoize the calculation function to prevent unnecessary re-executions
  const calculateProgress = useCallback(() => {
    const deadlineDate = new Date(`${deadline_time} ${OFF_TIME}`)
    const createdDate = new Date(created_on)
    const totalTime = deadlineDate.getTime() - createdDate.getTime() // total time in milliseconds
    const elapsedTime = Date.now() - createdDate.getTime() // time elapsed since creation

    const newProgress = Math.min((elapsedTime / totalTime) * 100, 100)
    setProgress(newProgress)
  }, [])

  useEffect(() => {
    calculateProgress()
  }, [calculateProgress])

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  )
})

export const ScheduleCardViewV2 = ({ schedules, reRender, isLead }) => {
  // const today = new Date().toISOString().split("T")[0]
  const today = new Date()
  const currentUser = useAuthContext()
  const { popupSnackbar } = useSnackbar()
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [editableDescription, setEditableDescription] = useState("")
  const [editableDeadline, setEditableDeadline] = useState("")
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [openDialog, setOpenDialog] = useState(false)
  const [keyWordsFilter, setKeyWordsFilter] = useState("")
  const [scheduleIdToDone, setScheduleIdToDone] = useState(null)
  const [scheduleIdToEdit, setScheduleIdToEdit] = useState(null)
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [scheduleIdToCancel, setScheduleIdToCancel] = useState(false)

  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  let transferData = {}

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

  //! console.log(schedules)
  //! Преобразуем объект в массив значений
  //! const schedulesArray = Object.values(schedules)
  //! Теперь можно использовать filter
  //! const ts = schedulesArray.filter(sc => sc.schedule_status !== "done")
  //! console.log(ts)

  const schedulesWithTime = useMemo(() => {
    return Object.values(schedules)
      .map(scheduleItem => ({
        ...scheduleItem,
        estimated_time: calculateRemainingTime(scheduleItem.deadline_time),
      }))
      .sort((a, b) => {
        if (a.schedule_status === "new" && b.schedule_status !== "new") return -1
        if (a.schedule_status !== "new" && b.schedule_status === "new") return 1
        return new Date(a.deadline_time) - new Date(b.deadline_time)
      })
  }, [schedules])

  // Фильтрация расписаний на основе введенного запроса
  const filteredSchedules = schedulesWithTime.filter(schedule => schedule.schedule_description.toLowerCase().includes(keyWordsFilter.toLowerCase()))

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
        popupSnackbar("Задача изменена!", "success")
      } catch (error) {
        popupSnackbar("Ошибка при редактировании задачи.", "error")
        setReqStatus({ loading: false, error: error })
      } finally {
        setReqStatus({ loading: false, error: null })
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
      popupSnackbar("Задача выполнена!", "success")
    } catch (error) {
      popupSnackbar("Ошибка при закрытии задачи.", "error")
      setReqStatus({ loading: false, error: error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  const handleDeleteSchedule = async schedule_id => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/removeSchedule", "POST", schedule_id, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Задача удаленна!", "success")
    } catch (error) {
      popupSnackbar("Ошибка при удалении задачи.", "error")
      setReqStatus({ loading: false, error: error })
    } finally {
      setReqStatus({ loading: false, error: null })
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
          label="Поиск по тексту"
          value={keyWordsFilter}
          onChange={e => setKeyWordsFilter(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </Box>
      <Loader reqStatus={reqStatus}>
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        <Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
              <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                <LocalPrintshopOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" gutterBottom align="center">
                  Распечатать задачи
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PrintTaskList tasks={filteredSchedules} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Loader>
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      <Box sx={{ mb: "50px" }}>
        {filteredSchedules &&
          filteredSchedules.map((schedule, index) => (
            <Box key={schedule.schedule_id} sx={{ m: "10px", width: "100%" }}>
              <Paper
                key={schedule.schedule_id}
                component="form"
                sx={{ mt: "5px", p: "2px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "left" }}>
                  <Tooltip title="Завершить">
                    <span>
                      <IconButton
                        disabled={!!editingScheduleId || schedule.schedule_status === "done" || isLead}
                        onClick={() => {
                          setScheduleIdToDone(schedule.schedule_id)
                          setDialogText({ title: "Подтвердите выполнение", message: "Вы уверены, что хотите завершить это задание?" })
                          setOpenDialog(true)
                        }}>
                        {schedule.schedule_status === "done" ? <DoneAllOutlinedIcon sx={{ color: "green" }} /> : <DoneOutlinedIcon />}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Box>
                {editingScheduleId === schedule.schedule_id ? (
                  <>
                    <TextField
                      id="task_description"
                      label="Введите описание задачи"
                      placeholder="текст задачи"
                      // multiline
                      // minRows={2}
                      // maxRows={10}
                      value={editableDescription} // Используем editableDescription как значение
                      onChange={e => setEditableDescription(e.target.value)} // Обновляем состояние при изменении текста
                      required
                      sx={{ width: "55%", m: "10px" }}
                    />
                    {/* <textarea
                      id="task_description"
                      placeholder="текст задачи"
                      value={editableDescription}
                      onChange={e => setEditableDescription(e.target.value)}
                      required
                      // rows="2"
                      className="textarea-custom"
                    /> */}
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "left", flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {schedule.schedule_description}
                    </Typography>
                  </Box>
                )}
                {/* --------------------------------------------------------------- */}
                {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
                {/* <RadioGroupRating rate={schedule.schedule_priority_rate} viewOnly={true} /> */}
                {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
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
                          <Typography variant="body2" component="div">
                            <Stack>
                              <Box>До:</Box>
                              <Box>{formatDate(schedule.deadline_time)}</Box>
                             </Stack>
                          </Typography>
                          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        </>
                      )}
                    </>
                  )}
                  <Typography variant="body2" color="textSecondary" component="div">
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
                          <span>
                            <IconButton disabled>
                              <EditOutlinedIcon />
                            </IconButton>
                          </span>
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
                        <span>
                          <IconButton
                            // disabled={!!editingScheduleId || schedule.schedule_status === "done"}
                            onClick={() => {
                              setScheduleIdToDelete(schedule.schedule_id)
                              setDialogText({ title: "Подтвердите удаление", message: "Вы уверены, что хотите удалить это задание?" })
                              setOpenDialog(true)
                            }}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </>
                  )}
                </Box>
              </Paper>

              {(() => {
                if (schedule.estimated_time === true && schedule.schedule_status !== "done") {
                  return (
                    <>
                      <LinearProgress variant="determinate" value={100} color="secondary" />
                    </>
                  )
                } else if (schedule.schedule_status === "done") {
                  return (
                    <>
                      <LinearProgress variant="determinate" value={100} color="success" />
                    </>
                  )
                } else {
                  return (
                    <>
                      {!editingScheduleId && (
                        <LinearDeterminate
                          sx={{ width: "100%" }}
                          created_on={schedule.created_on}
                          deadline_time={schedule.deadline_time}
                          estimated_time={schedule.estimated_time}
                        />
                      )}
                    </>
                  )
                }
              })()}
            </Box>
          ))}
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
