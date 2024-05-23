import { Step, StepLabel, Stepper } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"

export const TaskProgressCard = ({ task }) => {

  const taskExecutionDetails = [
    { key: "approved_on", value: task.approved_on ? "Согласованна: " + formatDate(task.approved_on) : null, default: "На согласовании" },
    {
      key: "setResponseUser_on",
      value: task.setResponseUser_on ? "Ответственный назначен: " + formatDate(task.setResponseUser_on) : null,
      default: "Назначение ответственного",
    },
    {
      key: "responsible_user_last_name",
      value: task.responsible_user_last_name ? "Ответственный: " + task.responsible_user_last_name + " " + task.responsible_position_name : null,
      default: "ФИО ответсвенного",
    },
    { key: "confirmation_on", value: task.confirmation_on ? "Отправлена на проверку: " + formatDate(task.confirmation_on) : null, default: "В работе" },
    { key: "closed_on", value: task.closed_on ? "Закрыта: " + formatDate(task.closed_on) : null, default: "Требует подтверждения" },
  ]

  if (task.reject_on !== null) {
    taskExecutionDetails.push({ key: "reject_on", value: task.reject_on ? "Отклонена: " + formatDate(task.reject_on) : null })
  }

  const nonNullCount = taskExecutionDetails.filter(item => item.value !== null).length
 
  return (
    <Stepper activeStep={nonNullCount} orientation="vertical">
      {taskExecutionDetails &&
        taskExecutionDetails.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label.value === null ? label.default : label.value}</StepLabel>
          </Step>
        ))}
    </Stepper>
  )
}
