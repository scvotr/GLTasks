import { AppBar, Toolbar, Typography, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

export const AppBarForPage = ({ title, openModal }) => {
  return (
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
        {openModal && (
          <Fab color="secondary" aria-label="add" onClick={openModal}>
            <AddIcon />
          </Fab>
        )}
      </Toolbar>
    </AppBar>
  )
}
