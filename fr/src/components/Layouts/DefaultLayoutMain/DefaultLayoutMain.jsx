import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { NavLink, Outlet } from "react-router-dom"
import styled from "@emotion/styled"

const StyledButton = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  "&.active": {
    // backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    paddingLeft: 4,
    /* Другие желаемые стили для выбранного пункта */
  },
}))

export const DefaultLayoutMain = () => {
  return (
    <>
      <Box>
        <AppBar>
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gelio Tasks
            </Typography>
            <Stack spacing={2} direction="row">
              <StyledButton color="inherit" variant="outlined" component={NavLink} to="/">
                На главную
              </StyledButton>
              <StyledButton color="inherit" variant="outlined" component={NavLink} to="/login">
                Войти
              </StyledButton>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ mt: 15 }}>
        <Outlet />
      </Box>
    </>
  )
}
