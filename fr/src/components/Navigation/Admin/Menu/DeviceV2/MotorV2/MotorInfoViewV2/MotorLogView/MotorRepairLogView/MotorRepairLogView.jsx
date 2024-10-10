import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../../../../../../CustomSnackbar/CustomSnackbar"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"

export const MotorRepairLogView = ({ motor }) => {
  const currentUser = useAuthContext()
  const [response, setResponse] = useState({ loading: false, error: null })
  const [tableData, setTableData] = useState([])

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
    const endpoint = ""
    try {
      setResponse({ loading: true, error: null })
      const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", motor, setResponse)
      setTableData(...data)
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
      <Loader reqStatus={response}></Loader>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </>
  )
}
