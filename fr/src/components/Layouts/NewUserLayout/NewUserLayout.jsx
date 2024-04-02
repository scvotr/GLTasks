import { Box } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

import { useAuthContext } from "../../../context/AuthProvider"
import { useSocketContext } from "../../../context/SocketProvider"
import useLocalStorageRoute from "../../../utils/useLocalStorageRoute"

export const NewUserLayout = () => {
  const currentUser = useAuthContext()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  useLocalStorageRoute()

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  const socket = useSocketContext()
  useEffect(() => {
    socket.on("taskApproved", messageData => {
      setSnackbarMessage(messageData.message)
      setOpen(true)
    })
    return () => {
      socket.off("yourRooms")
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

  useEffect(() => {
    // Проверяем, пустой ли профиль и перенаправляем на /settings/profile
    if (currentUser.profile.toString() === 'true') {
      navigate('/settings/profile')
    } if (currentUser.notDistributed.toString() === 'true') {
      // Показываем сообщение
      setSnackbarMessage("Обратитесь к администратору для назначения отдела")
      setOpen(true)
    }
  }, [currentUser, navigate])

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
