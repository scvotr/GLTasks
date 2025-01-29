import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { useEffect, useState } from "react"
import { Box, Tab, Badge, styled } from "@mui/material"
import { ReqForLabTable } from "../../Tables/ReqForLabTable"
import MailIcon from "@mui/icons-material/Mail"

const ELEVATOR_AE = 3
const ELEVATOR_PE = 4

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 8,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))

export const ElevatorTabs = ({ requests, currentUser, reRender, approvedRequest, resetApprovedRequest, resetAddNewRequest, setCheckFullScreenOpen, checkFullScreenOpen }) => {
  const [value, setValue] = useState(() => localStorage.getItem("activeTab") || "1")
  console.log("value", value)

  const [pendingCurrentUserAE, setPendingCurrentUserAE] = useState([])
  const [pendingReqCountAE, setPendingReqCountAE] = useState(0)
  const [pendingReqCountReadAE, setPendingReqCountReadAE] = useState(0)
  const [pendingCurrentUserPE, setPendingCurrentUserPE] = useState([])
  const [pendingReqCountPE, setPendingReqCountPE] = useState(0)
  const [pendingReqCountReadPE, setPendingReqCountReadPE] = useState(0)

  const [approvedCurrentUserAE, setApprovedCurrentUserAE] = useState([])
  const [approvedReqCountAE, setApprovedReqCountAE] = useState(0)
  const [approvedReqCountReadAE, setApprovedReqCountReadAE] = useState(0)
  const [approvedCurrentUserPE, setApprovedCurrentUserPE] = useState([])
  const [approvedReqCountPE, setApprovedReqCountPE] = useState(0)
  const [approvedReqCountReadPE, setApprovedReqCountReadPE] = useState(0)

  const [allUsersApprovedReqAE, setAllUsersApprovedReqAE] = useState([])
  const [allUsersApprovedCountAE, setAllUsersApprovedCountAE] = useState(0)
  const [allUsersApprovedCountReadAE, setAllUsersApprovedCountReadAE] = useState(0)
  const [allUsersApprovedReqPE, setAllUsersApprovedReqPE] = useState([])
  const [allUsersApprovedCountPE, setAllUsersApprovedCountPE] = useState(0)
  const [allUsersApprovedCountReadPE, setAllUsersApprovedCountReadPE] = useState(0)

  // console.log("pendingCurrentUserAE", pendingCurrentUserAE)
  // console.log("pendingReqCountAE", pendingReqCountAE)

  // console.log("pendingCurrentUserPE", pendingCurrentUserPE)
  // console.log("pendingReqCountPE", pendingReqCountPE)

  const isAeElevator = currentUser.dep.toString() === "3"
  const isPeElevator = currentUser.dep.toString() === "4"

  useEffect(() => {
    localStorage.setItem("activeTab", value)
  }, [value])

  useEffect(() => {
    if (approvedRequest) {
      setValue(approvedRequest.newReq)
    }
  }, [approvedRequest])

  useEffect(() => {
    if (Array.isArray(requests)) {
      const allConfirmRequests = requests.filter(request => request.approved === 1)
      console.log(allConfirmRequests)
      //! ----------------------АЛЕКСИКОВО-----------------------------------
      const allConfirmRequestToAE = allConfirmRequests.filter(request => request.selectedDepartment === ELEVATOR_AE)
      //! ----------------------АЛЕКСИКОВО не подписанные текущим пользователем-----------------------------------
      const pendingCurrentUserAE = allConfirmRequestToAE.filter(request =>
        request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "pending")
      )
      setPendingCurrentUserAE(pendingCurrentUserAE)
      setPendingReqCountAE(countRequests(pendingCurrentUserAE, "unread"))
      setPendingReqCountReadAE(countRequests(pendingCurrentUserAE, "readed"))
      // !------------------------Подписанные текущем пользователем
      const approvedCurrentUserAE = allConfirmRequestToAE.filter(
        request =>
          request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approved") &&
          !request.users.every(user => user.approval_status === "approved")
      )
      setApprovedCurrentUserAE(approvedCurrentUserAE)
      setApprovedReqCountAE(countRequests(approvedCurrentUserAE, "unread"))
      setApprovedReqCountReadAE(countRequests(approvedCurrentUserAE, "readed"))
      // !------------------------Подписанные всеми пользователем
      const allUsersApprovedAE = allConfirmRequestToAE.filter(request => request.users.every(user => user.approval_status === "approved"))
      setAllUsersApprovedReqAE(allUsersApprovedAE)
      setAllUsersApprovedCountAE(countRequests(allUsersApprovedAE, "unread"))
      setAllUsersApprovedCountReadAE(countRequests(allUsersApprovedAE, "readed"))
      // ----------------------ПАНФИЛОВО-----------------------------------
      const allConfirmRequestToPE = allConfirmRequests.filter(request => request.selectedDepartment === ELEVATOR_PE)
      // ----------------------ПАНФИЛОВО не подписанные текущим пользователем-----------------------------------
      const pendingCurrentUserPE = allConfirmRequestToPE.filter(request =>
        request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "pending")
      )
      setPendingCurrentUserPE(pendingCurrentUserPE)
      setPendingReqCountPE(countRequests(pendingCurrentUserPE, "unread"))
      setPendingReqCountReadPE(countRequests(pendingCurrentUserPE, "readed"))
      // ----------------------ПАНФИЛОВО подписанные текущим пользователем-----------------------------------
      const approvedCurrentUserPE = allConfirmRequestToPE.filter(
        request =>
          request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approved") &&
          !request.users.every(user => user.approval_status === "approved")
      )
      setApprovedCurrentUserPE(approvedCurrentUserPE)
      setApprovedReqCountPE(countRequests(approvedCurrentUserPE, "unread"))
      setApprovedReqCountReadPE(countRequests(approvedCurrentUserPE, "readed"))
      // ------------------------Подписанные всеми пользователем
      const allUsersApprovedPE = allConfirmRequestToPE.filter(request => request.users.every(user => user.approval_status === "approved"))
      setAllUsersApprovedReqPE(allUsersApprovedPE)
      setAllUsersApprovedCountPE(countRequests(allUsersApprovedPE, "unread"))
      setAllUsersApprovedCountReadPE(countRequests(allUsersApprovedPE, "readed"))
    }
  }, [requests])

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

  // Определяем стиль для fontWeight
  const fontWeightAe = isAeElevator && pendingReqCountAE > 0 ? "bold" : "normal"
  const fontWeightPe = isPeElevator && pendingReqCountPE > 0 ? "bold" : "normal"

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
          <TabList onChange={handleTabListChange} aria-label="Общая информация">
            {/* ----------------------------на согласовании---------- */}
            <Tab
              // label={isAeElevator ? `на согласовании ${pendingReqCountReadAE}` : isPeElevator ? `на согласовании ${pendingReqCountReadPE}` : ""}
              label={
                isAeElevator
                  ? `на согласовании ${pendingReqCountReadAE ? `${pendingReqCountReadAE}` : ""}`
                  : isPeElevator
                  ? `на согласовании ${pendingReqCountReadPE ? `${pendingReqCountReadPE}` : ""}`
                  : ""
              }
              value="1"
              sx={{ fontWeight: isAeElevator ? fontWeightAe : isPeElevator ? fontWeightPe : "normal" }}
            />
            {isPeElevator && pendingReqCountPE > 0 && (
              <StyledBadge badgeContent={pendingReqCountPE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {isAeElevator && pendingReqCountAE > 0 && (
              <StyledBadge badgeContent={pendingReqCountAE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {/* ----------------------------согласованные---------- */}
            <Tab
              // label={isAeElevator ? `согласованные ${approvedReqCountReadAE}` : isPeElevator ? `согласованные ${approvedReqCountReadPE}` : ""}
              label={
                isAeElevator
                  ? `согласованные ${approvedReqCountReadAE ? `${approvedReqCountReadAE}` : ""}`
                  : isPeElevator
                  ? `согласованные ${approvedReqCountReadPE ? `${approvedReqCountReadPE}` : ""}`
                  : ""
              }
              value="2"
              sx={{ fontWeight: isAeElevator ? fontWeightAe : isPeElevator ? fontWeightPe : "normal" }}
            />
            {isPeElevator && approvedReqCountPE > 0 && (
              <StyledBadge badgeContent={approvedReqCountPE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {isAeElevator && approvedReqCountAE > 0 && (
              <StyledBadge badgeContent={approvedReqCountAE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {/* ----------------------------в работе---------- */}
            <Tab
              // label={isAeElevator ? `в работе ${allUsersApprovedCountReadAE}` : isPeElevator ? `в работе ${allUsersApprovedCountReadPE}` : ""}
              label={
                isAeElevator
                  ? `в работе ${allUsersApprovedCountReadAE ? `${allUsersApprovedCountReadAE}` : ""}`
                  : isPeElevator
                  ? `в работе ${allUsersApprovedCountReadPE ? `${allUsersApprovedCountReadPE}` : ""}`
                  : ""
              }
              value="3"
              sx={{ fontWeight: isAeElevator ? fontWeightAe : isPeElevator ? fontWeightPe : "normal" }}
            />
            {isPeElevator && allUsersApprovedCountPE > 0 && (
              <StyledBadge badgeContent={allUsersApprovedCountPE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {isAeElevator && allUsersApprovedCountAE > 0 && (
              <StyledBadge badgeContent={allUsersApprovedCountAE} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
          </TabList>

          <TabPanel value="1">
            <ReqForLabTable
              requests={isAeElevator ? pendingCurrentUserAE : isPeElevator ? pendingCurrentUserPE : []}
              currentUser={currentUser}
              reRender={reRender}
              setCheckFullScreenOpen={setCheckFullScreenOpen}
              checkFullScreenOpen={checkFullScreenOpen}
            />
          </TabPanel>
          <TabPanel value="2">
            <ReqForLabTable
              requests={isAeElevator ? approvedCurrentUserAE : isPeElevator ? approvedCurrentUserPE : []}
              currentUser={currentUser}
              reRender={reRender}
              setCheckFullScreenOpen={setCheckFullScreenOpen}
              checkFullScreenOpen={checkFullScreenOpen}
            />
          </TabPanel>
          <TabPanel value="3">
            <ReqForLabTable
              requests={isAeElevator ? allUsersApprovedReqAE : isPeElevator ? allUsersApprovedReqPE : []}
              currentUser={currentUser}
              reRender={reRender}
              setCheckFullScreenOpen={setCheckFullScreenOpen}
              checkFullScreenOpen={checkFullScreenOpen}
            />
          </TabPanel>
        </Box>
      </TabContext>
    </>
  )
}
