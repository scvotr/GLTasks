import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { Divider, AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { fetchData } from "../../../../../../utils/fetchData"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { CreateMotorFormV2 } from "./CreateMotorFormV2"
import { CustomSnackbar } from "../../../../../CustomSnackbar/CustomSnackbar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { ConfirmationDialog } from "../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

export const CreateMotorV2 = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [isEdit, setIsEdit] = useState(false)

  // SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const [motors, setMotors] = useState([])
  const [motor, setMotor] = useState([])

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "Удалить номер двигателя?", message: "" })

  const getAllMotors = useCallback(() => {
    fetchData(currentUser, "/admin/devices/motor/readAll", setReqStatus, setMotors)
  })

  useEffect(() => {
    getAllMotors()
  }, [currentUser, formKey])

  const closeModal = () => {
    setModalOpen(false)
    setAnchorEl(null)
    setIsEdit(false)
    setFormKey(prev => prev + 1)
  }

  // SnackBar
  const popupSnackbar = (text, severity) => {
    setSnackbarMessage(text)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }
  // SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleClick = (event, data) => {
    // Получаем координаты курсора
    const { clientX, clientY } = event
    // Устанавливаем anchorEl как объект с координатами
    setAnchorEl({ top: clientY, left: clientX })
    setMotor(data)
  }
  const handleDelete = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      const res = await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/delete`, "POST", motor.motor_id, setReqStatus)
      popupSnackbar(res)
      setFormKey(prev => prev + 1)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    }
  }
  const handleOpenEdit = async () => {
    setIsEdit(true)
    setModalOpen(true)
  }

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText={isEdit ? "Изменить?" : "Добавить номер двигателя"}>
        <CreateMotorFormV2 onClose={closeModal} popupSnackbar={popupSnackbar} isEdit={isEdit} motor={motor} />
      </ModalCustom>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? { top: anchorEl.top, left: anchorEl.left } : undefined}
        open={open}
        onClose={closeModal}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={closeModal}>Забрать на ремонт</MenuItem>
        <MenuItem onClick={closeModal}>Запланировать ТО</MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenEdit}>Редактировать</MenuItem>
        <MenuItem
          sx={{
            color: "error.main", // Устанавливаем цвет текста на красный
            "&:hover": {
              color: "error.dark", // Устанавливаем цвет текста при наведении
              backgroundColor: "rgba(255, 0, 0, 0.1)", // Можно добавить легкий фон при наведении
            },
          }}
          onClick={e => {
            e.stopPropagation()
            setOpenDialog(true)
            setAnchorEl(null)
          }}>
          Удалить
        </MenuItem>
      </Menu>
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
              Добавить двигатель:
            </Typography>
            {/* <NavigationButtons sections={sections} /> */}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            <NavLink to="/admin/devicesV2/all" style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
        <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
      </Box>
      <Box>
        <Loader reqStatus={reqStatus}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={1} sx={{ border: "1px solid black" }}></TableCell>
                  <TableCell align="center" colSpan={1} sx={{ border: "1px solid black" }}>
                    номер
                  </TableCell>
                  <TableCell align="center" colSpan={2} sx={{ border: "1px solid black" }}>
                    Принадлежность
                  </TableCell>
                  <TableCell align="center" colSpan={1} sx={{ border: "1px solid black" }}>
                    Электрические
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Тех. номер</TableCell>

                  <TableCell align="left">Департамент</TableCell>
                  <TableCell align="left">Объект</TableCell>
                  <TableCell align="left">Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motors &&
                  motors.map(motor => (
                    <TableRow
                      key={motor.motor_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      hover
                      onClick={event => handleClick(event, motor)}>
                      <TableCell align="left">{motor.motor_id.substring(0, 5)}</TableCell>
                      <TableCell align="left">{motor.engine_number}</TableCell>
                      <TableCell align="left">{motor.department_name}</TableCell>
                      <TableCell align="left">{motor.workshop_name}</TableCell>
                      <TableCell align="left">{motor.device_id ? motor.device_id : "Не установлен"}</TableCell>
                      {/* <TableCell align="left">
                        <Stack direction="row">
                          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(motor.id)}>
                            Изменить
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDelete(motor.motor_config_id)}>
                            Удалить
                          </Button>
                        </Stack>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
