import React from 'react';
import { Button, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const QRActionMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) {
    return null; // Если устройство не мобильное, ничего не рендерим
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
      <Button variant="contained" color="secondary">
        Информация по устройству
      </Button>
      <Button variant="contained" color="primary">
        Плановый осмотр
      </Button>
      <Button variant="contained" color="primary">
        Техническое обслуживание
      </Button>
      <Button variant="contained" color="error">
        Внештатная ситуация
      </Button>
    </Box>
  );
};

export default QRActionMenu;


// const sections = [
//     { path: "/admin/machines/mechTypes", label: "+ тип механизма" },
//     { path: "/admin/machines/mechWorkflow", label: "+ тех. объекты" },
//   ]
//             {sections.map((section, index) => (
//               <NavLink to={section.path} key={index} style={{ textDecoration: "none", color: "inherit", margin: "0 8px" }}>
//                 <Button color="inherit">{section.label}</Button>
//               </NavLink>
//             ))}