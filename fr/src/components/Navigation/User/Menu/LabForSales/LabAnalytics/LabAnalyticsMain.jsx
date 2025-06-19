import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { AppBarForPage } from "../../components/AppBarForPage/AppBarForPage"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { FullScreenDialog } from "../../../../../FullScreenDialog/FullScreenDialog"

const fetchLabData = async (currentUser, endpoint, setLabData, setReqStatus) => {
  // const endpoint = `/lab/analytics/getData`
  setReqStatus({ loading: true, error: null })
  try {
    const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", setLabData, setReqStatus)
    setLabData(data)
    setReqStatus({ loading: false, error: null })
  } catch (error) {
    setReqStatus({ loading: false, error: error.message })
  }
}
// ?-------------------------------------------
export const LabAnalyticsMain = () => {
  const currentUser = useAuthContext()
  const [labData, setLabData] = useState([])
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  useEffect(() => {
    const endpoint = `/lab/analytics/getData`
    const fetchData = async () => {
      if (currentUser?.login) {
        await fetchLabData(currentUser, endpoint, setLabData, setReqStatus)
      }
    }
    fetchData()
  }, [currentUser])

  return (
    <>
      <Loader reqStatus={reqStatus}>
        <AppBarForPage title="Аналитика:" />
        <LabAnalyticsTableViewT data={labData} currentUser={currentUser} />
      </Loader>
    </>
  )
}
// !---------------------------------------------
export const LabAnalyticsTableViewT = ({ data, currentUser }) => {
  const [currentRow, setCurrentRow] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const modalTitle = `№ ${currentRow.reqNum}  Контрагент: ${currentRow.contractor} (${currentRow.culture}) Торговая точка: ${currentRow.salesPoint} ${currentRow.tonnage}т.`
  const handleRowClick = row => {
    setCurrentRow(row)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }
  if (!data || data.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
        Нет данных для отображения.
      </Typography>
    )
  }
  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText={modalTitle}>
        <LabAnalyticsRowView data={currentRow} currentUser={currentUser} />
      </FullScreenDialog>
      <TableContainer component={Paper} sx={{ mt: 2 }} key="lab-analytics-table">
        <Table size="small" aria-label="Аналитика лаборатории">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>№ запроса</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Подразделение</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Торговая точка</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Культура</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Контрагент</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Тоннаж (т)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Отгружено (т)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Аспирация (т)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Естеств. убыль (т)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow
                key={row.reqForAvail_id}
                sx={{
                  "&:hover": {
                    backgroundColor: "lightgreen", // Цвет фона при наведении
                  },
                  cursor: "pointer",
                }}
                onClick={event => handleRowClick(row)}>
                <TableCell>{row.reqNum}</TableCell>
                <TableCell>{row.dep_name}</TableCell>
                <TableCell>{row.salesPoint}</TableCell>
                <TableCell>{row.culture}</TableCell>
                <TableCell>{row.contractor}</TableCell>
                <TableCell align="right">{parseFloat(row.tonnage).toFixed(2)}</TableCell>
                <TableCell align="right">{parseFloat(row.total_shipped).toFixed(2)}</TableCell>
                <TableCell align="right">{parseFloat(row.total_aspiration_dust).toFixed(2)}</TableCell>
                <TableCell align="right">{parseFloat(row.total_natural_loss).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
export const LabAnalyticsRowView = ({ data, currentUser }) => {
  const [labData, setLabData] = useState({})
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const endpoint = `/lab/analytics/getRequestByID`
  useEffect(() => {
    const fetchData = async () => {
      try {
        setReqStatus({ loading: true, error: null })
        const result = await getDataFromEndpoint(currentUser.token, endpoint, "POST", data.reqForAvail_id, setReqStatus)
        setLabData(result)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        console.error("Error fetching lab data:", error)
        setReqStatus({ loading: false, error: error.message })
      }
    }
    if (currentUser.token && data.reqForAvail_id) {
      fetchData()
    }
  }, [currentUser, data.reqForAvail_id])

  return (
    <>
      <Loader reqStatus={reqStatus}></Loader>
    </>
  )
}
