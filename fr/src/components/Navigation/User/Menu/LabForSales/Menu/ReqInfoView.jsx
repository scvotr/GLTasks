import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Stack,
  ImageList,
  ImageListItem,
  Tooltip,
} from "@mui/material"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import PrintIcon from "@mui/icons-material/Print"
import DeleteIcon from "@mui/icons-material/Delete"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { UploadButton } from "../uploads/button/UploadButton"
import { LabComments } from "../LabComments/LabComments"
import { formatDateV2 } from "../../../../../../utils/formatDate"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { ConfirmationDialog } from "../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

const renderIndicators = indicatorsString => {
  try {
    const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
    return indicators
      .filter(indicator => indicator.value) // Фильтруем индикаторы, у которых value не пустое
      .map((indicator, index) => (
        <div key={index}>
          <strong>{indicator.name}:</strong> {indicator.value}
        </div>
      ))
  } catch (error) {
    console.error("Error parsing indicators:", error)
    return <div>Error parsing indicators</div>
  }
}

export const ReqInfoView = ({ request, currentUser, closeModal, reRender, totalUnreadCount, checkFullScreenOpen }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [statusReq, setStatusReq] = useState("new")
  const [getReqLabComments, setGetReqLabComments] = useState([])
  const [files, setFiles] = useState([])
  const [isImageFile, setIsImageFile] = useState([])
  const [isDocFile, setIsDocFile] = useState([])
  const [selectedImage, setSelectedImage] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const isCreator = request.creator.toString() === currentUser.id.toString()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [toDelete, setToDelete] = useState(null)
  const [toDeleteRequest, setToDeleteRequest] = useState(null)
  // !----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      console.log("rerernedr")
      try {
        setReqStatus({ loading: true, error: null })
        // Первый запрос - получаем файлы
        const filesData = await getDataFromEndpoint(currentUser.token, "/lab/getAllLabReqFiles", "POST", request.reqForAvail_id, setReqStatus)
        setFiles(filesData[0])
        // Второй запрос - получаем превью (зависит от первого запроса)
        if (files) {
          const previewData = await getDataFromEndpoint(
            currentUser.token,
            "/lab/getPreviewFileContent",
            "POST",
            {
              // files: files.old_files, // Используем данные из первого запроса
              files: filesData[0].old_files, // Используем данные из первого запроса
              req_id: request.reqForAvail_id,
            },
            setReqStatus
          )
          // Обработка превью
          setIsImageFile([])
          setIsDocFile([])
          if (Array.isArray(previewData)) {
            previewData.forEach(file => {
              file.type === ".jpg" || file.type === ".png" ? setIsImageFile(prev => [...prev, file]) : setIsDocFile(prev => [...prev, file])
            })
          }
        }
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
    fetchData()
  }, [currentUser.token, request, formKey])

  // useEffect(() => {
  //   const endpoint = `/lab/getAllLabReqFiles`
  //   try {
  //     setReqStatus({ loading: true, error: null })

  //     getDataFromEndpoint(currentUser.token, endpoint, "POST", request.reqForAvail_id, setReqStatus)
  //       .then(data => {
  //         setFiles(data[0]) //!WTF!!!
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })

  //     setReqStatus({ loading: false, error: null })
  //   } catch (error) {
  //     setReqStatus({ loading: false, error: error.message })
  //   }
  // }, [currentUser.token, request, formKey])

  // useEffect(() => {
  //   const endpoint = `/lab/getPreviewFileContent`
  //   setReqStatus({ loading: true, error: null })

  //   getDataFromEndpoint(currentUser.token, endpoint, "POST", { files: files.old_files, req_id: request.reqForAvail_id }, setReqStatus)
  //     .then(data => {
  //       // Очищаем массивы перед добавлением новых данных
  //       setIsImageFile([])
  //       setIsDocFile([])
  //       // Проверяем, что data существует и является массивом
  //       if (Array.isArray(data)) {
  //         data.forEach(file => {
  //           if (file.type === ".jpg" || file.type === ".png") {
  //             setIsImageFile(prev => [...prev, file])
  //           } else {
  //             setIsDocFile(prev => [...prev, file])
  //           }
  //         })
  //       } else {
  //         // console.error("Ожидался массив, но получено:", data)
  //       }
  //       setReqStatus({ loading: false, error: null })
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       setReqStatus({ loading: false, error: error.message })
  //     })
  // }, [currentUser.token, files, request.reqForAvail_id])

  // !----------------------------------
  const handleApprove = async (user, request) => {
    if (isCreator) {
      setStatusReq("new")
    } else {
      setStatusReq("approved")
    }

    const endpoint = `/lab/getUserConfirmation`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position, status: statusReq },
        setReqStatus
      )
      closeModal()
      reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleDelete = async request => {
    const endpoint = `/lab/deleteReqForLab`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position },
        setReqStatus
      )
      closeModal()
      reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleDownload = async file => {
    const endpoint = `/lab/getFullFileContent`
    //! Получить контент с сервера!!!
    console.log("handleDownload", file)
    console.log("request", request.reqForAvail_id)
    try {
      setReqStatus({ loading: true, error: null })
      const fullFile = await getDataFromEndpoint(currentUser.token, endpoint, "POST", { file: file, req_id: request.reqForAvail_id }, setReqStatus)
      console.log("fullFile", fullFile)
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
      setReqStatus({ loading: false, error: error.message })
      console.error("Ошибка при загрузке файла:", error)
    }
  }

  const handleImageClick = async file => {
    const endpoint = `/lab/getFullFileContent`
    try {
      setReqStatus({ loading: true, error: null })
      const fullFile = await getDataFromEndpoint(currentUser.token, endpoint, "POST", { file: file, req_id: request.reqForAvail_id }, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setSelectedImage(fullFile)
      setModalOpen(true)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  /**
   * Удаляет файл на основе переданных данных.
   * @param {Object} fileData - Данные для удаления файла.
   * @param {Object} fileData.file - Информация о файле.
   * @param {string} fileData.req_id - Идентификатор запроса.
   */
  const deleteFile = async file => {
    const endpoint = `/lab/deleteFile`
    console.log(file)
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", file, setReqStatus)
      setFormKey(prev => prev + 1)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const closeImagePreview = () => {
    setSelectedImage({})
    setModalOpen(false)
  }

  const handlePrintSelectedTasks = (user, request) => {
    const comments = getReqLabComments?.map(
      (comment, index) => `
      <div class="comments-item" key="${index}">
        <div>${comment.comment} | </div>
        <div>${comment.last_name} ${comment.first_name.charAt(0)}.${comment.middle_name.charAt(0)}. | </div>
        <div>${formatDateV2(comment.created_on, true)}</div>
      </div>
    `
    )

    const indicatorsContent = JSON.parse(request.indicators)
      .filter(indicator => indicator.value)
      .map(
        (indicator, index) => `
      <div class="indicator-item" key="${index}">
        <strong> - ${indicator.name}:</strong> ${indicator.value}
      </div>
    `
      )
      .join("")

    const usersContent = request.users
      .map(
        user => `
          <div class="user-item">
            <div class="subdepartment-name">${user.subdepartment_name}<br>${user.position_name}</div>
            <div class="user-name">${user.approval_status === "approved" ? `Согласована ${formatDateV2(user.approved_at, true)}` : "________________"} ${
          user.last_name_only
        } ${user.first_name_only.charAt(0)}.${user.middle_name_only.charAt(0)}.</div>
          </div>
        `
      )
      .join("")

    const printContent = `
      <div class="print-content">
        <h2>Культура: ${request.culture}. Урожай: ${request.yearOfHarvest}г. ${
      request.classType ? `${request.type.toLowerCase()} класс: ${request.classType}` : ""
    }</h2>
        <h3>Масса: ${request.tonnage} т. (+/- 5%) | Покупатель: ${request.contractor}</h3>
        <h4>Качественные показатели(${request.gost}):</h4>


        <div class="indicators-container">
          ${indicatorsContent}
        </div>
 
        ${
          request.commentsThenCreate
            ? `
          <p><strong>Комментарий:</strong></p>
          <div>
            ${request.commentsThenCreate}
          </div>
        `
            : ""
        }
        <p><strong>Лист согласования:</strong></p>
        <div class="user-list">${usersContent}</div>
      </div>
      <p><strong>Протокол:</strong></p>
      <div class="comments-list">
        ${comments}
      </div>
    `
    // Ваша функция для открытия окна печати
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
  <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
        }
        h2, h3, h4 {
          text-align: center;
          color: #2c3e50;
        }
        .print-content {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .indicators-container {
          display: flex;
          flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
          justify-content: center; /* Центрирует элементы по горизонтали */
          margin: 20px 0;
        }
        .indicator-item {
          flex: 0 0 45%; /* Задает ширину элемента 45% */
          margin: 5px; /* Отступ между элементами */
          text-align: left; /* Выравнивание текста влево */
        }
        .user-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f1f1f1;
        }
        .user-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        .comments-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f1f1f1;
        }
        .comments-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        .subdepartment-name, .user-name {
          flex: 1;
        }
        @media print {
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          body {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
        }
      </style>
    </head>
    <body>
      <h2>Запрос <br> №: ${request.req_number} от ${formatDateV2(request.approved_at)} <br> в лабораторию ${
      request.department_name
    } <br> для заключения договора с "${request.contractor}"</h2>
      ${printContent}
    </body>
  </html>
`)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <>
      <Loader reqStatus={reqStatus}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            {request.commentsThenCreate}
          </Typography>

          <Grid container spacing={2}>
            <Loader reqStatus={reqStatus}>
              {/* <Grid item xs={4} md={6} sx={{ border: "1px solid black", padding: "8px" }} > */}
              <Grid item xs={2}>
                <Paper sx={{ padding: 2 }}>
                  <Typography variant="h6">Информация о заявке №: {request.req_number}</Typography>
                  <Typography variant="body1">Культура: {request.culture}</Typography>
                  <Typography variant="body1">Урожай: {request.yearOfHarvest} года</Typography>
                  {request.type && <Typography variant="body1">Тип: {request.type}</Typography>}
                  {request.classType && <Typography variant="body1">Класс: {request.classType}</Typography>}
                  <Typography variant="body1">Масса: {request.tonnage} тонн +/- 5%</Typography>
                  <Typography variant="body1">Покупатель: {request.contractor}</Typography>
                  <Typography variant="body1">ГОСТ: {request.gost}</Typography>
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Качество по контракту</Typography>
                    {renderIndicators(request.indicators)}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Box component={Paper} sx={{ p: 2 }}>
                  <LabComments request={request} reRender={reRender} checkFullScreenOpen={checkFullScreenOpen} setGetReqLabComments={setGetReqLabComments} />
                </Box>
              </Grid>

              {/* <Grid item xs={12} md={6}> */}
              <Grid item xs={6}>
                <Paper sx={{ padding: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Лист согласования</Typography>
                    <IconButton color="primary" onClick={() => handlePrintSelectedTasks(null, request)}>
                      <PrintIcon />
                    </IconButton>
                  </Box>
                  <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Должность</TableCell>
                          <TableCell>Отдел</TableCell>
                          <TableCell>Имя пользователя</TableCell>
                          <TableCell>Дата</TableCell>
                          <TableCell>Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {request.users &&
                          request.users.map(user => (
                            <TableRow key={user.position_id} sx={{ backgroundColor: user.approval_status === "approved" ? "lightgreen" : "inherit" }}>
                              <TableCell>{user.position_name}</TableCell>
                              <TableCell>{user.department_name}</TableCell>
                              <TableCell>{user.user_name}</TableCell>
                              <TableCell>{user.approved_at ? formatDateV2(user.approved_at, true) : null}</TableCell>
                              <TableCell>
                                {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "pending" && (
                                  <Stack direction="row" spacing={0.5}>
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleApprove(user, request)}>
                                      {isCreator ? "Запросить" : "Подтвердить"}
                                    </Button>
                                    {isCreator && statusReq === "new" && (
                                      <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(request)}>
                                        Удалить
                                      </Button>
                                    )}
                                  </Stack>
                                )}
                                {/* Если уже отправлена в работу и на ходится на согласовании другими учсастниками */}
                                {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "approved" && (
                                  <Stack direction="row" spacing={0.5}>
                                    {isCreator && (
                                      <Button variant="contained" color="primary" size="small" onClick={() => handleApprove(user, request)}>
                                        В работу
                                      </Button>
                                    )}
                                    {isCreator && (
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        //  onClick={() => handleDelete(request)}
                                        onClick={() => {
                                          setToDeleteRequest(request)
                                          setDialogText({
                                            title: "Подтверждение удаления запроса",
                                            message: "Вы уверены, что хотите удалить этот запрос?",
                                          })
                                          setOpenDialog(true)
                                        }}>
                                        Удалить
                                      </Button>
                                    )}
                                  </Stack>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* {isCreator && <UploadButton data={request} reRender={setFormKey} />} */}
                  <UploadButton data={request} reRender={setFormKey} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ padding: 2 }}>
                      {isDocFile && isDocFile.length > 0 && (
                        <ImageList sx={{ width: "100%", height: "auto" }} cols={3} rowHeight={80}>
                          {isDocFile &&
                            isDocFile.map((file, index) => (
                              <ImageListItem key={index} sx={{ display: "flex", flexDirection: "row" }}>
                                <Tooltip title="Нажмите, чтобы скачать" onClick={() => handleDownload(file)}>
                                  <Stack direction="column" justifyContent="center" alignItems="center" spacing={1} sx={{ cursor: "pointer" }}>
                                    <Paper elevation={3} sx={{ p: "2%", display: "flex", flexDirection: "row" }}>
                                      {/* переделать на разные форматы */}
                                      <PictureAsPdfOutlinedIcon fontSize="large" />
                                      {file && (
                                        <Typography variant="body2" sx={{ ml: 1, wordBreak: "break-word" }}>
                                          {file.name}
                                        </Typography>
                                      )}
                                    </Paper>
                                  </Stack>
                                </Tooltip>
                                {isCreator && (
                                  <Tooltip
                                    title="Нажмите, чтобы удалить"
                                    sx={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      backgroundColor: "background.paper",
                                      borderRadius: "50%",
                                      boxShadow: 1,
                                    }}>
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() => {
                                        // Обработчик для удаления файла
                                        // console.log("Удалить файл:", file)
                                        // deleteFile({ file: file, req_id: request.reqForAvail_id })
                                        setToDelete({ file: file, req_id: request.reqForAvail_id })
                                        setDialogText({
                                          title: "Подтверждение удаления",
                                          message: "Вы уверены, что хотите удалить этот фаил?",
                                        })
                                        setOpenDialog(true)
                                      }}
                                      size="small"
                                      sx={{
                                        color: "error.main",
                                        "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" }, // Красный фон при наведении
                                      }}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </ImageListItem>
                            ))}
                        </ImageList>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ padding: 2 }}>
                      {isImageFile && isImageFile.length > 0 && (
                        <ImageList sx={{ width: "100%", height: "auto" }} cols={3} rowHeight={82}>
                          {isImageFile.map((file, index) => (
                            <ImageListItem key={index} sx={{ display: "flex", justifyContent: "center" }}>
                              <Tooltip title="Нажмите, чтобы увеличить" onClick={() => handleImageClick(file)}>
                                <img
                                  key={index}
                                  src={`data:${file.type};base64,${file.content}`}
                                  alt="File Preview"
                                  loading="lazy"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                              {isCreator && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "background.paper",
                                    borderRadius: "50%",
                                    boxShadow: 1,
                                  }}>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                      // deleteFile({ file: file, req_id: request.reqForAvail_id })
                                      setToDelete({ file: file, req_id: request.reqForAvail_id })
                                      setDialogText({
                                        title: "Подтверждение удаления",
                                        message: "Вы уверены, что хотите удалить этот фаил?",
                                      })
                                      setOpenDialog(true)
                                    }}
                                    size="small">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </ImageListItem>
                          ))}
                        </ImageList>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Loader>
          </Grid>
          <ModalCustom isOpen={modalOpen} onClose={closeImagePreview} infoText={selectedImage.name}>
            <ImageList sx={{ width: "100%", height: "100%" }} cols={1}>
              <ImageListItem>
                <img src={`data:${selectedImage.type};base64,${selectedImage.content}`} alt="File Preview" loading="lazy" title="Нажмите, чтобы удалить" />
              </ImageListItem>
            </ImageList>
          </ModalCustom>
        </Box>
      </Loader>
      {/* ------------------------ */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        onConfirm={async () => {
          try {
            setOpenDialog(false) // Закрываем диалог перед выполнением действия
            if (toDelete) {
              await deleteFile(toDelete)
            } else if (toDeleteRequest) {
              await handleDelete(toDeleteRequest)
            }
          } catch (error) {
            console.error("Ошибка при удалении файла:", error.message)
          }
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
      {/* ------------------------ */}
    </>
  )
}
