import TabContext from "@mui/lab/TabContext"
import { ReqForLabTable } from "../../Tables/ReqForLabTable"
import { useEffect, useState } from "react"
import { Badge, Box, Tab, styled } from "@mui/material"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import MailIcon from "@mui/icons-material/Mail"

const SALES_SUBDEB_G = "14"
const DEPARTMENT_AE = 3
const DEPARTMENT_PE = 4

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 8,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))

export const OwnersTabs = ({ requests = [], currentUser, reRender, addNewRequest, approvedRequest, resetApprovedRequest, resetAddNewRequest }) => {
  const [value, setValue] = useState(() => localStorage.getItem("activeTab") || "2")
  const [newReqForLab, setNewReqForLab] = useState([])
  const [pendingReqCount, setPendingReqCount] = useState(0)
  const [pendingReqCountRead, setPendingReqCountRead] = useState(0)
  const [approvedReqCount, setApprovedReqCount] = useState(0)
  const [approvedReqCountRead, setApprovedReqCountRead] = useState(0)
  const [allUsersApprovedCount, setAllUsersApprovedReqCount] = useState(0)
  const [allUsersApprovedCountReaded, setAllUsersApprovedReqCountReaded] = useState(0)
  const [pendingCurrentUser, setPendingCurrentUser] = useState([])
  const [approvedCurrentUser, setApprovedCurrentUser] = useState([])
  const [allUsersApprovedReq, setAllUsersApprovedReq] = useState([])

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
      setValue(isSalesDep ? approvedRequest.approved : approvedRequest.toApprove)
    }
    localStorage.setItem("activeTab", value)
  }, [approvedRequest, value])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const newReqForLab = requests.filter(request => request.approved === 0)
      setNewReqForLab(newReqForLab)
      const activeReqForLab = requests.filter(request => request.approved === 1)
      // ==========================================================================================================================
      // !----------------------------------- Новые не согласованные текущим пользователем
      const pendingCurrentUser = activeReqForLab.filter(request =>
        request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "pending")
      )
      setPendingCurrentUser(pendingCurrentUser)
      // Подсчет всех новых не согласованных не прочитанных запросов setApprovedReqCount
      const countAllPendingReq = pendingCurrentUser.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setPendingReqCount(countAllPendingReq)
      const countAllPendingReqRead = pendingCurrentUser.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "readed")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setPendingReqCountRead(countAllPendingReqRead)

      // !----------------------------------- Новые согласованные текущим пользователем но не всеми участниками
      // 4. Новые согласованные текущим пользователем, но не всеми участниками
      const approvedCurrentUser = activeReqForLab.filter(
        request =>
          request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approved") &&
          !request.users.every(user => user.approval_status === "approved")
      )
      setApprovedCurrentUser(approvedCurrentUser)

      const countAllPendingReq1 = approvedCurrentUser.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setApprovedReqCount(countAllPendingReq1)

      const countAllPendingReqRead1 = approvedCurrentUser.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "readed")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setApprovedReqCountRead(countAllPendingReqRead1)

      // !---------------------------------------Если все пользователи согласовали запрос
      const allUsersApproved = requests.filter(request => request.users.every(user => user.approval_status === "approved"))
      setAllUsersApprovedReq(allUsersApproved)
      const countAllUsersApproves = allUsersApproved.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setAllUsersApprovedReqCount(countAllUsersApproves)

      const countAllUsersApprovesReaded = allUsersApproved.reduce((acc, req) => {
        const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "readed")
        return acc + (isUnread ? 1 : 0)
      }, 0)
      setAllUsersApprovedReqCountReaded(countAllUsersApprovesReaded)
    }
  }, [currentUser.id, requests])

  const handleTabListChange = (event, newValue) => {
    event.preventDefault()
    setValue(newValue)
    resetApprovedRequest()
    resetAddNewRequest()
  }

  const isSalesDep = currentUser.subDep.toString() === SALES_SUBDEB_G

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
          <TabList onChange={handleTabListChange} aria-label="Общая информация">
            {isSalesDep && <Tab label="новые" value="1" />}
            {!isSalesDep && (
              <Tab
                label={`на согласовании ${pendingReqCountRead ? `(${pendingReqCountRead})` : ""} `}
                value="2"
                sx={{ fontWeight: pendingReqCount > 0 ? "bold" : "normal" }}
              />
            )}
            {pendingReqCount && (
              <StyledBadge badgeContent={pendingReqCount} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            <Tab
              label={`согласованные ${approvedReqCountRead ? `(${approvedReqCountRead})` : ""} `}
              value="3"
              sx={{ fontWeight: approvedReqCount > 0 ? "bold" : "normal" }}
            />
            {approvedReqCount && (
              <StyledBadge badgeContent={approvedReqCount} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            <Tab label={`подтвержденные ${allUsersApprovedCountReaded ? `(${allUsersApprovedCountReaded})` : ""} `} value="4" />
            {allUsersApprovedCount && (
              <StyledBadge badgeContent={allUsersApprovedCount} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {/* <Tab label={`все (${pendingReqCount})`} value="5" /> */}
          </TabList>
        </Box>
        <TabPanel value="1">
          <ReqForLabTable requests={newReqForLab} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
        {/* ------------------------на согласовании------------------------------ */}
        <TabPanel value="2">
          <ReqForLabTable requests={pendingCurrentUser} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
        {/* ------------------------согласованы------------------------------ */}
        <TabPanel value="3">
          <ReqForLabTable requests={approvedCurrentUser} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
        {/* ------------------------Подтвержденные------------------------------ */}
        <TabPanel value="4">
          <ReqForLabTable requests={allUsersApprovedReq} currentUser={currentUser} reRender={reRender} />
        </TabPanel>
      </TabContext>
    </>
  )
}

// <TabContext value={value}>
// <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
//   <TabList onChange={handleTabListChange} aria-label="Общая информация">
//     {isSalesDep && <Tab label="новые" value="1" />}
//     {!isSalesDep && <Tab label="на согласовании" value="2" sx={{ fontWeight: pendingReqCount > 0 ? "bold" : "normal" }} />}
//     {pendingReqCount && (
//       <StyledBadge badgeContent={pendingReqCount} color="secondary">
//         <MailIcon color="action" />
//       </StyledBadge>
//     )}
//     <Tab label="согласованные" value="3" />
//     <Tab label="подтвержденные" value="4" />
//     <Tab label={`все (${pendingReqCount})`} value="5" />
//   </TabList>
// </Box>
// <TabPanel value="1">
//   <ReqForLabTable requests={newReqForLab} currentUser={currentUser} reRender={reRender} />
// </TabPanel>
// {/* -----------------------на согласовании-------------------------------- */}
// <TabPanel value="2">
//   <TabContext value={activeReq}>
//     <TabList onChange={handleTabListActiveReqChange} aria-label="Общая информация">
//       <Tab
//         label={`Алексиковский Э. (${pendingReqAECount && pendingReqAECount})`}
//         value="1"
//         sx={{ fontWeight: pendingReqAECount > 0 ? "bold" : "normal" }}
//       />
//       <Tab
//         label={`Панфиловский Э. (${pendingReqPECount && pendingReqPECount})`}
//         value="2"
//         sx={{ fontWeight: pendingReqPECount > 0 ? "bold" : "normal" }}
//       />
//       <Tab label={`все (${pendingReqCount})`} value="3" sx={{ fontWeight: pendingReqCount > 0 ? "bold" : "normal" }} />
//     </TabList>
//     <TabPanel value="1">
//       <ReqForLabTable requests={pendingReqForLabAE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="2">
//       <ReqForLabTable requests={pendingReqForLabPE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="3">
//       <ReqForLabTable requests={pendingCurrentUser} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//   </TabContext>
// </TabPanel>

// {/* -----------------------согласованные-------------------------------- */}
// <TabPanel value="3">
//   <TabContext value={activeReq}>
//     <TabList onChange={handleTabListActiveReqChange} aria-label="Общая информация">
//       <Tab label="Алексиковский Э." value="1" />
//       <Tab label="Панфиловский Э." value="2" />
//       <Tab label="Все" value="3" />
//     </TabList>
//     <TabPanel value="1">
//       <ReqForLabTable requests={allApprovedReqForLabAE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="2">
//       <ReqForLabTable requests={allApprovedReqForLabPE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="3">
//       <ReqForLabTable requests={approvedCurrentUser} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//   </TabContext>
// </TabPanel>
// {/* ---------------------------подтвержденные---------------------------- */}
// <TabPanel value="4">
//   <TabContext value={activeReq}>
//     <TabList onChange={handleTabListActiveReqChange} aria-label="Общая информация">
//       <Tab label="Алексиковский Э." value="1" />
//       <Tab label="Панфиловский Э." value="2" />
//       <Tab label="все" value="3" />
//     </TabList>
//     <TabPanel value="1">
//       <ReqForLabTable requests={allApprovedReqForLabAE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="2">
//       <ReqForLabTable requests={allApprovedReqForLabPE} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//     <TabPanel value="3">
//       <ReqForLabTable requests={allApprovedReqForLab} currentUser={currentUser} reRender={reRender} />
//     </TabPanel>
//   </TabContext>
// </TabPanel>
// {/* ---------------------------все---------------------------- */}
// <TabPanel value="5">
//   <ReqForLabTable requests={requests} currentUser={currentUser} reRender={reRender} />
// </TabPanel>
// </TabContext>

// !---------------------------------------Все запросы не согласованные всеми участниками
// const pendingRequests = requests.filter(request => request.users.some(user => user.approval_status === "pending"))
// setPendingReqForLab(pendingRequests)

// const countAllPendingReq = pendingRequests.reduce((acc, req) => {
//   const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
//   return acc + (isUnread ? 1 : 0)
// }, 0)
// setPendingReqCount(countAllPendingReq)

// const pendingRequestsForLabAE = activeReqForLab.filter(
//   request => request.selectedDepartment === DEPARTMENT_AE && request.users.some(user => user.approval_status === "pending")
// )
// setPendingReqForLabAE(pendingRequestsForLabAE)

// const countAEPendingReq = pendingRequestsForLabAE.reduce((acc, req) => {
//   const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
//   return acc + (isUnread ? 1 : 0)
// }, 0)
// setPendingReqAECount(countAEPendingReq)

// const pendingRequestsForLabPE = activeReqForLab.filter(
//   request => request.selectedDepartment === DEPARTMENT_PE && request.users.some(user => user.approval_status === "pending")
// )
// setPendingReqForLabPE(pendingRequestsForLabPE)

// const countPEPendingReq = pendingRequestsForLabPE.reduce((acc, req) => {
//   const isUnread = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === "unread")
//   return acc + (isUnread ? 1 : 0)
// }, 0)
// setPendingReqPECount(countPEPendingReq)
// // !---------------------------------------Если все пользователи согласовали запрос
// const approvedRequests = requests.filter(request => request.users.every(user => user.approval_status === "approved"))
// setAllApprovedReqForLab(approvedRequests)

// const approvedRequestsForLabAE = activeReqForLab.filter(
//   request => request.selectedDepartment === DEPARTMENT_AE && request.users.every(user => user.approval_status === "approved")
// )
// setAllApprovedReqForLabAE(approvedRequestsForLabAE)

// const approvedRequestsForLabPE = activeReqForLab.filter(
//   request => request.selectedDepartment === DEPARTMENT_PE && request.users.every(user => user.approval_status === "approved")
// )
// setAllApprovedReqForLabPE(approvedRequestsForLabPE)
