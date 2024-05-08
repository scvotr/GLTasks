import ChevronLeft from '@mui/icons-material/ChevronLeft'
import MenuOpenTwoTone from '@mui/icons-material/MenuOpenTwoTone'
import { Box, Divider, IconButton, Toolbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import { ToolbarButton } from '../../ToolbarButton/ToolbarButton'
import { NestedListMenu } from '../NestedListMenu'


const drawerWidth = 270

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden', // Скрытие содержимого, выходящего за границы по горизонтали
})
const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
})

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1, // Установка z-index для компонента AppBar
  transition: theme.transitions.create(['width', 'margin'], {
    // Устанавливаем переходы для свойств width и margin
    easing: theme.transitions.easing.sharp, // Устанавливаем тип анимации для переходов
    duration: theme.transitions.duration.leavingScreen, // Устанавливаем продолжительность анимации для переходов
  }),
  ...(open && {
    // Условие: если open === true
    marginLeft: drawerWidth, // Изменение левого отступа
    width: `calc(100% - ${drawerWidth}px)`, // Изменение ширины
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen, // Изменение продолжительности анимации при открытии
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth, // Установка ширины компонента Drawer равной значению переменной drawerWidth
  flexShrink: 0, // Установка свойства flex-shrink равным 0, чтобы предотвратить уменьшение размера при нехватке места в flex-контейнере
  whiteSpace: 'nowrap', //текст внутри элемента не должен переноситься на новую строку
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme), // Применение стилей из openedMixin, если open === true
    '& .MuiDrawer-paper': openedMixin(theme), // Применение стилей из openedMixin к элементу с классом .MuiDrawer-paper, если open === true
  }),
  ...(!open && {
    ...closedMixin(theme), // Применение стилей из closedMixin, если open !== true
    '& .MuiDrawer-paper': closedMixin(theme), // Применение стилей из closedMixin к элементу с классом .MuiDrawer-paper, если open !== true
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

export const LeftSideDrawer = ({ currentUser, children }) => {
  const initialOpen = localStorage.getItem('drawerOpen') === 'true'
  const [open, setOpen] = useState(initialOpen)

  useEffect(() => {
    localStorage.setItem('drawerOpen', open)
  }, [open])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <MenuOpenTwoTone fontSize="large" />
          </IconButton>
          <ToolbarButton currentUser={currentUser}/>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          Выберите пункт:
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft fontSize="large" />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <NestedListMenu />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1}}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  )
}
