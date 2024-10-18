import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../utils/getDataFromEndpoint"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material"

export const RemoveMotorConfig = ({ motor, onClose, popupSnackbar }) => {
  console.log(motor.motor_config_id, motor.motor_id)
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

  const handleSubmit = async () => {
    const endpoint = "/admin/devices/motor/config/removeConfigFromMotor"
    try {
      setReqStatus({ loading: true, error: null })
      // Здесь вы можете отправить данные на сервер
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", { motor_config_id: motor.motor_config_id, motor_id: motor.motor_id }, setReqStatus)
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={reqStatus.loading || !selectedMotorConfig} // Отключить кнопку, если идет загрузка или не выбрана конфигурация
          sx={{ mt: 2 }} // Отступ сверху
        >
          Удалить конфигурацию
        </Button>
      </Stack>
    </Box>
  )
}
