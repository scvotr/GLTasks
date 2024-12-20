import { Button, CircularProgress, Paper, Stack, styled } from "@mui/material"
import { useState } from "react"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import fileTypes from "../../../../../../../utils/fileTypes"
import { FilesListView } from "../view/FilesListView"
import { useSnackbar } from "../../../../../../../context/SnackbarProvider"

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

export const UploadButton = ({ data }) => {
  console.log("data", data)

  const acceptedTypes = Object.values(fileTypes).join(", ") // Создаем строку с допустимыми типами файлов
  const { popupSnackbar } = useSnackbar()

  const initValue = {
    files: [],
    filePreviews: [],
    filesToRemove: [],
    new_files: [],
  }

  const [formData, setFormData] = useState(initValue)
  console.log(formData)
  const [loading, setLoading] = useState()

  const handleFileInput = event => {
    const input = event.target
    if (input.files.length > 5) {
      popupSnackbar("Максимальное количество файлов - 5", "error")
      input.value = "" // Очистить выбранные файлы
    } else {
      setLoading(true)
      getData(event).then(() => {
        setLoading(false) // Устанавливаем состояние загрузки обратно в false после завершения загрузки
        popupSnackbar(`Добавлено ${input.files.length} файлов`, "success")
      })
    }
  }

  const getData = async e => {
    const { name, value, files, checked } = e.target
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
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
                // Здесь можно добавить дополнительные проверки, например, размеры изображения
                resolve(e.target.result)
              }
              img.onerror = () => {
                console.error("Ошибка при загрузке изображения:", file.name)
                resolve(null) // Возвращаем null в случае ошибки
              }
            } else {
              // Для других типов файлов, просто возвращаем результат
              resolve(e.target.result)
            }
          }
          reader.onerror = () => {
            console.error("Ошибка при чтении файла:", file.name)
            resolve(null) // Возвращаем null в случае ошибки
          }
          reader.readAsDataURL(file)
        })
      })
    )

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...data],
      filePreviews: [...prev.filePreviews, ...previews],
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

  return (
    <Stack spacing={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Stack spacing={2} padding={2}>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              {formData.files.length === 0 ? `Добавить файлы` : 'Загрузить'}
              <VisuallyHiddenInput type="file" accept={acceptedTypes} multiple onChange={handleFileInput} name={"add_new_files"} />
            </Button>
            <FilesListView files={formData} removeTaskAddedFiles={removeTaskAddedFiles} />
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}
