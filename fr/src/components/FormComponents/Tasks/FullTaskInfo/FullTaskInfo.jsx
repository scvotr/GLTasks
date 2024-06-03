import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Stack,
  ImageList,
  ImageListItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
} from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"
import { HOST_ADDR } from "../../../../utils/remoteHosts"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ModalCustom } from "../../../ModalCustom/ModalCustom"
import { Loader } from "../../Loader/Loader"
import { TaskComments } from "../TaskComments/TaskComments"
import { styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import { UseAccordionView } from "../../Accordion/UseAccordionView"
import { TaskDetailsCard } from "./TaskDetailsCard"
import { TaskProgressCard } from "./TaskProgressCard"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
}))

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
  console.log(task)
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [taskFiles, setTaskFiles] = useState(task)
  const [taskFilesPDF, setTaskFilesPDF] = useState([])
  const [taskFilesIMAGE, setTaskFilesIMAGE] = useState([])
  const [selectedImage, setSelectedImage] = useState({})
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (task.old_files && task.old_files.length > 0) {
      getPreviewFileContent(currentUser.token, task, setReqStatus)
        .then(data => {
          setTaskFilesPDF([])
          setTaskFilesIMAGE([])
          data.forEach(file => {
            // file.type === ".pdf" ? setTaskFilesPDF(prevPDF => [...prevPDF, file]) : setTaskFilesIMAGE(prev => [...prev, file])
            if (file.type === ".pdf") {
              setTaskFilesPDF(prevPDF => [...prevPDF, file])
            } else if (file.type === ".jpg") {
              setTaskFilesIMAGE(prev => [...prev, file])
            }
          })
        })
        .catch(error => {
          // Обработка ошибки, если необходимо
        })
    } else {
      setTaskFiles(task)
    }
  }, [task.old_files, currentUser])

  const handleDownload = async file => {
    try {
      setReqStatus({ loading: true, error: null })
      const fullFile = await getFullFile(file, task.task_id, currentUser.token)
      setReqStatus({ loading: false, error: null })

      // Создаем ссылку для скачивания файла
      const downloadLink = document.createElement("a")
      downloadLink.href = `data:${fullFile.type};base64,${fullFile.content}`
      downloadLink.download = fullFile.name

      // Добавляем ссылку на страницу и эмулируем клик по ней для скачивания файла
      document.body.appendChild(downloadLink)
      downloadLink.click()

      // Удаляем ссылку после скачивания файла
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error)
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleImageClick = async file => {
    try {
      setReqStatus({ loading: true, error: null })
      const test = await getFullFile(file, task.task_id, currentUser.token)
      setReqStatus({ loading: false, error: null })
      setSelectedImage(test)
      setModalOpen(true)
    } catch (error) {}
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Grid container spacing={2} sx={{ p: "1%" }}>
        <Loader reqStatus={reqStatus}>
          {/* -------------------------------------- */}
          <Grid item xs={2}>
            <Item>
              <Item>
                <Typography variant="subtitle1">
                  <strong>Задача №: {task.id}</strong>
                </Typography>
              </Item>
              <UseAccordionView headerText={`Прогресс:`} bodyText={<TaskProgressCard task={task} />} />
              <UseAccordionView headerText={`От:`} bodyText={<TaskDetailsCard task={task} />} />
            </Item>
          </Grid>
          {/* ------------------------- */}
          <Grid item xs={6}>
            <Item>
              <UseAccordionView
                // headerText={`От: ${formatDate(task.created_on)} ${task.task_descript.substring(0, 50)}... до: ${formatDate(task.deadline)}`}
                headerText={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* <span>От: {formatDate(task.created_on)}</span> */}
                    <span style={{ textAlign: "center", flex: 1 }}>{task.task_descript.substring(0, 50)} ...</span>
                    {/* <span>До: {formatDate(task.deadline)}</span> */}
                  </div>
                }
                bodyText={task.task_descript}
              />
            </Item>
            {/* ################################# */}
            {taskFilesIMAGE && taskFilesIMAGE.length > 0 && (
              <>
                <UseAccordionView
                  headerText={"Изображения:"}
                  bodyText={
                    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={82}>
                      {taskFilesIMAGE &&
                        taskFilesIMAGE.map((file, index) => (
                          <ImageListItem key={index} sx={{ display: "flex", flexDirection: "row" }}>
                            <Tooltip title="Нажмите, чтобы увеличить" onClick={() => handleImageClick(file)}>
                              <img key={index} src={`data:${file.type};base64,${file.content}`} alt="File Preview" loading="lazy" />
                            </Tooltip>
                          </ImageListItem>
                        ))}
                    </ImageList>
                  }
                />
              </>
            )}
            {taskFilesPDF && taskFilesPDF.length > 0 && (
              <>
                <UseAccordionView
                  headerText={"Файлы:"}
                  bodyText={
                    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={80}>
                      <Loader reqStatus={reqStatus}>
                        {taskFilesPDF &&
                          taskFilesPDF.map((file, index) => (
                            <ImageListItem key={index} sx={{ display: "flex", flexDirection: "row" }}>
                              <Tooltip title="Нажмите, чтобы скачать" onClick={() => handleDownload(file)}>
                                <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
                                  <Paper elevation={3} sx={{ p: "2%", display: "flex", flexDirection: "row" }}>
                                    <PictureAsPdfOutlinedIcon fontSize="large" />
                                    {file && <Typography variant="body2">{file.name}</Typography>}
                                  </Paper>
                                </Stack>
                              </Tooltip>
                            </ImageListItem>
                          ))}
                      </Loader>
                    </ImageList>
                  }
                />
              </>
            )}
            {/* ################################# */}
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Item>
                <Typography variant="subtitle1">
                  <strong>Комментарии:</strong>
                </Typography>
              </Item>
              <TaskComments task={task} />
            </Item>
          </Grid>
          {/* -------------------------------------- */}
        </Loader>
      </Grid>
      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText={selectedImage.name}>
          <ImageList sx={{ width: "100%", height: "100%" }} cols={1}>
            <ImageListItem>
              <img src={`data:${selectedImage.type};base64,${selectedImage.content}`} alt="File Preview" loading="lazy" title="Нажмите, чтобы удалить" />
            </ImageListItem>
          </ImageList>
        </ModalCustom>
      </>
    </>
  )
}
