import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { CustomSnackbar } from "../../../../../../../../CustomSnackbar/CustomSnackbar"

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
    try {
      setResponse({ loading: true, error: null })
      const data = await getDataFromEndpoint(currentUser.token, "", "POST", motor, setResponse)
      setTableData(...data)
      setResponse({ loading: false, error: null })
    } catch (error) {
      setResponse({ loading: false, error: error.message })
    }
  }

  useEffect(() => {
    if (currentUser.login) {
      fetchData()
    }
  }, [currentUser, motor])

  return (
    <>
      MotorRepairLogView
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </>
  )
}
