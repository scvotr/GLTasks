import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { fetchData } from "../../../../../../utils/fetchData"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { CreateMotorForm } from "./CreateMotorForm"

export const CreateMotor = () => {
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
    // fetchData(currentUser, "/admin/devices/motor/read", setReqStatus, setDevicesTypes)
    fetchData(currentUser, "/admin/devices/motor/config/readAll", setReqStatus, setDevicesTypes)
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

  const handleDelete = async (id) => {
    console.log("Delete item with id:", id)
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/config/delete`, "POST", id, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }
  // https://el-dv.com/electrodvigateli-statiy/osnovnye-harakteristiki-elektrodvigatelej/
  const sections = [
    { path: "/admin/devices/motor/electrical", label: "Электрические характеристики" },
    { path: "/admin/devices/motor/mechanical", label: "Механические характеристики" },
    { path: "/admin/devices/motor/protection", label: "Защита" },
    { path: "/admin/devices/motor/technical", label: "Технические характеристики" },
    { path: "/admin/devices/motor/ServiceType", label: "Обслуживание" },
    { path: "/admin/devices/motor/brands", label: "Производитель" },
    { path: "/admin/devices/motor/techUnit", label: "Технологическая ед." },
  ]

  const NavigationButtons = ({ sections }) => {
    return sections.map((section, index) => (
      <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
        <Button color="inherit">{section.label}</Button>
      </NavLink>
    ))
  }

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить двигатель">
        <CreateMotorForm onClose={closeModal} />
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
              Добавить:
            </Typography>
            <NavigationButtons sections={sections} />
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            <NavLink to="/admin/devices/all" style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Loader reqStatus={reqStatus}>
        <Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2} sx={{ border: '1px solid black' }}>номер</TableCell>
                  <TableCell align="center" colSpan={2} sx={{ border: '1px solid black' }}>Производитель</TableCell>
                  <TableCell align="center" colSpan={5} sx={{ border: '1px solid black' }}>Электрические</TableCell>
                  <TableCell align="center" colSpan={4} sx={{ border: '1px solid black' }}>Механические</TableCell>
                  <TableCell align="center" colSpan={3} sx={{ border: '1px solid black' }}>Защита</TableCell>
                  <TableCell align="center" colSpan={3} sx={{ border: '1px solid black' }}>Технические</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">motor_tech_num</TableCell>

                  <TableCell align="left">Марка</TableCell>
                  <TableCell align="left">модель</TableCell>

                  <TableCell align="left">кВт</TableCell>
                  <TableCell align="left">А</TableCell>
                  <TableCell align="left">V</TableCell>
                  <TableCell align="left">КПД</TableCell>
                  <TableCell align="left">cos φ</TableCell>

                  <TableCell align="left">об\мин</TableCell>
                  <TableCell align="left">Нм</TableCell>
                  <TableCell align="left">t</TableCell>
                  <TableCell align="left">S</TableCell>

                  <TableCell align="left">IP</TableCell>
                  <TableCell align="left">Ex</TableCell>
                  <TableCell align="left">Ed</TableCell>

                  <TableCell align="left">подшипник</TableCell>
                  <TableCell align="left">IM</TableCell>
                  <TableCell align="left">DM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devicesTypes &&
                  devicesTypes.map(deviceType => (
                    <TableRow key={deviceType.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(deviceType)}>
                      <TableCell align="left" >{deviceType.id}</TableCell>
                      <TableCell align="left">{deviceType.motor_tech_num}</TableCell>
                      <TableCell align="left">{deviceType.brand_name}</TableCell>
                      <TableCell align="left">{deviceType.model_name}</TableCell>
                      <TableCell align="left">{deviceType.power_range}</TableCell>
                      <TableCell align="left">{deviceType.amperage_value}</TableCell>
                      <TableCell align="left">{deviceType.voltage_value}</TableCell>
                      <TableCell align="left">{deviceType.torque_value}</TableCell>
                      <TableCell align="left">{deviceType.cosF_value}</TableCell>
                      <TableCell align="left">{deviceType.rotation_speed}</TableCell>
                      <TableCell align="left">{deviceType.protection_level}</TableCell>
                      <TableCell align="left">{deviceType.temperature_value}</TableCell>
                      <TableCell align="left">{deviceType.operation_mode}</TableCell>

                      <TableCell align="left">{deviceType.protection_level}</TableCell>
                      <TableCell align="left">{deviceType.explosion_proof}</TableCell>
                      <TableCell align="left">{deviceType.brake_value}</TableCell>

                      <TableCell align="left">{deviceType.bearing_type}</TableCell>
                      <TableCell align="left">{deviceType.mounting_type}</TableCell>
                      <TableCell align="left">{deviceType.brake_value}</TableCell>
                      <TableCell align="left">
                        <Stack direction="row">
                          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(deviceType.id)}>
                            Изменить
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDelete(deviceType.motor_config_id)}>
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
