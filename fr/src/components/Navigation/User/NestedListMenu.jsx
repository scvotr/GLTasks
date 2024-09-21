import { useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import Badge from "@mui/material/Badge"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import SendIcon from "@mui/icons-material/Send"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined"
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined"
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined"
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined"
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { NavLink } from "react-router-dom"
// import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
// import getTasksData from "./MenuListData/TasksData.jsx"
import styled from "@emotion/styled"
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact"
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined"
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined"
import { useAuthContext } from "../../../context/AuthProvider"
import { Divider } from "@mui/material"

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

export const NestedListMenu = ({ isOpen }) => {
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
      name: "Задачи",
      icon: <ConnectWithoutContactIcon fontSize="large" />,
      path: "/tasks",
      tasksCount: 0,
      subItems: [
        currentUser.role === "chife"
          ? {
              name: "Мои задачи",
              icon: <PeopleAltOutlinedIcon fontSize="large" />,
              path: "/tasks/leadTasks",
              btn: true,
            }
          : null,
        currentUser.role === "chife"
          ? {
              name: "От отдела",
              icon: <CloudUploadOutlinedIcon fontSize="large" />,
              path: "/tasks/allTasksFromSubDep",
              btn: true,
            }
          : null,
        currentUser.role === "chife"
          ? {
              name: "Для отдела",
              icon: <CloudDownloadOutlinedIcon fontSize="large" />,
              path: "/tasks/allTasksToSubDep",
              btn: true,
            }
          : null,
        {
          name: "Тех. поддрежка",
          icon: <SupportAgentOutlinedIcon fontSize="large" />,
          path: "/tasks/helpDesk",
          btn: true,
        },
        {
          name: "Архив",
          icon: <Inventory2OutlinedIcon fontSize="large" />,
          path: "/tasks/closedTask",
          btn: true,
        },
        {
          name: "Статистика",
          icon: <AssessmentOutlinedIcon fontSize="large" />,
          path: "/tasks/AnalyticsChart",
          btn: true,
        },
      ].filter(item => item !== null), // Фильтруем null значения
    },
    {
      name: "Документы(alfa)",
      icon: <FilePresentOutlinedIcon fontSize="large" />,
      path: "/docs",
      tasksCount: 0,
      subItems: [
        {
          name: "Распоряжения(alfa)",
          icon: <FolderCopyOutlinedIcon fontSize="large" />,
          path: "/docs/ordinance",
          btn: true,
        },
        {
          name: "Архив",
          icon: <Inventory2OutlinedIcon fontSize="large" />,
          path: "/docs/docsArchive",
          btn: true,
        },
      ],
    },
    {
      name: "Планирование",
      icon: <CalendarMonthOutlinedIcon fontSize="large" />,
      path: "/schedule",
      tasksCount: 0,
      subItems: [
        currentUser.role === "chife"
          ? {
              name: "По сотрудникам",
              icon: <Diversity3OutlinedIcon fontSize="large" />,
              path: "/schedule/taskScheduler",
              btn: true,
            }
          : null,
        {
          name: "Архив",
          icon: <Inventory2OutlinedIcon fontSize="large" />,
          path: "/schedule/schedulesArchive",
          btn: true,
        },
      ].filter(Boolean),
    },
    {
      name: "Взаимопроверка",
      icon: <Diversity1OutlinedIcon fontSize="large" />,
      path: "/mutualVerification",
      tasksCount: 0,
      subItems: [
        {
          name: "Документы",
          icon: <FolderCopyOutlinedIcon fontSize="large" />,
          path: "/mutualVerification/docs",
          btn: true,
        },
        {
          name: "Архив",
          icon: <Inventory2OutlinedIcon fontSize="large" />,
          path: "/mutualVerification/archive",
          btn: true,
        },
      ],
    },
    {
      name: "Настройки",
      icon: <SettingsOutlinedIcon fontSize="large" />,
      path: "/settings",
      tasksCount: 0,
      settings: true,
      subItems: [
        { name: "Редактировать профиль", icon: <ManageAccountsOutlinedIcon fontSize="large" />, path: "/settings/profile", btn: true },
        { name: "Изменить Пароль", icon: <PasswordOutlinedIcon fontSize="large" />, path: "/settings/changePasPin", btn: true },
      ],
    },
  ]

  const sectionsWithoutSettings = sectionsData.filter(section => !section.settings)
  const sectionsWithSettings = sectionsData.filter(section => section.settings)

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
      <List style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginBottom: "20px" }}>
        <div>
          {sectionsWithoutSettings.map((section, index) => (
            <div key={index}>
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemButton onClick={() => handleSectionClick(section.name.toLowerCase())}>
                  <Badge
                    badgeContent={section.tasksCount}
                    color="primary"
                    overlap="rectangular"
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
                          style={{ textDecoration: "none", color: "inherit" }}>
                          <Badge
                            sx={{ ml: "15%" }}
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
          <Divider />
        </div>
        {/* ----------------------------------------------------------------- */}
        <div>
          <Divider />
          {sectionsWithSettings.map((section, index) => (
            <div key={index}>
              <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemButton onClick={() => handleSectionClick(section.name.toLowerCase())}>
                  <Badge
                    badgeContent={section.tasksCount}
                    color="primary"
                    overlap="rectangular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}></Badge>
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.name} />
                  {openSections[section.name.toLowerCase()] ? <ExpandMore /> : <ExpandLess />}
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
                              {openSubItems[subItem.name.toLowerCase()] ? <ExpandMore /> : <ExpandLess />}
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
        </div>
      </List>
    </>
  )
}
