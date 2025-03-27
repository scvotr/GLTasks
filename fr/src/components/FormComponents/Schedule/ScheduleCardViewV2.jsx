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
  Tab,
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
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"

const OFF_TIME = "17:00:00"

const LinearDeterminate = memo(({ created_on, deadline_time, estimated_time }) => {
  const [progress, setProgress] = useState(0)
  // Memoize the calculation function to prevent unnecessary re-executions

  const calculateProgress = useCallback(() => {
    const deadlineDate = new Date(`${deadline_time} ${OFF_TIME}`)
    const createdDate = new Date(created_on)

    const totalTime = deadlineDate.getTime() - createdDate.getTime() // total time in milliseconds
    const elapsedTime = Date.now() - createdDate.getTime() // time elapsed since creation

    // const newProgress = Math.min((elapsedTime / totalTime) * 100, 100)
    // Ограничиваем прогресс между 0 и 100
    const newProgress = Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100)
    setProgress(newProgress)
  }, [created_on, deadline_time])

  useEffect(() => {
    calculateProgress()
  }, [calculateProgress])

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  )
})

const calculateRemainingTime = deadlineTime => {
  const now = new Date()
  const deadlineDate = new Date(`${deadlineTime} ${OFF_TIME}`)
  const timeDifference = deadlineDate - now // разница в миллисекундах
  if (timeDifference <= 0) {
    return true // если дедлайн уже прошел
  }

  const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  const secondsRemaining = Math.floor((timeDifference % (1000 * 60)) / 1000)

  return {
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    message: `${daysRemaining} дн. ${hoursRemaining} ч. ${minutesRemaining} мин. ${secondsRemaining} сек.`,
  }
}

export const ScheduleCardViewV2 = ({ schedules, reRender, isLead }) => {
  const [keyWordsFilter, setKeyWordsFilter] = useState("")
  const [doneSchedules, setDoneSchedules] = useState([])
  const [newSchedules, setNewSchedules] = useState([])
  const [value, setValue] = useState("new")

  useEffect(() => {
    if (Array.isArray(schedules)) {
      const filteredDoneSchedules = schedules.filter(schedule => schedule.schedule_status === "done")
      const filteredNewSchedules = schedules.filter(schedule => schedule.schedule_status === "new")
      setDoneSchedules(filteredDoneSchedules)
      setNewSchedules(filteredNewSchedules)
    } else {
      setDoneSchedules([])
      setNewSchedules([])
    }
  }, [schedules])

  const schedulesWithTime = useMemo(() => {
    return Object.values(newSchedules)
      .map(scheduleItem => ({
        ...scheduleItem,
        estimated_time: calculateRemainingTime(scheduleItem.deadline_time),
      }))
      .sort((a, b) => {
        if (a.schedule_status === "new" && b.schedule_status !== "new") return -1
        if (a.schedule_status !== "new" && b.schedule_status === "new") return 1
        return new Date(a.deadline_time) - new Date(b.deadline_time)
      })
  }, [newSchedules])

  const schedulesIsDone = useMemo(() => {
    return Object.values(doneSchedules).sort((a, b) => {
      return new Date(b.deadline_time) - new Date(a.deadline_time)
    })
  }, [doneSchedules])

  const filteredNewSchedules = schedulesWithTime.filter(schedule => schedule.schedule_description.toLowerCase().includes(keyWordsFilter.toLowerCase()))
  const filteredDoneSchedules = schedulesIsDone.filter(schedule => schedule.schedule_description.toLowerCase().includes(keyWordsFilter.toLowerCase()))

  // Проверка, является ли schedules массивом
  if (!Array.isArray(schedules)) {
    return <div>Ошибка: данные расписания недоступны или неверного типа.</div>
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue) // обновляем состояние при смене вкладки
  }

  return (
    <>
      <TabContext value={value} centered variant="scrollable" scrollButtons="auto">
        <TabList
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="lab API tabs example"
          sx={{ maxWidth: { xs: 320, sm: 1200, margin: "0 auto" } }}>
          <Tab label="Новые" value="new" />
          <Tab label="Выполненные" value="done" />
        </TabList>
        {value === "new" && (
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
            <CardView filteredSchedules={filteredNewSchedules} isLead={isLead} reRender={reRender} />
          </>
        )}
        {value === "done" && (
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
            <CardView filteredSchedules={filteredDoneSchedules} isLead={isLead} reRender={reRender} />
          </>
        )}
      </TabContext>
      {/* ------------------------------------------------- */}
    </>
  )
}

export const CardView = ({ filteredSchedules, isLead, reRender }) => {
  let transferData = {}
  const today = new Date()
  const currentUser = useAuthContext()
  const { popupSnackbar } = useSnackbar()
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [editableDescription, setEditableDescription] = useState("")
  const [editableDeadline, setEditableDeadline] = useState("")
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [scheduleIdToDone, setScheduleIdToDone] = useState(null)
  const [scheduleIdToEdit, setScheduleIdToEdit] = useState(null)
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [scheduleIdToCancel, setScheduleIdToCancel] = useState(false)

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

  return (
    <>
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

      <Box sx={{ mb: "50px" }}>
        {filteredSchedules.map(schedule => (
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
                    value={editableDescription} // Используем editableDescription как значение
                    onChange={e => setEditableDescription(e.target.value)} // Обновляем состояние при изменении текста
                    required
                    sx={{ width: "55%", m: "10px" }}
                  />
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "left", flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {schedule.schedule_description}
                  </Typography>
                </Box>
              )}
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
                            <Box>Просрочено!</Box>
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
                return <>{/* <LinearProgress variant="determinate" value={100} color="success" /> */}</>
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
