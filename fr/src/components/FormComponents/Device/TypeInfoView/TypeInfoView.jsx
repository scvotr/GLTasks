import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../CustomSnackbar/CustomSnackbar"
import { Loader } from "../../Loader/Loader"
import { BucketElevatorsView } from "./BucketElevatorsView/BucketElevatorsView"

export const TypeInfoView = ({ device }) => {
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

  // Объединенный объект для endpoints и компонентов
  const deviceMapping = {
    1: { endpoint: `/admin/devices/bucketElevators/read`, component: BucketElevatorsView },
    3: { endpoint: `/admin/devices/transporter/read`, component: "TransporterComponent" },
    4: { endpoint: `/admin/devices/conveyor/read`, component: "ConveyorComponent" },
    5: { endpoint: `/admin/devices/separator/read`, component: "SeparatorComponent" },
    10: { endpoint: `/admin/devices/gateValve/read`, component: "GateValveComponent" },
  }

  useEffect(() => {
    const fetchData = async () => {
      const deviceInfo = deviceMapping[device.type_id]
      try {
        setResponse({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, deviceInfo.endpoint, "POST", device, setResponse)
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

  const renderDeviceComponent = () => {
    const deviceInfo = deviceMapping[device.type_id]
    if (deviceInfo) {
      const Component = deviceInfo.component
      return <Component data={deviceData} />
    }
    return <div>Неизвестный тип устройства</div>
  }

  return (
    <Box>
      <Loader reqStatus={response}>
        {deviceData && renderDeviceComponent()}
      </Loader>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </Box>
  )
}
