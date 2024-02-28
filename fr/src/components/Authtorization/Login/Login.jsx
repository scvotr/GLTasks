import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { NavLink } from "react-router-dom"
import { useState } from "react"

export const Login = () => {
  const [reqStatus2, setReqStatus2] = useState(null)

  const handleSubmit = () => {}

  const handleChange = () => {}

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        p: 1,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
      }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход
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
            error={!!reqStatus2}
            helperText={reqStatus2 || "Это поле обязательно к заполнению"}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Введите ваш пароль"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={!!reqStatus2}
            helperText={reqStatus2 || "Это поле обязательно к заполнению"}
          />
          {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Оставаться в системе" /> */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Войти
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={NavLink} to="/restorePassword" variant="body2">
                Забыли пароль?
              </Link>
            </Grid>
            <Grid item>
              <Link component={NavLink} to="/registration" variant="body2">
                Нет учетной записи? Зарегистрироваться
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
