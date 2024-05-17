import { Typography, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  margin: theme.spacing(2),
  borderRadius: "4px",
  textAlign: "center",
}))

const InstructionComponent = ({ data }) => {
  return (
    <>
      <Grid container spacing={2}>
        {/* --------MAIN PLACE------------ST */}
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Добавленно:
            </Typography>
            <Typography gutterBottom>
              <strong>17.05.20204</strong>
              <ul>
                <li>Добавлен пункт меню "Новости" с актуальными обновлениями и возможностями текущей версии.</li>
                <li>Созданую задачу можно удалить, если она не согласована или не назначен ответсвенный.</li>
                <li>Отключена кнопка редактирования.</li>
                <li>Изменение компонента для действия редактирования.</li>
                <li>Добавлен диалог подтверждения для удаления.</li>
                <li>Добавленна работа с pdf файлами.</li>
                <li>Добавлена возможность загрузить pdf.</li>
                <li>Добавлена возможность скачать pdf.</li>
                <li>Добавлена возможность планировать задачи. Рувоводителю доступны все запланированые задачи сотрудников.</li>
                <li>Изменения в интерфейсе.</li>
              </ul>
            </Typography>
          </Item>
        </Grid>
        {/* --------MAIN PLACE------------END */}
      </Grid>
    </>
  )
}

export default InstructionComponent
