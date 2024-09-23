import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../../ModalCustom/ModalCustom"
import {
  AppBar,
  Box,
  Button,
  Fab,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { fetchData } from "../../../../../../../../../utils/fetchData"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { ConfirmationDialog } from "../../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import { CreateVoltageForm } from "./CreateVoltageForm"

export const Voltage = () => {
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
  const [data, setData] = useState("")

  const [getRes, setGetRes] = useState("")
  console.log("getRes!!!!!!!!", getRes)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const popupSuccess = text => {
    setSnackbarMessage(text)
    setSnackbarSeverity("success")
    setOpenSnackbar(true)
  }
  const popupError = text => {
    setSnackbarMessage(text)
    setSnackbarSeverity("error")
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
    setIsEdit(false)
  }

  const getItem = useCallback(() => {
    fetchData(currentUser, "/admin/devices/motor/electrical/voltage/read", setReqStatus, setItem)
  }, [currentUser, formKey])

  useEffect(() => {
    getItem()
  }, [formKey, currentUser, getItem])

  useEffect(() => {
    if (getRes) {
      popupError(`Ошибка:  ${getRes.message}`)
    }
  }, [getRes])

  const handleClick = row => {
    // console.log("row clicked", row)
  }
  const handleEdit = async () => {
    setData(toEdit)
    setModalOpen(true)
    setIsEdit(true)
  }

  //  useEffect для сброса getRes при закрытии модального окна
  useEffect(() => {
    if (!modalOpen) {
      setGetRes("") // Сбрасываем getRes, когда модальное окно закрывается
    }
  }, [modalOpen])

  const handleDelete = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        `/admin/devices/motor/electrical/voltage/delete`,
        "POST",
        toDelete,
        setGetRes
      )
      setReqStatus({ loading: false, error: null })
      popupSuccess("Успешно удалена!")
      setFormKey(prev => prev + 1)
      setToDelete(null) // Сбрасываем состояние удаления
      setToEdit(null) // Сбрасываем состояние редактирования
      setIsEdit(false) // Сбрасываем флаг редактирования
    } catch (error) {
      popupError("Ошибка при удалена.")
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
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить напряжение">
        <CreateVoltageForm
          onClose={closeModal}
          isEdit={isEdit}
          dataToEdit={data}
          popupSuccess={popupSuccess}
          popupError={popupError}
          response={setGetRes}
        />
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
              Номинальное напряжение В (вольт), обозначается U:
            </Typography>
            {/* <NavigationButtons sections={sections} /> */}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            <NavLink
              to="/admin/devices/motor/electrical"
              style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Напряжение трехфазных машин - это линейное напряжение, т. е. напряжение между фазами сети, к которой подключен
          ЭД. На общепромышленных двигателях оно обычно равно 380В или 400В и 600В. Реже используется 220 В.
          Высоковольтные двигатели от 6000 В
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
                    <TableRow
                      key={data.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      hover
                      onClick={() => handleClick(data)}>
                      <TableCell align="left">{data.id}</TableCell>
                      <TableCell align="left">{data.name}</TableCell>
                      <TableCell align="left">
                        <Stack direction="row">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setToEdit({ id: data.id, name: data.name })
                              setDialogText({
                                title: "Подтверждение редактирования",
                                message: "Вы уверены, что хотите Изменить это номинальное напряжение?",
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
                                message: "Вы уверены, что хотите удалить это номинальное напряжение?",
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
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
