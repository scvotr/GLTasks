import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useState } from "react"
import { NavLink } from 'react-router-dom';

export const Registration = () => {
  const [error, setError] = useState("")
  const [fieldColor, setFieldColor] = useState("")

  const handleSubmit = () => {}

  const handleChange = () => {}

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
          />
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
