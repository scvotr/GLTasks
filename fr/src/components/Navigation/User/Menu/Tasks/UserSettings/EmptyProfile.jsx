import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import styled from "@emotion/styled"
import ListItemButton from "@mui/material/ListItemButton"
import { NavLink } from "react-router-dom"
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined"
import ListItemIcon from "@mui/material/ListItemIcon"
import { Stack, Typography } from "@mui/material"

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  paddingLeft: 4,
  display: "flex",
  "&.active": {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    /* Другие желаемые стили для выбранного пункта */
  },
}))

export const EmptyProfile = () => {
  const currentUser = useAuthContext()
  const [msg, setMsg] = useState()
  const [msg2, setMsg2] = useState()
  const renderCmpRef = useRef(null) // Создание useRef

  useEffect(() => {
    let renderCmp = null // Перемещение переменной внутрь useEffect

    if (currentUser.emptyProfile || currentUser.notDistributed) {
      if (currentUser.emptyProfile) {
        setMsg("Данные учетной записи не заполнены. Пожалуйста перейдите в настройки и заполните профиль.")
        setMsg2("Перейти в настройки профиля")
        renderCmp = (
          <>
            <StyledListItemButton component={NavLink} to="/settings/profile" activeclassname ="active">
              <ListItemIcon>
                <ManageAccountsOutlinedIcon fontSize="large" />
              </ListItemIcon>
            </StyledListItemButton>
          </>
        )
      } else if (currentUser.notDistributed) {
        setMsg("Не присвоен отдел обратитесь к администратору")
        setMsg2("")
      }
    }

    // Присвоение значения в .current свойство useRef
    renderCmpRef.current = renderCmp
  }, [currentUser.emptyProfile, currentUser.notDistributed])

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Typography ariant="body1">
          {" "}
          <strong>{msg}</strong>
        </Typography>
        <Typography ariant="body1">
          {" "}
          <strong>{msg2}</strong>
        </Typography>
        {renderCmpRef.current} {/* Использование .current для доступа к значению */}
      </Stack>
    </>
  )
}
