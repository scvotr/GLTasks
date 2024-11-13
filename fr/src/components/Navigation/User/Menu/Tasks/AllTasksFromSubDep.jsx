import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { useEffect, useState } from "react"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"

export const AllTasksFromSubDep = () => {
  const { allLeadTasks, allTasksFromSubDep } = useTaskContext()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {}, [formKey])

  return (
    <>
      <Box>
        <AppBar
          position="static"
          sx={{
            mt: 2,
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
          }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Закрытые задачи:
            </Typography>
          </Toolbar>
        </AppBar>
        <TasksTable tasks={allTasksFromSubDep || []} reRender={setFormKey} />
      </Box>
    </>
  )
}
