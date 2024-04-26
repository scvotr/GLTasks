import { AppBar, Box, Toolbar, Typography, Grid } from "@mui/material"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { styled } from "@mui/material/styles"
import { CountUserActivity } from "../../../../FormComponents/Statistics/CountUserActivity"
import { CountTasksByUser } from "../../../../FormComponents/Statistics/CountTasksByUser"
import { RoundCountTasksByUser } from "../../../../FormComponents/Statistics/RoundCountTasksByUser"


const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  margin:theme.spacing(2),
  borderRadius: "4px",
  textAlign: "center",
}))

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
        <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            <CountTasksByUser data={[...allTasks, ...closedAndReadedTasks]}/>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <RoundCountTasksByUser data={[...allTasks, ...closedAndReadedTasks]}/>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
          <CountUserActivity data={[...allTasks, ...closedAndReadedTasks]}/>
          </Item>
        </Grid>
        </Grid>
       
        
      </Box>
    </>
  )
}
