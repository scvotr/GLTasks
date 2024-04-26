import React from "react"
import { Paper, Typography, Box, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"
import { AnalyticsComponent } from "./AnalyticsComponent"
import { CountTasksByDepartment } from "../../../FormComponents/Statistics/CountTasksByDepartment"
import { RoundCountTasksByDepartment } from "../../../FormComponents/Statistics/RoundCountTasksByDepartment"
import { CountTasksBySubDepartment } from "../../../FormComponents/Statistics/CountTasksBySubDepartment"
import { RoundCountTasksBySubDepartment } from "../../../FormComponents/Statistics/RoundCountTasksBySubDepartment"
import { CountTasksByUser } from "../../../FormComponents/Statistics/CountTasksByUser"
import { RoundCountTasksByUser } from "../../../FormComponents/Statistics/RoundCountTasksByUser"
import { CountUserActivity } from "../../../FormComponents/Statistics/CountUserActivity"

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  margin:theme.spacing(2),
  borderRadius: "4px",
  textAlign: "center",
}))

const InstructionComponent = ({ data }) => {
  return (
    <>
      <Grid container spacing={2}>
        {/* --------MAIN PLACE------------ */}
        <Grid item xs={6}>
          <Item>
            <CountTasksByDepartment data={data} />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item><RoundCountTasksByDepartment data={data}/></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><CountTasksBySubDepartment data={data}/></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><RoundCountTasksBySubDepartment data={data}/></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><CountTasksByUser data={data}/></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><RoundCountTasksByUser data={data}/></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><CountUserActivity data={data}/></Item>
        </Grid>
      </Grid>
      {/* <Box>
        <AnalyticsComponent tasks={data} />
      </Box> */}
    </>
  )
}

export default InstructionComponent

// <Paper className={classes.root}>
// <Typography variant="h6" gutterBottom>
//   Инструкция по добавлению новой задачи
// </Typography>
// <Typography gutterBottom>
//   <strong>Шаг 1: Добавление новой задачи от сотрудника</strong>
//   <ul>
//     <li>Создайте новую задачу, используя кнопку "Добавить задачу".</li>
//     <li>Установите статус "непрочитано" для задачи.</li>
//     <li>Обновите информацию о задаче после создания.</li>
//     <li>Отправьте уведомление руководителю по электронной почте.</li>
//     <li>Обновите список активных задач.</li>
//   </ul>
// </Typography>
// <Typography gutterBottom>
//   <strong>Шаг 2: Согласование и утверждение от руководителя</strong>
//   <ul>
//     <li>Обновите статус "непрочитано" после согласования задачи.</li>
//     <li>Отправьте уведомление сотруднику об утверждении задачи.</li>
//     <li>Установите статус "непрочитано" для дальнейшего согласования.</li>
//     <li>Обновите статус задачи после утверждения.</li>
//     <li>Отправьте уведомления руководителю и всем заинтересованным сторонам.</li>
//     <li>Обновите статус задачи после завершения согласования.</li>
//     <li>Обновите список активных задач.</li>
//   </ul>
// </Typography>
// <Typography gutterBottom>
//   <strong>Шаг 3: Назначение ответственного за задачу</strong>
//   {/* Добавьте остальные шаги здесь */}
// </Typography>
// {/* Аналогично для остальных шагов */}
// {/* ... */}
// </Paper>
