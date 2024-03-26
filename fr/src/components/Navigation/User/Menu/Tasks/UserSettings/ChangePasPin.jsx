import { useEffect, useState } from "react"
import { TextField, Button, Grid, Box, CircularProgress, Stack } from "@mui/material"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { sendDataToChangePasPin } from "../../../../../../utils/sendDataToChangePasPin"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
}))

export const ChangePasPin = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [formData, setFormData] = useState({ name: currentUser.name, oldPassword: "", newPassword: "" })
  const [error, setError] = useState("")
  const [fieldColor, setFieldColor] = useState("")
  const [errorPin, setErrorPin] = useState("")
  const [fieldColorPin, setFieldColorPin] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (name === "oldPassword" || name === "newPassword") setError("")
    const newPasswordValue = name === "oldPassword" ? value : formData.oldPassword
    const confirmPasswordValue = name === "newPassword" ? value : formData.newPassword
    if (newPasswordValue && newPasswordValue === confirmPasswordValue) {
      setFieldColor("success") // функция, изменяющая цвет поля, должна быть определена в вашем коде
    } else {
      setFieldColor("warning") // сброс цвета поля
    }

    // if (name === "pincode" || name === "confirmPincode") setErrorPin("")
    // const pincode = name === "pincode" ? value : formData.pincode
    // const confirmPincode = name === "confirmPincode" ? value : formData.confirmPincode
    // if (pincode && pincode === confirmPincode) {
    //   setFieldColorPin("success")
    // } else {
    //   setFieldColorPin("warning")
    // }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setReqStatus({ loading: true, error: null })

    sendDataToChangePasPin(currentUser.token, "/auth/changePassword", "POST", formData, setReqStatus)
      .then(data => {
        if (data.newToken) {
          currentUser.updateToken(data.newToken)
          setFormData({ name: currentUser.name, oldPassword: "", newPassword: "" })
          setSuccessMessage("Пароль успешно изменен!")
          setError("")
          setReqStatus({ loading: false, error: null })
        } else {
          setError(data.changePassword)
          setSuccessMessage("")
          setReqStatus({ loading: false, error: null })
        }
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error.message })
      })
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '50%', margin: '0 auto', mt: 3, textAlign: "center" }}>
        <Item>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <TextField
              margin="normal"
              required
              name="oldPassword"
              label="Введите старый пароль"
              type="password"
              autoComplete="old-password"
              onChange={handleChange}
              color={fieldColor}
              error={!!error}
              helperText={successMessage || error || "Это поле обязательно к заполнению"}
              inputProps={{
                minLength: 4,
                value: formData.oldPassword,
              }}
            />
            <TextField
              margin="normal"
              required
              name="newPassword"
              label="Введите новый пароль"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
              color={fieldColor}
              error={!!error}
              helperText={successMessage || error || "Это поле обязательно к заполнению"}
              inputProps={{
                minLength: 4,
                value: formData.newPassword,
              }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Изменить пароль
            </Button>
          </Stack>
        </Item>
      </Box>
    </>
  )
}
