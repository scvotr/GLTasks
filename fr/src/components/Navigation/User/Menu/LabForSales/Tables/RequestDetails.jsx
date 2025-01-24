import React, { useEffect, useState } from "react"
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

const RequestsList = ({ requests, currentUser, reRender }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  // Пример использования индикаторов
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

  const handleApprove = async (user, request) => {
    //! Если роль пользователя chife и заявка approved = 0
    // То при подписании помимо изменения статуса нужно изменить в самой заявке
    // approved = 1

    let reqStatus
    const isCreator = request.creator.toString() === currentUser.id.toString()
    if (isCreator) {
      console.log("User is creator")
      reqStatus = "new"
    } else {
      console.log("User is not creator")
      reqStatus = "approved"
    }

    const endpoint = `/lab/getUserConfirmation`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id ,position_id: currentUser.position, status: reqStatus },
        setReqStatus
      )
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

  // Проверка на наличие данных
  if (!requests) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Загрузка данных...</Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Список запросов
      </Typography>
      {requests.map(request => (
        <Box key={request.reqForAvail_id} sx={{ marginBottom: 4 }}>
          <Typography variant="body1">Культура: {request.culture}</Typography>
          {request.type && <Typography variant="body1">Тип: {request.type}</Typography>}
          {request.classType && <Typography variant="body1">Класс: {request.classType}</Typography>}
          <Typography variant="body1">Тоннаж: {request.tonnage}</Typography>
          <Typography variant="body1">Качество: {request.quality}</Typography>
          <Typography variant="body1">Подрядчик: {request.contractor}</Typography>
          <Typography variant="body1">Одобрено: {request.approved === 1 ? "Да" : "Нет"}</Typography>
          <Typography variant="body1">Дата создания: {request.created_at}</Typography>
          <Typography variant="body1">ГОСТ: {request.gost}</Typography>
          <div>
            <h4>Качество по контракту</h4>
            {renderIndicators(request.indicators)} {/* Используем функцию для отображения индикаторов */}
          </div>
          <Typography variant="h5" gutterBottom sx={{ marginTop: 2 }}>
            Лист согласования:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Имя пользователя</TableCell>
                  <TableCell>Должность</TableCell>
                  <TableCell>Статус одобрения</TableCell>
                  <TableCell>Подразделение</TableCell>
                  <TableCell>Отдел</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {request.users &&
                  request.users.map(user => (
                    <TableRow key={user.position_id} sx={{ backgroundColor: user.approval_status === "approved" ? "lightgreen" : "inherit" }}>
                      <TableCell>{user.user_name}</TableCell>
                      <TableCell>{user.position_name}</TableCell>
                      <TableCell>{user.approval_status}</TableCell>
                      <TableCell>{user.subdepartment_name}</TableCell>
                      <TableCell>{user.department_name}</TableCell>
                      <TableCell>
                        {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "pending" && (
                          <Button variant="contained" color="primary" onClick={() => handleApprove(user, request)}>
                            Подтвердить
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handlePrintSelectedTasks(user, request)} sx={{ mt: 2 }}>
                          <PrintIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  )
}

export default RequestsList

// D.hranenie

// const handleApprove =  (user, request) => {
//   const endpoint = `/lab/getUserConfirmation`
//   try {
//     setReqStatus({ loading: true, error: null })
//     console.log(`Подтверждено для пользователя: ${user.user_name}`)
//     getDataFromEndpoint(
//       currentUser.token,
//       endpoint,
//       "POST",
//       { reqForAvail_id: request.reqForAvail_id, position_id: currentUser.position, status: "approved" },
//       setReqStatus
//     )
//  !   reRender()
//     setReqStatus({ loading: false, error: null })
//   } catch (error) {
//     setReqStatus({ loading: false, error: error.message })
//   }
// }

// const handleApprove =  async(user, request) => {
//   const endpoint = `/lab/getUserConfirmation`
//   try {
//     setReqStatus({ loading: true, error: null })
//     console.log(`Подтверждено для пользователя: ${user.user_name}`)
//  !   reRender()
//     await getDataFromEndpoint(
//       currentUser.token,
//       endpoint,
//       "POST",
//       { reqForAvail_id: request.reqForAvail_id, position_id: currentUser.position, status: "approved" },
//       setReqStatus
//     )
//     setReqStatus({ loading: false, error: null })
//   } catch (error) {
//     setReqStatus({ loading: false, error: error.message })
//   }
// }

// const handleApprove = (user, request) => {
//   const endpoint = `/lab/getUserConfirmation`;
//   setReqStatus({ loading: true, error: null });
//   console.log(`Подтверждено для пользователя: ${user.user_name}`);

//   getDataFromEndpoint(
//     currentUser.token,
//     endpoint,
//     "POST",
//     { reqForAvail_id: request.reqForAvail_id, position_id: currentUser.position, status: "approved" },
//     setReqStatus
//   )
//     .then(() => {
//       setReqStatus({ loading: false, error: null });
//       reRender(); // Вызываем reRender только после успешного завершения запроса
//     })
//     .catch((error) => {
//       setReqStatus({ loading: false, error: error.message });
//     });
// };
