import { Step, StepLabel, Stepper } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"

export const TaskDetailsCard = ({ task }) => {
  const taskDetails = [
    { key: "appoint_department_name", value: `${task.appoint_department_name} Отдел: ${task.appoint_subdepartment_name}` },
    {
      key: "appoint_user_last_name",
      value: task.appoint_user_last_name ? task.appoint_position_name + " " + task.appoint_user_last_name : null,
      default: "Назначивший",
    },
    // {
    //   key: "responsible_department_name",
    //   value: task.responsible_department_name ? "Для: " + task.responsible_department_name + " Службы: " + task.responsible_subdepartment_name : null,
    //   default: "Для Департамента:",
    // },
    { key: "created_on", value: "Создана: " + formatDate(task.created_on) },
    { key: "deadline", value: "Выполнить до: " + formatDate(task.deadline) },
  ]


  const nonNullCount = taskDetails.filter(item => item.value !== null).length

  return (
    <Stepper activeStep={nonNullCount} orientation="vertical">
      {taskDetails.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label.value === null ? label.default : label.value}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
