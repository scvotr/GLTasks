import { Box, Paper, styled } from "@mui/material"
import { Bar } from "react-chartjs-2"

export const CountUserActivity = ({ data }) => {
  const countTasksByUser = tasks => {
    const userData = {}

    tasks.forEach(task => {
      const appointUserLastName = task.appoint_user_last_name
      const responsibleUserLastName = task.responsible_user_last_name

      if (!userData[appointUserLastName]) {
        userData[appointUserLastName] = { appointCount: 0, responsibleCount: 0 }
      }
      if (responsibleUserLastName !== null && !userData[responsibleUserLastName]) {
        userData[responsibleUserLastName] = { appointCount: 0, responsibleCount: 0 }
      }

      userData[appointUserLastName].appointCount++
      if (responsibleUserLastName !== null) {
        userData[responsibleUserLastName].responsibleCount++
      }
    })

    return userData
  }

  const userTasksData = countTasksByUser(data)

  const userData = Object.entries(userTasksData).map(([lastName, counts]) => ({
    lastName,
    appointCount: counts.appointCount,
    responsibleCount: counts.responsibleCount,
  }))

  const labels = userData.map(user => user.lastName)

  const appointCounts = userData.map(user => user.appointCount)
  const responsibleCounts = userData.map(user => user.responsibleCount)

  const userBarChartData = {
    labels,
    datasets: [
      {
        label: "Назначенные задачи",
        data: appointCounts,
        backgroundColor: "#FF6384",
        hoverBackgroundColor: "#FF6384",
      },
      {
        label: "Полученные задачи",
        data: responsibleCounts,
        backgroundColor: "#36A2EB",
        hoverBackgroundColor: "#36A2EB",
      },
    ],
  }

  return (
    <>
      <h2>Аналитика задач по Пользователям</h2>
      <p>Общее количество задач: {data.length}</p>
      <h3>График распределения задач по пользователям:</h3>
      <Bar
        data={userBarChartData}
        options={{
          indexAxis: "y",
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            x: {
              ticks: {
                stepSize: 1, // установите размер шага деления
              },
            },
          },
        }}
      />
    </>
  )
}

// import { Box, Paper, styled } from "@mui/material";
// import { Bar, Doughnut } from "react-chartjs-2";

// const useStyles = styled((theme) => ({
//   chartContainer: {
//     padding: theme.spacing(1),
//     width: "80%",
//     margin: "auto",
//   },
//   chartTitle: {
//     fontSize: "1.2rem",
//     marginBottom: theme.spacing(1),
//   },
//   chartText: {
//     fontSize: "0.9rem",
//   },
// }));

// export const User = ({ data }) => {
//   const classes = useStyles();

//   const countTasksByUser = (tasks) => {
//     const users = {};
//     tasks.forEach((task) => {
//       const appointUserId = task.appoint_user_id;
//       const responsibleUserId = task.responsible_user_id;
//       if (users[appointUserId]) {
//         users[appointUserId].count++;
//       } else {
//         users[appointUserId] = {
//           name: task.appoint_user_last_name,
//           count: 1,
//         };
//       }
//       if (users[responsibleUserId]) {
//         users[responsibleUserId].count++;
//       } else {
//         users[responsibleUserId] = {
//           name: task.responsible_user_last_name,
//           count: 1,
//         };
//       }
//     });
//     return users;
//   };

//   const userTasksData = countTasksByUser(data);

//   const userData = Object.entries(userTasksData).map(([userId, userData]) => ({
//     userId,
//     userName: userData.name,
//     taskCount: userData.count,
//   }));

//   const userBarChartData = {
//     labels: userData.map((user) => user.userName),
//     datasets: [
//       {
//         label: "Количество задач",
//         data: userData.map((user) => user.taskCount),
//         backgroundColor: [
//           "#FF6384",
//           "#36A2EB",
//           "#FFCE56",
//           "#4BC0C0",
//           "#9966FF",
//           "#FF8C00",
//           "#8B0000",
//           "#008080",
//           "#2F4F4F",
//           "#800080",
//         ],
//         hoverBackgroundColor: [
//           "#FF6384",
//           "#36A2EB",
//           "#FFCE56",
//           "#4BC0C0",
//           "#9966FF",
//           "#FF8C00",
//           "#8B0000",
//           "#008080",
//           "#2F4F4F",
//           "#800080",
//         ],
//       },
//     ],
//   };

//   return (
//     <Paper className={classes.chartContainer}>
//       <h2>Аналитика задач по Пользователям</h2>
//       <p>Общее количество задач: {data.length}</p>
//       <Box>
//         <h3>График распределения задач по пользователям:</h3>
//         <Bar
//           data={userBarChartData}
//           options={{
//             indexAxis: "y",
//             plugins: {
//               legend: {
//                 display: false,
//               },
//             },
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// };
