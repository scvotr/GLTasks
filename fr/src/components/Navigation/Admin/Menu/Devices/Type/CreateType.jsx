import { AppBar, Box, Button, Fab, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { NavLink } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { fetchData } from "../../../../../../utils/fetchData"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { CreateTypeForm } from "./CreateTypeForm"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const CreateType = () => {
  const currentUser = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)
  const [devicesTypes, setDevicesTypes] = useState([])

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
  }

  const getDevicesTypes = useCallback(() => {
    fetchData(currentUser, "/admin/devices/types/read", setReqStatus, setDevicesTypes)
  }, [currentUser])

  useEffect(() => {
    getDevicesTypes()
  }, [formKey, currentUser, getDevicesTypes])

  const handleClick = row => {
    console.log("row clicked", row)
  }
  const handleEdit = id => {
    console.log("Edit item with id:", id)
  }

  const handleDelete = async id => {
    console.log("Delete item with id:", id)
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/admin/devices/types/delete`, "POST", id, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const sections = [
    // { path: "/admin/devices/workshop/createWorkshop", label: "Создать Цех" },
    { path: "/admin/devices/all", label: "назад" },
  ]
  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить тип оборудование">
        <CreateTypeForm onClose={closeModal} />
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
              Добавить тип механизма
            </Typography>
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            {sections.map((section, index) => (
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
                <Button color="inherit">{section.label}</Button>
              </NavLink>
            ))}
          </Toolbar>
        </AppBar>
      </Box>
      <Loader reqStatus={reqStatus}>
        <Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow></TableRow>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devicesTypes &&
                  devicesTypes.map(deviceType => (
                    <TableRow key={deviceType.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(deviceType)}>
                      <TableCell align="left">{deviceType.id}</TableCell>
                      <TableCell align="left">{deviceType.name}</TableCell>
                      <TableCell align="left">
                        <Stack direction="row">
                          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(deviceType.id)}>
                            Изменить
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDelete(deviceType.id)}>
                            Удалить
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Loader>
    </>
  )
}
