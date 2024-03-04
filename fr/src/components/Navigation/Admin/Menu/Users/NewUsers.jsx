import { useState } from "react"
import { AppBar, Toolbar, Typography } from "@mui/material"


export const NewUsers = () => {
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
          <Typography>Пользователи: </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}