import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AppBar, Box, Button, Fab, Table, TableBody, TableCell, TableContainer, Toolbar, TableHead, TableRow, Typography, Paper } from "@mui/material"
import { Loader } from "../../../../FormComponents/Loader/Loader"
import AddIcon from "@mui/icons-material/Add"
import { NavLink } from "react-router-dom"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { CreateNewDevice } from "./CreateNewDevice"
import { QRCodePrinter } from "../Machines/QRCode/QRCodePrinter"

export const DevicesAll = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [dataFromEndpoint, setDataFromEndpoint] = useState([])
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
  }

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/admin/devices/bucketElevators/readAll", "POST", null, setReqStatus)
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
                    <TableCell align="center" colSpan={4}>
                      Цех и Департамент
                    </TableCell>
                    <TableCell align="center" colSpan={6}>
                      Лента Ковш и Редуктор
                    </TableCell>
                    <TableCell align="center" colSpan={2}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Департамент</TableCell>
                    <TableCell align="center">Цех (п\м.)</TableCell>
                    <TableCell align="center">Тип</TableCell>
                    <TableCell align="center">Тех. номер</TableCell>
                    <TableCell align="center">Высота (п\м.)</TableCell>
                    <TableCell align="center">Лента</TableCell>
                    <TableCell align="center">Длина (м.)</TableCell>
                    <TableCell align="center">Ковш</TableCell>
                    <TableCell align="center">кол-во. (шт.)</TableCell>
                    <TableCell align="center">кол-во. ковшей на 1 м ленты (шт.)</TableCell>
                    <TableCell align="center">Редуктор</TableCell>
                    <TableCell align="center">Приводной ремень</TableCell>
                    <TableCell align="center">кол-во. (шт.)</TableCell>
                    <TableCell align="center">qr_code</TableCell>
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
                        <TableCell align="center">{row.height || "---"}</TableCell>
                        <TableCell align="center">{row.beltBrands_name || "---"}</TableCell>
                        <TableCell align="center">{row.belt_length || "---"}</TableCell>
                        <TableCell align="center">{row.bucketBrand_name || "---"}</TableCell>
                        <TableCell align="center">{row.bucket_quantity || "---"}</TableCell>
                        <TableCell align="center">{row.belt_length ? (row.bucket_quantity / row.belt_length).toFixed(2) : "---"}</TableCell>
                        <TableCell align="center">{row.gearboxBrand_name || "---"}</TableCell>
                        <TableCell align="center">{row.driveBeltsBrand_name || "---"}</TableCell>
                        <TableCell align="center">{row.driveBelt_quantity || "---"}</TableCell>
                        <TableCell align="center">
                          {row.qr_code && typeof row.qr_code === "string" && row.qr_code.startsWith("data:image/png;base64,") ? (
                            <>
                              <img src={row.qr_code} alt="QR Code" style={{ maxWidth: "100%", height: "auto" }} />
                              {/* <QRCodePrinter qrCodeData={row.qr_code} /> */}
                            </>
                          ) : (
                            <p>QR Code not available</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Loader>
      </Box>
    </>
  )
}
