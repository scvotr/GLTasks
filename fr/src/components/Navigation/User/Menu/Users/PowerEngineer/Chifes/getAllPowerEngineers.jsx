import ConstructionOutlinedIcon from '@mui/icons-material/Construction';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2';

export const getAllPowerEngineers = (currentUser) => {
  const energyServicePositions = [11, 23]; // Массив с допустимыми позициями получить всех энергетиков с сервера!

  if (energyServicePositions.includes(Number(currentUser.position))) {
    return {
      name: "Оборудование",
      icon: <ConstructionOutlinedIcon fontSize="large" />,
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
    };
  }
  return null; // Возвращаем null, если условие не выполнено
}