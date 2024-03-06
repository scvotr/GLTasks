import { AppBar, Box, Fab, Toolbar, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"

export const NewTask = () => {

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    // reRender(prevKey => prevKey + 1)
  }

  return (
    <>
      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText='Новая задача'> 

        </ModalCustom>
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
                Новая задача:
              </Typography>
              <Fab color="secondary" aria-label="add" onClick={openModal}>
                <AddIcon />
              </Fab>
              </Toolbar>
            </AppBar>
        </Box>
      </>
    </>
  )
}
