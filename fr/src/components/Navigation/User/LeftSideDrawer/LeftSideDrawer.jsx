import MenuOpenTwoTone from "@mui/icons-material/MenuOpenTwoTone"
import { AppBar, Box, IconButton, Toolbar } from "@mui/material"
import { useEffect, useState } from "react"
import { ToolbarButton } from "../../ToolbarButton/ToolbarButton"

export const LeftSideDrawer = ({ currentUser, children }) => {
  const initialOpen = localStorage.getItem("drawerOpen") === "true"
  const [open, setOpen] = useState(initialOpen)

  useEffect(() => {
    localStorage.setItem("drawerOpen", open)
  }, [open])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}>
            <MenuOpenTwoTone fontSize="large" />
          </IconButton>
          <ToolbarButton currentUser={currentUser} />
        </Toolbar>
      </AppBar>

      
    </Box>
  )
}
