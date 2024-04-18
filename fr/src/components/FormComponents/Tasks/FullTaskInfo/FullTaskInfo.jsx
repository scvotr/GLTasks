import { Typography, Grid, Card, CardContent, Divider, Box, Stack, ImageList, ImageListItem } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"
import { HOST_ADDR } from "../../../../utils/remoteHosts"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ModalCustom } from "../../../ModalCustom/ModalCustom"
import { Loader } from "../../Loader/Loader"

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
          <Typography variant="h4">Task ID: {task_id.slice(0, 4)}</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}>
                <Stack direction="column">
                  <Typography variant="body1">
                    <strong>Статус:</strong> {task_status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Создана:</strong> {formatDate(created_on)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Выполнить до:</strong> {formatDate(deadline)}
                  </Typography>
                  {approved_on && (
                    <Typography variant="body1">
                      <strong>Согласованна:</strong> {formatDate(approved_on)}
                    </Typography>
                  )}
                  {setResponseUser_on && (
                    <Typography variant="body1">
                      <strong>В работе с:</strong> {formatDate(setResponseUser_on)}
                    </Typography>
                  )}
                  {responsible_user_name && (
                    <Typography variant="body1">
                      <strong>Ответственный:</strong> {responsible_user_last_name}
                    </Typography>
                  )}
                  {confirmation_on && (
                    <Typography variant="body1">
                      <strong>Отправлена на проверку:</strong> {formatDate(confirmation_on)}
                    </Typography>
                  )}
                  {reject_on && (
                    <Typography variant="body1">
                      <strong>Отклонена:</strong> {formatDate(reject_on)}
                    </Typography>
                  )}
                  {closed_on && (
                    <Typography variant="body1">
                      <strong>Закрыта:</strong> {formatDate(closed_on)}
                    </Typography>
                  )}
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
                }}>
                <Stack direction="column">
                  <Typography variant="subtitle1">
                    <strong>От Департамента:</strong> {appoint_department_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>От Отдела:</strong> {appoint_subdepartment_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>От Сотрудника:</strong> {appoint_user_last_name}
                  </Typography>

                  <Typography variant="subtitle1">
                    <strong>Для Департамента:</strong> {responsible_department_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Для Отдела:</strong> {responsible_subdepartment_name}
                  </Typography>
                  {responsible_position_name && (
                    <>
                      <Typography variant="subtitle1">
                        <strong>Для Службы:</strong> {responsible_position_name}
                      </Typography>
                    </>
                  )}
                  {responsible_user_name && (
                    <>
                      <Typography variant="subtitle1">
                        <strong>Для:</strong> {responsible_user_last_name}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Box>
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
