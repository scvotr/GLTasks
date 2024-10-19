import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../../../../../../CustomSnackbar/CustomSnackbar"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider } from "@mui/material"
import { formatDateV2 } from "../../../../../../../../../utils/formatDate"
import { calculateTotalTime } from "../../../../../../../../../utils/calculateTotalTime"

export const MotorRepairLogView = ({ motor }) => {
  console.log(motor)
  const currentUser = useAuthContext()
  const [response, setResponse] = useState({ loading: false, error: null })
  const [tableData, setTableData] = useState([])

  console.log("ddd", tableData)

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

  const fetchData = async () => {
    const endpoint = "/admin/devices/motor/log/repair/readAll"
    try {
      setResponse({ loading: true, error: null })
      // const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", motor.by_history_id, setResponse)
      const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST",{ motor_id: motor.motor_id, motor_config_id: motor.motor_config_id }, setResponse)
      // Сортируем данные по repair_start_local
      const sortedData = data.sort((a, b) => new Date(b.repair_start_local) - new Date(a.repair_start_local))
      setTableData(sortedData)
      setResponse({ loading: false, error: null })
    } catch (error) {
      setResponse({ loading: false, error: error.message })
      popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    }
  }

  useEffect(() => {
    if (currentUser.login) {
      fetchData()
    }
  }, [currentUser, motor])

  return (
    <>
      <Loader reqStatus={response}>
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="журнал ремонтов">
              <TableHead>
                <TableRow>
                  <TableCell align="center">№</TableCell>
                  <TableCell align="center">Начат</TableCell>
                  <TableCell align="center">Завершён</TableCell>
                  <TableCell align="center">Затраченное время</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData &&
                  tableData.map((row, id) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, backgroundColor: !row.repair_end_local ? "rgba(255, 0, 0, 0.1)" : "inherit" }}
                      hover
                      onClick={() => console.log("qq")}>
                      <TableCell align="center">{id + 1}</TableCell>
                      <TableCell align="center">{formatDateV2(row.repair_start_local, true)}</TableCell>
                      <TableCell align="center">{row.repair_end_local ? formatDateV2(row.repair_end_local, true) : "Идет ремонт"}</TableCell>
                      <TableCell align="center">
                        {row.repair_end_local ? calculateTotalTime(row.repair_start_local, row.repair_end_local) : "Идет ремонт"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Loader>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </>
  )
}
