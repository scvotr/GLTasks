import { TextField } from "@mui/material"

export const TextDataField = props => {
  const today = new Date().toISOString().split("T")[0]

  return (
    <>
      <TextField
        sx={{ pl:2, pr: 2 }}
        id="task_description"
        label="Введите описание задачи"
        placeholder="текст задачи"
        multiline
        minRows={5}
        maxRows={10}
        variant="filled"
        name="task_descript"
        value={props.value.task_descript}
        onChange={e => {
          props.getData(e) // Вызов функции обратного вызова для обновления состояния formData
        }}
        required
      />
      <TextField
        sx={{p:2}}
        id="date"
        label="Выпонить до:"
        type="date"
        name="deadline"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ min: today }}
        value={props.value.deadline}
        onChange={e => {
          props.getData(e) // Вызов функции обратного вызова для обновления состояния formData
        }}
        required
      />
    </>
  )
}
