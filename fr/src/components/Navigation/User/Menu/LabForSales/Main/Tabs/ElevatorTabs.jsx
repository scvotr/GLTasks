import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { useEffect, useState } from "react"
import { Box, Tab } from "@mui/material"
import { ReqForLabTable } from "../../Tables/ReqForLabTable"

export const ElevatorTabs = ({ requests, currentUser, reRender }) => {
  const [value, setValue] = useState(() => localStorage.getItem("activeTab") || "1")

  const [activeReqForLab, setActiveReqForLab] = useState([])
  const [activeReqForLabAE, setActiveReqForLabAE] = useState([])
  const [activeReqForLabPE, setActiveReqForLabPE] = useState([])

  // Сохранение значений вкладок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("activeTab", value)
  }, [value])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const activeReqForLab = requests.filter(request => request.approved === 1)
      setActiveReqForLab(activeReqForLab)
      const activeReqForLabAE1 = activeReqForLab.filter(request => request.selectedDepartment === 3)
      setActiveReqForLabAE(activeReqForLabAE1)
      const activeReqForLabPE1 = activeReqForLab.filter(request => request.selectedDepartment === 4)
      setActiveReqForLabPE(activeReqForLabPE1)
    }
  }, [requests])

  const isAeElevator = currentUser.dep.toString() === "3"
  const isPeElevator = currentUser.dep.toString() === "4"

  const handleTabListChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
          <TabList onChange={handleTabListChange} aria-label="Общая информация">
            <Tab label="запросы" value="1" />
            <Tab label="активные" value="2" />
            <Tab label="все" value="3" />
          </TabList>
          <TabPanel value="1">
            <ReqForLabTable requests={isAeElevator ? activeReqForLabAE : isPeElevator ? activeReqForLabPE : []} currentUser={currentUser} reRender={reRender} />
          </TabPanel>
          <TabPanel value="2">
            <ReqForLabTable requests={isAeElevator ? activeReqForLabAE : isPeElevator ? activeReqForLabPE : []} currentUser={currentUser} reRender={reRender} />
          </TabPanel>
          <TabPanel value="3">
            <ReqForLabTable requests={isAeElevator ? activeReqForLabAE : isPeElevator ? activeReqForLabPE : []} currentUser={currentUser} reRender={reRender} />
          </TabPanel>
        </Box>
      </TabContext>
    </>
  )
}
