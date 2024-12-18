import { useEffect, useState } from "react"
import { useAuthContext } from "../../../context/AuthProvider"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import SendIcon from "@mui/icons-material/Send"
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { NavLink } from "react-router-dom"
import styled from "@emotion/styled"
import Badge from "@mui/material/Badge"
import Collapse from "@mui/material/Collapse"

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


export const NestedAdminListMenu = ({isOpen}) => {
  const currentUser = useAuthContext()
  const [openSections, setOpenSections] = useState(() => {
    const localSections = JSON.parse(localStorage.getItem("openSections"))
    return localSections || { tasks: false, projects: false, documents: false }
  })

  useEffect(() => {
    localStorage.setItem("openSections", JSON.stringify(openSections))
  }, [openSections])

  const handleSectionClick = section => {
    setOpenSections({ ...openSections, [section]: !openSections[section] })
  }

  const sectionsData = [
    {
      name: "Пользователи",
      icon: <SendIcon />,
      path: "/admin/users",
      subItems: [
        { name: "Новые", icon: <InboxIcon />, path: "/admin/users/new" },
      ],
    },
    {
      name: "Отделы и службы",
      icon: <SendIcon />,
      path: "/admin/struct",
      subItems: [
        { name: "Новые", icon: <InboxIcon />, path: "/admin/struct/new" },
      ],
    },
    {
      name: "Задачи",
      icon: <SendIcon />,
      path: "/admin/tasks",
      subItems: [
        { name: "Все задачи", icon: <InboxIcon />, path: "/admin/tasks/all" },
      ],
    },
    {
      name: "Оборудование",
      icon: <SendIcon />,
      path: "/admin/devices/main",
      subItems: [
        { name: "Устройства", icon: <InboxIcon />, path: "/admin/devices/all" },
        { name: "Устройства v2", icon: <InboxIcon />, path: "/admin/devicesV2/all" },
      ],
    },
  ]

    // Объявление состояния для открытия и закрытия SubItemsMenu
    const [openSubItems, setOpenSubItems] = useState({})

    // Обработчик клика для открытия и закрытия SubItemsMenu
    const handleSubItemClick = itemName => {
      setOpenSubItems(prevOpenSubItems => ({
        ...prevOpenSubItems,
        [itemName]: !prevOpenSubItems[itemName],
      }))
    }

  return (
    <>
      <List>
        {sectionsData.map((section, index) => (
          <div key={index}>
            <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton onClick={() => handleSectionClick(section.name.toLowerCase())}>
                <Badge
                  badgeContent={section.tasksCount}
                  color="primary"
                  overlap="rectangular" // Или overlap="rectangular"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}></Badge>
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.name} />
                {openSections[section.name.toLowerCase()] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </NavLink>
            <Collapse in={openSections[section.name.toLowerCase()]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.subItems.map((subItem, subIndex) => (
                  <div key={subIndex}>
                    {subItem.btn ? ( // Проверка наличия nameBnt вместо name
                      <StyledListItemButton
                        component={NavLink}
                        to={subItem.path}
                        key={subIndex}
                        activeclassname="active"
                        style={{ textDecoration: "none", color: "inherit", pl: 4, display: "flex" }}>
                        <Badge
                          sx={{ ml: 1 }}
                          badgeContent={subItem.tasksCount}
                          color="primary"
                          overlap="rectangular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}>
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.name} sx={{ flexGrow: 1 }} />
                        </Badge>
                      </StyledListItemButton>
                    ) : (
                      <StyledListItemButton
                        component={NavLink}
                        to={subItem.path}
                        key={subIndex}
                        activeclassname="active"
                        style={{ textDecoration: "none", color: "inherit", pl: 4, display: "flex" }}>
                        <Badge
                          sx={{ ml: 2 }}
                          badgeContent={subItem.tasksCount}
                          color="primary"
                          overlap="rectangular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}>
                          <ListItemButton sx={{ pl: 4 }} onClick={() => handleSubItemClick(subItem.name.toLowerCase())}>
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.name} />
                            {openSubItems[subItem.name.toLowerCase()] ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                        </Badge>
                      </StyledListItemButton>
                    )}
                    {/* Отображаем SubItemsMenu, если доступен */}
                    {openSubItems[subItem.name.toLowerCase()] && subItem.SubItemsMenu && (
                      <Collapse in={openSubItems[subItem.name.toLowerCase()]} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {subItem.SubItemsMenu.map((subItemsMenutem, subItemsMenuIndex) => (
                            <div key={subItemsMenuIndex}>
                              {subItemsMenutem.tasksCount ? (
                                <StyledListItemButton
                                  component={NavLink}
                                  to={subItemsMenutem.path}
                                  key={subIndex}
                                  activeclassname="active"
                                  style={{ textDecoration: "none", color: "inherit", pl: 4, display: "flex" }}
                                  sx={{ alignItems: "center" }} // Добавляем выравнивание элементов по центру
                                >
                                  <ListItemButton sx={{ pl: 2 }}>
                                    <Badge
                                      color="primary"
                                      overlap="rectangular"
                                      badgeContent={subItemsMenutem.tasksCount}
                                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                                      sx={{ marginRight: 2 }} // Добавляем отступ справа
                                    >
                                      <ListItemIcon>{subItemsMenutem.icon}</ListItemIcon>
                                    </Badge>
                                    <ListItemText primary={subItemsMenutem.name} />
                                  </ListItemButton>
                                </StyledListItemButton>
                              ) : (
                                <StyledListItemButton
                                  component={NavLink}
                                  to={subItemsMenutem.path}
                                  key={subIndex}
                                  activeclassname="active"
                                  style={{ textDecoration: "none", color: "inherit", pl: 4, display: "flex" }}>
                                  <ListItemButton sx={{ pl: 12 }}>
                                    <ListItemIcon>{subItemsMenutem.icon}</ListItemIcon>
                                    <ListItemText primary={subItemsMenutem.name} />
                                  </ListItemButton>
                                </StyledListItemButton>
                              )}
                            </div>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </div>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </>
  )
}