import React from "react"
import { ImageList, ImageListItem, Paper, Stack, Tooltip, Typography } from "@mui/material"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined"
import fileTypes from "../../../../../../../utils/fileTypes"

const { image, pdf, msWord, msExcel, wordDoc, excelDoc } = fileTypes

export const FilesListView = ({ files = [], removeTaskAddedFiles }) => {
  if (files.length === 0) {
    return <Typography variant="body2">Нет загруженных файлов.</Typography>
  }

  return (
    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={164}>
      {files?.filePreviews.map((preview, index) => {
        const isPdf = preview.startsWith(`data:${pdf};base64,`)
        const isOfficeFile =
          preview.startsWith(`data:${msWord};base64,`) ||
          preview.startsWith(`data:${msExcel};base64,`) ||
          preview.startsWith(`data:${wordDoc};base64,`) ||
          preview.startsWith(`data:${excelDoc};base64,`)

        const fileName = files.files[index]?.name // Извлечение имени файла

        return (
          <ImageListItem key={index}>
            <Tooltip title="Нажмите, чтобы удалить" onClick={() => removeTaskAddedFiles(index)}>
              <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
                <Paper elevation={3} style={{ padding: "10px" }}>
                  {isPdf ? (
                    <>
                      <PictureAsPdfOutlinedIcon fontSize="large" />
                      {fileName && <Typography variant="body2">{fileName}</Typography>}
                    </>
                  ) : isOfficeFile ? (
                    <>
                      <TextSnippetOutlinedIcon fontSize="large" />
                      {fileName && <Typography variant="body2">{fileName}</Typography>}
                    </>
                  ) : (
                    <img src={preview} alt="File Preview" loading="lazy" style={{ maxWidth: "100%", height: "auto" }} />
                  )}
                </Paper>
              </Stack>
            </Tooltip>
          </ImageListItem>
        )
      })}
    </ImageList>
  )
}
