import { useState } from "react"
import { useAuthContext } from "../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../utils/getDataFromEndpoint"
import { Box, Button, Stack } from "@mui/material"

export const RemoveMotorConfigForStorage = ({ motor, onClose, popupSnackbar }) => {
   const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleSubmit = async () => {
    const endpoint = "/admin/devices/motor/config/removeConfigForStorage"
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
          disabled={reqStatus.loading} // Отключить кнопку, если идет загрузка или не выбрана конфигурация
          sx={{ mt: 2 }} // Отступ сверху
        >
          Переместить на склад
        </Button>
      </Stack>
    </Box>
  )
}
