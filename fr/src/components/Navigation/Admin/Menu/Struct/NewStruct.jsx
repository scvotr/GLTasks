import { useCallback, useEffect, useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import { AppBar, Box, Fab, Toolbar, Typography } from "@mui/material"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { StructTable } from "../../Tables/StructTable/StructTableView"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AddStuctForm } from "./AddStuctForm"

export const NewStruct = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [dataFromEndpoint, setDataFromEndpoint] = useState([])
  const [formKey, setFormKey] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    // reRender(prevKey => prevKey + 1)
  }

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/orgStruct/getPositions", "POST", null, setReqStatus)
        setDataFromEndpoint(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser, formKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText='Добавить отдел'>
          <AddStuctForm  onTaskSubmit={closeModal}/>
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
                Отделы:{" "}
              </Typography>
              <Fab color="secondary" aria-label="add" onClick={openModal}>
                <AddIcon />
              </Fab>
            </Toolbar>
          </AppBar>
        </Box>
        <StructTable users={dataFromEndpoint} reRender={setFormKey} />
      </>
    </>
  )
}
