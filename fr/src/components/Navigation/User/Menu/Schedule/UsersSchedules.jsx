import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { useCallback, useEffect, useState } from "react"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { ScheduleCardView } from "../../../../FormComponents/Schedule/ScheduleCardView"
import { ScheduleCardViewV2 } from "../../../../FormComponents/Schedule/ScheduleCardViewV2"
import { Loader } from "../../../../FormComponents/Loader/Loader"

export const UsersSchedules = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)
  const [value, setValue] = useState()
  const [allSchedules, setAllSchedules] = useState([])
  const [allUsers, setAllUsers] = useState({})

  // Загружаем расписания при изменении выбранного пользователя
  const loadSchedules = useCallback(
    async userId => {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", userId, setReqStatus)
        setAllSchedules(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    },
    [currentUser.token]
  )

  const handleChange = async (event, newValue) => {
    setValue(newValue)
    await loadSchedules(newValue) // Загружаем данные сразу при изменении
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReqStatus({ loading: true, error: null })
        if (currentUser.role === "chife") {
          const data = await getDataFromEndpoint(currentUser.token, "/user/getAllUsersBySubDepId", "POST", currentUser.subDep, setReqStatus)
          const filteredData = data.filter(user => user.id.toString() !== currentUser.id.toString())
          if (filteredData.length > 0 && !value) {
            setValue(filteredData[1].id) // Установите значение на id первого пользователя
            await loadSchedules(filteredData[1].id)
          }
          setAllUsers(filteredData)
        } else {
          const data = await getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", currentUser.id, setReqStatus)
          setAllSchedules(data)
        }
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    }
    fetchData()
  }, [formKey])

  return (
    <>
      <AppBarForPage title="Планировщик задач: " />
      <Loader reqStatus={reqStatus}>
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
          }}>
          {currentUser.role === "chife" && Array.isArray(allUsers) && allUsers.length > 0 ? (
            <TabContext value={value} centered variant="scrollable" scrollButtons="auto">
              <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto" sx={{ maxWidth: { xs: 320, sm: 1200, margin: "0 auto" } }}>
                {allUsers.map(user => (
                  <Tab key={user.id} label={user.last_name} value={user.id} />
                ))}
              </TabList>
              {/* <ScheduleCardView schedules={allSchedules} reRender={setFormKey} /> */}
              <ScheduleCardViewV2 schedules={allSchedules} reRender={setFormKey} isLead={true} />
            </TabContext>
          ) : (
            <>
              <ScheduleCardViewV2 schedules={allSchedules} reRender={setFormKey} isLead={false} />
            </>
          )}
        </Box>
      </Loader>
    </>
  )
}

// useEffect(() => {
//   console.log('dddsss')
//   try {
//     setReqStatus({ loading: true, error: null })
//     if (currentUser.role === "chife") {
//       // getDataFromEndpoint(currentUser.token, "/user/getAllUsersBySubDepId", "POST", currentUser.subDep, setReqStatus).then(data => setAllUsers(data))
//       getDataFromEndpoint(currentUser.token, "/user/getAllUsersBySubDepId", "POST", currentUser.subDep, setReqStatus).then(data => {
//         const filteredData = data.filter(user => user.id.toString() !== currentUser.id)
//         console.log('Zzzz', filteredData)
//         setAllUsers(filteredData)
//         // data.map(data => data.id.toString() !== currentUser.id)
//         // console.log("bb", data)
//       })
//     } else {
//       getDataFromEndpoint(currentUser.token, "/schedule/getAllSchedulesByUserId", "POST", currentUser.id, setReqStatus).then(data => setAllScheduls(data))
//     }
//     setReqStatus({ loading: false, error: null })
//   } catch (error) {
//     setReqStatus({ loading: false, error: error })
//   }
// }, [formKey, value])
