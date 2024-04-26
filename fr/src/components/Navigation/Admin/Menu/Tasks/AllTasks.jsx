import { AppBar, Box, Fab, Toolbar, Typography } from "@mui/material"
import { AdminTasksTable } from "../../Tables/AdminTasksTable/AdminTasksTable"
import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import  InstructionComponent  from "../../../../Layouts/DefaultLayoutMain/FAQ/InstructionComponent"

export const AllTasks = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [formKey, setFormKey] = useState(0)
  const [dataFromEndpoint, setDataFromEndpoint] = useState([])

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/admin/getAllTasks", "POST", null, setReqStatus)
        setDataFromEndpoint(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser, formKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
              Все задачи:{" "}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <AdminTasksTable tasks={dataFromEndpoint} reRender={setFormKey} />
      <InstructionComponent data={dataFromEndpoint}/>
    </>
  )
}
