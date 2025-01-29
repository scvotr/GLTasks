import { useState } from "react"
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Stack } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { UploadButton } from "../uploads/button/UploadButton"
import { LabComments } from "../LabComments/LabComments"
import { formatDateV2 } from "../../../../../../utils/formatDate"

const renderIndicators = indicatorsString => {
  try {
    const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
    return indicators
      .filter(indicator => indicator.value) // Фильтруем индикаторы, у которых value не пустое
      .map((indicator, index) => (
        <div key={index}>
          <strong>{indicator.name}:</strong> {indicator.value}
        </div>
      ))
  } catch (error) {
    console.error("Error parsing indicators:", error)
    return <div>Error parsing indicators</div>
  }
}

export const ReqInfoView = ({ request, currentUser, closeModal, reRender, totalUnreadCount, checkFullScreenOpen }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [statusReq, setStatusReq] = useState("new")
  const isCreator = request.creator.toString() === currentUser.id.toString()

  console.log("request", request)

  const handleApprove = async (user, request) => {
    if (isCreator) {
      setStatusReq("new")
    } else {
      setStatusReq("approved")
    }

    const endpoint = `/lab/getUserConfirmation`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position, status: statusReq },
        setReqStatus
      )
      closeModal()
      reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleDelete = async request => {
    const endpoint = `/lab/deleteReqForLab`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position },
        setReqStatus
      )
      closeModal()
      reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handlePrintSelectedTasks = (user, request) => {
    const printContent = `
      <div>
        <h1>Запрос</h1>
        <p>Культура: ${request.culture}</p>
        <p>Тоннаж: ${request.tonnage}</p>
        <p>Качество: ${request.quality}</p>
        <p>Подрядчик: ${request.contractor}</p>
        <p>Одобрено: ${request.approved ? "Да" : "Нет"}</p>
        <p>Дата создания: ${request.created_at}</p>
        <h2>Лист согласования:</h2>
        <table>
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th>Должность</th>
              <th>Статус одобрения</th>
              <th>Подразделение</th>
              <th>Отдел</th>
            </tr>
          </thead>
          <tbody>
            ${request.users
              .map(
                user => `
              <tr>
                <td>${user.user_name}</td>
                <td>${user.position_name}</td>
                <td>${user.approval_status}</td>
                <td>${user.subdepartment_name}</td>
                <td>${user.department_name}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Печать выбранных задач</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Loader reqStatus={reqStatus}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {request.commentsThenCreate}
        </Typography>

        <Grid container spacing={2}>
          {/* <Grid item xs={4} md={6}> */}
          <Grid item xs={2}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Информация о заявке №: {request.req_number}</Typography>
              <Typography variant="body1">Культура: {request.culture}</Typography>
              {request.type && <Typography variant="body1">Тип: {request.type}</Typography>}
              {request.classType && <Typography variant="body1">Класс: {request.classType}</Typography>}
              <Typography variant="body1">Масса: {request.tonnage} тонн +/- 5%</Typography>
              {/* <Typography variant="body1">Качество: {request.quality}</Typography> */}
              <Typography variant="body1">Покупатель: {request.contractor}</Typography>
              {/* <Typography variant="body1">Одобрено: {request.approved === 1 ? "Да" : "Нет"}</Typography> */}
              {/* <Typography variant="body1">Дата создания: {request.created_at}</Typography> */}
              <Typography variant="body1">ГОСТ: {request.gost}</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Качество по контракту</Typography>
                {renderIndicators(request.indicators)}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Box component={Paper} sx={{ p: 2 }}>
              <LabComments request={request} reRender={reRender} checkFullScreenOpen={checkFullScreenOpen} />
            </Box>
          </Grid>

          {/* <Grid item xs={12} md={6}> */}
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Лист согласования</Typography>
                <IconButton color="primary" onClick={() => handlePrintSelectedTasks(null, request)}>
                  <PrintIcon />
                </IconButton>
              </Box>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Должность</TableCell>
                      {/* <TableCell>Статус одобрения</TableCell> */}
                      {/* <TableCell>Подразделение</TableCell> */}
                      <TableCell>Отдел</TableCell>
                      <TableCell>Имя пользователя</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {request.users &&
                      request.users.map(user => (
                        <TableRow key={user.position_id} sx={{ backgroundColor: user.approval_status === "approved" ? "lightgreen" : "inherit" }}>
                          <TableCell>{user.position_name}</TableCell>
                          {/* <TableCell>{user.approval_status}</TableCell> */}
                          {/* <TableCell>{user.subdepartment_name}</TableCell> */}
                          <TableCell>{user.department_name}</TableCell>
                          <TableCell>{user.user_name}</TableCell>
                          <TableCell>{user.approved_at ? formatDateV2(user.approved_at, true) : null}</TableCell>
                          <TableCell>
                            {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "pending" && (
                              <Stack direction="row" spacing={0.5}>
                                <Button variant="contained" color="primary" size="small" onClick={() => handleApprove(user, request)}>
                                  {isCreator ? "Запросить" : "Подтвердить"}
                                </Button>
                                {isCreator && statusReq === "new" && (
                                  <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(request)}>
                                    Удалить
                                  </Button>
                                )}
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* {isCreator && <UploadButton data={request} />} */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Loader>
  )
}
