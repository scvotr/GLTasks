import { Bar, Doughnut } from "react-chartjs-2"
import { Chart, ArcElement, registerables } from "chart.js"
import { Box, Paper, styled } from "@mui/material"
import { CategoryScale } from "chart.js"

Chart.register(CategoryScale)
Chart.register(ArcElement)
Chart.register(...registerables)

export const CountTasksByUser = ({ data }) => {
  const countTasksByDep = tasks => {
    const departments = {}
    tasks.map(task => {
      const department = task.appoint_user_last_name
      if (departments[department]) {
        departments[department]++
      } else {
        departments[department] = 1
      }
    })
    return departments
  }

  const departmentData = countTasksByDep(data)
  const departmentNames = Object.keys(departmentData)
  const departmentCounts = Object.values(departmentData)

  const chartData = {
    labels: departmentNames,
    datasets: [
      {
        label: "Количество задач",
        data: departmentCounts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  }

  return (
    <>
      <h2>Аналитика задач по Пользователям</h2>
      <p>Общее количество задач: {data.length}</p>
      <p>График распределения задач по отделам:</p>
      <Bar
        data={chartData}
        options={{
          indexAxis: "y",
          plugins: {
            legend: {
              display: false,
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
