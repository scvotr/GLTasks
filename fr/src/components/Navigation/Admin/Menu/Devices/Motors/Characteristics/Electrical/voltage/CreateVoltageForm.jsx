import { Box, Button, FormControl, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"

export const CreateVoltageForm = ({ onClose, isEdit, dataToEdit, popupSuccess, popupError, response }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formData, setFormData] = useState({ name: "" })
  const inputRef = useRef(null) // Создаем ссылку на TextField

  useEffect(() => {
    if (isEdit && dataToEdit) {
      setFormData({ id: dataToEdit.id, name: dataToEdit.name }) // Устанавливаем данные для редактирования
    }
    // Устанавливаем фокус на поле ввода при монтировании компонента
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentUser, dataToEdit, isEdit])

  const handleChange = e => {
    const { name, value } = e.target
    // Регулярное выражение для проверки, что введенное значение является числом с плавающей запятой и не содержит пробелов
    const regex = /^\d*\.?\d*$/

    // Проверяем, что значение соответствует регулярному выражению и не содержит пробелов
    if (regex.test(value) || value === "") {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setReqStatus({ loading: true, error: null })
      const endpoint = isEdit
        ? "/admin/devices/motor/electrical/voltage/update"
        : "/admin/devices/motor/electrical/voltage/create"
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", formData, response)
      setReqStatus({ loading: false, error: null })
      popupSuccess(isEdit ? "Обновлено -CreateVoltageForm" : "Создана")
      onClose()
    } catch (error) {
      popupError(isEdit ? "Обновлено -CreateVoltageForm-error" : "Создана")
      setReqStatus({ loading: false, error: error })
    }
  }

  return (
    <Loader reqStatus={reqStatus}>
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
              value={formData.name} // Передаем значение из состояния
              onChange={handleChange} // Обработчик изменения
              inputRef={inputRef}
            />
          </FormControl>
          <Box sx={{ p: 2 }}>
            <Button
              type="submit" // Указываем, что это кнопка отправки формы
              variant="contained"
              color="success"
              endIcon={<ThumbUpIcon />}
              disabled={reqStatus.loading} // отключаем кнопку во время загрузки
            >
              {reqStatus.loading ? (isEdit ? "Редактируем..." : "Добавляем...") : isEdit ? "Редактировать" : "Добавить"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Loader>
  )
}
