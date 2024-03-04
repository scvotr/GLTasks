import { Typography, Button, } from '@mui/material'
import { NavLink } from 'react-router-dom';

export const ToolbarButton = ({ currentUser }) => {

  return (
    <>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Gelio Tasks
      </Typography>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {currentUser.name} {currentUser.role}  ID:{currentUser.id}  DEP:{currentUser.dep} subDep:{currentUser.subDep} position:{currentUser.position}
      </Typography>
      {currentUser.login ? (
        <Button variant="outlined" color="inherit" onClick={currentUser.logout} component={NavLink} to="/login">Выйти</Button>
      ) : (
        <Button variant="outlined" color="inherit" component={NavLink} to="/login">Войти</Button>
      )
      }
    </>
  )
}