import { Box, Button, FormControl, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { useAuthContext } from "../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../utils/getDataFromEndpoint"

export const CrUpMotorChar = ({ onClose, isEdit, dataToEdit, popupSnackbar, response, endpointPath, fieldType, hlText }) => {
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

  const checkField = {
    nn: { regex: /^\d{1,2}$/ }, // одна или две цифры)
    nDn: { regex: /^\d+(\.\d+)?$/ }, // число, которое может содержать одну точку после первой цифры (например, 1.0, 12.34)
    n5: { regex: /^\d{1,5}$/ }, // строка, начинающаяся с 'M' и содержащая 6 цифр (например, M123456)
    Tn: { regex: /^[A-Za-z]\d{6}$/ },
    tx_1: { regex: /^[A-Za-z]+$/ }, // только буквы
    tx_2: { regex: /^[A-Za-z\s]+$/ }, // только буквы и пробелы
    tx_3: { regex: /^[A-Za-z0-9]+$/ }, // буквы и цифры
    tx_4: { regex: /^[A-Za-z0-9\s!@#$%^&*()_+.,-]*$/ }, // буквы, цифры и некоторые специальные символы
  }

  const handleChange = e => {
    const { name, value } = e.target
    const regex = checkField[fieldType]?.regex // Получаем регулярное выражение по fieldType
    console.log(regex)

    if (regex && (regex.test(value) || value === "")) {
      setFormData({ ...formData, [name]: value })
    } 
    // заглушка для работы полей без валидации удалить и заменить
    // else if(!hlText) {
    //   setFormData({ ...formData, [name]: value })
    // }
  }

  // const handleChange = e => {
  //   const { name, value } = e.target
  //   const regex = /^\d*\.?\d*$/
  //   if (regex.test(value) || value === "") {
  //     setFormData({ ...formData, [name]: value })
  //   }
  // }

  const handleSubmit = async e => {
    e.preventDefault()
    const endpoint = isEdit ? `/admin/devices/motor/${endpointPath}/update` : `/admin/devices/motor/${endpointPath}/create`
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
            helperText={
              formData.name.length === 0 ? (hlText ? `Поле не может быть пустым. ФОРМАТ: ${hlText}` : `Поле не может быть пустым. ФОРМАТ: НЕ ЗАДАН`) : ""
            }
            name="name"
            required
            type="text"
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
