import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { CountUserActivity } from "../../../../FormComponents/Statistics/CountUserActivity"
import { CountTasksBySubDepartment } from "../../../../FormComponents/Statistics/CountTasksBySubDepartment"
import { CountTasksByUser } from "../../../../FormComponents/Statistics/CountTasksByUser"

export const AnalyticsChart = ({ data }) => {
  const { allTasks, closedAndReadedTasks } = useTaskContext()
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
              Kлючевые показатели деятельности(KPI):
            </Typography>
          </Toolbar>
        </AppBar>
        <CountUserActivity data={[...allTasks, ...closedAndReadedTasks]}/>
        <CountTasksBySubDepartment data={[...allTasks, ...closedAndReadedTasks]}/>
        <CountTasksByUser data={[...allTasks, ...closedAndReadedTasks]}/>
      </Box>
    </>
  )
}
