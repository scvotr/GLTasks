import { useEffect, useState } from "react"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useDeviceData } from "../../Devices/useDeviceData"
import { v4 as uuidv4 } from "uuid"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { ConfirmationDialog } from "../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

export const CreateMotorFormV2 = ({ onClose, popupSnackbar, isEdit, motor, handleEdit }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const { useGroupedWorkflowsByDep, useReqStatus } = useDeviceData()

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "Создать номер двигателя?", message: "" })

  const [selectedDepartment, setSelectedDepartment] = useState([])
  const [selectedWorkshop, setSelectedWorkshop] = useState("")
  const [technoNumber, setTechnoNumber] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [error, setError] = useState("")

  const generalDeviceData = {
    device_id: isEdit ? motor.motor_id : deviceId, //! change for motor_id
    department_id: isEdit ? motor.department_id : selectedDepartment.id,
    workshop_id: isEdit ? motor.workshop_id : selectedWorkshop,
    tech_num: isEdit ? motor.engine_number : technoNumber,
  }

  console.log("sss", generalDeviceData)

  const handleDepartmentChange = e => {
    const selected = useGroupedWorkflowsByDep[e.target.value]
    setSelectedDepartment({
      name: e.target.value,
      id: selected ? selected[0].department_id : "",
    })
    setDeviceId(uuidv4())
    setSelectedWorkshop("") // Сбросить выбранный цех
    setTechnoNumber("") // Сбросить выбранный цех
  }

  const handleWorkshopChange = () => {
    setTechnoNumber("")
  }

  const handleTechnoNumberChange = e => {
    const value = e.target.value
    const prefix = "M"

    // Удаляем префикс для проверки числовой части
    const numberPart = value.startsWith(prefix) ? value.slice(prefix.length) : value

    // Проверяем, что строка состоит только из цифр
    const validateNumber = input => /^\d*$/.test(input)

    if (validateNumber(numberPart)) {
      // Если введено только число или пустая строка, добавляем префикс "M"
      setTechnoNumber(numberPart ? prefix + numberPart : "") // Установите пустую строку, если ничего не введено
      setError("")
    } else {
      setError("Номер должен содержать только цифры.")
    }
  }

  const handleSubmit = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/create`, "POST", generalDeviceData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("ok")
      onClose()
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    }
  }

  // Используем useEffect для инициализации состояния при редактировании
  useEffect(() => {
    if (isEdit && motor) {
      // setFormData({
      //   motor_id: motor.motor_id,
      //   // Инициализируйте другие поля из объекта motor
      // })
      console.log(isEdit, motor)
    }
  }, [isEdit, motor])

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault() // Предотвращаем стандартное поведение формы
      setOpenDialog(true) // Открываем диалог подтверждения
    }
  }

  return (
    <Box sx={{ width: "100%" }} component="form" onKeyDown={handleKeyDown}>
      <Loader reqStatus={useReqStatus}>
        <Stack direction="column">
          <Stack direction="row">
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel variant="standard" htmlFor="department-select" sx={{ pl: 1 }}>
                Департамент:
              </InputLabel>
              <Select
                value={selectedDepartment?.name || ""}
                onChange={handleDepartmentChange}
                inputProps={{
                  name: "department",
                  id: "department-select",
                }}>
                <MenuItem value="" disabled>
                  Выберите департамент
                </MenuItem>
                {Object.keys(useGroupedWorkflowsByDep).map(department => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedDepartment?.name && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel variant="standard" htmlFor="workshop-select" sx={{ pl: 1 }}>
                  Цех
                </InputLabel>
                <Select
                  value={selectedWorkshop}
                  onChange={e => {
                    setSelectedWorkshop(e.target.value)
                    handleWorkshopChange()
                  }}
                  inputProps={{
                    name: "workshop",
                    id: "workshop-select",
                  }}>
                  <MenuItem value="" disabled>
                    Выберите цех
                  </MenuItem>
                  {useGroupedWorkflowsByDep[selectedDepartment.name]?.map(workshop => (
                    <MenuItem key={workshop.id} value={workshop.id}>
                      {workshop.workshop_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
          {selectedWorkshop && (
            <>
              <Box sx={{ mt: 2 }} component="form">
                <Stack direction="column">
                  <FormControl sx={{ mb: 2 }}>
                    <TextField
                      label="№ технологический"
                      variant="outlined"
                      value={technoNumber}
                      onChange={handleTechnoNumberChange}
                      required
                      type="text" // Измените на text, чтобы поддерживать точку
                      error={!!error} // Установите ошибку, если есть сообщение об ошибке
                      helperText={error} // Отображение сообщения об ошибке
                    />
                  </FormControl>
                </Stack>
              </Box>
              <Stack direction="column" spacing={2}>
                {/* <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!generalDeviceData.tech_num}> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={e => {
                    e.stopPropagation()
                    setOpenDialog(true)
                  }}
                  disabled={!generalDeviceData.tech_num}>
                  создать
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Loader>
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          handleSubmit()
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
    </Box>
  )
}
