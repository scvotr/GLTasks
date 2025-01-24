import TabContext from "@mui/lab/TabContext"
import { ReqForLabTable } from "../../Tables/ReqForLabTable"
import { useEffect, useState } from "react"
import { Badge, Box, Tab, styled } from "@mui/material"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import MailIcon from "@mui/icons-material/Mail"

const SALES_SUBDEB_G = "14"

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 8,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))

export const OwnersTabs = ({ requests = [], currentUser, reRender, addNewRequest, approvedRequest, resetApprovedRequest, resetAddNewRequest, setCheckFullScreenOpen, checkFullScreenOpen }) => {
  const [value, setValue] = useState(() => localStorage.getItem("activeTab") || "2")
  const [newReqForLab, setNewReqForLab] = useState([])

  const [pendingCurrentUser, setPendingCurrentUser] = useState([])
  const [approvedCurrentUser, setApprovedCurrentUser] = useState([])
  const [allUsersApprovedReq, setAllUsersApprovedReq] = useState([])
  const [pendingReqCount, setPendingReqCount] = useState(0)
  const [pendingReqCountRead, setPendingReqCountRead] = useState(0)
  const [approvedReqCount, setApprovedReqCount] = useState(0)
  const [approvedReqCountRead, setApprovedReqCountRead] = useState(0)
  const [allUsersApprovedCount, setAllUsersApprovedCount] = useState(0)
  const [allUsersApprovedCountRead, setAllUsersApprovedCountRead] = useState(0)

  const isSalesDep = currentUser.subDep.toString() === SALES_SUBDEB_G

  useEffect(() => {
    localStorage.setItem("activeTab", value)
  }, [value])

  useEffect(() => {
    if (addNewRequest !== null) {
      setValue(addNewRequest.toString())
    }
  }, [addNewRequest])

  useEffect(() => {
    if (approvedRequest) {
      setValue(isSalesDep ? approvedRequest.approved : approvedRequest.toApprove)
    }
  }, [approvedRequest, isSalesDep])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const newReqForLab = requests.filter(request => request.approved === 0)
      setNewReqForLab(newReqForLab)

      const allConfirmRequests = requests.filter(request => request.approved === 1)

      // Подсчет запросов для текущего пользователя
      const pendingCurrentUser = allConfirmRequests.filter(request =>
        request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "pending")
      )
      setPendingCurrentUser(pendingCurrentUser)
      setPendingReqCount(countRequests(pendingCurrentUser, "unread"))
      setPendingReqCountRead(countRequests(pendingCurrentUser, "readed"))

      // ---------------------------------------------------------------------------------
      const approvedCurrentUser = allConfirmRequests.filter(
        request =>
          request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approved") &&
          !request.users.every(user => user.approval_status === "approved")
      )
      setApprovedCurrentUser(approvedCurrentUser)
      setApprovedReqCount(countRequests(approvedCurrentUser, "unread"))
      setApprovedReqCountRead(countRequests(approvedCurrentUser, "readed"))
      // ---------------------------------------------------------------------------------
      const allUsersApproved = requests.filter(request => request.users.every(user => user.approval_status === "approved"))
      setAllUsersApprovedReq(allUsersApproved)
      setAllUsersApprovedCount(countRequests(allUsersApproved, "unread"))
      setAllUsersApprovedCountRead(countRequests(allUsersApproved, "readed"))
    }
  }, [currentUser.id, requests])

  const countRequests = (requests, status) => {
    return requests.reduce((acc, req) => {
      const isStatus = req.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.read_status === status)
      return acc + (isStatus ? 1 : 0)
    }, 0)
  }

  const handleTabListChange = (event, newValue) => {
    event.preventDefault()
    setValue(newValue)
    resetApprovedRequest()
    resetAddNewRequest()
  }

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
            <Tab label={`подтвержденные ${allUsersApprovedCountRead ? `(${allUsersApprovedCountRead})` : ""} `} value="4" />
            {allUsersApprovedCount && (
              <StyledBadge badgeContent={allUsersApprovedCount} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {/* <Tab label={`все (${pendingReqCount})`} value="5" /> */}
          </TabList>
        </Box>
        <TabPanel value="1">
          <ReqForLabTable
            requests={newReqForLab}
            currentUser={currentUser}
            reRender={reRender}
            setCheckFullScreenOpen={setCheckFullScreenOpen}
            checkFullScreenOpen={checkFullScreenOpen}
          />
        </TabPanel>
        {/* ------------------------на согласовании------------------------------ */}
        <TabPanel value="2">
          <ReqForLabTable
            requests={pendingCurrentUser}
            currentUser={currentUser}
            reRender={reRender}
            setCheckFullScreenOpen={setCheckFullScreenOpen}
            checkFullScreenOpen={checkFullScreenOpen}
          />
        </TabPanel>
        {/* ------------------------согласованы------------------------------ */}
        <TabPanel value="3">
          <ReqForLabTable
            requests={approvedCurrentUser}
            currentUser={currentUser}
            reRender={reRender}
            setCheckFullScreenOpen={setCheckFullScreenOpen}
            checkFullScreenOpen={checkFullScreenOpen}
          />
        </TabPanel>
        {/* ------------------------Подтвержденные------------------------------ */}
        <TabPanel value="4">
          <ReqForLabTable
            requests={allUsersApprovedReq}
            currentUser={currentUser}
            reRender={reRender}
            setCheckFullScreenOpen={setCheckFullScreenOpen}
            checkFullScreenOpen={checkFullScreenOpen}
          />
        </TabPanel>
      </TabContext>
    </>
  )
}
