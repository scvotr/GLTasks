import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { Box, Button, CircularProgress, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import { ImageListView } from "./ImageListView"
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react"
import { useAuthContext } from "../../../../../../../../context/AuthProvider"
import { sendNewTaskData } from "../../../../../../../../utils/sendNewTaskData"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

export const ImageBlockV2 = ({ task, onSubmit, setNewFiles, isEdit, takeAddedIndex, removeTaskExistingFiles, toEdit }) => {
  const currentUser = useAuthContext()
  
  const handleFileInput = event => {
    const input = event.target
    if (input.files.length > 5) {
      alert("Максимальное количество файлов - 5")
      input.value = "" // Очистить выбранные файлы
    }
  }

  const initValue = {
    ...task,
    files: [],
    filePreviews: [],
    filesToRemove: [],
    task_files: [],
  }

  const [formData, setFormData] = useState(initValue)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [addFiles, setAddFiles] = useState(false)

  const getInputData = async e => {
    const { name, value, files, checked } = e.target
    if (name === "add_new_files" || name === "append_new_files") {
      setReqStatus({ loading: true })
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
      const data = Array.from(files).filter(file => allowedTypes.includes(file.type))
      const previews = await Promise.all(
        data.map(file => {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = e => {
              if (file.type.startsWith("image/")) {
                const img = new Image()
                img.src = e.target.result
                img.onload = () => {
                  resolve(e.target.result)
                }
              } else if (file.type.startsWith("application/pdf")) {
                resolve(e.target.result)
              }
            }
            reader.readAsDataURL(file)
          })
        })
      )
      setReqStatus({ loading: false })
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...data],
        filePreviews: [...prev.filePreviews, ...previews],
      }))
      formData.files ? setAddFiles(true) : setAddFiles(false)
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const removeTaskAddedFiles = index => {
    const updatedFiles = [...formData.files]
    const updatedPreviews = [...formData.filePreviews]
    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setFormData(prev => ({
      ...prev,
      files: updatedFiles,
      filePreviews: updatedPreviews,
    }))
  }

  const addFile = async() => {
    try {
      setReqStatus({ loading: true, error: null })
      await sendNewTaskData(currentUser.token, formData, "/tasks/updateTask", setNewFiles)
      setReqStatus({ loading: false, error: null })
      onSubmit(prevKey => prevKey + 1)
      setAddFiles(false)
      setFormData(initValue)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  return (
    <>
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
        Добавить файлы
        <VisuallyHiddenInput
          type="file"
          accept="image/jpeg, application/pdf" //,image/png
          multiple
          onInput={handleFileInput}
          onChange={getInputData}
          name={isEdit ? "append_new_files" : "add_new_files"}
        />
      </Button>
      {addFiles && (
        <>
          <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<SendIcon />} color="secondary" onClick={addFile} sx={{m: 2}}>
            Загрузить
          </Button>
        </>
      )}

      {reqStatus.loading ? (
        <Box
          sx={{
            p: 1,
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            "& .MuiTextField-root": { m: 1, width: "55ch" },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CircularProgress />
        </Box>
      ) : (
        <ImageList sx={{ width: "100%", height: "100%" }} cols={2} rowHeight={164}>
          {formData &&
            formData.filePreviews &&
            formData.filePreviews.map((preview, index) => {
              const isPdf = preview.startsWith("data:application/pdf;base64,")
              return (
                <ImageListItem key={index}>
                  {isPdf ? (
                    <Tooltip title="Нажмите, чтобы удалить" onClick={() => removeTaskAddedFiles(index)}>
                      <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Paper elevation={3} style={{ padding: "10px" }}>
                          <PictureAsPdfOutlinedIcon fontSize="large" />
                          {formData && formData.files && formData.files[index] && formData.files[index].name && (
                            <Typography variant="body2">{formData.files[index].name}</Typography>
                          )}
                        </Paper>
                      </Stack>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Нажмите, чтобы удалить" onClick={() => removeTaskAddedFiles(index)}>
                      <img src={preview} alt="File Preview" loading="lazy" style={{ maxWidth: "100%", height: "auto" }} />
                    </Tooltip>
                  )}
                </ImageListItem>
              )
            })}
        </ImageList>
      )}
    </>
  )
}
