import { Typography, Grid, Card, CardContent, Divider, Box, Stack, ImageList, ImageListItem, Stepper, Step, StepLabel } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"
import { HOST_ADDR } from "../../../../utils/remoteHosts"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ModalCustom } from "../../../ModalCustom/ModalCustom"
import { Loader } from "../../Loader/Loader"
import { TaskCommets } from "../TaskCommets/TaskCommets"

export const getPreviewFileContent = async (token, data, onSuccess) => {
  try {
    const res = await fetch(HOST_ADDR + "/tasks/getPreviewFileContent", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const responseData = await res.json()
      onSuccess(responseData)
      return responseData
    } else {
      throw new Error("Server response was not ok")
    }
  } catch (error) {
    onSuccess(error)
  }
}

const getFullFile = async (file, task_id, token) => {
  const { type, name } = file
  const data = {
    type,
    name,
    task_id,
  }
  try {
    const res = await fetch(HOST_ADDR + "/tasks/getFullFileContent", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const resData = await res.json()
      return resData
    } else {
      throw new Error("Server response was not ok or content type is not JSON")
    }
  } catch (error) {
    console.log(error)
  }
}

export const FullTaskInfo = ({ task }) => {
  const {
    id,
    task_id,
    task_status,
    created_on,
    deadline,
    approved_on,
    setResponseUser_on,
    confirmation_on,
    reject_on,
    closed_on,
    appoint_department_name,
    appoint_subdepartment_name,
    appoint_user_last_name,
    appoint_user_name,
    appoint_user_middle_name,
    responsible_user_last_name,
    responsible_user_name,
    responsible_user_middle_name,
    responsible_department_name,
    responsible_subdepartment_name,
    responsible_position_name,
    task_descript,
    old_files,
  } = task

  console.log(task)

  const timeSteps = [
    { key: "created_on", value: "Создана: " + formatDate(created_on) },
    { key: "deadline", value: "Выполнить до: " + formatDate(deadline) },
    { key: "approved_on", value: approved_on ? "Согласованна: " + formatDate(approved_on) : null, default: "На согласовании" },
    {
      key: "setResponseUser_on",
      value: setResponseUser_on ? "Ответственный назначен: " + formatDate(setResponseUser_on) : null,
      default: "Назначение ответственного",
    },
    {
      key: "responsible_user_last_name",
      value: responsible_user_last_name ? "Ответственный: " + responsible_user_last_name : null,
      default: "ФИО ответсвенного",
    },
    { key: "responsible_position_name", value: responsible_position_name ? "Должность: " + responsible_position_name : null, default: "Должность" },
    { key: "confirmation_on", value: confirmation_on ? "Отправлена на проверку: " + formatDate(confirmation_on) : null, default: "Проверка" },
    { key: "closed_on", value: closed_on ? "Закрыта: " + formatDate(closed_on) : null, default: "Закрытие" },
  ]

  if (reject_on !== null) {
    timeSteps.push({ key: "reject_on", value: reject_on ? "Отклонена: " + formatDate(reject_on) : null })
  }

  const nonNullCountTimeSteps = timeSteps.filter(item => item.value !== null).length

  const unitSteps = [
    { key: "appoint_department_name", value: "От Департамента:: " + appoint_department_name },
    { key: "appoint_subdepartment_name", value: "От Отдела: " + appoint_subdepartment_name },
    { key: "appoint_user_last_name", value: appoint_user_last_name ? "От Сотрудника: " + appoint_user_last_name : null, default: "Назначивший" },
    {
      key: "responsible_department_name",
      value: responsible_department_name ? "Для Департамента: " + responsible_department_name : null,
      default: "Для Департамента",
    },
    {
      key: "responsible_subdepartment_name",
      value: responsible_subdepartment_name ? "Для Департамента: " + responsible_subdepartment_name : null,
      default: "Для Отдела",
    },
  ]

  const nonNullCountUnitSteps = unitSteps.filter(item => item.value !== null).length

  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [taskData, setTaskData] = useState(task)

  useEffect(() => {
    if (task.old_files) {
      getPreviewFileContent(currentUser.token, task, setReqStatus)
        .then(data => {
          const updatedTaskToEdit = { ...task, old_files: data }
          setTaskData({ ...task, ...updatedTaskToEdit })
        })
        .catch(error => {
          // Обработка ошибки, если необходимо
        })
    } else {
      setTaskData(task)
    }
  }, [task])

  const [modalOpen, setModalOpen] = useState(false)

  const openModal = task => {
    // setSelectedTask(task)
    setModalOpen(true)
  }
  const closeModal = () => {
    // setSelectedTask(null)
    setModalOpen(false)
    // reRender(prevKey => prevKey + 1)
  }

  const [selectedImage, setSelectedImage] = useState("")

  const handleImageClick = async file => {
    try {
      setReqStatus({ loading: true, error: null })
      const test = await getFullFile(file, task_id, currentUser.token)
      setReqStatus({ loading: false, error: null })
      setSelectedImage(test)
      setModalOpen(true)
    } catch (error) {}
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h4">Номер задачи: {id}</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid xs={8}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}>
                <Stack direction="column" spacing={5}>
                  <Stepper activeStep={nonNullCountUnitSteps} alternativeLabel>
                    {unitSteps &&
                      unitSteps.map(label => (
                        <Step key={label}>
                          <StepLabel>{label.value === null ? label.default : label.value}</StepLabel>
                        </Step>
                      ))}
                  </Stepper>
                  <Stepper activeStep={nonNullCountTimeSteps} alternativeLabel>
                    {timeSteps &&
                      timeSteps.map(label => (
                        <Step key={label}>
                          <StepLabel>{label.value === null ? label.default : label.value}</StepLabel>
                        </Step>
                      ))}
                  </Stepper>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}></Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}>
            <Divider />
            <Stack direction="column">
              <Typography variant="subtitle1">
                <strong>Задача:</strong>
              </Typography>
              <Typography variant="body1">{task_descript}</Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}>
        <Divider />
        <Loader reqStatus={reqStatus}>
          <ImageList sx={{ width: 500, height: 250 }} cols={3} rowHeight={164}>
            {taskData.old_files &&
              taskData.old_files.map((file, index) => (
                <ImageListItem key={index}>
                  <img
                    key={index}
                    src={`data:${file.type};base64,${file.content}`}
                    alt="File Preview"
                    loading="lazy"
                    onClick={() => handleImageClick(file)}
                    title="Нажмите, чтобы удалить"
                  />
                </ImageListItem>
              ))}
          </ImageList>
          {/* <TaskCommets task={task} /> */}
        </Loader>
      </Box>

      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="dsdsdsd">
          <ImageList sx={{ width: 800, height: 600 }} cols={1} rowHeight={164}>
            <ImageListItem>
              <img src={`data:${selectedImage.type};base64,${selectedImage.content}`} alt="File Preview" loading="lazy" title="Нажмите, чтобы удалить" />
            </ImageListItem>
          </ImageList>
        </ModalCustom>
      </>
    </>
  )
}
