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

export const InfoNews = ({ data }) => {
  return (
    <>
      <Grid container spacing={2}>
        {/* --------MAIN PLACE------------ST */}
        {/* <Grid item xs={2}></Grid> */}
        <Grid item xs={12}>
          <Item>
            <Typography gutterBottom variant="body2">
              Добавлено:
            </Typography>
            <Typography gutterBottom variant="body2">
              <strong>09.04.2025</strong>
              <ul>
                <li>Добавлен базис по ETOS.</li>
                <li>Добавлена возможность добавить контрагента если он отсутствует.</li>
                <li>Добавлена возможность выбрать контрагента из списка после добавления.</li>
                <li>Добавлен поиск контрагента из списка.</li>
              </ul>
              <strong>03.04.2025</strong>
              <ul>
                <li>Преименнованы должности. Убраны сокращения</li>
                <li>В таблице для задач добавлено колонка "Предприятие" для которого назначена задача.</li>
                <li>Обновлена таблица задач. Колонка "Задача" адаптируется в зависимости открыто левое меню или свернуто.</li>
              </ul>
              <strong>27.03.2025</strong>
              <ul>
                <li>При создании запроса в лабораторию добавлена возможность указать продавца.</li>
                <li>При формировании отчета добавлена возможность указать данные из удостоверения и данные от клиента если они предоставлены.</li>
                <li>В разделе "Планирование" разделены задачи на две категории "Новые" и "Выполненные"</li>
                <li>В разделе "Планирование" изменен шаблон для печати плановых задач.</li>
              </ul>
              <strong>17.03.2025</strong>
              <ul>
                <li>Раздел для запросов в лабораторию АЕ ПЕ от отдела реализации.</li>
                <li>Доступен для сотрудников элеваторов, отдела реализации и отдела ХПР.</li>
                <li>
                  Подсистема позволяет создавать запрос, открыть контакт, прикреплять документы, чат для обмена сообщениям, формировать отчет после закрытия
                  контракта.
                </li>
              </ul>

              <strong>08.08.2024</strong>
              <ul>
                <li>В раздел "Взаимопроверка" добавлены документы для общего доступа.</li>
                <li>Графические файлы и файлы в формате pdf открываются в браузере. Файлы doc\docx доступны после скачивания.</li>
              </ul>
              <strong>11.07.2024</strong>
              <ul>
                <li>Добавлены пункты меню "Тех. поддержка" - содержит все обращения в службу технической поддержки. Доступно всем пользователям системы.</li>
                <li>
                  Добавлены пункты меню "От отдела" - содержит все задачи от отдела. Добавлены пункты меню "Для отдела" - содержит все задачи для отдела.
                  Доступны только руководителям отделов.
                </li>
              </ul>
              <strong>10.07.2024</strong>
              <ul>
                <li>Добавлена возможность загружать файлы формата doc, docx, xls, xlsx.</li>
                <li>
                  Добавлены пункты меню для Руководителей отделов. "Мои задачи" - содержит только созданные задачи пользователем-руководителем. "По отделу" -
                  содержит все задачи от пользователей отдела. "Задачи" - содержат все задачи как и раньше. Нужно тестировать. Так же добавлена кнопка создания
                  новой задачи из пункта меню "Мои задачи".
                </li>
              </ul>
              <strong>25.06.2024</strong>
              <ul>
                <li>Добавлена инструкция по работе с задачами.</li>
              </ul>
              <strong>24.06.2024</strong>
              <ul>
                <li>
                  Добавлена возможность изменения срок выполнения задачи. При отправке задачи на проверку сотрудник назначивший задачу может увеличить срок
                  выполнения выбрав дату и отклонив задачу.
                </li>
              </ul>
              <strong>21.06.2024</strong>
              <ul>
                <li>Добавлена возможность отклонить задачу отправленную на проверку. Отклоненная задача возвращается обратно в работу.</li>
              </ul>
              <strong>20.06.2024</strong>
              <ul>
                <li>Добавлена возможность добавлять файлы(jpg, pdf) к задаче на любом этапе.</li>
                <li>
                  Реализован функционал уведомлений о новых комментариях. Пользователи теперь получают мгновенные уведомления в приложении и по электронной
                  почте.
                </li>
              </ul>
              <strong>03.06.2024</strong>
              <ul>
                <li>Обновлена форма для просмотра задач.</li>
                <li>Если к задаче есть графические файл или документы то они отображаются при просмотре.</li>
              </ul>
              <strong>17.05.2024</strong>
              <ul>
                <li>Добавлен пункт меню "Новости" с актуальными обновлениями и возможностями текущей версии.</li>
                <li>Созданную задачу можно удалить, если она не согласована или не назначен ответственный.</li>
                <li>Отключена кнопка редактирования.</li>
                <li>Изменение компонента для действия редактирования.</li>
                <li>Добавлен диалог подтверждения для удаления.</li>
                <li>Добавленная работа с pdf файлами.</li>
                <li>Добавлена возможность загрузить pdf.</li>
                <li>Добавлена возможность скачать pdf.</li>
                <li>Добавлена возможность планировать задачи. Руководителю доступны все запланированные задачи сотрудников.</li>
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
