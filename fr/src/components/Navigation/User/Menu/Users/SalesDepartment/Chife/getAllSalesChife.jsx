import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2';


export const getAllSalesChife = (currentUser) => {
  const salesServicePositions = [2, 33, 15,  16, 27, 28 ,45, 47, ] // Массив с допустимыми позициями получить всех продавщиков с сервера!

  if (salesServicePositions.includes(Number(currentUser.position))) {
    return {
      name: "Лаборатория",
      icon: <BiotechOutlinedIcon fontSize="large" />,
      path: "/labForSales",
      tasksCount: 0,
      subItems: [
        {
          name: "Архив",
          icon: <Inventory2OutlinedIcon fontSize="large" />,
          path: "/labForSales/archive",
          btn: true,
        },
        {
          name: "",
          // icon: <ProductionQuantityLimitsOutlinedIcon fontSize="large" />,
          path: "/labForSales/requestForAvailability",
          btn: true,
        },
      ],
    }
  }
  return null // Возвращаем null, если условие не выполнено
}
