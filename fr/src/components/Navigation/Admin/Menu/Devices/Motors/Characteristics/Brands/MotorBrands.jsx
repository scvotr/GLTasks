import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { fetchData } from "../../../../../../../../utils/fetchData"
import { Loader } from "../../../../../../../FormComponents/Loader/Loader"
import { getDataFromEndpoint } from "../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../context/AuthProvider"
import { CreateModelForm } from "../Models/CreateModelForm"

export const MotorBrands = () => {
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
    fetchData(currentUser, "/admin/devices/motor/models/readAll", setReqStatus, setDevicesTypes)
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
      await getDataFromEndpoint(currentUser.token, `/admin/devices/motor/models/delete`, "POST", id, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }
  // const sections = [
  //     { path: "/admin/devices/workshop/voltage", label: "ТО" },
  //     { path: "/admin/devices/workshop/current", label: "ТР" },
  // ]

  // const NavigationButtons = ({ sections }) => {
  //   return sections.map((section, index) => (
  //     <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
  //       <Button color="inherit">{section.label}</Button>
  //     </NavLink>
  //   ))
  // }

  const groupByBrand = devicesTypes.reduce((acc, item) => {
    if (!acc[item.brand_name]) {
      acc[item.brand_name] = []
    }
    acc[item.brand_name].push({
      id: item.id,
      model_name: item.model_name,
    })

    return acc
  }, {})

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить тип марку и модель">
        <CreateModelForm onClose={closeModal} />
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
            {/* <NavigationButtons sections={sections} /> */}
            <Fab color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
              <AddIcon />
            </Fab>
            <NavLink to="/admin/devices/motors/createMotor" style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
              <Button color="inherit">назад</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Loader reqStatus={reqStatus}>

        
        <Box>
          {Object.keys(groupByBrand).map(brandName => (
            <Box key={brandName}>
              <Typography variant="h6">{brandName}</Typography>
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
                    {groupByBrand[brandName].map(({ id, model_name }) => (
                      <TableRow key={id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(id)}>
                        <TableCell align="left">{id}</TableCell>
                        <TableCell align="left">{model_name}</TableCell>
                        <TableCell align="left">
                          <Stack direction="row">
                            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(id)}>
                              Изменить
                            </Button>
                            <Button variant="contained" color="error" onClick={() => handleDelete(id)}>
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
          ))}
        </Box>
      </Loader>
    </>
  )
}
