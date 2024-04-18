import { AppBar, Toolbar, Typography, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { TasksTable } from "../../../../../FormComponents/Tables/TasksTable/TasksTable"

import { useEffect, useState } from "react"
import { useTaskContext } from "../../../../../../context/Tasks/TasksProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"

export const GeneralTasksMain = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })


  const { allTasks, notifyEvent} = useTaskContext()
  const [formKey, setFormKey] = useState(0)


  useEffect(() => {
    notifyEvent("need-all-dep-Tasks")
  }, [formKey])


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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Задачи:
          </Typography>
          {/* <Fab color="secondary" aria-label="add" onClick={openModal}>
            <AddIcon />
          </Fab> */}
        </Toolbar>
      </AppBar>
      <TasksTable tasks={allTasks || []} reRender={setFormKey} />

    </>
  )
}
