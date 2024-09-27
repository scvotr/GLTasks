import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../CustomSnackbar/CustomSnackbar"
import { Loader } from "../../Loader/Loader"

export const MotorInfoView = ({ device }) => {
  const currentUser = useAuthContext()
  const [response, setResponse] = useState({ loading: false, error: null })
  const [deviceData, setDeviceData] = useState({})

  // SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const popupSnackbar = (text, severity) => {
    setSnackbarMessage(text)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `/admin/devices/motor/config/read`
      try {
        setResponse({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", device, setResponse)
        setDeviceData(...data)
        setResponse({ loading: false, error: null })
      } catch (error) {
        setResponse({ loading: false, error: error.message })
        popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
      }
    }

    if (currentUser.login) {
      fetchData()
    }
  }, [currentUser, device])

  return (
    <Box>
      <Loader reqStatus={response}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2} sx={{ border: "1px solid black" }}>
                  номер
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ border: "1px solid black" }}>
                  Производитель
                </TableCell>
                <TableCell align="center" colSpan={5} sx={{ border: "1px solid black" }}>
                  Электрические
                </TableCell>
                <TableCell align="center" colSpan={4} sx={{ border: "1px solid black" }}>
                  Механические
                </TableCell>
                <TableCell align="center" colSpan={3} sx={{ border: "1px solid black" }}>
                  Защита
                </TableCell>
                <TableCell align="center" colSpan={3} sx={{ border: "1px solid black" }}>
                  Технические
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">motor_tech_num</TableCell>
                <TableCell align="left">Марка</TableCell>
                <TableCell align="left">модель</TableCell>
                <TableCell align="left">кВт</TableCell>
                <TableCell align="left">А</TableCell>
                <TableCell align="left">V</TableCell>
                <TableCell align="left">КПД</TableCell>
                <TableCell align="left">cos φ</TableCell>
                <TableCell align="left">об\мин</TableCell>
                <TableCell align="left">Нм</TableCell>
                <TableCell align="left">t</TableCell>
                <TableCell align="left">S</TableCell>
                <TableCell align="left">IP</TableCell>
                <TableCell align="left">Ex</TableCell>
                <TableCell align="left">Ed</TableCell>
                <TableCell align="left">подшипник</TableCell>
                <TableCell align="left">IM</TableCell>
                <TableCell align="left">DM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deviceData ? (
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => console.log("deviceData")}>
                  <TableCell align="left">{deviceData.motor_config_id || "---"}</TableCell>
                  <TableCell align="left">{deviceData.motor_tech_num || "---"}</TableCell>
                  <TableCell align="left">{deviceData.brand_name || "---"}</TableCell>
                  <TableCell align="left">{deviceData.model_name || "---"}</TableCell>
                  <TableCell align="left">{deviceData.power_range || "---"}</TableCell>
                  <TableCell align="left">{deviceData.amperage_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.voltage_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.torque_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.cosF_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.rotation_speed || "---"}</TableCell>
                  <TableCell align="left">{deviceData.protection_level || "---"}</TableCell>
                  <TableCell align="left">{deviceData.temperature_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.operation_mode || "---"}</TableCell>
                  <TableCell align="left">{deviceData.protection_level || "---"}</TableCell>
                  <TableCell align="left">{deviceData.explosion_proof || "---"}</TableCell>
                  <TableCell align="left">{deviceData.brake_value || "---"}</TableCell>
                  <TableCell align="left">{deviceData.bearing_type || "---"}</TableCell>
                  <TableCell align="left">{deviceData.mounting_type || "---"}</TableCell>
                  <TableCell align="left">{deviceData.brake_value || "---"}</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={18} align="center">
                    {response.loading ? "Загрузка данных..." : "Не присвоен двигатель"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Loader>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </Box>
  )
}
