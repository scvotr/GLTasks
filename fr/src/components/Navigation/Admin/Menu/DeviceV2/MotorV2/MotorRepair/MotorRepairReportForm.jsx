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

export const MotorRepairReportForm = ({ motor, popupSnackbar, onClose }) => {
  //   console.log("MotorRepairReasonForm", motor)
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const [formData, setFormData] = useState({
    motor_id: motor.motor_id,
    technicianId: "",
    additionalNotesReport: "",
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setReqStatus({ loading: true, error: null })
      const res = await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/completeMotorRepair`, "POST", formData, setReqStatus)
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
          <InputLabel id="technician-label">Исполнитель</InputLabel>
          <Select labelId="technician-label" id="technician" label="Исполнитель" name="technicianId" value={formData.technicianId} onChange={handleChange}>
            {technicians.map(technician => (
              <MenuItem key={technician.id} value={technician.id}>
                {technician.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TextField
        label="Отчет о событии"
        name="additionalNotesReport"
        value={formData.additionalNotesReport}
        onChange={handleChange}
        multiline
        rows={4}
        placeholder="Введите дополнительные заметки (обязательно)"
        required
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Завершить ремонт
        </Button>
      </Box>
    </Box>
  )
}
