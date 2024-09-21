import { Box, Card, CardContent, Typography, Grid, useMediaQuery } from "@mui/material"
import { useParams } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { useCallback, useEffect, useState } from "react"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { useTheme } from "@mui/material/styles"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import QRActionMenu from "./QRActionMenu"

export const QRGate = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [dataFromEndpoint, setDataFromEndpoint] = useState([])
  const { devicesId } = useParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
  }


  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        // const data = await getDataFromEndpoint(currentUser.token, `/admin/machines/machineById`, "POST", machineId, setReqStatus)
        const data = await getDataFromEndpoint(currentUser.token, `/admin/devices/getById`, "POST", devicesId, setReqStatus)
        console.log(data)
        setDataFromEndpoint(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser])

  useEffect(() => {
    if(isMobile)  setModalOpen(true)
    fetchData()
  }, [formKey, fetchData])

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Тип действия">
        <QRActionMenu/>
      </ModalCustom>
      <Box sx={{ padding: { xs: 1, sm: 3 } }}>
        {/* Увеличение отступов на больших экранах */}
        <Loader reqStatus={reqStatus}>
          <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom>
            Machine Details (ID: {devicesId})
          </Typography>
          <Grid container spacing={isMobile ? 2 : 3}>
            {dataFromEndpoint &&
              dataFromEndpoint.map(data => (
                <Grid item xs={12} sm={6} md={4} key={data.id}>
                  <Card elevation={3} sx={{ height: "100%", marginBottom: isMobile ? 2 : 0 }}>
                    <CardContent>
                      <Typography variant="h6" component="h3">
                        {data.type_name}
                      </Typography>
                      <Typography color="textSecondary">Tech Number: {data.tech_num}</Typography>
                      <Typography color="textSecondary">Position Number: {data.pos_num}</Typography>
                      <Typography color="textSecondary">Department: {data.department_name}</Typography>
                      <Typography color="textSecondary">Workshop: {data.workshop_name}</Typography>
                      <Typography color="textSecondary">Power Range: {data.power_range_name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Loader>
      </Box>
    </>
  )
}
