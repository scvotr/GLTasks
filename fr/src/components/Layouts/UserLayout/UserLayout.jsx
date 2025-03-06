import { Link, useLocation, Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

import { useAuthContext } from "../../../context/AuthProvider"
import { useSocketContext } from "../../../context/SocketProvider"
import { useTaskContext } from "../../../context/Tasks/TasksProvider"
import useLocalStorageRoute from "../../../utils/useLocalStorageRoute"

export const UserLayout = () => {
  const currentUser = useAuthContext()
  const { notifyEvent } = useTaskContext()

  useEffect(() => {
    if (currentUser.login) {
      notifyEvent("need-all-Tasks")
    }
  }, [currentUser])

  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarLink, setSnackbarLink] = useState("") // Состояние для ссылки
  const location = useLocation() // Получаем текущий путь
  // Проверяем, находится ли пользователь уже по этому адресу
  const isCurrentPath = location.pathname === snackbarLink

  useLocalStorageRoute()

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  const handleLinkClick = () => {
    setOpen(false); // Закрываем Snackbar при клике на ссылку
  };

  const socket = useSocketContext()
  useEffect(() => {
    socket.on("taskApproved", messageData => {
      setSnackbarMessage(messageData.message)
      notifyEvent("need-all-Tasks")
      setOpen(true)
    })
    socket.on("reqForLab", messageData => {
      setSnackbarMessage(messageData.message)
      // setSnackbarLink("/labForSales/requestForAvailability") // Устанавливаем ссылку
      setSnackbarLink("/labForSales") // Устанавливаем ссылку
      // notifyEvent("need-all-Tasks")
      setOpen(true)
    })
    // Для уведомлений !!
    socket.on("reqForLabNewComment", taskData => {
      // notifyEvent("need-all-Tasks")
      setSnackbarMessage(taskData.message)
      // setSnackbarLink("/labForSales/requestForAvailability") // Устанавливаем ссылку
      setSnackbarLink("/labForSales") // Устанавливаем ссылку
      // setLogSnackbarMessage(prev => [...prev, taskData])
      setOpen(true)
    })

    return () => {
      socket.off("yourRooms")
      socket.off("taskApproved")
      socket.off("reqForLab")
      socket.off("reqForLabNewComment")
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
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <MuiAlert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            {snackbarMessage}{" "}
            {!isCurrentPath && snackbarLink && (
              <Link to={snackbarLink} style={{ color: 'inherit', textDecoration: 'underline' }} onClick={handleLinkClick}>
                Перейти
              </Link>
            )}
          </MuiAlert>
        </Snackbar>
      </Box>
      <Outlet />
    </>
  )
}
