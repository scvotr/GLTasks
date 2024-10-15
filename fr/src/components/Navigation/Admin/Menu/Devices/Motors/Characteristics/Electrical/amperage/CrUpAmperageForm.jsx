import { Box, Button, FormControl, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"

export const CrUpAmperageForm = ({ onClose, isEdit, dataToEdit, popupSnackbar, response }) => {
  const currentUser = useAuthContext()
  const [formData, setFormData] = useState({ name: "" })
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEdit && dataToEdit) {
      setFormData({ id: dataToEdit.id, name: dataToEdit.name })
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentUser, dataToEdit, isEdit])

  const handleChange = e => {
    const { name, value } = e.target
    const regex = /^\d*\.?\d*$/
    if (regex.test(value) || value === "") {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const endpoint = isEdit
      ? "/admin/devices/motor/electrical/amperage/update"
      : "/admin/devices/motor/electrical/amperage/create"
    try {
      response({ loading: true })
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", formData, response)
      isEdit ? popupSnackbar("Успешное Обновлено!", "success") : popupSnackbar("Успешное создано!", "success")
      response(prev => ({ ...prev, loading: false }))
      onClose()
    } catch (error) {
      isEdit ? popupSnackbar("Ошибка при обновлении!", "error") : popupSnackbar("Ошибка при создании!", "error")
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="form"
        sx={{
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          "& .MuiTextField-root": { m: 1, width: "55ch" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={handleSubmit} // Добавляем обработчик на форме
      >
        <FormControl>
          <TextField
            sx={{ p: 2 }}
            helperText={formData.name.length === 0 ? "Поле не может быть пустым. ФОРМАТ: 00, 000, 0000" : ""}
            name="name"
            required
            type="number"
            value={formData.name}
            onChange={handleChange}
            inputRef={inputRef}
          />
        </FormControl>
        <Box sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            endIcon={<ThumbUpIcon />}
            // disabled={reqStatus.loading} // отключаем кнопку во время загрузки
          >
            {/* {reqStatus.loading ? (isEdit ? "Редактируем..." : "Добавляем...") : isEdit ? "Редактировать" : "Добавить"} */}
            {isEdit ? "Редактировать" : "Добавить"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
