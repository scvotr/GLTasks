import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import Slide from "@mui/material/Slide"
import { useState, forwardRef } from "react"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const FullScreenDialog = ({ isOpen, onClose, children, infoText }) => {
  return (
    <>
      <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {infoText}
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={onClose}>
              save
            </Button> */}
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
          {children}
      </Dialog>
    </>
  )
}


        {/* <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItemButton>
        </List> */}