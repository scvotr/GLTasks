import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { Button, CircularProgress, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import fileTypes from "../../../../../../../utils/fileTypes"
import { useState } from "react"

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

const { image, pdf, msWord, msExcel, wordDoc, excelDoc } = fileTypes

export const ImageBlock = ({ files, getData, isEdit, actionType, takeAddedIndex, removeTaskExistingFiles, toEdit }) => {
  const acceptedTypes = `${image}, ${pdf}, ${msWord}, ${msExcel}, ${wordDoc}, ${excelDoc}`

  const [loading, setLoading] = useState(false)

  const handleFileInput = event => {
    const input = event.target
    if (input.files.length > 5) {
      alert("Максимальное количество файлов - 5")
      input.value = "" // Очистить выбранные файлы
    } else {
      setLoading(true)
      getData(event).then(() => {
        setLoading(false); // Устанавливаем состояние загрузки обратно в false после завершения загрузки
      });
    }
  }

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
          Загрузить файлы
          <VisuallyHiddenInput
            type="file"
            // accept="image/jpeg, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" //image/png,
            accept={acceptedTypes}
            multiple
            onInput={handleFileInput}
            onChange={getData}
            name={isEdit ? "append_new_files" : "add_new_files"}
          />
        </Button>
      )}

      <ImageList sx={{ width: 500, height: "100%" }} cols={3} rowHeight={164}>
        {files &&
          files.filePreviews &&
          files.filePreviews.map((preview, index) => {
            // const isPdf = preview.startsWith("data:application/pdf;base64,")
            const isPdf = preview.startsWith(`data:${pdf};base64,`)
            // const isOfficeFile = preview.startsWith("data:application/msword;base64,") || preview.startsWith("data:application/vnd.ms-excel;base64,") || preview.startsWith("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,") || preview.startsWith("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")
            const isOfficeFile =
              preview.startsWith(`data:${msWord};base64,`) ||
              preview.startsWith(`data:${msExcel};base64,`) ||
              preview.startsWith(`data:${wordDoc};base64,`) ||
              preview.startsWith(`data:${excelDoc};base64,`)
            return (
              <ImageListItem key={index}>
                {isPdf ? (
                  <Tooltip title="Нажмите, чтобы удалить" onClick={() => takeAddedIndex(index)}>
                    <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
                      <Paper elevation={3} style={{ padding: "10px" }}>
                        <PictureAsPdfOutlinedIcon fontSize="large" />
                        {files && files.files && files.files[index] && files.files[index].name && (
                          <Typography variant="body2">{files.files[index].name}</Typography>
                        )}
                      </Paper>
                    </Stack>
                  </Tooltip>
                ) : isOfficeFile ? (
                  // Отображение офисных файлов
                  <Tooltip title="Нажмите, чтобы удалить" onClick={() => takeAddedIndex(index)}>
                    <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
                      <Paper elevation={3} style={{ padding: "10px" }}>
                        {/* Иконка для офисного файла */}
                        <TextSnippetOutlinedIcon fontSize="large" />
                        {files && files.files && files.files[index] && files.files[index].name && (
                          <Typography variant="body2">{files.files[index].name}</Typography>
                        )}
                      </Paper>
                    </Stack>
                  </Tooltip>
                ) : (
                  <Tooltip title="Нажмите, чтобы удалить" onClick={() => takeAddedIndex(index)}>
                    <img src={preview} alt="File Preview" loading="lazy" style={{ maxWidth: "100%", height: "auto" }} />
                  </Tooltip>
                )}
              </ImageListItem>
            )
          })}

        {isEdit &&
          files.old_files &&
          files.old_files.map((file, index) => (
            <ImageListItem key={index}>
              {file.type !== ".jpg" && file.type !== ".png" ? (
                <Tooltip title="Нажмите, чтобы удалить" onClick={() => removeTaskExistingFiles(index)}>
                  <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <Paper elevation={3} style={{ padding: "10px" }}>
                      <PictureAsPdfOutlinedIcon fontSize="large" />
                      {file && <Typography variant="body2">{file.name}</Typography>}
                    </Paper>
                  </Stack>
                </Tooltip>
              ) : (
                <Tooltip title="Нажмите, чтобы удалить" onClick={() => removeTaskExistingFiles(index)}>
                  <img key={index} src={`data:${file.type};base64,${file.content}`} alt="File Preview" loading="lazy" />
                </Tooltip>
              )}
            </ImageListItem>
          ))}
      </ImageList>
    </>
  )
}
