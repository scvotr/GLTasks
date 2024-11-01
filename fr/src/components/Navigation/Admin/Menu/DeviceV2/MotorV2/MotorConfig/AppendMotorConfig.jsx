import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../utils/getDataFromEndpoint"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material"

export const AppendMotorConfig = ({ motor, onClose, popupSnackbar }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [allMotorConfig, setAllMotorConfig] = useState([])
  const [selectedMotorConfig, setSelectedMotorConfig] = useState({ motor_id: motor.motor_id, motor_config_id: "" })

  const getAllMotorConfigs = async () => {
    const endpoint = "/admin/devices/motor/config/readAllConfigUninstall"
    try {
      if (currentUser.login) {
        try {
          setReqStatus({ loading: true, error: null })
          const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", null, setReqStatus)
          setAllMotorConfig(data)
          setReqStatus({ loading: false, error: null })
        } catch (error) {
          setReqStatus({ loading: false, error: error.message })
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    getAllMotorConfigs()
  }, [currentUser])

  const handleChange = e => {
    const { value } = e.target // Получаем значение из события
    setSelectedMotorConfig(prev => ({
      ...prev, // Сохраняем предыдущее состояние
      motor_config_id: value, // Обновляем только motor_config_id
    }))
  }

  const handleSubmit = async () => {
    if (!selectedMotorConfig) {
      popupSnackbar("Пожалуйста, выберите конфигурацию двигателя", "error")
      return
    }

    try {
      setReqStatus({ loading: true, error: null })
      // Здесь вы можете отправить данные на сервер
      await getDataFromEndpoint(currentUser.token, "/admin/devices/motor/config/appendConfigToMotor", "POST", selectedMotorConfig, setReqStatus)
      popupSnackbar("Конфигурация успешно установлена", "success")
      onClose() // Закрыть модальное окно после успешной установки
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      popupSnackbar("Ошибка при установке конфигурации", "error")
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  return (
    <Box sx={{ width: "100%", m: 2 }}>
      <Stack direction="column" spacing={1}>
        {" "}
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="conf-select" sx={{ pl: 1 }}>
            {"Выберите двигатель"}
          </InputLabel>
          <Select
            onChange={handleChange}
            inputProps={{
              id: "conf-select",
            }}>
            <MenuItem value="" disabled>
              {allMotorConfig.length ? "Выберете:": 'Нет свободных двигателей'}
            </MenuItem>
            {allMotorConfig?.map(config => (
              <MenuItem key={config.id} value={config.motor_config_id}>
                {config.id + " " + config.brand_name + " " + config.model_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={reqStatus.loading || !selectedMotorConfig || !allMotorConfig.length } // Отключить кнопку, если идет загрузка или не выбрана конфигурация
          sx={{ mt: 2 }} // Отступ сверху
        >
          Установить двигатель
        </Button>
      </Stack>
    </Box>
  )
}
