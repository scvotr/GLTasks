import { Typography, Grid, Card, CardContent, Divider, Box, Stack } from "@mui/material"
import { formatDate } from "../../../../utils/formatDate"

export const FullTaskInfo = ({ task }) => {
  const {
    task_id,
    task_status,
    created_on,
    deadline,
    approved_on,
    setResponseUser_on,
    confirmation_on,
    reject_on,
    closed_on,
    appoint_department_name,
    appoint_subdepartment_name,
    appoint_user_name,
    responsible_user_name,
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}>
                <Stack direction="column">
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
                  {setResponseUser_on && (
                    <Typography variant="body1">
                      <strong>В работе с:</strong> {formatDate(setResponseUser_on)}
                    </Typography>
                  )}
                  {responsible_user_name && (
                    <Typography variant="body1">
                      <strong>Ответственный:</strong> {responsible_user_name}
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
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}>
                <Stack direction="column">
                  <Typography variant="subtitle1">
                    <strong>От Департамента:</strong> {appoint_department_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>От Отдела:</strong> {appoint_subdepartment_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>От Сотрудника:</strong> {appoint_user_name}
                  </Typography>

                  <Typography variant="subtitle1">
                    <strong>Для Департамента:</strong> {responsible_department_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Для Отдела:</strong> {responsible_subdepartment_name}
                  </Typography>
                  {responsible_position_name && (
                    <>
                      <Typography variant="subtitle1">
                        <strong>Для Службы:</strong> {responsible_position_name}
                      </Typography>
                    </>
                  )}
                  {responsible_user_name && (
                    <>
                      <Typography variant="subtitle1">
                        <strong>Для:</strong> {responsible_user_name}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}>
            <Divider />
            <Stack direction="column">
              <Typography variant="subtitle1">
                <strong>Задача:</strong>
              </Typography>
              <Typography variant="body1">{task_descript}</Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
