import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined"
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2"
import FenceOutlinedIcon from "@mui/icons-material/FenceOutlined"
import AnalyticsIcon from "@mui/icons-material/Analytics"

export const getAllSalesChife = currentUser => {
  const salesServicePositions = [2, 33, 15, 16, 27, 28, 45, 47] // Массив с допустимыми позициями получить всех продавщиков с сервера!
  const analyzePositions = [2, 33, 47]

  const isSalesService = salesServicePositions.includes(Number(currentUser.position))
  const isAnalyzeUser = analyzePositions.includes(Number(currentUser.position))
  const result = {
    name: "Лаборатория",
    icon: <BiotechOutlinedIcon fontSize="large" />,
    path: "/labForSales",
    tasksCount: 0,
    subItems: [
      {
        name: "Закрытые запросы",
        icon: <Inventory2OutlinedIcon fontSize="large" />,
        path: "/labForSales/closed",
        btn: true,
      },
      // {
      //   name: "Элеватор",
      //   icon: <FenceOutlinedIcon fontSize="large" />,
      //   path: "/elevator",
      //   btn: true,
      // },
      // {
      //   name: "Элеватор_V2",
      //   icon: <FenceOutlinedIcon fontSize="large" />,
      //   path: "/elevatorV2",
      //   btn: true,
      // },
      // {
      //   name: "Элеватор_V3",
      //   icon: <FenceOutlinedIcon fontSize="large" />,
      //   path: "/elevatorV3",
      //   btn: true,
      // },
      // {
      //   name: "Элеватор_V4",
      //   icon: <FenceOutlinedIcon fontSize="large" />,
      //   path: "/elevatorV4",
      //   btn: true,
      // },
      // {
      //   name: "old_version",
      //   icon: <ProductionQuantityLimitsOutlinedIcon fontSize="large" />,
      //   path: "/labForSales/requestForAvailability",
      //   btn: true,
      // },
    ],
  }
  // Если пользователь имеет позицию для анализа, добавляем вкладку анализа
  if (isAnalyzeUser) {
    result.subItems.push({
      name: "Анализ запросов",
      icon: <AnalyticsIcon fontSize="large" />,
      path: "/labForSales/analytics",
      btn: true,
    })
  }
  return isSalesService ? result : null // Возвращаем результат, если пользователь в salesServicePositions
}

// if (salesServicePositions.includes(Number(currentUser.position))) {
//   return {
//     name: "Лаборатория",
//     icon: <BiotechOutlinedIcon fontSize="large" />,
//     path: "/labForSales",
//     tasksCount: 0,
//     subItems: [
//       {
//         name: "Закрытые запросы",
//         icon: <Inventory2OutlinedIcon fontSize="large" />,
//         path: "/labForSales/closed",
//         btn: true,
//       },
// {
//   name: "Элеватор",
//   icon: <FenceOutlinedIcon fontSize="large" />,
//   path: "/elevator",
//   btn: true,
// },
// {
//   name: "Элеватор_V2",
//   icon: <FenceOutlinedIcon fontSize="large" />,
//   path: "/elevatorV2",
//   btn: true,
// },
// {
//   name: "Элеватор_V3",
//   icon: <FenceOutlinedIcon fontSize="large" />,
//   path: "/elevatorV3",
//   btn: true,
// },
// {
//   name: "Элеватор_V4",
//   icon: <FenceOutlinedIcon fontSize="large" />,
//   path: "/elevatorV4",
//   btn: true,
// },
// {
//   name: "old_version",
//   icon: <ProductionQuantityLimitsOutlinedIcon fontSize="large" />,
//   path: "/labForSales/requestForAvailability",
//   btn: true,
// },
//     ],
//   }
// }
// return null // Возвращаем null, если условие не выполнено
