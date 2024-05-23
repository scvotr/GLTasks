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
import { TaskComments } from "../TaskComments/TaskComments"
import { styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import { UseAccordionView } from "../../Accordion/UseAccordionView"
import { TaskDetailsCard } from "./TaskDetailsCard"
import { TaskProgressCard } from "./TaskProgressCard"

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
  return (
    <>
      <Grid container spacing={2} sx={{ p: "1%" }}>
        {/* -------------------------------------- */}
        <Grid item xs={2}>
          <Item>
            <Typography variant="subtitle1">
              <strong>Задача №: {task.id}</strong>
            </Typography>
            <UseAccordionView headerText={`Прогресс:`} bodyText={<TaskProgressCard task={task} />} />
            <UseAccordionView headerText={`От:`} bodyText={<TaskDetailsCard task={task} />} />
          </Item>
        </Grid>
        {/* ------------------------- */}
        <Grid item xs={6}>
          <Item>
            <UseAccordionView
              // headerText={`От: ${formatDate(task.created_on)} ${task.task_descript.substring(0, 50)}... до: ${formatDate(task.deadline)}`}
              headerText={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>От: {formatDate(task.created_on)}</span>
                  <span style={{ textAlign: 'center', flex: 1 }}>{task.task_descript.substring(0, 50)} ...</span>
                  <span>До: {formatDate(task.deadline)}</span>
                </div>
              }
              bodyText={task.task_descript}
            />
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <TaskComments task={task} />
          </Item>
        </Grid>
        {/* -------------------------------------- */}
      </Grid>
    </>
  )
}
