import { Box, Button, FormControl, TextField } from "@mui/material"
import { useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"

export const CreateTypeForm = ({ onClose }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formData, setFormData] = useState({ type_name: "" })

  // const handleChange = e => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value })
  // }
  
  const handleChange = e => {
    const { name, value } = e.target
    // Приводим значение к нижнему регистру и убираем пробелы
    const formattedValue = value.toLowerCase().trim()
    setFormData({ ...formData, [name]: formattedValue })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // if (formData.type_name.trim() === "") {
    //   setReqStatus({ loading: false, error: "Поле не может быть пустым" })
    //   return
    // }

    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/admin/devices/types/create", "POST", formData, setReqStatus)
      console.log(reqStatus)
      setReqStatus({ loading: false, error: null })
      onClose()
    } catch (error) {
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
              helperText={formData.type_name.length === 0 ? "Поле не может быть пустым" : ""}
              name="type_name"
              required
              value={formData.type_name} // Передаем значение из состояния
              onChange={handleChange} // Обработчик изменения
            />
          </FormControl>
          <Box sx={{ p: 2 }}>
            <Button
              type="submit" // Указываем, что это кнопка отправки формы
              variant="contained"
              color="success"
              endIcon={<ThumbUpIcon />}
              disabled={reqStatus.loading} // Дизаблируем кнопку во время загрузки
            >
              {reqStatus.loading ? "Добавляем..." : "Добавить тип"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Loader>
  )
}
