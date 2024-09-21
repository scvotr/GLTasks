import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { fetchData } from "../../../../../../../../utils/fetchData"
import { Loader } from "../../../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../context/AuthProvider"
import { DeviceSpecifications, ElectricalSpecifications } from "./MainPageContent/ElectricalSpecifications"

export const Electrical = () => {
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
    { path: "/admin/devices/motor/electrical/power", label: "Мощность кВт" },
    { path: "/admin/devices/motor/electrical/amperage", label: "Номинальный ток А" },
    { path: "/admin/devices/motor/electrical/voltage", label: "Номинальное напряжение В" },
    { path: "/admin/devices/motor/electrical/efficiency", label: "КПД электродвигателя %" },
    { path: "/admin/devices/motor/electrical/cosF", label: "Коэффициент мощности (cos φ)" },
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
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить тип оборудование">
        {/* <CreateMotorForm onClose={closeModal} /> */}
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
            {/* <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab> */}
            <NavLink to="/admin/devices/motors/createMotor" style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Loader reqStatus={reqStatus}>
        <Box>
          <ElectricalSpecifications />
        </Box>
      </Loader>
    </>
  )
}
