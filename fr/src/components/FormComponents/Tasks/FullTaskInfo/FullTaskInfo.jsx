import { Box } from "@mui/material"
import { Typography, Grid, Card, CardContent, Divider } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"

export const FullTaskInfo = ({ task }) => {
  const {
    task_id,
    task_status,
    created_on,
    deadline,
    approved_on,
    setResponseSubDep_on,
    confirmation_on,
    reject_on,
    closed_on,
    appoint_department_name,
    appoint_subdepartment_name,
    appoint_user_name,
    responsible_department_name,
    responsible_subdepartment_name,
    responsible_position_name,
    task_descript,
  } = task

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h4">Task ID: {task_id.slice(0, 4)}</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Статус:</strong> {task_status}
              </Typography>
              <Typography variant="body1">
                <strong>Создана:</strong> {formatDate(created_on)}
              </Typography>
              <Typography variant="body1">
                <strong>Выполнить до:</strong> {formatDate(deadline)}
              </Typography>
              {approved_on && (
                <Typography variant="body1">
                  <strong>Согласованна:</strong> {formatDate(approved_on)}
                </Typography>
              )}
              {setResponseSubDep_on && (
                <Typography variant="body1">
                  <strong>В работе с:</strong> {formatDate(setResponseSubDep_on)}
                </Typography>
              )}
              {confirmation_on && (
                <Typography variant="body1">
                  <strong>Отправлена на проверку:</strong> {formatDate(confirmation_on)}
                </Typography>
              )}
              {reject_on && (
                <Typography variant="body1">
                  <strong>Отклонена:</strong> {formatDate(reject_on)}
                </Typography>
              )}
              {closed_on && (
                <Typography variant="body1">
                  <strong>Закрыта:</strong> {formatDate(closed_on)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <div>
                <Typography variant="subtitle1">
                  <strong>От Департамента:</strong>
                </Typography>
                <Typography variant="body1">{appoint_department_name}</Typography>
                <Typography variant="subtitle1">
                  <strong>От Отдела:</strong>
                </Typography>
                <Typography variant="body1">{appoint_subdepartment_name}</Typography>
                <Typography variant="subtitle1">
                  <strong>От Сотрудника:</strong>
                </Typography>
                <Typography variant="body1">{appoint_user_name}</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">
                  <strong>Для Департамента:</strong>
                </Typography>
                <Typography variant="body1">{responsible_department_name}</Typography>
                <Typography variant="subtitle1">
                  <strong>Для Отдела:</strong>
                </Typography>
                <Typography variant="body1">{responsible_subdepartment_name}</Typography>
                {responsible_position_name && (
                  <>
                    <Typography variant="subtitle1">
                      <strong>Для Службы:</strong>
                    </Typography>
                    <Typography variant="body1">{responsible_position_name}</Typography>
                  </>
                )}
              </div>
            </Grid>
          </Grid>
          <div>
            <Divider />
            <Typography variant="subtitle1">
              <strong>Задача:</strong>
            </Typography>
            <Typography variant="body1">{task_descript}</Typography>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
