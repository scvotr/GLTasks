import { Bar } from "react-chartjs-2"
import { Chart, ArcElement, registerables } from "chart.js"
import { Paper } from "@mui/material"
import { styled } from "@mui/system" // Correct import statement for styled
import { CategoryScale } from "chart.js"

Chart.register(CategoryScale)
Chart.register(ArcElement)
Chart.register(...registerables)

const useStyles = styled(theme => ({
  chartContainer: {
    padding: theme.spacing(1),
    width: "80%",
    margin: "auto",
  },
  chartTitle: {
    fontSize: "1.2rem",
    marginBottom: theme.spacing(1),
  },
  chartText: {
    fontSize: "0.9rem",
  },
}))

export const CountTasksByDepartment = ({ data }) => {
  const classes = useStyles()

  const countTasksByDep = tasks => {
    const departments = {}
    tasks.map(task => {
      const department = task.appoint_department_name
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
    <Paper>
      <h2>Аналитика задач по Департаментам</h2>
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
        }}
      />
    </Paper>
  )
}
