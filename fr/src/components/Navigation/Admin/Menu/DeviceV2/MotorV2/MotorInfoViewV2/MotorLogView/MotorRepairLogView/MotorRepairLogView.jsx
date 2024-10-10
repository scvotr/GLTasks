import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../../../../../../CustomSnackbar/CustomSnackbar"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider } from "@mui/material"
import { formatDateV2 } from "../../../../../../../../../utils/formatDate"

export const MotorRepairLogView = ({ motor }) => {
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
      const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", motor.by_history_id, setResponse)
      setTableData(data)
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

  // Функция для вычисления затраченного времени
  const calculateTotalTime = (start, end) => {
    console.log(start, end)
    const startDate = new Date(start.split(" ").join("T")) // Преобразуем строку в формат ISO
    const endDate = new Date(end.split(" ").join("T"))
    const totalTimeInSeconds = (endDate - startDate) / 1000 // Разница в миллисекундах
    const hours = Math.floor(totalTimeInSeconds / 3600)
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60)
    const seconds = Math.floor(totalTimeInSeconds % 60)
    return `${hours}ч ${minutes}м ${seconds}с` // Форматируем результат
  }

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
                    <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => console.log("qq")}>
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{formatDateV2(row.repair_start_local, true)}</TableCell>
                      <TableCell align="center">{formatDateV2(row.repair_end_local, true)}</TableCell>
                      <TableCell align="center">{calculateTotalTime(row.repair_start_local, row.repair_end_local)}</TableCell>
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
