import { useEffect, useState } from "react"
import { TextField, Button, Grid, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { useSocketContext } from "../../../../../../context/SocketProvider"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

export const EditProfile = ({ text }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [userData, setUserData] = useState()
  const [errorPin, setErrorPin] = useState("")

  useEffect(() => {
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/user/getUserById", "POST", null, setReqStatus)
      .then(data => {
        setUserData(data)
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => console.log(error))
  }, [currentUser])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/user/editUserData", "POST", userData, setReqStatus)
      currentUser.setEmptyProfile(false)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: null })
    }
  }

  const [snackbarMessage, setSnackbarMessage] = useState()
  const [open, setOpen] = useState(false)

  const socket = useSocketContext()
  useEffect(() => {
    // socket.on('need-logout', messageData => {
    socket.on("taskApproved", messageData => {
      console.log(messageData.message)
      setSnackbarMessage(messageData.message)
      setOpen(true)
    })

    return () => {
      socket.off("yourRooms")
      socket.off("taskApproved")
      // socket.off("need-logout")
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: "center" }}>
      {reqStatus.loading ? (
        <CircularProgress />
      ) : (
        <>
          <Snackbar open={open} autoHideDuration={16000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <MuiAlert onClose={handleClose} severity="warning" variant="filled" sx={{ width: "100%" }}>
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
          <Typography variant="h4" gutterBottom>
            {"Для дальнейшей работы заполните профиль!"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Логин: {userData.login || ""}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <TextField
              sx={{ mr: 2 }}
              required
              label="Имя"
              name="first_name"
              value={userData.first_name || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Ваше имя"}
              inputProps={{
                minLength: 4,
              }}
            />
            <TextField
              sx={{ mr: 2 }}
              required
              label="Отчество"
              name="middle_name"
              value={userData.middle_name || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Ваше отчество"}
              inputProps={{
                minLength: 4,
              }}
            />
            <TextField
              required
              label="Фамилия"
              name="last_name"
              value={userData.last_name || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Вашу фамилию"}
              inputProps={{
                minLength: 4,
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              required
              sx={{ mr: 2 }}
              label="№ внеш. тел."
              name="external_phone"
              value={userData.external_phone || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "введите цифры"}
              inputProps={{
                minLength: 6,
                maxLength: 8,
              }}
            />
            <TextField
              required
              label="№ внутр. тел."
              name="internal_phone"
              value={userData.internal_phone || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "введите цифры"}
              inputProps={{
                minLength: 4,
                maxLength: 6,
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              required
              label="№ каб."
              name="office_number"
              value={userData.office_number || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "введите цифры"}
              inputProps={{
                pattern: "[0-9]*",
                minLength: 3,
                maxLength: 5,
              }}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Сохранить
          </Button>
        </>
      )}
    </Box>
  )
}
