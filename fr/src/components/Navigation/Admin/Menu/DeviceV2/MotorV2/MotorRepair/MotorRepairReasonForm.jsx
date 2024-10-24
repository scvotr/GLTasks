import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material"
import { useState, useEffect } from "react"
import { getDataFromEndpoint } from "../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../context/AuthProvider"

// Пример массива техников
const technicians = [
  { id: 1, name: "Иван Иванов" },
  { id: 2, name: "Петр Петров" },
  { id: 3, name: "Сидор Сидоров" },
  { id: 4, name: "Анна Аннова" },
]

export const MotorRepairReasonForm = ({ motor, popupSnackbar, onClose }) => {
  console.log("MotorRepairReasonForm", motor)
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    repairReason: "",
    technicianId: "",
    additionalNotes: "",
    repairEndTime: "",
  })

  // Устанавливаем минимальное значение для времени окончания ремонта
  const [minDateTime, setMinDateTime] = useState("")

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 16) // Форматируем дату в 'YYYY-MM-DDTHH:mm'
    setMinDateTime(formattedDate)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Отправка данных:", formData)
    try {
      setReqStatus({ loading: true, error: null })
      const res = await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/takeMotorForRepair`, "POST", motor.motor_id, setReqStatus)
      popupSnackbar(res)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    }
    onClose()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, m: 10, pr: 20, pl: 20 }}>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth required sx={{ flex: 1 }}>
          <InputLabel id="repair-reason-label">Причина ремонта</InputLabel>
          <Select
            labelId="repair-reason-label"
            id="repair-reason"
            label="Причина ремонта"
            name="repairReason"
            value={formData.repairReason}
            onChange={handleChange}>
            <MenuItem value="неисправность">Неисправность</MenuItem>
            <MenuItem value="техническое обслуживание">Техническое обслуживание</MenuItem>
            <MenuItem value="модернизация">Модернизация</MenuItem>
            <MenuItem value="другое">Другое</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth required sx={{ flex: 1 }}>
          <InputLabel id="technician-label">Исполнитель</InputLabel>
          <Select labelId="technician-label" id="technician" label="Исполнитель" name="technicianId" value={formData.technicianId} onChange={handleChange}>
            {technicians.map(technician => (
              <MenuItem key={technician.id} value={technician.id}>
                {technician.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Планируемое время окончания ремонта"
          name="repairEndTime"
          type="date"
          value={formData.repairEndTime}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: today }}
          sx={{ flex: 1 }}
        />
      </Stack>

      <TextField
        label="Отчет о событии"
        name="additionalNotes"
        value={formData.additionalNotes}
        onChange={handleChange}
        multiline
        rows={4}
        placeholder="Введите дополнительные заметки (обязательно)"
        required
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Забрать на ремонт
        </Button>
      </Box>
    </Box>
  )
}
