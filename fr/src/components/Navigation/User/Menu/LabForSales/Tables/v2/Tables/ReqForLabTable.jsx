import { useEffect, useMemo, useState } from "react"
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, TextField, Button } from "@mui/material"
import { formatDateV2 } from "../../../../../../../../utils/formatDate"
import { ReqLabRowClick } from "../../../Menu/v2/ReqLabRowClick"

export const ReqForLabTable = ({ requests, currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen }) => {
  const [currentRequest, setCurrentRequest] = useState([])
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  const [page, setPage] = useState(0) // Текущая страница
  const [rowsPerPage, setRowsPerPage] = useState(10) // Количество записей на страницу

  const statusTranslations = {
    draft: "Черновик",
    new: "Новая",
    approved: "Одобрена",
    discard: "Отклонена",
    in_progress: "Открыт контракт",
    on_confirm: "Формируется отчет",
    closed: "Контракт закрыт",
    canceled: "Аннулирована",
  }

  const [filters, setFilters] = useState({
    reqNumber: "",
    reqStatus: "",
    department_name: "",
    culture: "",
    tonnage: "",
    contractor: "",
  })

  useEffect(() => {
    // Восстановление фильтров из localStorage
    const loadFilters = () => {
      try {
        const savedFilters = JSON.parse(localStorage.getItem("labTableFilters")) || {}
        setFilters(savedFilters)
        // Восстанавливаем rowsPerPage
        const savedRowsPerPage = parseInt(localStorage.getItem("labTableRowsPerPage"), 10) || 10
        setRowsPerPage(savedRowsPerPage)
      } catch (error) {
        console.error("Ошибка при загрузке фильтров:", error)
      }
    }
    loadFilters()
  }, [])

  // Обработчик изменения фильтров
  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        [field]: value,
      }
      // Сохраняем в localStorage
      localStorage.setItem("labTableFilters", JSON.stringify(updatedFilters))

      return updatedFilters
    })
    setPage(0) // Сброс страницы при изменении фильтров
  }

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      reqNumber: "",
      reqStatus: "",
      department_name: "",
      culture: "",
      tonnage: "",
      contractor: "",
    })
    // Очищаем localStorage
    localStorage.removeItem("labTableFilters")
    setPage(0) // Сброс страницы при сбросе фильтров
  }

  // Применение фильтра к запросам
  const filteredRequests = useMemo(() => {
    return (requests || [])
      .filter(req => {
        // Фильтрация по номеру запроса
        if (filters.reqNumber && !req.req_number?.toString().toLowerCase().includes(filters.reqNumber.toLowerCase())) return false
        // Фильтрация по статусу запроса с использованием перевода
        const translatedStatus = statusTranslations[req.req_status] || req.req_status // Получаем русский статус
        if (filters.reqStatus && !translatedStatus.toLowerCase().includes(filters.reqStatus.toLowerCase())) return false
        // Фильтрация по подразделению запроса
        if (filters.department_name && !req.department_name.toLowerCase().includes(filters.department_name.toLowerCase())) return false
        // Фильтрация по подразделению запроса
        if (filters.culture && !req.culture.toLowerCase().includes(filters.culture.toLowerCase())) return false
        // Фильтрация по номеру тонажу
        if (filters.tonnage && !req.tonnage?.toString().toLowerCase().includes(filters.tonnage.toLowerCase())) return false
        // Фильтрация по номеру тонажу
        if (filters.contractor && !req.contractor?.toString().toLowerCase().includes(filters.contractor.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        const aCurrentUserStatus = a.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status
        const bCurrentUserStatus = b.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status
        if (aCurrentUserStatus === bCurrentUserStatus) {
          return new Date(b.created_at) - new Date(a.created_at) // Изменено на b - a для убывания
        }
        return aCurrentUserStatus === "unread" ? -1 : 1 // Если a unread, то он выше
      })
  }, [requests, filters, currentUser])

  const handleRowClick = (event, req) => {
    setCurrentRequest(req)
    setFullScreenOpen(true)
  }
  const closeModal = () => {
    setFullScreenOpen(false)
    setCheckFullScreenOpen(false)
    reRender()
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    // Обновляем состояние
    setRowsPerPage(newRowsPerPage)
    setPage(0) // Сбрасываем страницу на первую
    // Сохраняем значение в localStorage
    localStorage.setItem("labTableRowsPerPage", newRowsPerPage)
  }

  const renderIndicators = indicatorsString => {
    if (!indicatorsString) {
      return <Typography>No indicators available</Typography>
    }
    try {
      const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
      return (
        <Stack direction="row" spacing={1}>
          {indicators
            .filter(indicator => indicator.value && indicator.name) // Фильтруем индикаторы
            .map((indicator, index) => (
              <div key={index}>
                {indicator.name.substring(0, 3)}: {indicator.value}
                {index < indicators.length - 1 ? ", " : ""}
              </div>
            ))}
        </Stack>
      )
    } catch (error) {
      console.error("Error parsing indicators:", error)
      return <Typography>Error parsing indicators</Typography>
    }
  }

  // В методе рендеринга таблицы
  const renderStatus = status => {
    return statusTranslations[status] || status // Отображаем переведенный статус
  }
  return (
    <>
      <Box>
        {/* -------------------------------- */}
        <ReqLabRowClick
          isOpen={fullScreenOpen}
          onClose={closeModal}
          currentRequest={currentRequest}
          reRender={reRender}
          currentUser={currentUser}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
        />
        {/* -------------------------------- */}
        {/* Панель фильтрации по номеру запроса */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleResetFilters}>
            Сбросить фильтры
          </Button>
        </Box>
        {/* -------------------------------- */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              {/* Строка для фильтров */}
              <TableRow>
                <TableCell align="center">
                  <TextField
                    label="№"
                    value={filters.reqNumber}
                    onChange={e => handleFilterChange("reqNumber", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 80 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Статус"
                    value={filters.reqStatus}
                    onChange={e => handleFilterChange("reqStatus", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {/* <TextField
                    label="от"
                    value={filters.fromDate} // Предположим, что у вас есть фильтр для даты
                    onChange={e => handleFilterChange("fromDate", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  /> */}
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Предприятие"
                    value={filters.department_name} // Предположим, что у вас есть фильтр для даты
                    onChange={e => handleFilterChange("department_name", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Культура"
                    value={filters.culture}
                    onChange={e => handleFilterChange("culture", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Тоннаж"
                    value={filters.tonnage} // Предположим, что у вас есть фильтр для тоннажа
                    onChange={e => handleFilterChange("tonnage", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Покупатель"
                    value={filters.contractor} // Предположим, что у вас есть фильтр для покупателя
                    onChange={e => handleFilterChange("contractor", e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 190 }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">№</TableCell>
                <TableCell align="center">Статус</TableCell>
                <TableCell align="center">от</TableCell>
                <TableCell align="center">На</TableCell>
                <TableCell align="center">Культура</TableCell>
                <TableCell align="center">Тоннаж</TableCell>
                {/* <TableCell align="center">Качество</TableCell> */}
                <TableCell align="center">Покупатель</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests &&
                filteredRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Срез для текущей страницы
                  .map((req, id) => {
                    if (!currentUser || !currentUser.id) {
                      console.error("Текущий пользователь не определен")
                      return null
                    }
                    // Получаем информацию о текущем пользователе
                    const currentUserInfo = req.users.find(user => user.user_id.toString() === currentUser.id.toString())
                    const currentUserReadStatusU = req.users.some(
                      user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread"
                    )
                    const currentUserReadStatusR = req.users.some(
                      user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "readed"
                    )
                    const unread = Boolean(currentUserReadStatusU)
                    const readed = Boolean(currentUserReadStatusR)

                    return (
                      <TableRow
                        key={id}
                        sx={{
                          backgroundColor: unread ? "lightgreen" : "inherit", // Выделяем строку, если есть непрочитанные
                          "&:hover": {
                            backgroundColor: "lightblue", // Цвет фона при наведении
                          },
                          cursor: "pointer",
                        }}
                        onClick={event => handleRowClick(event, req)}>
                        <TableCell align="center" sx={{ fontWeight: unread ? "bold" : "normal" }}>
                          {req.req_number}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: unread ? "bold" : "normal" }}>
                          {renderStatus(req.req_status)}
                        </TableCell>
                        <TableCell align="center">{formatDateV2(req.created_at, true)}</TableCell>
                        <TableCell align="center">{req.department_name}</TableCell>
                        <TableCell align="center">{req.culture}</TableCell>
                        <TableCell align="center">{req.tonnage}</TableCell>
                        {/* <TableCell align="center">{renderIndicators(req.indicators)}</TableCell> */}
                        <TableCell align="center">{req.contractor}</TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]} // Опции для выбора количества записей на страницу
          component="div"
          count={filteredRequests?.length || 0} // Общее количество записей
          rowsPerPage={rowsPerPage} // Количество записей на страницу
          page={page} // Текущая страница
          onPageChange={handleChangePage} // Обработчик изменения страницы
          onRowsPerPageChange={handleChangeRowsPerPage} // Обработчик изменения количества записей на страницу
        />
      </Box>
    </>
  )
}

// <>
//   {/* Основной список запросов */}
//   {requests && requests.length > 0 ? (
//     <div>
//       <h2>Запросы:</h2>
//       <ul>
//         {requests.map((request, index) => (
//           <li
//             key={request.reqForAvail_id}
//             onClick={() => handleRowClick(request)} // Обработчик клика
//             style={{ cursor: "pointer", padding: "8px", borderBottom: "1px solid #ccc" }}>
//             <div>ID: {request.reqForAvail_id}</div>
//             <div>Статус: {request.req_status}</div>
//             {/* <h3>Пользователи:</h3>
//             <ul>
//               {request.users.map((user, index) => (
//                 <li key={index}>{user.user_name}</li>
//               ))}
//             </ul> */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : (
//     <p>Нет доступных запросов.</p>
//   )}
// </>

// Сортировка массива requests
// const sortedRequests = (requests || []).sort((a, b) => {
//   const aCurrentUserStatus = a.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status
//   const bCurrentUserStatus = b.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status

//   if (aCurrentUserStatus === bCurrentUserStatus) {
//     return new Date(b.approved_at) - new Date(a.approved_at) // Сортировка по убыванию
//   }
//   return aCurrentUserStatus === "unread" ? -1 : 1 // Если a unread, то он выше
// })
