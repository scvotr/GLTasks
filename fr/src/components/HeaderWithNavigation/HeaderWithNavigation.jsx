// HeaderWithNavigation.js
import { AppBar, Box, Button, Fab, Toolbar, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"

export const HeaderWithNavigation = ({ title, sections = [], onAddClick, backPath }) => {
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          mt: 2,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {sections?.length > 0 &&
            sections.map((section, index) => (
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
                <Button color="inherit">{section.label}</Button>
              </NavLink>
            ))}
          <Fab color="secondary" aria-label="add" onClick={onAddClick}>
            <AddIcon />
          </Fab>
          <NavLink to={backPath} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
            <Button color="inherit">назад</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
