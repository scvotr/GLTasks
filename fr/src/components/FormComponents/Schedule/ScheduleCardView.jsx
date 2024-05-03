import { useState } from "react"
import { Grid, Card, CardContent, Typography, TextField, Button } from "@mui/material"
import { formatDate } from "../../../utils/formatDate"

export const ScheduleCardView = ({ schedules }) => {
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

  console.log(sortedSchedules)

  return (
    <div>
      <TextField label="Фильтр по описанию" value={filter} onChange={e => setFilter(e.target.value)} variant="outlined" fullWidth margin="normal" />
      <div>
        <Button variant={sortOrder === "asc" ? "contained" : "outlined"} onClick={() => setSortOrder("asc")}>
          Сортировка по возрастанию
        </Button>
        <Button variant={sortOrder === "desc" ? "contained" : "outlined"} onClick={() => setSortOrder("desc")}>
          Сортировка по убыванию
        </Button>
        <Button variant={sortOrder === "complex" ? "contained" : "outlined"} onClick={() => setSortOrder("complex")}>
          Сложная сортировка
        </Button>
      </div>
      <Grid container spacing={2}>
        {sortedSchedules.map((schedule, index) => (
          <Grid item xs={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">Schedule ID: {schedule.schedule_id}</Typography>
                <Typography>Assign User ID: {schedule.assign_user_id}</Typography>
                <Typography>Schedule Status: {schedule.schedule_status}</Typography>
                <Typography>Deadline Time: {formatDate(schedule.deadline_time)}</Typography>
                <Typography>Schedule Description: {schedule.schedule_description}</Typography>
                {/* Add more fields as needed */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
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
