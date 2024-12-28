import React, { useState } from "react"
import { Menu, MenuItem, Box, Typography } from "@mui/material"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import { FullScreenDialog } from "../../../../../FullScreenDialog/FullScreenDialog"
import { ReqInfoView } from "./ReqInfoView"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const ReqForLabMenu = ({ anchorEl, open, closeMenu, currentRequest, reRender, currentUser }) => {
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  const [currentFullScreenView, setCurrentFullScreenView] = useState(null)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleInfoView = async () => {
    setCurrentFullScreenView("view")
    setFullScreenOpen(true)

    const data = {
      req_id: currentRequest.reqForAvail_id,
      user_id: currentUser.id,
      read_status: "readed",
    }

    try {
      setCurrentFullScreenView("view")
      setFullScreenOpen(true)
      // reRender()
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/lab/updateReadStatus`, "POST", data, setReqStatus)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const closeModal = () => {
    setFullScreenOpen(false)
    closeMenu()
    reRender()
  }

  const fullScreenViews = {
    view: <ReqInfoView request={currentRequest} currentUser={currentUser} reRender={reRender} closeModal={closeModal}/>,
  }

  return (
    <>
      <FullScreenDialog isOpen={fullScreenOpen} onClose={closeModal} infoText={currentRequest.reqForAvail_id}>
        {fullScreenViews[currentFullScreenView]}
      </FullScreenDialog>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? { top: anchorEl.top, left: anchorEl.left } : undefined}
        open={open}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={handleInfoView}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="body1">Просмотр</Typography>
            <VisibilityOutlinedIcon sx={{ marginLeft: 1 }} />
          </Box>
        </MenuItem>
        {/* <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="body1">Подписать</Typography>
            <ApprovalOutlinedIcon sx={{ marginLeft: 1 }} />
          </Box>
        </MenuItem> */}
        <MenuItem onClick={closeMenu}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="body1">Закрыть</Typography>
            <CancelOutlinedIcon sx={{ marginLeft: 1 }} />
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}
