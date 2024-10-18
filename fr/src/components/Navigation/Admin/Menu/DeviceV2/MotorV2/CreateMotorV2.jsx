import { useCallback, useEffect, useRef, useState } from "react"
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
import { CheckCircle, Cancel } from "@mui/icons-material"
import { FullScreenDialog } from "../../../../../FullScreenDialog/FullScreenDialog"
import { MotorInfoViewV2 } from "./MotorInfoViewV2/MotorInfoViewV2"
import { formatDateV2 } from "../../../../../../utils/formatDate"
import { AppendMotorConfig } from "./MotorConfig/AppendMotorConfig"
import { RemoveMotorConfig } from "./MotorConfig/RemoveMotorConfig"
import { MotorRepairReasonForm } from "./MotorRepair/MotorRepairReasonForm"
import { MotorRepairReportForm } from "./MotorRepair/MotorRepairReportForm"

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

  console.log(motors)
  const [appendMotorConfig, setAppendMotorConfig] = useState(false)
  const [removeMotorConfig, setRemovedMotorConfig] = useState(false)
  const [confirmRemoveMotorConfig, setConfirmRemoveMotorConfig] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "Удалить номер двигателя?", message: "" })

  const [fullScreenOpen, setFullScreenOpen] = useState(false)

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
    setFullScreenOpen(false)
    setAppendMotorConfig(false)
    setRemovedMotorConfig(false)
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
  // !!!!!!!!!
  const [toRepair, setToRepair] = useState(false)
  // -----------------------------------------------
  const [currentFullScreenView, setCurrentFullScreenView] = useState(null)
  // -----------------------------------------------

  const handleToRepair = async () => {
    // setToView(false)
    // setToRepair(true)
    setCurrentFullScreenView("repair")
    setFullScreenOpen(true)
    // try {
    //   setReqStatus({ loading: true, error: null })
    //   const res = await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/takeMotorForRepair`, "POST", motor.motor_id, setReqStatus)
    //   popupSnackbar(res)
    //   setFormKey(prev => prev + 1)
    //   setAnchorEl(null)
    //   setReqStatus({ loading: false, error: null })
    // } catch (error) {
    //   setReqStatus({ loading: false, error: error.message })
    //   popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    // }
  }
  const handleCompleteRepair = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      const res = await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/completeMotorRepair`, "POST", motor.motor_id, setReqStatus)
      popupSnackbar(res)
      setFormKey(prev => prev + 1)
      setAnchorEl(null)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      popupSnackbar(`Ошибка: ${error.message} Код: ${error.code}`, "error")
    }
  }
  // !!!!!!!!!
  const [toView, setToView] = useState(false)
  const handleInfoView = async () => {
    // setToRepair(false)
    // setToView(true)
    setCurrentFullScreenView("view")
    setFullScreenOpen(true)
  }

  const fullScreenViews = {
    repair_on: <MotorRepairReasonForm motor={motor}/>,
    repair_off: <MotorRepairReportForm motor={motor}/>,
    view: <MotorInfoViewV2 motor={motor} />,
  }

  const handleAppendMotorConfig = async () => {
    setModalOpen(true)
    setAppendMotorConfig(true)
  }
  const handleRemoveMotorConfig = async () => {
    setModalOpen(true)
    setRemovedMotorConfig(true)
    setConfirmRemoveMotorConfig(false)
  }

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText={isEdit ? "Изменить?" : "Добавить номер двигателя"}>
        {appendMotorConfig ? (
          <AppendMotorConfig motor={motor} onClose={closeModal} popupSnackbar={popupSnackbar} />
        ) : removeMotorConfig ? (
          <RemoveMotorConfig motor={motor} onClose={closeModal} popupSnackbar={popupSnackbar} />
        ) : (
          <CreateMotorFormV2 onClose={closeModal} popupSnackbar={popupSnackbar} isEdit={isEdit} motor={motor} />
        )}{" "}
      </ModalCustom>
      <FullScreenDialog isOpen={fullScreenOpen} onClose={closeModal} infoText={motor.motor_id}>
        {/* <MotorInfoViewV2 motor={motor} /> */}

        {/* {toRepair ? (
          <div>Двигатель в ремонте</div> // Здесь можно добавить нужный контент
        ) : toView ? (
          <MotorInfoViewV2 motor={motor} />
        ) : (
          <div>Выберите действие</div> // Здесь можно добавить нужный контент
        )} */}

        {fullScreenViews[currentFullScreenView]}
      </FullScreenDialog>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? { top: anchorEl.top, left: anchorEl.left } : undefined}
        open={open}
        onClose={closeModal}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={handleInfoView}>Информация</MenuItem>

        {/* Если двигатель не на ремонте и есть конфигурация */}
        {!motor.on_repair && motor.motor_config_id !== null ? (
          <MenuItem onClick={handleToRepair}>Забрать на ремонт</MenuItem>
        ) : // если двигатель не демонтирован то завершаем ремонт
        motor.motor_config_id !== null ? (
          <MenuItem onClick={handleCompleteRepair}>Завершить ремонт</MenuItem>
        ) : null}
        {/* если конфигурация отсутвует и двигатлель в ремонте то можно назначит */}
        {!motor.motor_config_id ? (
          <MenuItem
            onClick={() => {
              handleAppendMotorConfig()
              setDialogText({ title: "Установить конфигурацию двигателя?", message: "" })
            }}>
            Установить двигатель
          </MenuItem>
        ) : motor.on_repair ? (
          <MenuItem
            onClick={e => {
              e.stopPropagation()
              setDialogText({ title: "Удалить конфигурацию двигателя?", message: "" })
              setOpenDialog(true)
              setConfirmRemoveMotorConfig(true)
              setAnchorEl(null)
            }}>
            Демонтировать двигатель
          </MenuItem>
        ) : null}
        <MenuItem onClick={closeModal}>Запланировать ТО</MenuItem>
        {!motor.on_repair &&
          motor.motor_config_id === null && ( // Добавлено условие motor.motor_config_id === null
            <>
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
            </>
          )}
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
              Двигателя:
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
                  <TableCell align="center" colSpan={2} sx={{ border: "1px solid black" }}>
                    Нумерация
                  </TableCell>
                  <TableCell align="center" colSpan={4} sx={{ border: "1px solid black" }}>
                    Эксплуатация
                  </TableCell>
                  <TableCell align="center" colSpan={2} sx={{ border: "1px solid black" }}>
                    Принадлежность
                  </TableCell>
                  <TableCell align="center" colSpan={1} sx={{ border: "1px solid black" }}>
                    Установка
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">П.П</TableCell>
                  <TableCell align="center">Тех. номер</TableCell>
                  <TableCell align="center">Двигатель</TableCell>
                  <TableCell align="center">Состояние</TableCell>
                  <TableCell align="center">Последний ремонт</TableCell>

                  <TableCell align="center">Департамент</TableCell>
                  <TableCell align="center">Объект</TableCell>
                  <TableCell align="center">Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motors &&
                  motors.map((motor, id) => (
                    <TableRow
                      key={motor.motor_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, backgroundColor: motor.on_repair ? "rgba(255, 0, 0, 0.1)" : "inherit" }}
                      hover
                      onClick={event => handleClick(event, motor)}>
                      <TableCell align="center">{motor.motor_id.substring(0, 5)}</TableCell>
                      <TableCell align="center">{id + 1}</TableCell>
                      <TableCell align="center">{motor.engine_number}</TableCell>
                      <TableCell align="center">{!motor.model_name ? "не установлен" : motor.model_name}</TableCell>
                      <TableCell align="center">
                        {motor.on_repair ? (
                          <Cancel color="error" /> // Иконка для состояния "не в ремонте"
                        ) : (
                          <CheckCircle color="success" /> // Иконка для состояния "в ремонте"
                        )}
                      </TableCell>
                      <TableCell align="center">{motor.on_repair ? "На ремонте" : formatDateV2(motor.last_repair_date, true)}</TableCell>
                      <TableCell align="center">{motor.department_name}</TableCell>
                      <TableCell align="center">{motor.workshop_name}</TableCell>
                      <TableCell align="center">{motor.device_id ? motor.device_id : "Не установлен"}</TableCell>
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
            if (confirmRemoveMotorConfig) {
              handleRemoveMotorConfig()
            } else {
              handleDelete()
            }
          }}
          title={dialogText.title}
          message={dialogText.message}
        />
      </Box>
    </>
  )
}
