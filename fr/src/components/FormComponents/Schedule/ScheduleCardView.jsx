import { useState } from "react"
import { Grid, Card, CardContent, Typography, TextField, Button, Stack, IconButton, TablePagination } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { formatDate } from "../../../utils/formatDate"
import { useAuthContext } from "../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog"
import { UseAccordionView } from "../Accordion/UseAccordionView"

export const ScheduleCardView = ({ schedules, reRender }) => {
  const [currentPage, setCurrentPage] = useState(0) // Состояние для управления текущей страницей
  const [rowsPerPage, setRowsPerPage] = useState(10) // Состояние для управления количеством записей на странице

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setCurrentPage(0) // Сбрасываем текущую страницу при изменении количества записей на странице
  }

  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [openDialog, setOpenDialog] = useState(false)
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [editingDescription, setEditingDescription] = useState("")

  const [filter, setFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  if (!Array.isArray(schedules)) {
    return <div>No schedules available</div>
  }

  // Фильтрация расписаний на основе введенного запроса
  const filteredSchedules = schedules.filter(schedule => schedule.schedule_description.toLowerCase().includes(filter.toLowerCase()))

  const currentTime = new Date().toISOString()

  // Сортировка расписаний
  let sortedSchedules = []
  if (sortOrder === "complex") {
    sortedSchedules = filteredSchedules
      .filter(schedule => formatDate(schedule.deadline_time) === formatDate(currentTime))
      .sort((a, b) => a.deadline_time.localeCompare(b.deadline_time))
  } else {
    sortedSchedules = [...filteredSchedules].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.deadline_time.localeCompare(b.deadline_time)
      } else {
        return b.deadline_time.localeCompare(a.deadline_time)
      }
    })
  }

  const handleDeleteSchedul = async schedul_id => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/schedule/removeSchedule", "POST", schedul_id, setReqStatus)
      reRender(prevKey => prevKey + 1)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error })
    }
  }

  const indexOfLastSchedule = (currentPage + 1) * rowsPerPage
  const indexOfFirstSchedule = indexOfLastSchedule - rowsPerPage
  const currentSchedules = sortedSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule)

  const handleEditDescription = schedule => {
    setEditingScheduleId(schedule.schedule_id)
    setEditingDescription(schedule.schedule_description)
  }

  const handleSaveDescription = () => {
    // Обновить описание расписания в бэкэнде или состоянии
    // ...
    setEditingScheduleId(null);
  };

  return (
    <>
      <TextField label="Фильтр по описанию" value={filter} onChange={e => setFilter(e.target.value)} variant="outlined" fullWidth margin="normal" />
      <Stack direction="row" spacing={2} sx={{ mb: "1%", justifyContent: "center" }}>
        <Button variant={sortOrder === "asc" ? "contained" : "outlined"} onClick={() => setSortOrder("asc")}>
          Сортировка по возрастанию
        </Button>
        <Button variant={sortOrder === "desc" ? "contained" : "outlined"} onClick={() => setSortOrder("desc")}>
          Сортировка по убыванию
        </Button>
        <Button variant={sortOrder === "complex" ? "contained" : "outlined"} onClick={() => setSortOrder("complex")}>
          Крайний срок сегодня!
        </Button>
      </Stack>
      {/* ---------------------------------------------- */}
      <TablePagination
        component="div"
        count={sortedSchedules.length}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Записей на странице:"
      />
      {/* ---------------------------------------------- */}

      <Grid container spacing={1}>
        {currentSchedules.map((schedule, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <UseAccordionView
                headerText={`от: ${formatDate(schedule.created_on)} ${schedule.schedule_description.substring(0, 30)}... до: ${formatDate(
                  schedule.deadline_time
                )}`}
                // bodyText={schedule.schedule_description}
                bodyText={
                  editingScheduleId === schedule.schedule_id ? (
                    <TextField fullWidth value={editingDescription} onChange={e => setEditingDescription(e.target.value)} onBlur={handleSaveDescription} />
                  ) : (
                    schedule.schedule_description
                  )
                }
                >
                <CardContent>
                  <IconButton
                    onClick={() => {
                      setScheduleIdToDelete(schedule.schedule_id)
                      setOpenDialog(true)
                    }}>
                    <DeleteIcon />
                    <Typography variant="h6" gutterBottom>
                      Удалить
                    </Typography>
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      handleEditDescription(schedule)
                    }}>
                    <EditOutlinedIcon />
                    <Typography variant="h6" gutterBottom>
                      Редактировать
                    </Typography>
                  </IconButton>
                </CardContent>
              </UseAccordionView>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setScheduleIdToDelete(null)
        }}
        onConfirm={() => {
          if (scheduleIdToDelete) {
            handleDeleteSchedul(scheduleIdToDelete) // Вызов функции удаления с scheduleIdToDelete
            setScheduleIdToDelete(null) // Сброс scheduleIdToDelete после удаления
          }
          setOpenDialog(false)
        }}
        title="Подтвердите удаление задачи"
        message="Вы уверены, что хотите удалить эту задачу?"
      />
    </>
  )
}

// import { useState } from 'react';
// import { Grid, Card, CardContent, Typography, TextField } from '@mui/material';

// export const ScheduleCardView = ({ schedules }) => {
//   const [filter, setFilter] = useState('');

//   if (!Array.isArray(schedules)) {
//     return <div>No schedules available</div>;
//   }

//     // Фильтрация расписаний на основе введенного запроса
//     const filteredSchedules = schedules.filter(schedule =>
//       schedule.schedule_description.toLowerCase().includes(filter.toLowerCase())
//     );

//       // Сортировка расписаний по убывающей дате
//   const sortedSchedules = schedules.sort((a, b) => new Date(b.deadline_time) - new Date(a.deadline_time))

//     return (
//       <div>
//         <TextField
//           label="Фильтр по описанию"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           variant="outlined"
//           fullWidth
//           margin="normal"
//         />
//         <Grid container spacing={2}>
//           {filteredSchedules.map((schedule, index) => (
//             <Grid item xs={4} key={index}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Schedule ID: {schedule.schedule_id}</Typography>
//                   <Typography>Assign User ID: {schedule.assign_user_id}</Typography>
//                   <Typography>Schedule Status: {schedule.schedule_status}</Typography>
//                   <Typography>Deadline Time: {schedule.deadline_time}</Typography>
//                   <Typography>Schedule Description: {schedule.schedule_description}</Typography>
//                   {/* Add more fields as needed */}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </div>
//     );
// };
