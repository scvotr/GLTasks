import { AppBar, Box, Button, Fab, Table, TableBody, TableCell, TableContainer, Toolbar, TableHead, TableRow, Typography, Paper, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useCallback, useEffect, useState } from "react"

export const DeviceAllV2 = () => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
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
              Добавить оборудование
            </Typography>
            {/* {sections.map((section, index) => (
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
                <Button color="inherit">{section.label}</Button>
              </NavLink>
            ))} */}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
