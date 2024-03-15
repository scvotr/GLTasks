import { Outlet } from "react-router-dom"
import { useAuthContext } from "../../../context/AuthProvider"
import { useEffect, useState } from "react"
import { useSocketContext } from "../../../context/SocketProvider"
import { Box } from "@mui/material"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import { useTaskContext } from "../../../context/TasksProvider"

export const LeadLayout = () => {
  const currentUser = useAuthContext()
  const {allTasks, notifyEvent} = useTaskContext()

  useEffect(() => {
    if(currentUser.login) {
      notifyEvent("need-all-Tasks")
    }
  }, [currentUser])

  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

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
      notifyEvent("need-all-Tasks")
      // setLogSnackbarMessage(prev => [...prev, messageData])
      setOpen(true)
    })
    socket.on("taskApproved", taskData => {
      // notifyEvent("need-all-Tasks")
      setSnackbarMessage(taskData.message)
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
      socket.disconnect();
    });
    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.disconnect();
      });
    };
  }, [socket]);

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
