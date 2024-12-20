import TabContext from "@mui/lab/TabContext"
import { ReqForLabTable } from "../../Tables/ReqForLabTable"
import { useEffect, useState } from "react"
import { Box, Tab } from "@mui/material"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"

const SALES_SUBDEB_G = "14"

export const OwnersTabs = ({ requests = [], currentUser, reRender, addNewRequest, approvedRequest }) => {
  const [value, setValue] = useState(() => localStorage.getItem("activeTab") || "1")
  const [activeReq, setActiveReq] = useState(() => localStorage.getItem("activeReq") || "1")
  const [newReqForLab, setNewReqForLab] = useState([])
  const [activeReqForLab, setActiveReqForLab] = useState([])
  const [activeReqForLabAE, setActiveReqForLabAE] = useState([])
  const [activeReqForLabPE, setActiveReqForLabPE] = useState([])

  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadCountAE, setUnreadCountAE] = useState(0) // Количество непрочитанных для отдела 3
  const [unreadCountPE, setUnreadCountPE] = useState(0) // Количество непрочитанных для отдела 4
  const [totalUnreadCount, setTotalUnreadCount] = useState(0) // Общее количество непрочитанных сообщений
  console.log('unreadCountAE', unreadCountAE)
  console.log('unreadCountPE', unreadCountPE)
  console.log('totalUnreadCount', totalUnreadCount)

  // Сохранение значений вкладок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("activeTab", value)
  }, [value])

  useEffect(() => {
    if (addNewRequest !== null) {
      setValue(addNewRequest.toString())
    }
  }, [addNewRequest])

  useEffect(() => {
    if (approvedRequest !== null) {
      setValue(approvedRequest.m1)
      setActiveReq(approvedRequest.m2)
    }
  }, [approvedRequest])

  useEffect(() => {
    localStorage.setItem("activeReq", activeReq)
  }, [activeReq])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const newReqForLab = requests.filter(request => request.approved === 0)
      setNewReqForLab(newReqForLab)
      const activeReqForLab = requests.filter(request => request.approved === 1)
      setActiveReqForLab(activeReqForLab)
      const activeReqForLabAE1 = activeReqForLab.filter(request => request.selectedDepartment === 3)
      setActiveReqForLabAE(activeReqForLabAE1)
      const activeReqForLabPE1 = activeReqForLab.filter(request => request.selectedDepartment === 4)
      setActiveReqForLabPE(activeReqForLabPE1)
    }
  }, [requests])

  const handleTabListChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleTabListActiveReqChange = (event, newValue) => {
    setActiveReq(newValue)
  }

  const isSalesDep = currentUser.subDep.toString() === SALES_SUBDEB_G


  // useEffect для подсчета непрочитанных сообщений
  useEffect(() => {
    if (requests && currentUser) {
      const filteredAE = requests.filter(req => req.selectedDepartment === 3)
      const filteredPE = requests.filter(req => req.selectedDepartment === 4)

      const countAE = filteredAE.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)

      const countPE = filteredPE.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)

      const count = requests.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)

      setUnreadCount(count)

      setUnreadCountAE(countAE)
      setUnreadCountPE(countPE)
      setTotalUnreadCount(countAE + countPE) // Общее количество непрочитанных сообщений

    }
  }, [requests, currentUser])

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
          <TabList onChange={handleTabListChange} aria-label="Общая информация">
            {isSalesDep && <Tab label="новые" value="1" />}
            <Tab label="запросы" value="2" />
            <Tab label="активные" value="3" />
            {/* <Tab label="все" value="4" /> */}
            <Tab label={`все (${totalUnreadCount})`} value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ReqForLabTable requests={newReqForLab} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
        <TabPanel value="2">
          <TabContext value={activeReq}>
            <TabList onChange={handleTabListActiveReqChange} aria-label="Общая информация">
              <Tab label={`Алексиковский Э. (${unreadCountAE})`} value="1" />
              <Tab label={`Панфиловский Э. (${unreadCountPE})`} value="2" />
              <Tab label={`все (${totalUnreadCount})`} value="3" />
            </TabList>
            <TabPanel value="1">
              <ReqForLabTable requests={activeReqForLabAE} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
            <TabPanel value="2">
              <ReqForLabTable requests={activeReqForLabPE} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
            <TabPanel value="3">
              <ReqForLabTable requests={activeReqForLab} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
          </TabContext>
        </TabPanel>
        <TabPanel value="3">
          <TabContext value={activeReq}>
            <TabList onChange={handleTabListActiveReqChange} aria-label="Общая информация">
              <Tab label="Алексиковский Э." value="1" />
              <Tab label="Панфиловский Э." value="2" />
              <Tab label="Все" value="3" />
            </TabList>
            <TabPanel value="1">
              <ReqForLabTable requests={activeReqForLabAE} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
            <TabPanel value="2">
              <ReqForLabTable requests={activeReqForLabPE} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
            <TabPanel value="3">
              <ReqForLabTable requests={activeReqForLab} currentUser={currentUser} reRender={reRender} />
            </TabPanel>
          </TabContext>
        </TabPanel>
        <TabPanel value="4">
          <ReqForLabTable requests={requests} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
      </TabContext>
    </>
  )
}
