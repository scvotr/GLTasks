import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { fetchData } from "../../../../../../../../../utils/fetchData"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { CreatePowerForm } from "./CreatePowerForm"
import { ConfirmationDialog } from "../../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

export const Power = () => {
  const currentUser = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)
  const [item, setItem] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [toDelete, setToDelete] = useState(null)
  const [toEdit, setToEdit] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [data, setData] = useState('')

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
    setIsEdit(false)
  }

  const getItem = useCallback(() => {
    fetchData(currentUser, "/admin/devices/motor/electrical/power/read", setReqStatus, setItem)
  }, [currentUser])

  useEffect(() => {
    getItem()
  }, [formKey, currentUser, getItem])

  const handleClick = row => {
    // console.log("row clicked", row)
  }
  const handleEdit = async () => {
    console.log("Edit item with id:", toEdit)
    setData(toEdit)
    setModalOpen(true)
    setIsEdit(true)
  }

  const handleDelete = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/power/delete`, "POST", toDelete, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  //   const sections = [
  //     { path: "/admin/devices/motor/electrical/power", label: "Мощность кВт" },
  //   ]

  //   const NavigationButtons = ({ sections }) => {
  //     return sections.map((section, index) => (
  //       <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
  //         <Button color="inherit">{section.label}</Button>
  //       </NavLink>
  //     ))
  //   }

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить мощность" >
        <CreatePowerForm onClose={closeModal} isEdit={isEdit} dataToEdit={data} />
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
              Мощности:
            </Typography>
            {/* <NavigationButtons sections={sections} /> */}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            <NavLink to="/admin/devices/motor/electrical" style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Box>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          кВт (киловатт),обозначается P
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Механическая полезная мощность на валу электродвигателя. Потребляемая мощность двигателя всегда больше.
        </Typography>
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
                {item &&
                  item.map(data => (
                    <TableRow key={data.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(data)}>
                      <TableCell align="left">{data.id}</TableCell>
                      <TableCell align="left">{data.name}</TableCell>
                      <TableCell align="left">
                        <Stack direction="row">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setToEdit({id: data.id, name: data.name})
                              setDialogText({
                                title: "Подтверждение редактирования",
                                message: "Вы уверены, что хотите Изменить этот тип устройства?",
                              })
                              setOpenDialog(true)
                            }}>
                            Изменить
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              setToDelete(data.id)
                              setDialogText({
                                title: "Подтверждение удаления",
                                message: "Вы уверены, что хотите удалить этот тип устройства?",
                              })
                              setOpenDialog(true)
                            }}>
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
      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        onConfirm={() => {
          if (toDelete) {
            handleDelete()
          } else if (toEdit) {
            handleEdit()
          }
          setOpenDialog(false)
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
    </>
  )
}
