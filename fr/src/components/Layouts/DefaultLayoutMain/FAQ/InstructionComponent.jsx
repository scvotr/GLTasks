import React from 'react';
import { styled, Paper, Typography } from '@mui/material';

const useStyles = styled((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const InstructionComponent = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Инструкция по добавлению новой задачи
      </Typography>
      <Typography gutterBottom>
        <strong>Шаг 1: Добавление новой задачи от сотрудника</strong>
        <ul>
          <li>Создайте новую задачу, используя кнопку "Добавить задачу".</li>
          <li>Установите статус "непрочитано" для задачи.</li>
          <li>Обновите информацию о задаче после создания.</li>
          <li>Отправьте уведомление руководителю по электронной почте.</li>
          <li>Обновите список активных задач.</li>
        </ul>
      </Typography>
      <Typography gutterBottom>
        <strong>Шаг 2: Согласование и утверждение от руководителя</strong>
        <ul>
          <li>Обновите статус "непрочитано" после согласования задачи.</li>
          <li>Отправьте уведомление сотруднику об утверждении задачи.</li>
          <li>Установите статус "непрочитано" для дальнейшего согласования.</li>
          <li>Обновите статус задачи после утверждения.</li>
          <li>Отправьте уведомления руководителю и всем заинтересованным сторонам.</li>
          <li>Обновите статус задачи после завершения согласования.</li>
          <li>Обновите список активных задач.</li>
        </ul>
      </Typography>
      <Typography gutterBottom>
        <strong>Шаг 3: Назначение ответственного за задачу</strong>
        {/* Добавьте остальные шаги здесь */}
      </Typography>
      {/* Аналогично для остальных шагов */}
      {/* ... */}
    </Paper>
  );
};

export default InstructionComponent;