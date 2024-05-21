import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Stack,
  ImageList,
  ImageListItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
} from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"
import { HOST_ADDR } from "../../../../utils/remoteHosts"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ModalCustom } from "../../../ModalCustom/ModalCustom"
import { Loader } from "../../Loader/Loader"
import { TaskCommets } from "../TaskCommets/TaskCommets"
import { styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import { UseAccordionView } from "../../Accordion/UseAccordionView"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
}))

export const getPreviewFileContent = async (token, data, onSuccess) => {
  try {
    const res = await fetch(HOST_ADDR + "/tasks/getPreviewFileContent", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const responseData = await res.json()
      onSuccess(responseData)
      return responseData
    } else {
      throw new Error("Server response was not ok")
    }
  } catch (error) {
    onSuccess(error)
  }
}

const getFullFile = async (file, task_id, token) => {
  const { type, name } = file
  const data = {
    type,
    name,
    task_id,
  }
  try {
    const res = await fetch(HOST_ADDR + "/tasks/getFullFileContent", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const resData = await res.json()
      return resData
    } else {
      throw new Error("Server response was not ok or content type is not JSON")
    }
  } catch (error) {
    console.log(error)
  }
}

export const FullTaskInfo = ({ task }) => {
  console.log(task)

  const timeSteps = [
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
    timeSteps.push({ key: "reject_on", value: task.reject_on ? "Отклонена: " + formatDate(task.reject_on) : null })
  }

  const nonNullCountTimeSteps = timeSteps.filter(item => item.value !== null).length

  return (
    <>
      <Grid container spacing={2} sx={{ p: "1%" }}>
        <Grid item xs={2}>
          <Item>
            <Stack direction="column" justifyContent="space-around" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">
                <strong>задача №: {task.id}</strong>
              </Typography>
            </Stack>
            {/* ------------------------------------------- */}
            <Stepper activeStep={nonNullCountTimeSteps} orientation="vertical">
              {timeSteps &&
                timeSteps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label.value === null ? label.default : label.value}</StepLabel>
                  </Step>
                ))}
            </Stepper>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <UseAccordionView
              headerText={`от: ${formatDate(task.created_on)} ${task.task_descript.substring(0, 50)}... до: ${formatDate(task.deadline)}`}
              bodyText={task.task_descript}
            />
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <TaskCommets task={task} />
          </Item>
        </Grid>
        {/* -------------------------------------- */}
        {/* <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid> */}
      </Grid>
    </>
  )
}
