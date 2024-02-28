import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { NavLink, Outlet } from "react-router-dom"

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
              <Button color="inherit" variant="outlined" component={NavLink} to="/">
                На главную
              </Button>
              <Button color="inherit" variant="outlined" component={NavLink} to="/login">
                Войти
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{mt: 10}}>
        <Outlet />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque unde sit ipsum perspiciatis! Animi pariatur sequi alias corporis veritatis ducimus.
      </Box>
    </>
  )
}
