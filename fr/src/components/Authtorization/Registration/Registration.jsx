import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Stack, TextField, Typography } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { sendRegData } from "./API/sendRegData"
import { HOST_ADDR } from "../../../utils/remoteHosts"

export const Registration = () => {
  const [reqStatus, setReqStatus] = useState(null)
  const [formData, setFormData] = useState({ name: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [fieldColor, setFieldColor] = useState("")
  const [errorPin, setErrorPin] = useState("")
  const [fieldColorPin, setFieldColorPin] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await sendRegData(formData, HOST_ADDR, setReqStatus)
    } catch (error) {
      console.log('sendRegData - handleSubmit: ', error)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password" || name === "confirmPassword") setError("")
    const newPasswordValue = name === "password" ? value : formData.password
    const confirmPasswordValue = name === "confirmPassword" ? value : formData.confirmPassword
    if (newPasswordValue && newPasswordValue === confirmPasswordValue) {
      setFieldColor("success") // функция, изменяющая цвет поля, должна быть определена в вашем коде
    } else {
      setFieldColor("warning") // сброс цвета поля
    }

    if (name === "pincode" || name === "confirmPincode") setErrorPin("")
    const pincode = name === "pincode" ? value : formData.pincode
    const confirmPincode = name === "confirmPincode" ? value : formData.confirmPincode
    if (pincode && pincode === confirmPincode) {
      setFieldColorPin("success")
    } else {
      setFieldColorPin("warning")
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
      }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Введите ваш логин"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handleChange}
            helperText={"Это поле обязательно к заполнению"}
            inputProps={{
              minLength: 4,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Введите ваш пароль"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
            color={fieldColor}
            error={!!error}
            helperText={error || "Это поле обязательно к заполнению"}
            inputProps={{
              minLength: 4,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Повторите введеный пароль"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
            color={fieldColor}
            error={!!error}
            helperText={error || "Это поле обязательно к заполнению"}
            inputProps={{
              minLength: 4,
            }}
          />
          {/* -------------------------------- */}
          <Stack spacing={1} direction="row">
            <TextField
              margin="normal"
              required
              fullWidth
              name="pincode"
              label="Введите пин-код"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
              color={fieldColorPin}
              error={!!errorPin}
              helperText={errorPin || "введите 4 цифры"}
              inputProps={{
                minLength: 4,
                maxLength: 4,
                pattern: "[0-9]{4}",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPincode"
              label="Повторите пин-код"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
              color={fieldColorPin}
              error={!!errorPin}
              helperText={errorPin || "введите 4 цифры"}
              inputProps={{
                minLength: 4,
                maxLength: 4,
                pattern: "[0-9]{4}",
              }}
            />
          </Stack>
          {/* -------------------------------- */}
          <FormControlLabel required control={<Checkbox value="agreeTerms" color="primary" />} label="Согласен с условиями использования" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Зарегистрироватся
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={NavLink} to="/login" variant="body2">
                Есть учетная запись? Войти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
