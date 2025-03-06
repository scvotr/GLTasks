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

export const OwnersTabs = ({
  requests = [],
  currentUser,
  reRender,
  addNewRequest,
  approvedRequest,
  resetApprovedRequest,
  resetAddNewRequest,
  setCheckFullScreenOpen,
  checkFullScreenOpen,
}) => {
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
      // Получаем все запросы где статус request.approved === 0 То есть не опубликованные
      const newReqForLab = requests.filter(request => request.approved === 0)
      setNewReqForLab(newReqForLab)
      // Получаем все запросы где статус request.approved === 1 То есть опубликованные и доступные в системе
      const allConfirmRequests = requests.filter(request => request.approved === 1)

      // Подсчет количества запросов для текущего пользователя
      const pendingCurrentUser = allConfirmRequests.filter(request =>
        request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "pending")
      )
      setPendingCurrentUser(pendingCurrentUser)
      setPendingReqCount(countRequests(pendingCurrentUser, "unread"))
      setPendingReqCountRead(countRequests(pendingCurrentUser, "readed"))

      // ---------------------------------------------------------------------------------
      // Получение всех запросов в которых все текущий пользователь подтвердили наличие
      const approvedCurrentUser = allConfirmRequests.filter(
        request =>
          request.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approved") &&
          !request.users.every(user => user.approval_status === "approved")
      )
      setApprovedCurrentUser(approvedCurrentUser)
      setApprovedReqCount(countRequests(approvedCurrentUser, "unread"))
      setApprovedReqCountRead(countRequests(approvedCurrentUser, "readed"))
      // ---------------------------------------------------------------------------------
      // Получение всех запросов в которых все пользователи подтвердили наличие
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
            <Tab label={`в работе ${allUsersApprovedCountRead ? `(${allUsersApprovedCountRead})` : ""} `} value="4" />
            {allUsersApprovedCount && (
              <StyledBadge badgeContent={allUsersApprovedCount} color="secondary">
                <MailIcon color="action" />
              </StyledBadge>
            )}
            {/* <Tab label={`все (${pendingReqCount})`} value="5" /> */}
          </TabList>
        </Box>
        {/*------------------------ Новые не опубликованные запросы -------------------*/}
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
        {/* ------------------------в работе------------------------------ */}
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


// {
//   "req_number": 8,
//   "status": "pending", // Может быть "approved", "in_progress", "pending", "closed", "canceled"
//   "status_history": [
//     { "status": "pending", "timestamp": "2025-02-12T09:03:55Z" },
//     { "status": "in_progress", "timestamp": "2025-02-12T10:00:00Z" },
//     { "status": "approved", "timestamp": "2025-02-12T11:00:00Z" }
//     { "status": "closed", "timestamp": "2025-02-12T11:00:00Z" }
//     { "status": "canceled", "timestamp": "2025-02-12T11:00:00Z" }
//   ],
//   "reqForAvail_id": "355ee447-521b-4396-be0a-17f6503d9013",
//   "culture": "Подсолнечник",
//   "tonnage": "12",
//   "classType": "",
//   "type": "",
//   "contractor": "12",
//   "selectedDepartment": 3,
//   "creator": 1042,
//   "creator_subDep": 14,
//   "creator_role": "chife",
//   "approved": 1,
//   "commentsThenCreate": "222",
//   "yearOfHarvest": "12",
//   "gost": "ГОСТ 22391-2015",
//   "indicators": "[{\"name\":\"Влажность, %\",\"value\":\"12\"},{\"name\":\"Сорная примесь, %\",\"value\":\"12\"},{\"name\":\"Масличная примесь, %\",\"value\":\"12\"},{\"name\":\"Масличность, %\",\"value\":\"12\"},{\"name\":\"Кислотное число м/семян (кчм), мг КОН\",\"value\":\"12\"},{\"name\":\"Испорченные, %\",\"value\":\"12\"},{\"name\":\"Запах\",\"value\":\"12\"},{\"name\":\"Цвет\",\"value\":\"12\"},{\"name\":\"Зараженность\",\"value\":\"12\"}]",
//   "department_name": "Алексиковский Э.",
//   "created_at": "2025-02-12 09:03:55",
//   "updated_at": null,
//   "approved_at": "2025-02-12 09:04:15",
//   "users": [
//     {
//       "request_id": "355ee447-521b-4396-be0a-17f6503d9013",
//       "position_id": 2,
//       "position_name": "Начальник ХПР",
//       "user_id": 1001,
//       "user_name": "Татаркин Дмитрий",
//       "last_name_only": "Татаркин",
//       "middle_name_only": "Олегович",
//       "first_name_only": "Дмитрий",
//       "approval_status": "pending",
//       "subdepartment_name": "ХПР",
//       "department_name": "Гелио-Пакс",
//       "read_status": "unread",
//       "approved_at": null
//     },
//     {
//       "request_id": "355ee447-521b-4396-be0a-17f6503d9013",
//       "position_id": 15,
//       "position_name": "Зам. по производству",
//       "user_id": 1008,
//       "user_name": "Соломон Александр",
//       "last_name_only": "Соломон",
//       "middle_name_only": "Николаевич",
//       "first_name_only": "Александр",
//       "approval_status": "pending",
//       "subdepartment_name": " АЕ Служба Качества",
//       "department_name": "Алексиковский Э.",
//       "read_status": "unread",
//       "approved_at": null
//     },
//     {
//       "request_id": "355ee447-521b-4396-be0a-17f6503d9013",
//       "position_id": 16,
//       "position_name": "Нач. Лаб",
//       "user_id": 1030,
//       "user_name": "Забодкина Ольга",
//       "last_name_only": "Забодкина",
//       "middle_name_only": "Владимировна",
//       "first_name_only": "Ольга",
//       "approval_status": "pending",
//       "subdepartment_name": " АЕ Служба Качества",
//       "department_name": "Алексиковский Э.",
//       "read_status": "unread",
//       "approved_at": null
//     },
//     {
//       "request_id": "355ee447-521b-4396-be0a-17f6503d9013",
//       "position_id": 33,
//       "position_name": "Специалист по качеству зерна",
//       "user_id": 1003,
//       "user_name": "Гуреева Дарья",
//       "last_name_only": "Гуреева",
//       "middle_name_only": "Николаевна",
//       "first_name_only": "Дарья",
//       "approval_status": "pending",
//       "subdepartment_name": "ХПР",
//       "department_name": "Гелио-Пакс",
//       "read_status": "unread",
//       "approved_at": null
//     },
//     {
//       "request_id": "355ee447-521b-4396-be0a-17f6503d9013",
//       "position_id": 47,
//       "position_name": "Начальник отдела",
//       "user_id": 1042,
//       "user_name": "Скворцов Иван",
//       "last_name_only": "Скворцов",
//       "middle_name_only": "Васильевич",
//       "first_name_only": "Иван",
//       "approval_status": "approved",
//       "subdepartment_name": "Торгово-закупочный отдел",
//       "department_name": "Гелио-Пакс",
//       "read_status": "readed",
//       "approved_at": "2025-02-12 09:04:15"
//     }
//   ]
// }