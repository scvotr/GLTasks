import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

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

export const ImageBlock = ({  files,  getData,  isEdit,  actionType,  takeAddedIndex, toEdit}) => {
  const handleFileInput = event => {
    const input = event.target
    if (input.files.length > 5) {
      alert("Максимальное количество файлов - 5")
      input.value = "" // Очистить выбранные файлы
    }
  }

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}>
        Загрузить файлы
        <VisuallyHiddenInput
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          multiple
          onInput={handleFileInput}
          onChange={getData}
          name={
            isEdit ? "append_new_files" : "add_new_files"
          }
        />
      </Button>
      <ImageList
        sx={{ width: 500, height: 450 }}
        cols={3}
        rowHeight={164}>
        {files &&
          files.filePreviews &&
          files.filePreviews.map((preview, index) => (
            <ImageListItem key={index}>
              <img
                key={index}
                src={preview}
                alt="File Preview"
                loading="lazy"
                onClick={() => takeAddedIndex(index)}
                title="Нажмите, чтобы удалить"
              />
            </ImageListItem>
          ))}
      </ImageList>
    </>
  )
}
