import { Outlet } from "react-router-dom"
import { useAuthContext } from "../../../context/AuthProvider"
import { useEffect, useState } from "react"
import { useSocketContext } from "../../../context/SocketProvider"
import { Box } from "@mui/material"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

export const UserLayout = () => {
  const currentUser = useAuthContext()

  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  // const [snackbarMessages, setSnackbarMessages] = useState([])
  // console.log(snackbarMessages)

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  const socket = useSocketContext()
  useEffect(() => {
    socket.on("taskCreated", messageData => {
      setSnackbarMessage(messageData.message)
      // setSnackbarMessages(prevMessages => [...prevMessages, messageData.message])
      // notifyEvent("need-all-Tasks")
      // setLogSnackbarMessage(prev => [...prev, messageData])
      setOpen(true)
    })
    socket.on("taskApproved", messageData => {
      setSnackbarMessage(messageData.message)
      // setSnackbarMessages(prevMessages => [...prevMessages, messageData.message])
      // notifyEvent("need-all-Tasks")
      // setLogSnackbarMessage(prev => [...prev, taskData])
      setOpen(true)
    })

    return () => {
      socket.off("yourRooms")
      socket.off("taskCreated")
      socket.off("taskApproved")
      socket.disconnect()
      window.removeEventListener("beforeunload", () => socket.disconnect())
    }
  }, [])

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.disconnect()
    })
    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.disconnect()
      })
    }
  }, [socket])

  return (
    <>
      <Box>
        <Snackbar open={open} autoHideDuration={16000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <MuiAlert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
      <Outlet />
    </>
  )
}
