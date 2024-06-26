import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"

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

export const ImageBlock = ({ files, getData, isEdit, actionType, takeAddedIndex, removeTaskExistingFiles, toEdit }) => {
  const handleFileInput = event => {
    const input = event.target
    if (input.files.length > 5) {
      alert("Максимальное количество файлов - 5")
      input.value = "" // Очистить выбранные файлы
    }
  }

  return (
    <>
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
        Загрузить файлы
        <VisuallyHiddenInput
          type="file"
          accept="image/jpeg, application/pdf" //image/png,
          multiple
          onInput={handleFileInput}
          onChange={getData}
          name={isEdit ? "append_new_files" : "add_new_files"}
        />
      </Button>

      <ImageList sx={{ width: 500, height: '100%' }} cols={3} rowHeight={164}>
        {files &&
          files.filePreviews &&
          files.filePreviews.map((preview, index) => {
            const isPdf = preview.startsWith("data:application/pdf;base64,")
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
                ) : (
                  <Tooltip title="Нажмите, чтобы удалить" onClick={() => takeAddedIndex(index)}>
                    <img src={preview} alt="File Preview" loading="lazy" style={{ maxWidth: "100%", height: "auto" }} />
                  </Tooltip>
                )}
              </ImageListItem>
            )
          })}

        {isEdit && files.old_files &&
          files.old_files.map((file, index) => (
            <ImageListItem key={index}>
              {file.type === ".pdf" ? (
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
                  <img
                    key={index}
                    src={`data:${file.type};base64,${file.content}`}
                    alt="File Preview"
                    loading="lazy"
                  />
                </Tooltip>
              )}
            </ImageListItem>
          ))}
      </ImageList>
    </>
  )
}
