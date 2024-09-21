import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { fetchData } from "../../../../../../utils/fetchData"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { CreateWorkshopForm } from "./CreateWorkshopForm"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const CreateWorkshop = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const [workshops, setWorkshops] = useState([])

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
  }

  const getData = useCallback(() => {
    fetchData(currentUser, "/admin/workflow/allWorkflowByDep", setReqStatus, setWorkshops)
  }, [currentUser])

  useEffect(() => {
    getData()
  }, [formKey, currentUser, getData])

  // Группируем данные по department_name
  // Алексиковский Э.: (2) ['Элеватор №1', 'Элеватор №2']
  // Панфиловский Э.: (4) ['Элеватор №1', 'Элеватор №2', 'Склад №5', 'Склады']
  const groupWorkshops = workshops.reduce((acc, item) => {
    if (!acc[item.department_name]) {
      acc[item.department_name] = []
    }
    acc[item.department_name].push({
      id: item.id,
      workshop_name: item.workshop_name,
    })

    return acc
  }, {})

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
      await getDataFromEndpoint(currentUser.token, `/admin/workflow/deleteWorkflow`, "POST", id, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setFormKey(prev => prev + 1)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const sections = [
    { path: "/admin/devices/all", label: "назад" },
    // { path: "/admin/devices/workshop/createWorkshop", label: "Создать Цех" },
  ]
  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить Цех">
        <CreateWorkshopForm onClose={closeModal}/>
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
              Добавить Цех
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
      <Box>
        <Loader reqStatus={reqStatus}>
          <Box>
            {Object.keys(groupWorkshops).map(departmentName => (
              <Box key={departmentName}>
                <Typography variant="h6">{departmentName}</Typography>
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
                      {groupWorkshops[departmentName].map(({ id, workshop_name }) => (
                        <TableRow key={id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => handleClick(id)}>
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{workshop_name}</TableCell>
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
      </Box>
    </>
  )
}
