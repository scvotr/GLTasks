import { AppBar, Toolbar, Typography } from "@mui/material"

export const DeviceMain = () => {
  return (
    <>
      <AppBar
        position="static"
        sx={{
          mt: 2,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <Toolbar>
          <Typography>Оборудование: </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}