import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"
import { useEffect, useState } from "react"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { ScheduleCardView } from "../../../../FormComponents/Schedule/ScheduleCardView"

export const UsersSchedules = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)
  const [value, setValue] = useState("1")
  const [allSchedules, setAllScheduls] = useState([])
  const [allUsers, setAllUsers] = useState({})

  const handleChange = async (event, newValue) => {
    setValue(newValue)
    try {
      setReqStatus({ loading: true, error: null })
      getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", newValue, setReqStatus).then(data => setAllScheduls(data))
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error })
    }
  }

  useEffect(() => {
    try {
      setReqStatus({ loading: true, error: null })
      if (currentUser.role === "chife") {
        getDataFromEndpoint(currentUser.token, "/user/getAllUsersBySubDepId", "POST", currentUser.subDep, setReqStatus).then(data => setAllUsers(data))
      } else {
        getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", currentUser.id, setReqStatus).then(data => setAllScheduls(data))
      }
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error })
    }
  }, [formKey, value])

  return (
    <>
      <AppBarForPage title="Планировщик задач: " />
      <Box
        sx={{
          bgcolor: "background.paper",
          mt: "1%",
          p: "1%",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          ".MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
        }}
      >
        {currentUser.role === "chife" && Array.isArray(allUsers) && allUsers.length > 0 ? (
          <TabContext value={value} centered variant="scrollable" scrollButtons="auto">
              <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="lab API tabs example" sx={{maxWidth: { xs: 320, sm: 1200, margin: "0 auto" }}}>
                {allUsers.map(user => (
                  <Tab key={user.id} label={user.last_name} value={user.id} />
                ))}
              </TabList>
            <ScheduleCardView schedules={allSchedules} reRender={setFormKey} />
          </TabContext>
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}