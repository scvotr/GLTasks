import { Outlet, useLocation, useNavigate, Link } from "react-router-dom"
import { useAuthContext } from "../../../context/AuthProvider"
import { useEffect, useState } from "react"
import { useSocketContext } from "../../../context/SocketProvider"
import { Box } from "@mui/material"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import { useTaskContext } from "../../../context/Tasks/TasksProvider"

export const LeadLayout = () => {
  const currentUser = useAuthContext()
  const { notifyEvent } = useTaskContext()
  const [snackbarLink, setSnackbarLink] = useState("") // Состояние для ссылки
  const location = useLocation() // Получаем текущий путь
  // Проверяем, находится ли пользователь уже по этому адресу
  const isCurrentPath = location.pathname === snackbarLink

  useEffect(() => {
    if (currentUser.login) {
      notifyEvent("need-all-Tasks")
    }
  }, [currentUser])

  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  //!------------------------
  const navigate = useNavigate()

  useEffect(() => {
    const savedRoute = localStorage.getItem("currentRoute")
    if (savedRoute && savedRoute !== location.pathname) {
      navigate(savedRoute)
    }
  }, [location, navigate])
  //!------------------------

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  const handleLinkClick = () => {
    setOpen(false) // Закрываем Snackbar при клике на ссылку
  }

  const socket = useSocketContext()
  useEffect(() => {
    socket.on("taskCreated", messageData => {
      setSnackbarMessage(messageData.message)
      notifyEvent("need-all-Tasks")
      // setLogSnackbarMessage(prev => [...prev, messageData])
      setOpen(true)
    })
    socket.on("taskApproved", taskData => {
      notifyEvent("need-all-Tasks")
      setSnackbarMessage(taskData.message)
      // setLogSnackbarMessage(prev => [...prev, taskData])
      setOpen(true)
    })
    socket.on("reqForLab", taskData => {
      // notifyEvent("need-all-Tasks")
      setSnackbarMessage(taskData.message)
      setSnackbarLink("/labForSales/requestForAvailability") // Устанавливаем ссылку
      // setLogSnackbarMessage(prev => [...prev, taskData])
      setOpen(true)
    })
    // Для уведомлений !!
    socket.on("reqForLabNewComment", taskData => {
      // notifyEvent("need-all-Tasks")
      setSnackbarMessage(taskData.message)
      setSnackbarLink("/labForSales/requestForAvailability") // Устанавливаем ссылку
      // setLogSnackbarMessage(prev => [...prev, taskData])
      setOpen(true)
    })

    return () => {
      socket.off("yourRooms")
      socket.off("taskCreated")
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
        <Snackbar open={open} autoHideDuration={16000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
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
