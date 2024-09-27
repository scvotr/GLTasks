import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Table, TableBody, TableCell, TableContainer, Toolbar, TableHead, TableRow, Typography, Paper, Stack } from "@mui/material"
import { Loader } from "../../../../FormComponents/Loader/Loader"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { CreateNewDevice } from "./CreateNewDevice"
import { QRCodePrinter } from "../Machines/QRCode/QRCodePrinter"
import { ConfirmationDialog } from "../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"
import { DeviceInfoView } from "../../../../FormComponents/Device/DeviceInfoView/DeviceInfoView"

export const DevicesAll = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [dataFromEndpoint, setDataFromEndpoint] = useState([])
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [toDelete, setToDelete] = useState()
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  const [deviceToView, setDeviceToView] = useState(false)

  const closeModal = () => {
    setModalOpen(false)
    setFullScreenOpen(false)
    setFormKey(prev => prev + 1)
  }

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/admin/devices/readAll", "POST", null, setReqStatus)
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

  const handleClick = row => {
    console.log("row clicked", row)
    setDeviceToView(row)
    setFullScreenOpen(true)
  }

  const handleDelete = async () => {
    console.log("delete", toDelete)
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/admin/devices/delete`, "POST", toDelete, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const sections = [
    { path: "/admin/devices/type/createType", label: "Создать тип механизма" },
    { path: "/admin/devices/workshop/createWorkshop", label: "Создать Цех" },
    { path: "/admin/devices/motors/createMotor", label: "Создать Двигатель" },
  ]

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить оборудование">
        <CreateNewDevice onClose={closeModal} />
      </ModalCustom>
      <FullScreenDialog isOpen={fullScreenOpen} onClose={closeModal} infoText={deviceToView.device_id}>
        <DeviceInfoView device={deviceToView} />
      </FullScreenDialog>
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
            {sections.map((section, index) => (
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
                <Button color="inherit">{section.label}</Button>
              </NavLink>
            ))}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
          </Toolbar>
        </AppBar>
        <Loader reqStatus={reqStatus}>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={1}></TableCell>
                    <TableCell align="center" colSpan={2}>
                      Цех и Департамент
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Департамент</TableCell>
                    <TableCell align="center">Цех (п\м.)</TableCell>
                    <TableCell align="center">Тип</TableCell>
                    <TableCell align="center">Тех. номер</TableCell>
                    <TableCell align="center">кВт</TableCell>
                    <TableCell align="center">actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFromEndpoint &&
                    dataFromEndpoint.map(row => (
                      <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(row)}>
                        <TableCell align="center">{row.device_id || "---"}</TableCell>
                        <TableCell align="center">{row.department_name || "---"}</TableCell>
                        <TableCell align="center">{row.workshop_name || "---"}</TableCell>
                        <TableCell align="center">{row.type_name || "---"}</TableCell>
                        <TableCell align="center">{row.tech_num || "---"}</TableCell>
                        <TableCell align="center">{row.power_value || "---"}</TableCell>
                        <TableCell align="center">
                          <Stack direction="column" spacing={1} >
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ mr: 1 }}
                              onClick={event => {
                                event.stopPropagation() // Остановить всплытие события
                              }}>
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ mr: 1 }}
                              onClick={event => {
                                event.stopPropagation() // Остановить всплытие события
                                setToDelete(row.device_id)
                                setDialogText({
                                  title: "Подтверждение удаления",
                                  message: "Вы уверены, что хотите удалить это устройство?",
                                })
                                setOpenDialog(true)
                              }}>
                              DELETE
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
          onClose={() => setOpenDialog(false)}
          onConfirm={() => {
            handleDelete()
          }}
          title={dialogText.title}
          message={dialogText.message}
        />
      </Box>
    </>
  )
}
