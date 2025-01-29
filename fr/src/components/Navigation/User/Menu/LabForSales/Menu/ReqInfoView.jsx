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
    const indicatorsContent = JSON.parse(request.indicators)
      .filter(indicator => indicator.value)
      .map(
        (indicator, index) => `
      <div class="indicator-item" key="${index}">
        <strong> - ${indicator.name}:</strong> ${indicator.value}
      </div>
    `
      )
      .join("")

    const usersContent = request.users
      .map(
        user => `
          <div class="user-item">
            <div class="subdepartment-name">${user.subdepartment_name}<br>${user.position_name}</div>
            <div class="user-name">________________ ${user.user_name}</div>
          </div>
        `
      )
      .join("")

    const printContent = `
      <div class="print-content">
        <h2>Культура: ${request.culture}</h2>
        <h3>Масса: ${request.tonnage} | Покупатель: ${request.contractor}</h3>
        <h4>Индикаторы:</h4>
        <div class="indicators-container">
          ${indicatorsContent}
        </div>
        <p><strong>Лист согласования:</strong></p>
        <div class="user-list">${usersContent}</div>
      </div>
    `
    // Ваша функция для открытия окна печати
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
  <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
        }
        h2, h3, h4 {
          text-align: center;
          color: #2c3e50;
        }
        .print-content {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .indicators-container {
          display: flex;
          flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
          justify-content: center; /* Центрирует элементы по горизонтали */
          margin: 20px 0;
        }
        .indicator-item {
          flex: 0 0 45%; /* Задает ширину элемента 45% */
          margin: 5px; /* Отступ между элементами */
          text-align: left; /* Выравнивание текста влево */
        }
        .user-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f1f1f1;
        }
        .user-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        .subdepartment-name, .user-name {
          flex: 1;
        }
        @media print {
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          body {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="lef-top-data-number">
        <strong>№: ${request.req_number} от ${formatDateV2(request.approved_at)}</strong>
      </div>
      <h2>В лабораторию ${request.department_name} для заключения договора с "${request.contractor}"</h2>
      ${printContent}
    </body>
  </html>
`)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
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

// ! --------------------------------------------------------
// const handlePrintSelectedTasks = (user, request) => {
//   const indicatorsContent = JSON.parse(request.indicators)
//     .filter(indicator => indicator.value)
//     .map(
//       (indicator, index) => `
//         <div class="indicator-item" key="${index}">
//           <strong> - ${indicator.name}:</strong> ${indicator.value}
//         </div>
//       `
//     )
//     .join("");

//   const usersContent = request.users
//     .map(
//       user => `
//         <div class="user-item">
//           <div class="subdepartment-name">${user.subdepartment_name}<br>${user.position_name}</div>
//           <div class="user-name">________________ ${user.user_name}</div>
//         </div>
//       `
//     )
//     .join("");

//   const printContent = `
//     <div>
//       <h2>Культура: ${request.culture}. Масса: ${request.tonnage}. Покупатель: ${request.contractor}</h2>
//       <div class="list-indicators-content">${indicatorsContent}</div>
//       <p><strong>Лист согласования:</strong></p>
//       <div class="user-list">${usersContent}</div>
//     </div>
//   `;

//   const printWindow = window.open("", "_blank");
//   printWindow.document.write(`
//     <html>
//       <head>
//         <style>
//           body {
//             margin: 0;
//             padding: 10px;
//           }
//           h2 {
//             margin-top: 25px;
//             text-align: center;
//           }
//           .list-indicators-content, .user-list {
//             margin: 20px 0;
//           }
//           .user-item {
//             display: flex;
//             align-items: center;
//             margin-bottom: 10px;
//           }
//           .subdepartment-name, .user-name {
//             flex: 1;
//           }
//           @media print {
//             @page {
//               margin: 0;
//             }
//             body {
//               padding: 5rem 0;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="lef-top-data-number">
//           <strong>№: ${request.req_number} от ${formatDateV2(request.approved_at)}</strong>
//         </div>
//         <h2>В лабораторию ${request.department_name} для заключения договора с "${request.contractor}"</h2>
//         ${printContent}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
//   printWindow.focus();
//   printWindow.print();
//   printWindow.close();
// };

// ! --------------------------------------------------------

// <table>
// <thead>
//   <tr>
//     <th>Должность</th>
//     <th>Отдел</th>
//     <th>Имя пользователя</th>
//   </tr>
// </thead>
// <tbody>
//   ${request.users
//     .map(
//       user => `
//     <tr>
//       <td>${user.position_name}</td>
//       <td>${user.subdepartment_name}</td>
//       <td>${user.user_name}</td>
//      </tr>
//   `
//     )
//     .join("")}
// </tbody>
// </table>
