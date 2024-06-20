import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { Paper, Stack, Tooltip, Typography } from "@mui/material"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"

export const ImageListView = ({ files, isEdit, takeAddedIndex, removeTaskExistingFiles }) => {
  return (
    <>
      <ImageList sx={{ width: 500, height: "100%" }} cols={3} rowHeight={164}>
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

        {
          files.old_files &&
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
                  <img key={index} src={`data:${file.type};base64,${file.content}`} alt="File Preview" loading="lazy" />
                </Tooltip>
              )}
            </ImageListItem>
          ))}
      </ImageList>
    </>
  )
}
