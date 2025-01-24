import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { Box, TextField, Button } from "@mui/material"
import { DepartmentSelectOnce } from "../Select/DepartmentSelect/DepartmentSelectOnce"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { useSnackbar } from "../../../context/SnackbarProvider"

export const LabsRequestForAvailability = ({ onClose, reRender, currentUser }) => {
  const { popupSnackbar } = useSnackbar()
  const [culture, setCulture] = useState("")
  const [tonnage, setTonnage] = useState("")
  const [quality, setQuality] = useState("")
  const [contractor, setContractor] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = {
      reqForAvail_id: uuidv4(),
      culture,
      tonnage,
      quality,
      contractor,
      selectedDepartment: selectedDepartment.id,
      creator: currentUser.id,
      creator_role: currentUser.role,
      approved: currentUser.role === "chife",
    }

    setReqStatus({ loading: true, error: null })
    try {
      await getDataFromEndpoint(currentUser.token, "/lab/reqForAvailability", "POST", formData, setReqStatus)
      popupSnackbar("Создан запрос!", "success")
      reRender(prevKey => prevKey + 1)
      onClose()
    } catch (error) {
      console.error("Ошибка при создании запроса:", error) // Логирование ошибки
      const errorMessage = error.response?.data?.message || "Ошибка при создании запроса." // Извлечение сообщения об ошибке
      popupSnackbar(errorMessage, "error")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <DepartmentSelectOnce selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} />
      <TextField
        label="Культура"
        variant="outlined"
        fullWidth
        margin="normal"
        value={culture}
        onChange={e => setCulture(e.target.value)}
        required // Обязательное поле
      />
      <TextField
        label="Тоннаж"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={tonnage}
        onChange={e => setTonnage(e.target.value)}
        required // Обязательное поле
      />
      <TextField
        label="Качество по контракту"
        variant="outlined"
        fullWidth
        margin="normal"
        value={quality}
        onChange={e => setQuality(e.target.value)}
        required // Обязательное поле
      />
      <TextField
        label="Контрагент"
        variant="outlined"
        fullWidth
        margin="normal"
        value={contractor}
        onChange={e => setContractor(e.target.value)}
        required // Обязательное поле
      />
      <Button type="submit" variant="contained" color="primary">
        Отправить
      </Button>
      <Button onClick={onClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
        Отмена
      </Button>
    </Box>
  )
}
