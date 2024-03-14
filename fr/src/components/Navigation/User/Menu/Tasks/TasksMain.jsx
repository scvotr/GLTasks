import { AppBar, Toolbar, Typography } from "@mui/material"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { useTaskContext } from "../../../../../context/TasksProvider"

export const TasksMain = () => {
  const {allTasks} = useTaskContext()

  return (
    <>
      <AppBar
        position="static"
        sx={{
          mt: 2,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <Toolbar>
          <Typography>Задачи: </Typography>
        </Toolbar>
      </AppBar>
      <TasksTable tasks={allTasks}/>
    </>
  )
}