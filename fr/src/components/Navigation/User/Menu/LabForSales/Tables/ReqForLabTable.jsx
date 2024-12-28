import { useEffect, useState } from "react"
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination } from "@mui/material"
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined"
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined"
import { formatDateV2 } from "../../../../../../utils/formatDate"
import { ReqForLabMenu } from "../Menu/ReqForLabMenu"
import { Loader } from "../../../../../FormComponents/Loader/Loader"

export const ReqForLabTable = ({ requests, currentUser, reRender }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [currentRequest, setCurrentRequest] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [page, setPage] = useState(0) // Текущая страница
  const [rowsPerPage, setRowsPerPage] = useState(5) // Количество записей на страницу

  const handleRowClick = (event, req) => {
    setCurrentRequest(req)
    const { clientX, clientY } = event
    setAnchorEl({ top: clientY, left: clientX })
  }

  const closeMenu = () => {
    setAnchorEl(null)
    reRender()
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Сбросить на первую страницу при изменении количества записей на страницу
  }

  // Сортировка массива requests
  const sortedRequests = (requests || []).sort((a, b) => {
    const aCurrentUserStatus = a.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status
    const bCurrentUserStatus = b.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status

    if (aCurrentUserStatus === bCurrentUserStatus) {
      return new Date(b.approved_at) - new Date(a.approved_at) // Сортировка по убыванию
    }
    return aCurrentUserStatus === "unread" ? -1 : 1 // Если a unread, то он выше
  })

  return (
    <Loader reqStatus={reqStatus}>
      <Box>
        {/* -------------------------------- */}
        <ReqForLabMenu anchorEl={anchorEl} open={open} closeMenu={closeMenu} currentRequest={currentRequest} reRender={reRender} currentUser={currentUser} />
        {/* -------------------------------- */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Статус</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">№</TableCell>
                <TableCell align="center">от</TableCell>
                <TableCell align="center">На</TableCell>
                <TableCell align="center">Культура</TableCell>
                <TableCell align="center">Тоннаж</TableCell>
                <TableCell align="center">качество</TableCell>
                <TableCell align="center">Покупатель</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRequests &&
                sortedRequests
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

                    const isCurrentUser = Boolean(currentUserInfo) // true, если текущий пользователь найден
                    const unread = Boolean(currentUserReadStatusU)
                    const readed = Boolean(currentUserReadStatusR)

                    const currentLabRequest = req.reqForAvail_id === currentUserInfo.request_id

                    return (
                      <TableRow
                        key={id}
                        sx={{
                          backgroundColor: unread ? "lightgreen" : "inherit", // Выделяем строку, если есть непрочитанные
                          "&:hover": {
                            backgroundColor: "lightblue", // Цвет фона при наведении
                          },
                        }}
                        // hover
                        onClick={event => handleRowClick(event, req)}>
                        <TableCell align="center">
                          {/* {req.users.map(user => (
                            <div key={user.id}>
                              {user.user_name}
                              {user.read_status === "unread" ? (
                                <span style={{ color: "red" }}>(Непрочитанное)</span>
                              ) : (
                                <span style={{ color: "green" }}>(Прочтено)</span>
                              )}
                            </div>
                          ))} */}
                        </TableCell>
                        {/* ----------------------- */}
                        <TableCell align="center" sx={{ fontWeight: unread ? "bold" : "normal" }}>
                          {req.approved ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: unread ? "bold" : "normal" }}>
                          {req.req_number}
                        </TableCell>
                        <TableCell align="center">{formatDateV2(req.created_at, true)}</TableCell>
                        <TableCell align="center">{req.department_name}</TableCell>
                        <TableCell align="center">
                          {req.culture}
                          {/* <br /> */}
                          {/* {req.gost} */}
                          {/* {req.type ? <br /> : <></> } */} {req.type ? req.type : <></>}
                          {/* <br /> */} {req.classType ? `Класс: ${req.classType}` : <></>}
                        </TableCell>
                        <TableCell align="center">{req.tonnage}</TableCell>
                        <TableCell align="center">
                          {renderIndicators(req.indicators)}
                          {/* {renderIndicators(req.indicators || '')} */}
                          {/* {renderIndicators(req.indicators ? req.indicators : null)} */}
                        </TableCell>
                        <TableCell align="center">{req.contractor}</TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Опции для выбора количества записей на страницу
          component="div"
          count={requests?.length || 0} // Общее количество записей
          rowsPerPage={rowsPerPage} // Количество записей на страницу
          page={page} // Текущая страница
          onPageChange={handleChangePage} // Обработчик изменения страницы
          onRowsPerPageChange={handleChangeRowsPerPage} // Обработчик изменения количества записей на страницу
        />
      </Box>
    </Loader>
  )
}

// {requests &&
//   requests
//     .sort((a, b) => {
//       // Проверяем статус текущего пользователя в каждом запросе
//       const aCurrentUserStatus = a.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status
//       const bCurrentUserStatus = b.users.find(user => user.user_id.toString() === currentUser.id.toString())?.read_status

//       // Сортируем так, чтобы unread был выше
//       if (aCurrentUserStatus === bCurrentUserStatus) {
//         // return 0 // Оставляем порядок, если статусы одинаковые
//         return new Date(b.approved_at) - new Date(a.approved_at) // Сортировка по убыванию
//       }
//       return aCurrentUserStatus === "unread" ? -1 : 1 // Если a unread, то он выше
//     })
